// ============================================================
// PORTFOLIO DATA — Edit this file to update all website content
// ============================================================

export const personalInfo = {
  firstName: "Yatendra",
  lastName: "Verma",
  fullName: "Yatendra Verma",
  titles: [
    "Software Developer",
    "Computer Vision Enthusiast",
    "AI Engineer",
    "Full Stack Developer",
    "Problem Solver",
  ],
  summary:
    "Passionate Software Developer and AI Engineer specializing in Computer Vision, Machine Learning, and Full-Stack Development. Building intelligent systems that bridge the gap between cutting-edge research and real-world applications.",
  profileImage: "/images/profile.webp",
  resumeUrl: "/resume.pdf",
  location: "Indore, Madhya Pradesh, India",
  email: "yatendrav477@gmail.com",
  phone: "+91-9479607590",
  socialLinks: {
    github: "https://github.com/Yatendra477",
    linkedin: "https://www.linkedin.com/in/yatendra-verma-0899a6246",
    email: "mailto:yatendrav477@gmail.com",
    twitter: "#",
  },
};

export const aboutHighlights = [
  {
    icon: "Lightbulb",
    title: "Problem Solving",
    description:
      "200+ LeetCode problems solved. Strong foundation in data structures, algorithms, and computational thinking.",
  },
  {
    icon: "Code2",
    title: "Software Engineering",
    description:
      "Building scalable, maintainable applications with clean architecture and modern development practices.",
  },
  {
    icon: "Brain",
    title: "Artificial Intelligence",
    description:
      "Hands-on experience with ML/DL frameworks, neural networks, and intelligent system design.",
  },
  {
    icon: "Eye",
    title: "Computer Vision",
    description:
      "Specialized in image processing, face recognition, object detection, and real-time visual systems.",
  },
  {
    icon: "Users",
    title: "Leadership",
    description:
      "Active participant in hackathons, tech events, and collaborative engineering projects.",
  },
  {
    icon: "TrendingUp",
    title: "Continuous Learning",
    description:
      "Always exploring emerging technologies, earning certifications, and expanding technical horizons.",
  },
];

export const stats = [
  { label: "Projects Completed", value: 5, suffix: "+" },
  { label: "Technologies Learned", value: 12, suffix: "+" },
  { label: "Certifications Earned", value: 3, suffix: "+" },
  { label: "Coding Hours", value: 1500, suffix: "+" },
  { label: "Hackathons", value: 2, suffix: "+" },
];

export const education = [
  {
    degree: "Bachelor of Technology (B.Tech)",
    field: "Robotics & Automation",
    institution: "Medicaps University",
    location: "Indore, India",
    duration: "2022 — 2026",
    cgpa: "5.78 / 10",
    coursework: [
      "Data Structures",
      "Algorithms",
      "OOP",
      "DBMS",
      "Operating Systems",
      "Computer Networks",
      "Computer Vision",
      "Machine Learning",
      "AI",
      "Web Development",
    ],
  },
  {
    degree: "Higher Secondary (12th Grade)",
    field: "Science — CBSE",
    institution: "Gyan Sagar International School",
    location: "Hoshangabad, India",
    duration: "2022",
    cgpa: "5.50 / 10",
    coursework: [],
  },
  {
    degree: "Secondary (10th Grade)",
    field: "CBSE",
    institution: "Gyan Sagar International School",
    location: "Hoshangabad, India",
    duration: "2020",
    cgpa: "5.20 / 10",
    coursework: [],
  },
];

export const skillCategories = [
  {
    name: "Programming Languages",
    skills: [
      { name: "C", level: 75, icon: "🔧" },
      { name: "C++", level: 80, icon: "⚙️" },
      { name: "Python", level: 90, icon: "🐍" },
      { name: "JavaScript", level: 70, icon: "✨" },
    ],
  },
  {
    name: "Frontend",
    skills: [
      { name: "HTML", level: 85, icon: "🌐" },
      { name: "CSS", level: 80, icon: "🎨" },
      { name: "Tailwind CSS", level: 75, icon: "💨" },
      { name: "React", level: 70, icon: "⚛️" },
    ],
  },
  {
    name: "Backend",
    skills: [
      { name: "Node.js", level: 65, icon: "🟢" },
      { name: "Express.js", level: 60, icon: "🚂" },
      { name: "Flask", level: 70, icon: "🧪" },
      { name: "Django", level: 60, icon: "🎯" },
    ],
  },
  {
    name: "Database",
    skills: [
      { name: "MySQL", level: 80, icon: "🗄️" },
      { name: "MongoDB", level: 60, icon: "🍃" },
    ],
  },
  {
    name: "AI & Computer Vision",
    skills: [
      { name: "OpenCV", level: 85, icon: "👁️" },
      { name: "Image Processing", level: 80, icon: "🖼️" },
      { name: "Machine Learning", level: 75, icon: "🤖" },
      { name: "Deep Learning", level: 65, icon: "🧠" },
      { name: "Scikit-Learn", level: 70, icon: "📊" },
    ],
  },
  {
    name: "Tools & Platforms",
    skills: [
      { name: "Git", level: 85, icon: "📦" },
      { name: "GitHub", level: 90, icon: "🐙" },
      { name: "VS Code", level: 90, icon: "💻" },
      { name: "Arduino", level: 75, icon: "🔌" },
      { name: "Linux", level: 65, icon: "🐧" },
    ],
  },
];

export const experience = [
  {
    company: "Cyber Instant Pvt. Ltd.",
    role: "Software Engineer Intern",
    duration: "Jun 2025 — Jul 2025",
    location: "Indore, India",
    description:
      "Focused on scripting, automation, and backend development to support security operations and application development.",
    responsibilities: [
      "Built server-side web applications using Django and Flask frameworks",
      "Applied unit testing frameworks including unittest and pytest for code reliability",
      "Implemented file handling & I/O for CSV, JSON, XML, and TXT file types",
      "Developed automation scripts to streamline development workflows",
    ],
    technologies: [
      "Python",
      "Django",
      "Flask",
      "MySQL",
      "GitHub",
      "NumPy",
      "Pandas",
      "Matplotlib",
    ],
    type: "Internship" as const,
  },
];

export const projects = [
  {
    title: "Face Recognition Attendance System",
    description:
      "Real-time face recognition attendance system with 95%+ accuracy in contactless face detection. Features automated attendance logging, multi-face detection, and a user-friendly GUI interface.",
    technologies: ["Python", "OpenCV", "MySQL", "Tkinter"],
    features: [
      "95%+ face detection accuracy",
      "Real-time multi-face recognition",
      "Automated attendance logging",
      "Admin dashboard with reports",
    ],
    github: "https://github.com/tanishk937/face--attendance-system",
    liveDemo: "",
    image: "/images/project-face.webp",
    category: "AI/CV",
    featured: true,
    date: "Feb 2025 — Apr 2025",
  },
  {
    title: "PythonBot — Automation Suite",
    description:
      "Intelligent Python-based automation bot for executing routine tasks and improving workflow efficiency. Integrates API and web automation with robust error-handling mechanisms.",
    technologies: ["Python", "React.js", "CSS", "HTML"],
    features: [
      "Task automation engine",
      "API integration layer",
      "Web scraping capabilities",
      "Error recovery system",
    ],
    github: "https://github.com/Yatendra477",
    liveDemo: "",
    image: "/images/project-bot.webp",
    category: "Automation",
    featured: true,
    date: "2024",
  },
  {
    title: "PyShortify — URL Shortener",
    description:
      "Python-based URL shortener converting long URLs into compact, shareable links using hashing algorithms with fast redirection and analytics tracking.",
    technologies: ["Python", "Flask", "MySQL"],
    features: [
      "Custom short URL generation",
      "Fast redirection engine",
      "Click analytics dashboard",
      "RESTful API endpoints",
    ],
    github: "https://github.com/Yatendra477",
    liveDemo: "",
    image: "/images/project-url.webp",
    category: "Web",
    featured: true,
    date: "2024",
  },
  {
    title: "Smart IoT Automation System",
    description:
      "IoT-based smart automation project using Arduino and sensors for real-time environmental monitoring and automated control of connected devices.",
    technologies: ["Arduino", "C++", "Sensors", "IoT"],
    features: [
      "Real-time sensor data monitoring",
      "Automated device control",
      "Serial communication protocol",
      "Low-power operation mode",
    ],
    github: "https://github.com/Yatendra477",
    liveDemo: "",
    image: "/images/project-iot.webp",
    category: "Automation",
    featured: false,
    date: "2024",
  },
  {
    title: "ML Prediction Engine",
    description:
      "Machine learning prediction system built with Scikit-Learn for data analysis, model training, and predictive analytics on structured datasets.",
    technologies: ["Python", "Scikit-Learn", "Pandas", "Matplotlib"],
    features: [
      "Multiple ML model comparison",
      "Data preprocessing pipeline",
      "Visualization dashboard",
      "Model performance metrics",
    ],
    github: "https://github.com/Yatendra477",
    liveDemo: "",
    image: "/images/project-ml.webp",
    category: "AI/CV",
    featured: false,
    date: "2025",
  },
];

export const certifications = [
  {
    title: "Smart UAV: AI/ML in Communication & Navigation",
    organization: "IIT Indore (sponsored by MeitY)",
    date: "March 2024",
    description:
      "40+ hours hands-on training covering drone basics, AI/ML applications, communications, navigation, and regulations. Aggregate: 10/10.",
    credentialUrl: "#",
  },
  {
    title: "Python Programming",
    organization: "Infosys Springboard",
    date: "2024",
    description:
      "Comprehensive Python 3 certification covering core concepts, clean code practices, and real-world application development.",
    credentialUrl: "#",
  },
  {
    title: "Smart UAS: AI/ML Seminar",
    organization: "IIT Indore",
    date: "Mar 2024",
    description:
      "Intensive week-long seminar (Mar 1-6, 2024) on AI and ML applications in Unmanned Aircraft Systems.",
    credentialUrl: "#",
  },
];

export const achievements = [
  {
    title: "200+ LeetCode Problems Solved",
    description:
      "Consistent problem-solving practice across data structures, algorithms, and competitive programming.",
    icon: "Code2",
    category: "Competitive Programming",
  },
  {
    title: "2+ Major Hackathons",
    description:
      "Active participation in national-level hackathons, building innovative solutions under time constraints.",
    icon: "Trophy",
    category: "Hackathons",
  },
  {
    title: "IIT Indore Certified",
    description:
      "Scored 10/10 aggregate in Smart UAV program conducted by IIT Indore, sponsored by MeitY.",
    icon: "Award",
    category: "Certifications",
  },
  {
    title: "Open Source Contributor",
    description:
      "Active GitHub presence with multiple public repositories and contributions to collaborative projects.",
    icon: "GitBranch",
    category: "Open Source",
  },
];

export const testimonials = [
  {
    name: "Prof. Mentor Name",
    designation: "Professor, Medicaps University",
    review:
      "Yatendra is a dedicated student with a strong passion for AI and computer vision. His project work demonstrates exceptional problem-solving abilities and technical depth.",
    photo: "",
  },
  {
    name: "Team Lead",
    designation: "Senior Engineer, Cyber Instant Pvt. Ltd.",
    review:
      "During his internship, Yatendra showed remarkable initiative in automating workflows and building robust backend systems. A quick learner with great attention to detail.",
    photo: "",
  },
];

export const resumeHighlights = [
  "B.Tech in Robotics & Automation from Medicaps University",
  "Software Engineer Intern at Cyber Instant Pvt. Ltd.",
  "Proficient in Python, C++, and AI/ML frameworks",
  "Specialized in Computer Vision with OpenCV",
  "200+ LeetCode problems solved",
  "IIT Indore Certified in AI/ML for UAV systems",
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Achievements", href: "#achievements" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
];
