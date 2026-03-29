---
layout: post
title: "让 Cursor 帮你找 Bug：用 MCP 把 SVF 静态分析接进 AI 编辑器"
date: 2026-03-29 16:00:00 +0800
description: "把 SVF 的 buffer overflow 检测封装成 MCP Server，接入 Cursor AI，实现在聊天框里一句话就能跑静态分析"
tags: [SVF, MCP, Cursor, Program Analysis, Static Analysis]
categories: [tech]
giscus_comments: true
---

> 你写了一段 C 代码，想知道有没有 buffer overflow。传统做法：编译、跑工具、看报告。现在：在 Cursor 里打一句"帮我查查这个文件有没有越界访问"，AI 就帮你搞定了。

---

## 痛点

做程序分析的人都知道，SVF 是个很强大的静态分析框架——能做指针分析、检测内存泄漏、发现 buffer overflow。但它的使用门槛不低：

1. 源码要先用 `clang` 编译成 LLVM IR（`.ll` 文件）
2. 还要跑一遍 `opt -p=mem2reg` 做 SSA 优化
3. 然后才能用 SVF 的分析工具（`saber`、`wpa` 等）去跑
4. 输出是一堆 ICFG 节点信息，需要自己对照源码理解

这个流程对搞研究的人来说没问题，但如果想让更多人用起来，门槛确实有点高。

那能不能把这套东西接到 AI 编辑器里，让 AI 帮你搞定编译、分析、解读结果这一整套流程？

## 方案：MCP + Cursor

[MCP（Model Context Protocol）](https://modelcontextprotocol.io/) 是 Anthropic 提出的一个协议，简单来说就是给 AI 定义了一套"调用外部工具"的标准接口。Cursor 原生支持 MCP，意味着你可以把任何工具封装成 MCP Server，然后在 Cursor Chat 里直接用自然语言触发。

所以思路就很清楚了：

```
C/C++ 源码 → clang → .ll → pysvf 分析 → 报告
                  ↑                          ↓
             MCP Server 自动处理这一切
                  ↑                          ↓
            Cursor AI Agent ←── 返回结果给用户
```

## 实现

### 技术栈

- **[SVF](https://github.com/SVF-tools/SVF)**：核心静态分析引擎
- **[pysvf](https://github.com/SVF-tools/SVF-Python)**：SVF 的 Python 绑定，可以直接在 Python 里调用 SVF 的分析 API
- **[FastMCP](https://github.com/jlowin/fastmcp)**：MCP Server 的 Python SDK，几行代码就能起一个 MCP 服务
- **LLVM 18**：提供 `clang` 和 `opt`，用来把 C 源码编译成 LLVM IR

### 核心代码

整个 MCP Server 的核心逻辑就两步：

**第一步：编译**

```python
def _compile_c_to_ll(source_path, include_flags=""):
    # clang -g -S -c -Xclang -disable-O0-optnone
    #       -fno-discard-value-names -emit-llvm source.c -o source.ll
    # opt -S -p=mem2reg source.ll -o source.ll
```

**第二步：分析**

```python
def _run_svf_analysis(ll_file):
    pysvf.buildSVFModule([ll_file])
    pag = pysvf.getPAG()
    analysis = Assignment3(pag)
    analysis.analyse()  # 跑抽象执行，检测 buffer overflow
    pysvf.releasePAG()
```

然后用 FastMCP 包一个 tool：

```python
@mcp.tool()
def analyze_c_code(source_path: str, include_flags: str = "") -> str:
    """Detect buffer overflow bugs in C/C++ source code using SVF."""
    ll_file = _compile_c_to_ll(source_path, include_flags)
    return _run_svf_analysis(ll_file)
```

就这么多。FastMCP 会自动把这个函数的名字、参数、docstring 注册为 MCP tool 的 schema。Cursor 的 AI 在启动时会读取这些信息，知道什么时候该调用它。

### Cursor 配置

在 Cursor 的 MCP 设置里加上：

```json
{
  "mcpServers": {
    "svf-bug-finder": {
      "command": "python3.10",
      "args": ["/path/to/SVF-MCP/mcp_server.py"],
      "env": {
        "LLVM_BIN": "/path/to/llvm-18/bin",
        "SVF_ANALYSIS_DIR": "/path/to/analysis-modules"
      }
    }
  }
}
```

配好之后，MCP 面板会显示绿灯，说明连接成功。

## 效果

配置完成后，在 Cursor Chat 里就可以直接用自然语言触发分析了：

<div style="text-align: center">
  <img src="/assets/img/mcp-svf.png" alt="SVF-MCP in Cursor" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
</div>

上面这张图展示的是一个最简单的测试用例：

```c
int main() {
    int arr[5];
    arr[5] = 10;  // out-of-bounds!
}
```

用户在 Chat 里说"Please check if test1.c has buffer overflow"，AI 自动：
1. 调用 `analyze_c_code` 工具
2. 编译 `test1.c` → LLVM IR
3. 跑 SVF 抽象执行分析
4. 返回结果：`Buffer Overflow (1 found)` — `Objsize: 20, but try to access offset [20, 20]`
5. 还会进一步解释：`arr` 声明了 5 个 `int`（20 字节），但 `arr[5]` 试图访问第 20 字节偏移，越界了

整个过程用户不需要手动编译、不需要看 LLVM IR、不需要理解 ICFG 节点——AI 全部帮你处理了。

## 背后的原理：AI 怎么知道要调这个工具？

这可能是大家最好奇的一点。答案是 **MCP 协议内置了工具发现机制**。

当 Cursor 启动并连接 MCP Server 时，会发一个 `tools/list` 请求。Server 返回所有注册的工具信息（名字、描述、参数 schema）。Cursor 把这些信息注入到 AI Agent 的上下文里。

所以 AI "看到"的大概是这样：

```
你可以使用以下工具：
- analyze_c_code(source_path, include_flags)
  "Detect buffer overflow bugs in C/C++ source code using SVF static analysis."
```

当用户说"帮我检查有没有 buffer overflow"的时候，AI 根据语义匹配到这个工具，自动调用，就这么简单。

**关键在于 tool 的描述要写好** — 描述越精准，AI 匹配越准确。

## 为什么用 Python 方案（pysvf）而不是直接调 CLI？

SVF 本身是 C++ 写的，提供了 `wpa`、`saber` 等命令行工具。但我选择用 pysvf Python 绑定的原因：

| | CLI 方案 | pysvf 方案 |
|---|---|---|
| 调用方式 | subprocess 起进程 | Python API 直接调用 |
| 输出解析 | 需要 regex 解析 stdout | 可以直接拿到程序分析图的数据结构 |
| 灵活性 | 只能用预定义的分析 | 可以自定义分析逻辑 |
| 性能 | 每次都要重新加载 | 可以复用 PAG |

而且 MCP Server 本身用 Python 写（FastMCP），和 pysvf 天然兼容，省去了跨语言通信的麻烦。

## TODO：下一步——甩掉 LLVM，用 tree-sitter 做轻量版

现在这个方案有一个很"重"的地方：**依赖 LLVM 工具链**。你需要装 clang、opt，整个 LLVM 18 大概 1.5GB，还得保证源码能完整编译通过。如果代码里 `#include` 了一个本地没有的头文件，clang 直接报错，分析就跑不了。

所以下一步计划是做一个 **tree-sitter 版本**，彻底换掉底层：

| | 当前版本 (LLVM + pysvf) | 未来版本 (tree-sitter) |
|---|---|---|
| 安装 | 需要 LLVM 18 (~1.5GB) + pysvf + Z3 | `pip install tree-sitter tree-sitter-c` 就行 |
| 编译步骤 | `.c` → clang → `.ll` → opt → 分析 | 直接解析源码，**零编译** |
| 不完整代码 | 编译不过就跑不了 | tree-sitter 天然支持 **partial parsing**，写了一半的代码也能分析 |
| 子模块分析 | 必须拿到完整翻译单元 | 可以只分析单个函数、单个文件片段 |
| 分析深度 | LLVM IR 级别：跨函数指针分析、数据流 | AST 级别：模式匹配、结构检查 |

tree-sitter 的核心优势是：

1. **零编译依赖** — 不需要 clang，不需要头文件，`pip install` 一行搞定
2. **容错解析** — 代码有语法错误？没关系，tree-sitter 会构建一棵带 `ERROR` 节点的部分语法树，其余部分照常分析
3. **增量解析** — 改了一行代码，不用重新解析整个文件，只更新受影响的 AST 节点
4. **原生源码映射** — 分析结果可以直接定位到源码行列号，不用像 LLVM IR 那样通过 debug info 反查

当然 tradeoff 也很明显：tree-sitter 拿到的是语法树，不是 LLVM IR，所以像 pysvf 那种基于 value-flow 的跨函数指针分析就做不了了。但对于 buffer overflow 的很多常见 pattern（数组越界、循环边界错误、`memcpy` 大小不匹配），在 AST 层面做模式匹配已经能覆盖相当多的场景。

两个版本不冲突——轻量版覆盖日常开发的快速检查，重量级版本用于需要精确分析的场景。

## 代码

项目开源在 [**github.com/bjjwwang/SVF-MCP**](https://github.com/bjjwwang/SVF-MCP)，欢迎试用和反馈。

---

*如果你也在做程序分析相关的工具，想接入 AI 编辑器，MCP 是一个值得关注的方向。门槛不高，效果很直观。*
