---
layout: post
title: "Claude Skills 深度解读：从理解到实践，再到未来路由的想象"
date: 2026-02-25 14:00:00 +0800
description: "基于对 claude-skills 仓库的完整研究，深度解析 Claude Skills 的设计模式、最佳实践与路由机制设想"
tags: [AI, Claude, Prompt Engineering]
categories: [tech]
giscus_comments: false
---
> 基于对 [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) 的完整研究

---

## 一、我对 Claude Skills 的理解

### 1.1 它到底是什么？

Claude Skills **不是插件系统，不是 API，不是框架**——它是一套**结构化的 Prompt 工程协议**。

如果把 AI Agent 比作一个新入职的天才员工，那 Skills 就是你递给他的**岗位手册**。手册里写了：
- 你的角色是什么（Practitioner Voice）
- 遇到问题先看什么（Context-First）
- 不同情况走什么流程（Multi-Mode Workflows）
- 什么时候该主动预警（Proactive Triggers）
- 交付物长什么样（Output Artifacts）

本质上，它在解决一个核心矛盾：**大模型什么都懂一点，但什么都不够深**。通过注入结构化的领域知识，让 Agent 从"通才"变成"专才"。

### 1.2 三层架构

```
┌─────────────────────────────────────┐
│           SKILL.md (≤10KB)          │  ← 工作流引擎，立即可用
│   角色定义 + 决策框架 + 工作流程      │
├─────────────────────────────────────┤
│         references/ (按需加载)        │  ← 深度知识库
│   框架指南 / 基准数据 / 最佳实践      │
├─────────────────────────────────────┤
│         scripts/ (Python CLI)        │  ← 量化工具
│   零依赖 / 纯标准库 / JSON 输出      │
└─────────────────────────────────────┘
```

这个三层设计非常精妙：
- **SKILL.md 控制在 10KB 以内**——不浪费 context window
- **references 按需加载**——需要深挖时再读，不一次性灌入
- **scripts 零依赖**——任何环境都能跑，不会因为缺个 pip 包而卡住

### 1.3 十大设计模式的核心洞察

205 个 Skills 遵循 10 个统一的设计模式，但其中最关键的是三个：

**Context-First（先读再问）**
```
❌ 普通 AI："请告诉我你的技术栈是什么？"
✅ Skills AI：先扫描 package.json / Dockerfile / tsconfig.json，
            然后说："我看到你用的是 Next.js 14 + PostgreSQL，
            你是想优化 SSR 性能还是数据库查询？"
```
这一个模式就能让用户体验提升一个量级。

**Practitioner Voice（专家口吻）**
不说"你可以考虑以下几个选项"，而是说"在你这个场景下，用 X。原因是 Y。如果你的流量超过 Z，再换成 W。"——有主见，像真正的资深工程师。

**Quality Loop（置信度标签）**
每个结论必须标注 🟢 已验证 / 🟡 中等置信 / 🔴 假设推断。这解决了 AI 最大的信任问题——你不知道它是真懂还是在编。

### 1.4 规模全景

| 维度 | 数量 |
|------|------|
| 生产级技能 | 205 个 |
| Python CLI 工具 | 254 个 |
| 覆盖领域 | 9 大领域（工程/产品/营销/C-Level/合规等） |
| 支持 AI 工具 | 11 种（Claude Code / Cursor / Gemini CLI 等） |
| Persona 预设 | 3 种（Startup CTO / Growth Marketer / Solo Founder） |

---

## 二、最佳实践：三个真实场景

### 场景 A：从零搭建一个 SaaS 产品

**背景**：你是一个 3 人创业团队，要用 Next.js + Supabase 搭建一个 B2B SaaS。

**推荐技能栈**：
```
1. senior-architect/SKILL.md      → 系统架构设计
2. senior-fullstack/SKILL.md      → 全栈开发执行
3. stripe-integration-expert/SKILL.md → 支付集成
4. senior-security/SKILL.md       → 安全基线
```

**使用流程**：

```
第 1 步：加载架构师技能
> Load engineering-team/senior-architect/SKILL.md

提问："我要做一个多租户 SaaS，支持 Stripe 订阅，
      预期第一年 1000 个企业客户，帮我设计架构。"

架构师技能会：
- 先扫描你的项目目录，识别已有技术选型
- 输出系统架构图 + 技术决策记录（ADR）
- 标注每个决策的置信度（🟢🟡🔴）
- 主动触发："你没有设置 rate limiting，这在多租户场景下是必须的"

第 2 步：切换到全栈开发技能
> Load engineering-team/senior-fullstack/SKILL.md

提问："按照刚才的架构，帮我搭建项目脚手架。"

第 3 步：集成支付
> Load engineering-team/stripe-integration-expert/SKILL.md

提问："接入 Stripe Billing，支持月付/年付两种计划。"
```

**关键心得**：
- 技能之间是**串行叠加**的关系，前一个的输出是后一个的输入
- 不要一次加载所有技能，会稀释 context window 的有效浓度
- 架构决策阶段用 architect，进入编码阶段再换 fullstack

---

### 场景 B：遗留系统的安全审计与重构

**背景**：你接手了一个 3 年前的 Express.js 项目，已知有安全隐患，需要审计并逐步重构。

**推荐技能栈**：
```
1. senior-security/SKILL.md   → 安全威胁建模 + 漏洞扫描
2. code-reviewer/SKILL.md     → 代码质量审查
3. senior-backend/SKILL.md    → 重构执行
4. senior-devops/SKILL.md     → CI/CD 加固
```

**使用流程**：

```
第 1 步：安全审计（发现问题）
> Load engineering-team/senior-security/SKILL.md

提问："对这个项目做一次完整的安全审计。"

安全技能会：
- 扫描依赖（package.json）找已知漏洞
- 检查认证/授权逻辑
- 识别 SQL 注入 / XSS / CSRF 风险点
- 输出：按严重程度排序的漏洞清单 + 修复优先级

第 2 步：代码审查（评估质量）
> Load engineering-team/code-reviewer/SKILL.md

提问："重点审查 src/middleware/ 和 src/routes/，
      关注安全和可维护性。"

第 3 步：后端重构（修复问题）
> Load engineering-team/senior-backend/SKILL.md

提问："按照审计报告，从 P0 问题开始逐个修复。"

第 4 步：加固流水线
> Load engineering-team/senior-devops/SKILL.md

提问："在 CI 中加入 SAST 扫描和依赖漏洞检查。"
```

**关键心得**：
- 安全审计一定要在重构之前，先知道问题在哪
- code-reviewer 和 senior-security 的视角不同：前者看代码质量，后者看攻击面
- 最后用 DevOps 技能把安全检查固化到流水线里，防止回退

---

### 场景 C：用 Persona 模式进行产品战略决策

**背景**：你是一个 Solo Founder，产品上线 3 个月，有一些付费用户但增长缓慢，需要决定下一步方向。

**推荐方式**：使用 Persona 而非单个 Skill

```
第 1 步：加载 "Startup CTO" Persona
这个 Persona 预配置了工程 + 产品 + 商业的跨域视角

提问："我的 SaaS 上线 3 个月，MRR $2K，月增长 8%，
      churn 12%。用户反馈最多的是缺少团队协作功能。
      我该先降 churn 还是先加新功能拉增长？"

Persona 会综合调用多个领域的思维：
- 工程视角：团队协作功能的技术复杂度评估
- 产品视角：12% churn 在这个阶段是否正常
- 商业视角：$2K MRR 阶段的资源分配建议
- 输出：一个带优先级的行动计划

第 2 步：深入某个方向
如果决定先降 churn，可以加载：
> Load product-team/product-manager/SKILL.md
> Load marketing-skill/customer-retention/SKILL.md

如果决定先加功能，可以加载：
> Load engineering-team/senior-architect/SKILL.md
```

**关键心得**：
- Persona 适合**战略决策**——需要跨域综合判断时
- 单个 Skill 适合**执行任务**——已经知道要做什么时
- 先用 Persona 定方向，再用 Skill 做执行

---

## 三、路由的重要性：被忽视的关键拼图

### 3.1 当前的痛点

这个仓库有 205 个技能，但**没有路由机制**。这意味着：

```
用户必须：
1. 知道有哪些技能存在            ← 认知负担
2. 理解每个技能的适用场景         ← 学习成本
3. 在正确的时机手动加载正确的技能  ← 操作负担
4. 知道什么时候该切换技能         ← 判断负担
```

这就像你有一个 200 人的专家团队，但没有前台接待——每个来访者必须自己知道该找哪个专家，走到哪个办公室，敲哪扇门。

**仓库作者的原话是："The human decides. Orchestration is a suggestion."**

这在技术上是一个合理的 MVP 选择，但在产品上，它把最难的决策（选什么技能）留给了最不擅长做这个决策的人（用户）。

### 3.2 路由为什么是刚需？

| 没有路由 | 有路由 |
|---------|--------|
| "我该用哪个技能？" | "告诉我你要做什么" |
| 用户必须读完 205 个技能描述 | 系统自动匹配 Top-3 |
| 手动 Load + 手动切换 | 任务驱动，自动编排 |
| 专家才能用好 | 新手也能用好 |
| 技能数量是负担 | 技能数量是优势 |

路由的本质是：**把"选择的认知负担"从用户侧转移到系统侧。**

---

## 四、路由设计：我的方案

### 4.1 轻量级方案：静态索引 + LLM 匹配

最简单也最实用的第一步：

```yaml
# skill-index.yaml — 所有技能的轻量索引
skills:
  - name: senior-architect
    domain: engineering
    path: engineering-team/senior-architect/SKILL.md
    triggers:
      - "系统设计"
      - "架构"
      - "微服务 vs 单体"
      - "技术选型"
      - "扩展性"
    anti_triggers:
      - "写具体代码"
      - "修 bug"
    complexity: high
    phase: planning

  - name: senior-frontend
    domain: engineering
    path: engineering-team/senior-frontend/SKILL.md
    triggers:
      - "React"
      - "CSS"
      - "页面性能"
      - "组件设计"
    anti_triggers:
      - "数据库"
      - "API 设计"
    complexity: medium
    phase: execution
```

**工作流程**：
```
用户输入 → Router Prompt（读 skill-index.yaml）
         → 输出 Top-3 技能推荐 + 理由
         → 用户确认（或系统自动加载最佳匹配）
         → 执行
```

Router Prompt 核心逻辑：
```
你是技能路由器。根据用户的任务描述，从 skill-index.yaml 中
选出最匹配的 1-3 个技能。

选择依据：
1. 任务关键词与 triggers 的匹配度
2. 排除命中 anti_triggers 的技能
3. 任务所处阶段（planning / execution / review）
4. 项目上下文（如果有 package.json 等文件）

输出格式：
- 推荐技能 + 匹配理由
- 建议的加载顺序
- 置信度（🟢🟡🔴）
```

**优点**：零代码改动，只需一个 YAML + 一段 Prompt。
**缺点**：静态索引需要人工维护，无法学习用户偏好。

### 4.2 中级方案：Context-Aware 动态路由

```
┌──────────┐    ┌──────────────┐    ┌─────────────┐
│ 用户输入  │ →  │  上下文采集器  │ →  │  路由引擎    │
└──────────┘    └──────────────┘    └─────────────┘
                      │                     │
                      ▼                     ▼
                ┌──────────┐         ┌──────────┐
                │ 项目文件  │         │ 技能索引  │
                │ Git 历史  │         │ 用户画像  │
                │ 错误日志  │         │ 会话记忆  │
                └──────────┘         └──────────┘
```

路由引擎的判断维度：

| 维度 | 信号 | 示例 |
|------|------|------|
| 任务意图 | 用户的自然语言描述 | "这个 API 太慢了" → senior-backend |
| 项目上下文 | package.json / Dockerfile / .env | 检测到 Next.js → 优先推荐 senior-frontend |
| 工作阶段 | Git 历史 + 文件变更模式 | 刚 init → architect；大量代码 → code-reviewer |
| 用户画像 | 历史交互记录 | 这个用户经常做安全审计 → 提升 security 权重 |
| 错误上下文 | 终端报错 / 测试失败 | TypeError → senior-frontend；SQL error → senior-backend |

### 4.3 高级方案：自演化路由（Self-Evolving Router）

利用仓库里已有的 `self-improving-agent` 技能的理念：

```
路由决策 → 用户反馈（接受/拒绝/替换）→ 更新路由权重
                                        ↓
                              路由准确率持续提升
```

每次路由后记录：
```json
{
  "task": "优化首页加载速度",
  "recommended": ["senior-frontend", "senior-devops"],
  "user_chose": ["senior-frontend"],
  "user_rejected": ["senior-devops"],
  "reason": "这次只是 CSS 问题，不需要 DevOps",
  "timestamp": "2026-03-20"
}
```

随着数据积累，路由会越来越懂你的项目和偏好。

---

## 五、如果我是乔布斯：路由的终极形态

> "People don't know what they want until you show it to them."

乔布斯不会让用户去选技能。他甚至不会让用户意识到"技能"这个概念的存在。

### 5.1 路由应该是隐形的

未来的 AI Agent 不应该有"加载技能"这个动作。就像你用 iPhone 时不需要手动加载"打电话模块"或"拍照模块"——你只是打电话，只是拍照。

```
今天：
用户："我想优化数据库查询"
AI："请先加载 senior-backend 技能"       ← 这是产品的失败

未来：
用户："我想优化数据库查询"
AI：（已自动激活 backend + database 领域知识，
     扫描了你的 schema 和慢查询日志，
     正在用 EXPLAIN ANALYZE 分析 Top-5 慢查询）
    "你的 orders 表缺少 user_id + created_at 的复合索引，
     这导致了 dashboard 页面 80% 的延迟。要我加上吗？"
```

### 5.2 路由的三个进化阶段

```
阶段 1：菜单式（当前）
┌─────────────────────┐
│  请选择你需要的技能：   │
│  □ 架构师             │
│  □ 前端工程师          │
│  □ 安全专家           │
│  □ ...               │
└─────────────────────┘
等同于：早期手机的层层菜单

阶段 2：搜索式（我的方案）
┌─────────────────────┐
│  告诉我你要做什么      │
│  [优化API性能_______] │
│                      │
│  推荐：               │
│  🟢 senior-backend   │
│  🟡 senior-devops    │
└─────────────────────┘
等同于：Google 搜索——你说需求，我给结果

阶段 3：直觉式（终极形态）
┌─────────────────────┐
│  （无任何技能选择界面） │
│                      │
│  AI 像一个资深 CTO：   │
│  看到你在写什么代码，   │
│  知道项目处在什么阶段， │
│  理解你的技术偏好，     │
│  自动用对的方式帮你。   │
└─────────────────────┘
等同于：iPhone——你不选功能，你直接做事
```

### 5.3 终极路由 = 消灭路由

真正伟大的路由，是让用户**完全感知不到路由的存在**。

它应该像人脑一样工作——当你看到一个数学公式时，你不会想"让我先激活数学模块"；当你听到音乐时，你不会想"让我先加载音乐处理模块"。你的大脑自动、即时、无缝地调用了正确的能力。

**未来的 AI Agent 应该是这样的**：

```
你说一句话 → Agent 已经知道该用什么能力
           → 已经扫描了你的上下文
           → 已经准备好了工具
           → 直接给你结果

没有"选择技能"这一步。
没有"加载中"这个状态。
没有"你确定要用这个技能吗"这种确认。

就像乔布斯说的：
"It just works."
```

### 5.4 实现路径

从今天到终极形态，需要三件事：

1. **更大的 Context Window**：当模型能同时持有所有技能的精华（不是全文），路由就变成了注意力分配问题——模型自己知道当前该关注哪部分知识。

2. **持久记忆**：Agent 需要记住你的项目、你的偏好、你过去的决策。不是每次从零开始，而是像一个跟你合作了一年的同事。

3. **实时上下文感知**：不只是你说了什么，还有你在看什么文件、刚运行了什么命令、终端里报了什么错。所有这些都是路由信号。

当这三件事同时成熟时，"技能"这个概念本身就会消失——它会内化为 Agent 的能力底座，就像你不会说"我正在使用我的语言技能来读这段文字"一样。

**技能的终局不是更好的技能管理，而是技能的消融。**

---

## 六、总结

| 层次 | 理解 |
|------|------|
| What | Claude Skills 是结构化的 Prompt 工程协议，把领域专家知识打包为可插拔模块 |
| How | 三层架构（SKILL.md + references + scripts）+ 十大设计模式 |
| Why | 解决大模型"什么都会但不够深"的问题 |
| Gap | 缺少路由机制，用户必须自己知道该用什么技能 |
| Future | 路由从"菜单式"→"搜索式"→"直觉式"，最终消融为 Agent 的内在能力 |

> **一句话总结**：Claude Skills 把"知道怎么做"工程化了，但"知道该做什么"这个更难的问题，还留给了用户。谁解决了路由，谁就解决了 AI Agent 的最后一公里。
