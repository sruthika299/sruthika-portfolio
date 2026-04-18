const navLinks = [
  {
    id: 1,
    name: "Projects",
    type: "finder",
  },
  {
    id: 3,
    name: "Contact",
    type: "contact",
  },
  {
    id: 4,
    name: "Resume",
    type: "resume",
  },
];

const navIcons = [
  {
    id: 1,
    img: "/icons/wifi.svg",
  },
  {
    id: 2,
    img: "/icons/search.svg",
  },
  {
    id: 3,
    img: "/icons/user.svg",
  },
  {
    id: 4,
    img: "/icons/mode.svg",
  },
];

const dockApps = [
  {
    id: "finder",
    name: "Portfolio", // was "Finder"
    icon: "finder.png",
    canOpen: true,
  },
  {
    id: "safari",
    name: "Safari",
    icon: "safari.png",
    canOpen: true,
  },
  {
    id: "photos",
    name: "Gallery", // was "Photos"
    icon: "photos.png",
    canOpen: true,
  },
  {
    id: "contact",
    name: "Contact", // or "Get in touch"
    icon: "contact.png",
    canOpen: true,
  },
  {
    id: "terminal",
    name: "Skills", // was "Terminal"
    icon: "terminal.png",
    canOpen: true,
  },
  {
    id: "trash",
    name: "Archive", // was "Trash"
    icon: "trash.png",
    canOpen: true,
  },
];

const techStack = [
  {
    category: "Design Software",
    items: ["Figma", "Sketch", "Adobe XD"],
  },
  {
    category: "Prototyping",
    items: ["Protopie", "Framer", "InVision"],
  },
  {
    category: "User Research",
    items: ["Miro", "FigJam", "Maze"],
  },
  {
    category: "Visual Content",
    items: ["Photoshop", "Illustrator", "After Effects"],
  },
  {
    category: "Design Systems",
    items: ["Tokens Studio", "Storybook", "Zeplin"],
  },
  {
    category: "Web Building",
    items: ["Webflow", "Framer Sites", "HTML/CSS"],
  },
];

const socials = [
  {
    id: 1,
    text: "Github",
    icon: "/icons/github.svg",
    bg: "#f4656b",
    link: "https://github.com/sruthika299",
  },
  {
    id: 2,
    text: "Instagram",
    icon: "/icons/instagram.svg",
    bg: "#e1306c",
    link: "https://www.instagram.com/sruthxxa__/",
  },
  {
    id: 3,
    text: "Dribbble",
    icon: "/icons/dribbble.svg",
    bg: "#ea4c89",
    link: "https://dribbble.com/sruthika384",
  },
  {
    id: 4,
    text: "LinkedIn",
    icon: "/icons/linkedin.svg",
    bg: "#05b6f6",
    link: "https://www.linkedin.com/in/sruthika-k-144389331/",
  },
];

const photosLinks = [
  {
    id: 1,
    icon: "/icons/gicon1.svg",
    title: "Library",
  },
  {
    id: 2,
    icon: "/icons/gicon2.svg",
    title: "Memories",
  },
  {
    id: 3,
    icon: "/icons/file.svg",
    title: "Places",
  },
  {
    id: 4,
    icon: "/icons/gicon4.svg",
    title: "People",
  },
  {
    id: 5,
    icon: "/icons/gicon5.svg",
    title: "Favorites",
  },
];

const gallery = [
  { id: 1, img: "/images/gal-1.jpeg" },
  { id: 2, img: "/images/gal-2.jpeg" },
  { id: 3, img: "/images/gal-3.jpeg" },
  { id: 4, img: "/images/gal-4.jpeg" },
];

export {
  navLinks,
  navIcons,
  dockApps,
  techStack,
  socials,
  photosLinks,
  gallery,
};

// Flattened projects for Finder
export const projects = [
  {
    id: 1,
    title: "JBL Redesign",
    image: "/images/project-1.png",
    category: "E-COMMERCE",
    link: "https://jbl.com",
  },
  {
    id: 2,
    title: "Nike Store",
    image: "/images/project-2.png",
    category: "RETAIL",
    link: "https://nike.com",
  },
  {
    id: 3,
    title: "Pattio App",
    image: "/images/project-3.png",
    category: "FOOD TECH",
    link: "https://pattio.netlify.app/",
  },
  {
    id: 4,
    title: "Fintech Dashboard",
    image: "/images/project-4.png",
    category: "FINTECH",
    link: "https://dashboard.com",
  }
];

const WORK_LOCATION = {
  id: 1,
  type: "work",
  name: "Work",
  icon: "/icons/work.svg",
  kind: "folder",
  children: [
    // ▶ Project 1
    {
      id: 5,
      name: "JBL Redesign",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-10 left-5", // icon position inside Finder
      windowPosition: "top-[5vh] left-5", // optional: Finder window position
      children: [
        {
          id: 1,
          name: "JBL Project.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          description: [
            "The JBL website redesign is a comprehensive UI/UX case study aimed at delivering a premium audio shopping experience.",
            "I focused on user research, wireframing, and high-fidelity prototyping to craft a dynamic dark theme and sleek visual hierarchy.",
            "By optimizing the user journey and creating interactive prototypes, I ensured a seamless and engaging experience for audiophiles.",
            "The final design incorporates custom iconography and tactile feedback animations that mimic the physical feel of premium audio equipment.",
            "Through multiple rounds of usability testing, I achieved a significant reduction in checkout friction, creating a truly user-centric digital storefront.",
          ],
        },
        {
          id: 2,
          name: "jbl.com",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://jbl-headset.netlify.app/",
          position: "top-10 right-20",
        },
        {
          id: 4,
          name: "jbl.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-52 right-80",
          imageUrl: "/images/project-1.png",
          size: "241 KB",
          created: "Jan 15, 2026",
        },
        {
          id: 5,
          name: "Design.fig",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://www.figma.com/design/mq8mtmk4GZZzPWAvV4iB9y/Design-Files?node-id=1-854&t=RSXxUx51dJExL8qF-1",
          position: "top-60 right-20",
        },
      ],
    },

    // ▶ Project 2
    {
      id: 6,
      name: "Vivid Lux",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-52 right-80",
      windowPosition: "top-[20vh] left-7",
      children: [
        {
          id: 1,
          name: "Vivid Lux Project.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 right-10",
          description: [
            "Vivid Lux is a UI/UX design project for a modern eCommerce platform, specialized for a high-end lighting brand.",
            "My design process involved creating comprehensive user personas, user flows, and a clean, minimalist design system.",
            "I emphasized intuitive product discovery through clear navigation and refined micro-interactions, providing a seamless journey from browsing to checkout.",
            "I integrated a sophisticated 'Lighting Preview' feature that allows users to visualize products in different room settings before purchasing.",
            "The color palette was carefully chosen to enhance the luxury feel, using deep charcoal backgrounds to let the vibrant product photography shine.",
          ],
        },
        {
          id: 2,
          name: "vividlux.com",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://vividlux.netlify.app/",
          position: "top-20 left-20",
        },
        {
          id: 4,
          name: "vivid-lux.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-52 left-80",
          imageUrl: "/images/project-2.png",
          size: "466 KB",
          created: "Feb 2, 2026",
        },
        {
          id: 5,
          name: "Design.fig",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://www.figma.com/design/mq8mtmk4GZZzPWAvV4iB9y/Design-Files?node-id=1-97&t=RSXxUx51dJExL8qF-1",
          position: "top-60 left-5",
        },
      ],
    },

    // ▶ Project 3
    {
      id: 7,
      name: "Pattio - Burger Website",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-10 left-80",
      windowPosition: "top-[33vh] left-7",
      children: [
        {
          id: 1,
          name: "Pattio Project.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          description: [
            "Pattio is a vibrant and appetizing UI/UX design concept dedicated to the ultimate burger experience.",
            "The design strategy focused on accessible typography, high-contrast visual elements, and an inviting color palette.",
            "I prioritized usability testing and iterative prototyping to refine the food ordering process, reducing friction and capturing the essence of great user experience.",
            "Interactive 'Build Your Burger' components were developed to make the customization process fun and visually rewarding for customers.",
            "The project successfully bridges the gap between digital convenience and the sensory appeal of gourmet food through high-resolution imagery.",
          ],
        },
        {
          id: 2,
          name: "pattio.com",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://pattio.netlify.app/",
          position: "top-10 right-20",
        },
        {
          id: 4,
          name: "pattio.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-52 right-80",
          imageUrl: "/images/project-3.png",
          size: "918 KB",
          created: "Mar 10, 2026",
        },
        {
          id: 5,
          name: "Design.fig",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://www.figma.com/design/mq8mtmk4GZZzPWAvV4iB9y/Design-Files?node-id=1-1211&t=RSXxUx51dJExL8qF-1",
          position: "top-60 right-20",
        },
      ],
    },
  ],
};

const ABOUT_LOCATION = {
  id: 2,
  type: "about",
  name: "About me",
  icon: "/icons/info.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "me.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-10 left-5",
      imageUrl: "/images/sruthika-2.jpg.jpeg",
      size: "1.8 MB",
      created: "Apr 1, 2026",
    },
    {
      id: 2,
      name: "profile-pic.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-28 right-72",
      imageUrl: "/images/profile-pic.jpg",
      size: "268 KB",
      created: "Mar 15, 2026",
    },
    {
      id: 4,
      name: "about-me.txt",
      icon: "/images/txt.png",
      kind: "file",
      fileType: "txt",
      position: "top-60 left-5",
      subtitle: "Meet the Designer Behind the Experience",
      image: "/images/profile-pic.jpg",
      description: [
        "Hey! I’m Sruthika 👋, a UI/UX Designer who enjoys building sleek, interactive designs that actually work well.",
        "I specialize in User Experience, Interaction Design, and Figma and I love making things feel smooth, fast, and just a little bit delightful.",
        "I’m big on clean UI, good UX, and creating designs that don't even need a manual to understand.",
        "Outside of design work, you'll find me tweaking layouts at 2AM, sipping overpriced coffee, or impulse-buying gadgets I absolutely convinced myself I needed 😅",
      ],
    },
  ],
};

const RESUME_LOCATION = {
  id: 3,
  type: "resume",
  name: "Resume",
  icon: "/icons/file.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "Resume.pdf",
      icon: "/images/pdf.png",
      kind: "file",
      fileType: "pdf",
      // you can add `href` if you want to open a hosted resume
      // href: "/your/resume/path.pdf",
    },
  ],
};

const TRASH_LOCATION = {
  id: 4,
  type: "trash",
  name: "Trash",
  icon: "/icons/trash.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "trash1.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-10 left-10",
      imageUrl: "/images/trash-1.png",
      size: "347 KB",
      created: "Jan 1, 2026",
    },
    {
      id: 2,
      name: "trash2.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-40 left-80",
      imageUrl: "/images/trash-2.png",
      size: "208 KB",
      created: "Feb 14, 2026",
    },
  ],
};

export const locations = {
  work: WORK_LOCATION,
  about: ABOUT_LOCATION,
  resume: RESUME_LOCATION,
  trash: TRASH_LOCATION,
};

const INITIAL_Z_INDEX = 1000;

const WINDOW_CONFIG = {
  finder: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  contact: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  resume: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  safari: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  photos: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  terminal: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  txtfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  imgfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  trash: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
};

export { INITIAL_Z_INDEX, WINDOW_CONFIG };