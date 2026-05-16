export interface ActionLink {
  label: string;
  href?: string | null;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  size?: "default" | "large";
}

export interface NavItem {
  label: string;
  href: string;
}

export interface VerticalItem {
  label: string;
  title: string;
  summary: string;
  href: string;
  image: string;
  cta: string;
  status: "internal" | "external" | "pending";
}

export interface TimelineItem {
  period: string;
  title: string;
  body: string;
}

export interface SkillCluster {
  title: string;
  summary: string;
  items: string[];
}

export interface PathwayItem {
  eyebrow?: string;
  title: string;
  body: string;
  href: string;
  label: string;
  external?: boolean;
  tone?: "default" | "accent";
}

export interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
  category: string;
  note: string;
  featured?: boolean;
}

export interface ProjectItem {
  slug: string;
  title: string;
  label: string;
  year: string;
  category: string;
  status: string;
  summary: string;
  technologies: string[];
  note: string;
  details: string[];
  featured?: boolean;
  externalHref?: string;
  externalLabel?: string;
}

export const siteMeta = {
  name: "Baruch Lopez",
  shortName: "Baruch Lopez",
  site: "https://baruchlopez.com",
  defaultTitle: "Baruch Lopez | AI, Data and Structured Execution",
  defaultDescription:
    "Baruch Lopez connects artificial intelligence, data systems, automation, corporate execution and technical exploration across four public-facing verticals.",
  ogImage: "/assets/images/baruch-lopez-portrait.jpg",
};

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Manifesto", href: "/manifesto/" },
  { label: "About", href: "/about/" },
  { label: "Experience", href: "/experience/" },
  { label: "Projects", href: "/projects/" },
  { label: "Alpha Signature", href: "/alpha-signature/" },
  { label: "Cyrus", href: "/cyrus-global-capital/" },
  { label: "Contact", href: "/contact/" },
];

export const externalLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/baruchlopez/" },
  { label: "GitHub", href: "https://github.com/OBaruch" },
];

export const homeHero = {
  eyebrow: "BARUCHLOPEZ.COM / PERSONAL IDENTITY HUB",
  title: "AI, data and business systems.",
  intro:
    "Baruch Lopez connects artificial intelligence, analytics, automation and strategic execution across corporate work, consulting, institutional capital context and technical exploration.",
  body:
    "This site is a public-safe gateway into four core verticals: Alpha Signature, Cyrus Global Capital, Corporate / Bosch and Project Lab.",
  image: "/assets/images/baruch-lopez-portrait.jpg",
  imageAlt: "Portrait of Baruch Lopez in a dark editorial setting.",
  actions: [
    { label: "Read the Manifesto", href: "/manifesto/", variant: "primary", size: "large" },
    { label: "View Experience", href: "/experience/", variant: "secondary" },
    { label: "Explore Projects", href: "/projects/", variant: "secondary" },
    { label: "About the story", href: "/about/", variant: "ghost" },
  ] satisfies ActionLink[],
};

export const verticals: VerticalItem[] = [
  {
    label: "Consulting",
    title: "Alpha Signature",
    summary:
      "A consulting and implementation firm focused on helping small and mid-sized businesses move from informal execution to structured operating systems.",
    href: "/alpha-signature/",
    image: "/assets/concept-board/alpha-glass-capsules.jpeg",
    cta: "Explore bridge",
    status: "pending",
  },
  {
    label: "Institutional",
    title: "Cyrus Global Capital",
    summary:
      "A public-safe institutional bridge into a private long-term capital initiative where Baruch participates as Co-Founder and CFO.",
    href: "/cyrus-global-capital/",
    image: "/assets/concept-board/cyrus-liquid.jpeg",
    cta: "View bridge",
    status: "external",
  },
  {
    label: "Corporate",
    title: "Corporate / Bosch",
    summary:
      "A public-safe overview of work in AI, data engineering, analytics, automation, reporting and technical enablement.",
    href: "/corporate/",
    image: "/assets/concept-board/corporate-emboss.jpeg",
    cta: "See profile",
    status: "internal",
  },
  {
    label: "Project Lab",
    title: "Projects and experiments",
    summary:
      "A curated archive of public-facing projects, prototypes and technical evolution across robotics, AI, automation, finance and software.",
    href: "/projects/",
    image: "/assets/concept-board/lab-glass-editorial.jpeg",
    cta: "Open lab",
    status: "internal",
  },
];

export const trustSignals = [
  {
    title: "Current role",
    body: "AI Engineer II with a public-safe profile around AI, data engineering, analytics, automation and business-facing systems.",
  },
  {
    title: "Technical foundation",
    body: "Robotics engineering background with visible work across AI, computer vision, embedded systems and applied experimentation.",
  },
  {
    title: "Institutional expansion",
    body: "CFO at Cyrus Global Capital and a growing focus on structured finance, governance and long-term execution.",
  },
  {
    title: "Academic growth",
    body: "Dual MBA in progress, extending the technical layer into business administration, leadership and operational thinking.",
  },
];

export const homePathways: PathwayItem[] = [
  {
    eyebrow: "Recruiters",
    title: "Start with the formal career layer.",
    body: "Use Experience for the shortest public-safe read on role progression, capabilities, credentials and current professional context.",
    href: "/experience/",
    label: "Open Experience",
    tone: "accent",
  },
  {
    eyebrow: "Clients",
    title: "See how consulting fits the ecosystem.",
    body: "Alpha Signature explains the consulting and implementation layer without turning the personal site into a generic agency page.",
    href: "/alpha-signature/",
    label: "See Alpha bridge",
  },
  {
    eyebrow: "Institutional",
    title: "Use the institutional bridge directly.",
    body: "Cyrus Global Capital should be read as a disciplined institutional layer with its own boundaries and official path.",
    href: "/cyrus-global-capital/",
    label: "Open Cyrus bridge",
  },
  {
    eyebrow: "Technical",
    title: "Go straight to the project archive.",
    body: "Project Lab is the fastest route for peers who want code-adjacent context, experiments and technical evolution.",
    href: "/projects/",
    label: "Explore Project Lab",
  },
];

export const condensedTimeline: TimelineItem[] = [
  {
    period: "2017 - 2021",
    title: "Robotics foundation",
    body: "Engineering studies at Universidad de Guadalajara built the base in robotics, intelligent systems and technical problem solving.",
  },
  {
    period: "2019",
    title: "Snowy Robot",
    body: "A multidisciplinary robotics project that remains a strong public signal of hands-on engineering and experimentation.",
  },
  {
    period: "2022 - 2026",
    title: "AI and enterprise systems",
    body: "Corporate work evolved into AI, analytics, ETL, reporting and enablement inside complex business environments.",
  },
  {
    period: "2024 - Present",
    title: "Institutional layer",
    body: "Cyrus Global Capital adds a more institutional and finance-oriented layer to the broader professional ecosystem.",
  },
  {
    period: "2025 - 2027",
    title: "MBA in progress",
    body: "A dual MBA expands the profile toward leadership, business administration and structured growth.",
  },
  {
    period: "Current direction",
    title: "Systems with context",
    body: "The current public narrative sits at the intersection of AI, data, strategy, consulting and long-term systems thinking.",
  },
];

export const featuredProjects: ProjectItem[] = [
  {
    slug: "snowy-robot",
    title: "Snowy Robot",
    label: "Academic / Robotics",
    year: "2019",
    category: "Robotics",
    status: "Completed archive",
    summary:
      "An inclusive robotics concept that combined embedded systems, control, audio, mobility and solar thinking in a multidisciplinary academic setting.",
    technologies: ["ESP32", "Mobile app", "Servos", "IoT", "Solar design"],
    note: "Historical project with high narrative value and low publication risk.",
    details: [
      "Framed as a multidisciplinary robotics build connected to Universidad de Guadalajara and the DIVEC Innovation Challenge.",
      "Useful as a proof of technical origin rather than as the center of the site.",
      "Best shown as one strong project among several, not as a singular defining achievement.",
    ],
    featured: true,
  },
  {
    slug: "vehicle-detection",
    title: "Vehicle Detection Using IBM Clusters",
    label: "AI / ML / Vision",
    year: "Historical",
    category: "AI / ML",
    status: "Technical archive",
    summary:
      "A computer vision project centered on training workflows, aerial imagery and practical experimentation with modern AI tooling.",
    technologies: ["PyTorch", "TensorFlow", "Computer vision", "GPU training"],
    note: "Public-facing summary only; useful for depth without overclaiming production maturity.",
    details: [
      "Shows a credible bridge from robotics to machine learning and applied vision work.",
      "Supports the public story of hands-on technical experimentation beyond dashboards and BI.",
      "Better presented as a deep technical archive project than as a polished product.",
    ],
    featured: true,
  },
  {
    slug: "staff-mobility-tool",
    title: "Staff Mobility Tool",
    label: "Optimization / Data",
    year: "Historical",
    category: "Data / Automation",
    status: "Prototype",
    summary:
      "A mobility and planning concept shaped around graph logic, routing and operations-oriented problem solving.",
    technologies: ["Python", "Graph logic", "Optimization", "Geolocation"],
    note: "Useful for showing operations thinking through technical systems.",
    details: [
      "Connects AI-style reasoning with practical operational structure.",
      "Works well as an example of applied systems thinking, even at prototype level.",
      "Should be framed as an exploration of planning and optimization, not a finished product.",
    ],
    featured: true,
  },
  {
    slug: "ai-driven-product-recommendation",
    title: "AI-Driven Product Recommendation",
    label: "Corporate-safe / Hackathon",
    year: "2026",
    category: "AI / ML",
    status: "Prototype / hackathon",
    summary:
      "A public-safe summary of a recommendation prototype recognized in a Bosch innovation context.",
    technologies: ["Recommendation systems", "Analytics", "Applied AI", "Hackathon"],
    note: "Keep the description high-level and avoid any internal details or metrics.",
    details: [
      "Best framed as a visible signal of applied innovation rather than as a case study with internal detail.",
      "Supports the narrative of turning complex information into decision-support systems.",
      "Should always stay at the level of public-safe capability and recognition.",
    ],
    featured: true,
  },
  {
    slug: "project-center",
    title: "Project Center",
    label: "Documentation / Systems",
    year: "2026",
    category: "Systems",
    status: "Active workspace",
    summary:
      "A Markdown-first system for organizing profile, CV, projects, timeline and professional continuity.",
    technologies: ["Markdown", "Knowledge systems", "Documentation"],
    note: "Strong signal of structured thinking and documentation culture.",
    details: [
      "Shows that the operating style is not only technical but also highly documented and system-oriented.",
      "Useful as a bridge between execution, portfolio structure and future publishing.",
      "Safe to present publicly as a method and documentation artifact.",
    ],
    externalHref: "https://github.com/OBaruch/Project-Center",
    externalLabel: "View public repository",
    featured: true,
  },
  {
    slug: "patrimonia",
    title: "Patrimonia",
    label: "Finance / Product",
    year: "2026",
    category: "Finance / Systems",
    status: "MVP",
    summary:
      "An early-stage personal finance product direction centered on structure, clarity and offline-first control.",
    technologies: ["TypeScript", "React Native", "Expo", "SQLite"],
    note: "Show as an evolving product thesis, not as a finished financial platform.",
    details: [
      "Useful for showing current product-oriented experimentation around finance and personal systems.",
      "Should remain framed as an MVP and learning vehicle.",
      "Avoid any language that could imply advisory, performance or regulated outcomes.",
    ],
    externalHref: "https://github.com/OBaruch/patrimonial",
    externalLabel: "View public repository",
    featured: true,
  },
];

export const projectCategories = [
  "AI / ML",
  "Robotics",
  "Data / Automation",
  "Finance / Systems",
  "Experimental",
  "Archive",
];

export const projectArchiveGroups = [
  {
    title: "Robotics and embedded systems",
    body:
      "Includes robotics control, kinematics, Arduino, IoT and academic engineering experiments that support the technical origin story.",
  },
  {
    title: "AI, vision and numerical methods",
    body:
      "Includes historical exploration across computer vision, neural approaches, optimization and numerical problem solving.",
  },
  {
    title: "Finance, automation and product experiments",
    body:
      "Includes product ideas, forecasting experiments, tooling and internal system design that should be communicated with caution.",
  },
];

export const aboutBio = {
  eyebrow: "ABOUT / STORY",
  title: "From robotics to intelligent business systems.",
  intro:
    "Baruch Lopez works across artificial intelligence, data systems, automation and structured execution, with a trajectory that extends from robotics into corporate, consulting and institutional contexts.",
  body: [
    "The public story starts with a technical base in robotics engineering and grows into AI, analytics, ETL, dashboards and business-facing systems.",
    "Over time, that engineering layer expands toward consulting, leadership, documentation, finance and long-term institutional thinking.",
  ],
};

export const educationHighlights = [
  {
    title: "Robotics Engineering",
    body:
      "Universidad de Guadalajara. A strong foundation in robotics, intelligent systems, embedded work and technical experimentation.",
  },
  {
    title: "Dual MBA in progress",
    body:
      "MIU City University Miami and UNIR Mexico. A current expansion into business administration, leadership and structured growth.",
  },
  {
    title: "Technical and leadership development",
    body:
      "Public certifications reinforce machine learning in production, technical leadership, applied AI and business-facing delivery.",
  },
];

export const philosophyCards = [
  {
    title: "Clarity over noise",
    body:
      "Technology becomes useful when it improves visibility, decisions and continuity rather than adding more complexity.",
  },
  {
    title: "Systems over one-off fixes",
    body:
      "Projects matter, but repeatable systems, documentation and structured follow-through create longer value.",
  },
  {
    title: "Execution with context",
    body:
      "The work sits between code, operations, business reasoning and institutional discipline.",
  },
];

export const futureDirections = [
  "Deepen the personal platform as a public-safe hub.",
  "Expand the Project Lab with selected case narratives and technical writing.",
  "Keep connecting AI, data, consulting and long-term systems thinking.",
];

export const experienceHero = {
  eyebrow: "EXPERIENCE",
  title: "AI, data and enterprise execution.",
  intro:
    "A professional path built across AI systems, data engineering, analytics, automation and technical enablement.",
};

export const experienceSnapshots = [
  {
    title: "Current role",
    body: "AI Engineer II with a public-safe focus on AI, analytics, data flows, automation and business-facing systems.",
  },
  {
    title: "Cross-disciplinary range",
    body: "Robotics, machine learning, BI, documentation, stakeholder enablement and structured operations thinking.",
  },
  {
    title: "Institutional expansion",
    body: "CFO at Cyrus Global Capital plus current MBA studies strengthen the strategic and financial layer of the profile.",
  },
];

export const experienceTimeline: TimelineItem[] = [
  {
    period: "2026 - Present",
    title: "AI Engineer II / Bosch Mexico",
    body:
      "Current public-safe role across AI, data engineering, analytics, reporting and business-facing systems.",
  },
  {
    period: "2022 - 2026",
    title: "AI Engineer / Bosch Mexico",
    body:
      "Built experience in applied AI, ETL, dashboards, SQL-driven work, automation and technical enablement.",
  },
  {
    period: "2024 - Present",
    title: "Co-Founder and CFO / Cyrus Global Capital",
    body:
      "Supports institutional structure, financial coordination and long-term operating discipline in a private initiative.",
  },
  {
    period: "2019 - 2021",
    title: "Mexcellence Scholarship Program",
    body:
      "A formative bridge into Bosch-related professional context and applied exposure.",
  },
  {
    period: "2020 - 2021",
    title: "Don Senor",
    body:
      "Worked across operations and search engine marketing, showing flexibility and real-world execution outside technical contexts.",
  },
  {
    period: "2016",
    title: "Teleperformance",
    body:
      "An early bilingual support role that helps explain later communication range and client-facing clarity.",
  },
];

export const skillClusters: SkillCluster[] = [
  {
    title: "AI / ML",
    summary: "Applied intelligence, experimentation and practical delivery.",
    items: ["Applied AI", "Machine learning", "Recommendation systems", "Computer vision"],
  },
  {
    title: "Data / BI",
    summary: "Information pipelines, reporting and executive visibility.",
    items: ["Data engineering", "ETL", "Power BI", "SQL", "Analytics"],
  },
  {
    title: "Software / Automation",
    summary: "Technical systems that reduce friction and improve continuity.",
    items: ["Python", "Automation", "Documentation", "Process support"],
  },
  {
    title: "Strategy / Finance",
    summary: "A growing layer of institutional, financial and operating structure.",
    items: ["Leadership", "Business administration", "Consulting", "Financial thinking"],
  },
];

export const recommendations = [
  "Public recommendations describe him as reliable, technically sharp and effective in automation, collaboration and mentorship.",
  "The public profile suggests steady trust-building across university, Bosch and broader professional relationships.",
];

export const certifications: CertificationItem[] = [
  {
    title: "Lean Six Sigma White Belt Certification",
    issuer: "International Lean Six Sigma",
    date: "Nov 2025",
    category: "Operations / Improvement",
    note: "Continuous improvement and operating discipline.",
    featured: true,
  },
  {
    title: "AI Agents for Cognigy Users",
    issuer: "NiCE Cognigy",
    date: "Sep 2025",
    category: "AI / Agents",
    note: "Recent training in conversational AI agents.",
    featured: true,
  },
  {
    title: "Cognigy Foundations (2025)",
    issuer: "NiCE Cognigy",
    date: "Sep 2025",
    category: "AI / Agents",
    note: "Foundational platform knowledge for Cognigy.",
    featured: true,
  },
  {
    title: "Principles of Leadership: Leading Technical Teams Specialization",
    issuer: "University of Colorado Boulder",
    date: "Mar 2025",
    category: "Leadership",
    note: "Technical team leadership and structured management.",
    featured: true,
  },
  {
    title: "A Technical Leader's Qualities and Effectiveness",
    issuer: "University of Colorado Boulder",
    date: "Feb 2025",
    category: "Leadership",
    note: "Leadership development for technical environments.",
    featured: true,
  },
  {
    title: "Challenges of Leading Individuals in the Tech Industry",
    issuer: "University of Colorado Boulder",
    date: "Mar 2025",
    category: "Leadership",
    note: "People leadership inside technology contexts.",
  },
  {
    title: "Challenges of Leading Technical Teams",
    issuer: "University of Colorado Boulder",
    date: "Feb 2025",
    category: "Leadership",
    note: "Operating and guiding technical teams.",
  },
  {
    title: "Introduction to Finance: The Basics",
    issuer: "University of Illinois Urbana-Champaign",
    date: "Mar 2025",
    category: "Finance",
    note: "Foundational finance studies.",
    featured: true,
  },
  {
    title: "Introduction to Amazon Athena",
    issuer: "AWS",
    date: "Mar 2024",
    category: "Cloud / Data",
    note: "Public cloud literacy for analytics workflows.",
  },
  {
    title: "Introduction to Amazon Kinesis Streams",
    issuer: "AWS",
    date: "Mar 2024",
    category: "Cloud / Data",
    note: "Streaming and cloud data fundamentals.",
  },
  {
    title: "AWS Shared Responsibility Model",
    issuer: "AWS",
    date: "Feb 2024",
    category: "Cloud / Security",
    note: "Foundational cloud responsibility concepts.",
  },
  {
    title: "Introduction to Amazon SageMaker",
    issuer: "AWS",
    date: "Aug 2024",
    category: "Cloud / ML",
    note: "Machine learning tooling in AWS.",
  },
  {
    title: "Machine Learning Data Lifecycle in Production",
    issuer: "DeepLearning.AI",
    date: "May 2023",
    category: "AI / ML",
    note: "Production-oriented ML lifecycle concepts.",
    featured: true,
  },
  {
    title: "Introduction to Machine Learning in Production",
    issuer: "DeepLearning.AI",
    date: "Mar 2023",
    category: "AI / ML",
    note: "Production ML fundamentals.",
  },
  {
    title: "Deploy Models with TensorFlow Serving and Flask",
    issuer: "Coursera",
    date: "Jan 2023",
    category: "AI / ML",
    note: "Model deployment and serving workflows.",
  },
  {
    title: "AWS Elastic Beanstalk: Deploy a Python (Flask) Web Application",
    issuer: "Coursera",
    date: "Jan 2023",
    category: "Software / Cloud",
    note: "Practical deployment skills.",
  },
  {
    title: "MySQL 8.0",
    issuer: "Sulens / BYW Consulting Services",
    date: "Jun 2022",
    category: "Data / SQL",
    note: "Database and query fundamentals.",
    featured: true,
  },
  {
    title: "Agile with Atlassian Jira",
    issuer: "Atlassian / Coursera",
    date: "Mar 2022",
    category: "Delivery",
    note: "Agile workflow basics and Jira tooling.",
  },
  {
    title: "IoT Foundations: Operating Systems Fundamentals",
    issuer: "LinkedIn Learning",
    date: "Sep 2021",
    category: "IoT / Embedded",
    note: "IoT systems fundamentals.",
  },
  {
    title: "Building and Deploying Deep Learning Applications with TensorFlow",
    issuer: "LinkedIn Learning",
    date: "Aug 2021",
    category: "AI / ML",
    note: "Applied deep learning workflows.",
  },
  {
    title: "Reality Capture Foundations for AEC",
    issuer: "LinkedIn Learning",
    date: "Aug 2021",
    category: "Technical archive",
    note: "Specialized technical training.",
  },
  {
    title: "TOEFL iBT Score 78",
    issuer: "ETS",
    date: "Sep 2020",
    category: "Language",
    note: "Public evidence of professional English development.",
    featured: true,
  },
  {
    title: "Dibujo y Pintura",
    issuer: "Universidad de Guadalajara",
    date: "Aug 2016",
    category: "Creative archive",
    note: "Historical complementary formation.",
  },
  {
    title: "Expresion Teatral",
    issuer: "Universidad de Guadalajara",
    date: "Aug 2016",
    category: "Creative archive",
    note: "Historical complementary formation.",
  },
  {
    title: "Instalaciones electricas residenciales",
    issuer: "SEP",
    date: "Nov 2015",
    category: "Technical archive",
    note: "Early technical formation.",
  },
];

export const corporateHero = {
  eyebrow: "CORPORATE / PUBLIC-SAFE",
  title: "Enterprise AI, data and enablement.",
  intro:
    "A corporate-safe layer focused on what can be said publicly about applied AI, analytics, ETL, automation and stakeholder-facing systems work.",
};

export const corporateThemes = [
  {
    title: "AI and decision support",
    body:
      "High-level work around AI-assisted systems that improve visibility, decision support and structured business understanding.",
  },
  {
    title: "Data engineering and ETL",
    body:
      "Public-safe experience connecting data sources, transforming information and supporting operational reporting flows.",
  },
  {
    title: "Reporting and dashboards",
    body:
      "Executive-friendly reporting and dashboard work aimed at clearer operational visibility without exposing internal systems.",
  },
  {
    title: "Documentation and enablement",
    body:
      "A recurring role in explaining systems, documenting workflows and helping stakeholders use technical outputs more effectively.",
  },
];

export const corporateAllowed = [
  "AI, machine learning and analytics at a high level",
  "Data engineering, ETL and reporting themes",
  "Automation, documentation and technical enablement",
  "Role evolution and public-safe recognition",
];

export const corporateAvoid = [
  "Internal clients, stakeholders or architecture",
  "Private dashboards, tables, metrics or screenshots",
  "Sensitive SAP, ABAP or proprietary workflow detail",
  "Any data, code or operational disclosure that crosses NDA boundaries",
];

export const alphaPage = {
  eyebrow: "ALPHA SIGNATURE",
  title: "Consulting plus implementation, without hype.",
  intro:
    "Alpha Signature is the consulting and implementation expression of Baruch's broader systems mindset: structured, sober and execution-oriented.",
  practices: [
    "Alpha Digital",
    "Alpha Data",
    "Alpha Intelligence",
    "Alpha Business",
    "Alpha Finance",
    "Alpha Connect",
  ],
  cycle: [
    "Diagnosis",
    "Structure",
    "Implementation",
    "Executive follow-through",
  ],
};

export const cyrusPage = {
  eyebrow: "CYRUS GLOBAL CAPITAL",
  title: "A public-safe institutional bridge.",
  intro:
    "Cyrus Global Capital represents a private, long-term and institutional layer inside the broader public profile of Baruch Lopez.",
  disclaimer:
    "This page is a public-safe bridge and not an investment solicitation, performance summary or advisory page.",
  officialHref: "https://www.cyrusglobalcapital.com/",
};

export const contactPathways = [
  {
    eyebrow: "Recruiting",
    title: "Professional profile",
    body: "LinkedIn remains the fastest external layer for formal background, current role and public recommendations.",
    href: "https://www.linkedin.com/in/baruchlopez/",
    label: "Open LinkedIn",
    external: true,
    tone: "accent",
  },
  {
    eyebrow: "Technical",
    title: "Technical work",
    body: "GitHub is the best external bridge for public repositories, systems thinking and technical archive depth.",
    href: "https://github.com/OBaruch",
    label: "Open GitHub",
    external: true,
  },
  {
    eyebrow: "Consulting",
    title: "Alpha Signature",
    body: "The Alpha Signature bridge page explains how consulting and implementation fit into the broader professional ecosystem.",
    href: "/alpha-signature/",
    label: "See Alpha bridge",
  },
  {
    eyebrow: "Institutional",
    title: "Cyrus Global Capital",
    body: "Cyrus is represented through a short public-safe institutional bridge and an official external path.",
    href: "/cyrus-global-capital/",
    label: "See Cyrus bridge",
  },
];

export const footerLinks = {
  internal: [
    { label: "Manifesto", href: "/manifesto/" },
    { label: "About", href: "/about/" },
    { label: "Experience", href: "/experience/" },
    { label: "Corporate", href: "/corporate/" },
    { label: "Projects", href: "/projects/" },
    { label: "Credentials", href: "/credentials/" },
    { label: "Contact", href: "/contact/" },
  ],
  external: externalLinks,
};

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Baruch Lopez",
  alternateName: "Omar Baruch Moron Lopez",
  jobTitle: "AI Engineer II",
  url: "https://baruchlopez.com/",
  sameAs: [
    "https://www.linkedin.com/in/baruchlopez/",
    "https://github.com/OBaruch",
  ],
  description:
    "Robotics engineer and AI specialist working across data systems, automation, analytics and structured execution.",
};
