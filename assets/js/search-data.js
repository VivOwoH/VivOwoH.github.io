// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "Blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "A collection of projects that aren&#39;t repo-ready — yet (or ever, for various reasons).",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-repo",
          title: "Repo",
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
        },{id: "post-nvidia-jetson-agx-orin-with-oai-5g-stack",
        
          title: 'NVIDIA Jetson AGX Orin with OAI 5G Stack <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Complete guide for configuring NVIDIA Jetson AGX Orin for 5G NR SA end-to-end setup with OpenAirInterface gNB",
        section: "Posts",
        handler: () => {
          
            window.open("https://gist.github.com/VivOwoH/c137b8201a548f80e20d76a68edf4344", "_blank");
          
        },
      },{id: "post-tensorflow-gpu-on-ubuntu-with-cuda-11-8",
        
          title: 'TensorFlow-GPU on Ubuntu with CUDA 11.8 <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "A comprehensive guide for installing TensorFlow with GPU support on WSL2 and Ubuntu 22.04, including CUDA 11.8 and cuDNN 8 configuration",
        section: "Posts",
        handler: () => {
          
            window.open("https://gist.github.com/VivOwoH/e3d3ab76be5b2eb9a6ebdb7b4ba84da2", "_blank");
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "projects-end-to-end-wireless-communication-with-channel-surrogate",
          title: 'End-to-End Wireless Communication with Channel Surrogate',
          description: "Neural network-based communication system using CWGAN for differentiable channel modeling",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5g_project/";
            },},{id: "projects-concussion-action-plan-app",
          title: 'Concussion Action Plan App',
          description: "Cross-platform mobile healthcare app with offline-first architecture",
          section: "Projects",handler: () => {
              window.location.href = "/projects/concussion_project/";
            },},{id: "projects-networked-device-management-w-digital-twin",
          title: 'Networked Device Management w/ Digital Twin',
          description: "Digital twin system for offline device management in distributed networks",
          section: "Projects",handler: () => {
              window.location.href = "/projects/dante_project/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%77%65%68%61%37%36%31%32@%75%6E%69.%73%79%64%6E%65%79.%65%64%75.%61%75", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/VivOwoH", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/vivian-ha-a6b6a0207", "_blank");
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
