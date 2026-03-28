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
          description: "Edit the `_data/repositories.yml` and change the `github_users` and `github_repos` lists to include your own GitHub profile and repositories.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "This is a description of the page. You can modify it in &#39;_pages/cv.md&#39;. You can also change or remove the top pdf download button.",
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
        },{id: "nav-people",
          title: "people",
          description: "members of the lab or group",
          section: "Navigation",
          handler: () => {
            window.location.href = "/people/";
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
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-our-paper-precise-sparse-abstract-execution-via-cross-domain-interaction-has-been-accepted-at-icse-2024",
          title: 'Our paper “Precise Sparse Abstract Execution via Cross-Domain Interaction” has been accepted at...',
          description: "",
          section: "News",},{id: "news-our-paper-efficient-abstract-interpretation-via-selective-widening-has-been-accepted-at-oopsla-2025",
          title: 'Our paper “Efficient Abstract Interpretation via Selective Widening” has been accepted at OOPSLA...',
          description: "",
          section: "News",},{id: "projects-siftabs",
          title: 'SiftAbs',
          description: "Selective widening for efficient abstract interpretation, enabling precise and scalable static analysis of real-world programs.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/siftabs/";
            },},{id: "projects-svf-cve",
          title: 'SVF-CVE',
          description: "Evaluating static analysis techniques on real-world CVE vulnerabilities using the SVF framework.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/svf-cve/";
            },},{id: "projects-svf-teaching",
          title: 'SVF Teaching',
          description: "CI/CD infrastructure and Docker tooling for SVF-based software analysis teaching at UNSW.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/svf-teaching/";
            },},{id: "projects-svf",
          title: 'SVF',
          description: "Static Value-Flow Analysis framework for source code. An open-source compiler tool for interprocedural static analysis of C/C++ programs.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/svf/";
            },},{
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
