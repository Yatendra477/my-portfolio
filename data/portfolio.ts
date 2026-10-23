// ============================================================
// PORTFOLIO DATA — Edit this file to update all website content
// ============================================================

export const STUDENT_STATUS = "final-year B.Tech student";
export const RESUME_UPDATED: string = "";

export const personalInfo = {
  firstName: "Yatendra",
  lastName: "Verma",
  fullName: "Yatendra Verma",
  titles: [
    "Python Developer",
    "AI/ML Engineer",
    "Computer Vision Enthusiast",
    "Backend Developer",
    "Problem Solver",
  ],
  summary:
    "Passionate Python Developer and AI/ML Engineer specializing in Computer Vision, Machine Learning, and backend development. Building intelligent systems that bridge the gap between cutting-edge research and real-world applications.",
  profileImage: "/images/profile-cutout.png",
  resumeUrl: "/resume.pdf",
  location: "Indore, Madhya Pradesh, India",
  email: "yatendrav477@gmail.com",
  phone: "+91-9479607590",
  socialLinks: {
    github: "https://github.com/Yatendra477",
    linkedin: "https://www.linkedin.com/in/yatendra-verma-0899a6246",
    email: "mailto:yatendrav477@gmail.com",
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
  { label: "Projects Completed", value: 5, suffix: "" },
  { label: "Certifications Earned", value: 5, suffix: "" },
  { label: "Technologies Learned", value: 21, suffix: "+" },
  { label: "LeetCode Problems", value: 200, suffix: "+" },
  { label: "Hackathons", value: 2, suffix: "+" },
];

export const education = [
  {
    degree: "Secondary (10th Grade)",
    field: "CBSE",
    institution: "Gyan Sagar International School",
    location: "Hoshangabad, India",
    duration: "2020",
    coursework: [],
  },
  {
    degree: "Higher Secondary (12th Grade)",
    field: "Science — CBSE",
    institution: "Gyan Sagar International School",
    location: "Hoshangabad, India",
    duration: "2022",
    coursework: [],
  },
  {
    degree: "Bachelor of Technology (B.Tech)",
    field: "Robotics & Automation",
    institution: "Medicaps University",
    location: "Indore, India",
    duration: "2022 — 2026",
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
    ],
  },
];

export const skillCategories = [
  {
    name: "Programming Languages",
    skills: [
      { name: "Python", level: 90, icon: "Code2", description: "Primary language for all projects" },
      { name: "C", level: 75, icon: "Cpu", description: "Systems & embedded programming" },
    ],
  },
  {
    name: "Frontend",
    skills: [
      { name: "HTML", level: 85, icon: "Globe", description: "Semantic markup & structure" },
      { name: "CSS", level: 80, icon: "Palette", description: "Styling & responsive layouts" },
      { name: "Streamlit", level: 75, icon: "BarChart3", description: "Python-based data apps & demos" },
    ],
  },
  {
    name: "Backend",
    skills: [
      { name: "FastAPI", level: 75, icon: "Zap", description: "High-performance async REST APIs" },
      { name: "Flask", level: 70, icon: "FlaskConical", description: "Lightweight web framework" },
      { name: "Django", level: 60, icon: "Layers", description: "Full-featured Python web framework" },
    ],
  },
  {
    name: "Database",
    skills: [
      { name: "MySQL", level: 80, icon: "Database", description: "Relational database design & queries" },
      { name: "MongoDB", level: 60, icon: "Leaf", description: "NoSQL document-based storage" },
      { name: "PostgreSQL", level: 65, icon: "Database", description: "Advanced open-source RDBMS" },
    ],
  },
  {
    name: "AI & Computer Vision",
    skills: [
      { name: "OpenCV", level: 85, icon: "Eye", description: "Real-time image & video processing" },
      { name: "Image Processing", level: 80, icon: "Scan", description: "Filters, transforms, feature extraction" },
      { name: "Machine Learning", level: 75, icon: "Bot", description: "Supervised & unsupervised models" },
      { name: "Deep Learning", level: 65, icon: "Brain", description: "Neural networks & model training" },
      { name: "Scikit-Learn", level: 70, icon: "Binary", description: "Classical ML pipelines & evaluation" },
      { name: "NumPy / Pandas", level: 80, icon: "BarChart3", description: "Numerical computing & data wrangling" },
      { name: "spaCy", level: 65, icon: "Bot", description: "NLP & named entity recognition" },
    ],
  },
  {
    name: "Tools & Platforms",
    skills: [
      { name: "Git", level: 85, icon: "GitBranch", description: "Version control & branching" },
      { name: "GitHub", level: 90, icon: "FolderGit2", description: "Repository management & collaboration" },
      { name: "VS Code", level: 90, icon: "Laptop", description: "Primary code editor" },
      { name: "Arduino", level: 75, icon: "CircuitBoard", description: "Microcontroller & embedded systems" },
      { name: "Linux", level: 65, icon: "Terminal", description: "CLI, scripting & server environments" },
    ],
  },
];

export const experience = [
  {
    company: "Cyber Instant Pvt. Ltd.",
    role: "Python Development Intern",
    duration: "Jun 2025 – Jul 2025",
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
    github: "https://github.com/Yatendra477/FaceRecognition-Attendance-System",
    liveDemo: "https://huggingface.co/spaces/Yatendra477/Face-Attendance-System",
    image: "/images/project-face-v2.png",
    category: "AI/CV",
    featured: true,
    date: "Feb 2025 – Apr 2025",
  },
  {
    title: "Non-Profit QuizTutor Bot",
    description:
      "Intelligent educational bot designed for non-profits to provide automated tutoring and interactive quizzes. Features natural language processing, automated grading, and learning progress tracking.",
    technologies: ["Python", "NLP", "APIs", "Database"],
    features: [
      "Automated tutoring system",
      "Interactive quiz generation",
      "Learning progress tracking",
      "Multi-platform integration",
    ],
    github: "https://github.com/Yatendra477/Non-Profit-QuizTutor-Bot",
    liveDemo: "https://huggingface.co/spaces/Yatendra477/nonprofit-quiz-bot",
    image: "/images/project-quizbot-v2.png",
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
    github: "", // Showcase project (no public repository)
    liveDemo: "",
    image: "/images/project-url-v2.png",
    category: "Web",
    featured: false,
    date: "2024",
  },
  {
    title: "NGO Infrastructure System",
    description:
      "Comprehensive infrastructure and resource management platform for non-governmental organizations. Features volunteer tracking, donation processing, and operational analytics.",
    technologies: ["Python", "Django", "React", "PostgreSQL"],
    features: [
      "Volunteer management",
      "Resource allocation tracking",
      "Donation processing system",
      "Operational analytics dashboard",
    ],
    github: "https://github.com/vinay-24250/ngo-infrastructure",
    liveDemo: "",
    image: "/images/project-ngo-v2.png",
    category: "Web",
    featured: false,
    date: "2024",
  },
  {
    title: "Non-Profit Support Triage Agent",
    description:
      "A production-grade, multi-agent AI system that classifies, enriches, and routes incoming support messages for non-profit organisations using FastAPI and Groq Llama 3.",
    technologies: ["Python", "FastAPI", "Llama 3", "spaCy"],
    features: [
      "Multi-agent AI orchestration",
      "Intent and urgency classification",
      "Named Entity Recognition (NER)",
      "Deterministic routing rules engine",
    ],
    github: "https://github.com/Yatendra477/non-profit-triage-agent",
    liveDemo: "https://non-profit-triage-agent.onrender.com/ui/",
    image: "/images/project-triage-v2.png",
    category: "AI/CV",
    featured: true,
    date: "2024",
  },
];

export const certifications = [
  {
    title: "Agentic AI",
    organization: "Datagami (IBM Gold Partner / nasscom)",
    date: "Apr 2026 – May 2026",
    description:
      "Successfully completed a Skill-Based Project comprising 80 hours of structured learning and practical training in Agentic AI. Certificate: EDU-2026-2Q7YM",
    credentialUrl: "",
  },
  {
    title: "Generative AI",
    organization: "Datagami (IBM Gold Partner / nasscom)",
    date: "Feb 2026 – Mar 2026",
    description:
      "Successfully completed a Skill-Based Project comprising 80 hours of structured learning and practical training in Generative AI. Certificate: EDU-2026-EFWGY",
    credentialUrl: "",
  },
  {
    title: "DevOps Foundation",
    organization: "Datagami (IBM Gold Partner / nasscom)",
    date: "Jan 2026 – Feb 2026",
    description:
      "Successfully completed a Skill-Based Project comprising 80 hours of structured learning and practical training in DevOps Foundation. Certificate: EDU-2026-FTNC8",
    credentialUrl: "",
  },
  {
    title: "Smart UAV: AI/ML in Communication & Navigation",
    organization: "IIT Indore (sponsored by MeitY)",
    date: "Mar 2024",
    description:
      "40+ hours hands-on training covering drone basics, AI/ML applications, communications, navigation, and regulations. Aggregate: 10/10.",
    credentialUrl: "",
  },
  {
    title: "Python Programming",
    organization: "Infosys Springboard",
    date: "2024",
    description:
      "Comprehensive Python 3 certification covering core concepts, clean code practices, and real-world application development.",
    credentialUrl: "",
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

export interface TestimonialItem {
  name: string;
  designation: string;
  review: string;
  photo?: string;
}

// TODO: Add real testimonials here once supplied (e.g. name, role, quote, photo).
// Section and nav/footer links are automatically hidden while this array is empty.
export const testimonials: TestimonialItem[] = [];

export const resumeHighlights = [
  "B.Tech in Robotics & Automation from Medicaps University",
  "Python Development Intern at Cyber Instant Pvt. Ltd.",
  "Proficient in Python and AI/ML frameworks",
  "Specialized in Computer Vision with OpenCV",
  "200+ LeetCode problems solved",
  "IIT Indore Certified in AI/ML for UAV systems",
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];
