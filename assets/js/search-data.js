// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-teaching",
          title: "teaching",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "nav-bookshelf",
          title: "bookshelf",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/books/";
          },
        },{id: "dropdown-bookshelf",
              title: "bookshelf",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/books/";
              },
            },{id: "dropdown-blog",
              title: "blog",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/blog/";
              },
            },{id: "post-让-cursor-帮你找-bug-用-mcp-把-svf-静态分析接进-ai-编辑器",
        
          title: "让 Cursor 帮你找 Bug：用 MCP 把 SVF 静态分析接进 AI 编辑器",
        
        description: "把 SVF 的 buffer overflow 检测封装成 MCP Server，接入 Cursor AI，实现在聊天框里一句话就能跑静态分析",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/svf-mcp-cursor-buffer-overflow/";
          
        },
      },{id: "post-当-ai-被-骗-了-聊聊-llm-prompt-injection-与防御",
        
          title: "当 AI 被「骗」了：聊聊 LLM Prompt Injection 与防御",
        
        description: "从台大 ML HW1 出发，聊聊 Prompt Injection 的攻击手法、防御范式，以及 LLM 安全的根本困境",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/llm-prompt-injection-defense/";
          
        },
      },{id: "post-icse-2026-程序分析论文深度解读",
        
          title: "ICSE 2026 程序分析论文深度解读",
        
        description: "对 ICSE 2026 中程序分析方向论文的深度解读与分析",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/icse2026-program-analysis-survey/";
          
        },
      },{id: "post-claude-skills-深度解读-从理解到实践-再到未来路由的想象",
        
          title: "Claude Skills 深度解读：从理解到实践，再到未来路由的想象",
        
        description: "基于对 claude-skills 仓库的完整研究，深度解析 Claude Skills 的设计模式、最佳实践与路由机制设想",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/claude-skills-deep-dive/";
          
        },
      },{id: "books-the-republic",
          title: 'The Republic',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_republic/";
            },},{id: "books-writing-for-computer-science",
          title: 'Writing for Computer Science',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/writing_for_cs/";
            },},{id: "books-the-fine-art-of-small-talk",
          title: 'The Fine Art of Small Talk',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/fine_art_of_small_talk/";
            },},{id: "books-nexus-a-brief-history-of-information-networks-from-the-stone-age-to-ai",
          title: 'Nexus: A Brief History of Information Networks from the Stone Age to AI...',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/nexus/";
            },},{id: "books-痛苦是条虫",
          title: '痛苦是条虫',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/tongku_shi_tiao_chong/";
            },},{id: "books-正道",
          title: '正道',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/zhengdao/";
            },},{id: "news-our-paper-precise-sparse-abstract-execution-via-cross-domain-interaction-has-been-accepted-at-icse-2024",
          title: 'Our paper “Precise Sparse Abstract Execution via Cross-Domain Interaction” has been accepted at...',
          description: "",
          section: "News",},{id: "news-our-paper-efficient-abstract-interpretation-via-selective-widening-has-been-accepted-at-oopsla-2025",
          title: 'Our paper “Efficient Abstract Interpretation via Selective Widening” has been accepted at OOPSLA...',
          description: "",
          section: "News",},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6A%69%61%77%65%69.%77%61%6E%67%36@%75%6E%73%77.%65%64%75.%61%75", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/bjjwwang", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=Reukqu8AAAAJ", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0009-0000-0582-5966", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
