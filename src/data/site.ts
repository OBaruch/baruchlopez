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
  external?: boolean;
}

export interface VerticalItem {
  label: string;
  title: string;
  summary: string;
  href: string;
  external?: boolean;
  image: string;
  imageAlt: string;
  cta: string;
  status: "internal" | "external" | "pending";
}

export interface TimelineItem {
  period: string;
  title: string;
  body: string;
  category?: string;
  location?: string;
  importance?: string;
  impact?: string;
  tags?: string[];
  status?: string;
  sourceNote?: string;
}

export interface TimelineStage {
  id: string;
  period: string;
  label: string;
  title: string;
  summary: string;
  items: TimelineItem[];
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
  name: "Baruch López",
  shortName: "Baruch López",
  site: "https://baruchlopez.com",
  defaultTitle: "Baruch López | Robotics, AI, Data and Business Systems",
  defaultDescription:
    "Personal hub for Baruch López, a robotics engineer and AI specialist working across data systems, automation, business implementation, Alpha Signature, selected projects and carefully framed finance initiatives.",
  ogImage: "/assets/images/baruch-lopez-portrait.jpg",
};

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Experience", href: "/experience/" },
  { label: "Projects", href: "/projects/" },
  { label: "Mural", href: "/recognitions/" },
  { label: "Alpha Signature", href: "https://alphasignaturefirm.com/", external: true },
  { label: "Cyrus", href: "https://www.cyrusglobalcapital.com/", external: true },
  { label: "Contact", href: "/contact/" },
];

export const externalLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/baruchlopez/" },
  { label: "GitHub", href: "https://github.com/OBaruch" },
];

export const homeHero = {
  eyebrow: "BARUCHLOPEZ.COM / PERSONAL HUB",
  title: "Baruch López",
  intro:
    "Robotics engineer and AI specialist connecting data, automation and business implementation with a calm, systems-minded way of working.",
  badges: [
    "Founder / Alpha Signature",
    "AI Engineer II",
    "Co-Founder & CFO / Cyrus Global Capital",
    "MBA in progress",
  ],
  body:
    "This is the central public profile for Baruch's professional work, Alpha Signature, carefully framed Cyrus Global Capital context, selected projects and contact pathways.",
  image: "/assets/images/baruch-lopez-portrait.jpg",
  imageAlt: "Portrait of Baruch López seated in an editorial setting.",
  scrollCueHref: "#home-pathways",
  scrollCueLabel: "Explore the guide",
  actions: [
    { label: "View Profile", href: "/experience/", variant: "primary", size: "large" },
    { label: "Project Lab", href: "/projects/", variant: "secondary" },
    { label: "Alpha Signature", href: "https://alphasignaturefirm.com/", variant: "secondary", external: true },
    { label: "Contact", href: "/contact/", variant: "ghost" },
  ] satisfies ActionLink[],
};

export const verticals: VerticalItem[] = [
  {
    label: "Consulting",
    title: "Alpha Signature",
    summary:
      "A consulting and implementation firm for businesses that need clearer systems, better data habits and disciplined follow-through.",
    href: "https://alphasignaturefirm.com/",
    external: true,
    image: "/assets/public-images/alpha-architecture-katya-azimova-unsplash.jpg",
    imageAlt: "Neutral architectural arches and shadows used as an editorial visual for Alpha Signature.",
    cta: "Visit Alpha Signature",
    status: "pending",
  },
  {
    label: "Institutional",
    title: "Cyrus Global Capital",
    summary:
      "A cautious bridge to the private capital initiative where Baruch appears publicly as Co-Founder & CFO.",
    href: "https://www.cyrusglobalcapital.com/",
    external: true,
    image: "/assets/public-images/cyrus-architecture-mike-hindle-unsplash.jpg",
    imageAlt: "Neutral high-rise architectural facade used as an editorial visual for Cyrus Global Capital context.",
    cta: "Visit Cyrus Global Capital",
    status: "external",
  },
  {
    label: "Corporate",
    title: "Corporate / Bosch",
    summary:
      "A high-level view of AI, data engineering, analytics, automation, reporting and technical enablement work.",
    href: "/corporate/",
    image: "/assets/public-images/corporate-data-eric-stoynov-unsplash.jpg",
    imageAlt: "Server and data infrastructure detail used as an editorial visual for enterprise AI and analytics work.",
    cta: "Read corporate profile",
    status: "internal",
  },
  {
    label: "Project Lab",
    title: "Projects and experiments",
    summary:
      "A curated archive of public projects, prototypes and technical evolution across robotics, AI, automation, finance and software.",
    href: "/projects/",
    image: "/assets/public-images/project-lab-adrian-gonzalez-unsplash.jpg",
    imageAlt: "Dark laptop workspace used as an editorial visual for the Project Lab archive.",
    cta: "Open Project Lab",
    status: "internal",
  },
];

export const trustSignals = [
  {
    title: "Current role",
    body: "AI Engineer II, with public-facing work framed around AI, data engineering, analytics, automation and business support systems.",
  },
  {
    title: "Technical foundation",
    body: "Robotics engineering background, with visible work across AI, computer vision, embedded systems and applied experimentation.",
  },
  {
    title: "Business expansion",
    body: "MBA studies in progress, extending the technical profile into management, finance, strategy and operating discipline.",
  },
  {
    title: "Builder's ecosystem",
    body: "Alpha Signature, selected projects and the Cyrus Global Capital bridge show a broader path across consulting, systems and finance-adjacent work.",
  },
];

export const homePathways: PathwayItem[] = [
  {
    eyebrow: "Recruiters",
    title: "Professional background and current role.",
    body: "A concise view of role progression, capabilities, credentials and current AI/data work.",
    href: "/experience/",
    label: "View Experience",
    tone: "accent",
  },
  {
    eyebrow: "Clients",
    title: "Consulting and implementation context.",
    body: "Alpha Signature is the service layer where Baruch's systems mindset becomes structured work for businesses.",
    href: "https://alphasignaturefirm.com/",
    label: "Visit Alpha Signature",
    external: true,
  },
  {
    eyebrow: "Institutional",
    title: "Finance-related public context.",
    body: "A careful bridge to Cyrus Global Capital, with boundaries around what belongs on a personal website.",
    href: "https://www.cyrusglobalcapital.com/",
    label: "Visit Cyrus Global Capital",
    external: true,
  },
  {
    eyebrow: "Technical",
    title: "Projects, prototypes and public repositories.",
    body: "A curated route into robotics, AI, automation, finance-product experiments and selected technical work.",
    href: "/projects/",
    label: "Open Project Lab",
  },
];

export const condensedTimeline: TimelineItem[] = [
  {
    period: "2017 - 2021",
    title: "Robotics foundation",
    body: "Engineering studies at Universidad de Guadalajara built the base in robotics, intelligent systems and applied problem solving.",
  },
  {
    period: "2019",
    title: "Snowy Robot",
    body: "A multidisciplinary robotics project that remains a strong public signal of hands-on engineering and experimentation.",
  },
  {
    period: "2022 - 2026",
    title: "AI and enterprise systems",
    body: "Corporate work evolved across AI, analytics, ETL, reporting and enablement inside complex business environments.",
  },
  {
    period: "2024 - Present",
    title: "Institutional layer",
    body: "Cyrus Global Capital adds a more institutional and finance-oriented layer, presented here only with careful public context.",
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

export const timelinePage = {
  eyebrow: "TIMELINE",
  title: "The path, organized with context.",
  intro:
    "A fuller chronology of Baruch López across early leadership, robotics, enterprise AI, business education, consulting, carefully framed finance context, projects and values.",
  body:
    "The timeline is intentionally selective. It shows the public story without exposing private details, internal corporate information or unverified claims.",
};

export const lifeTimelineStages: TimelineStage[] = [
  {
    id: "timeline-roots",
    period: "Early layer - 2018",
    label: "Origins",
    title: "Roots, service and first leadership habits.",
    summary:
      "The earliest layer: values, community service, early technical curiosity and the first habits of responsibility.",
    items: [
      {
        period: "Early life",
        title: "Roots, family memory and personal compass",
        category: "Personal foundation",
        body:
          "The values manifesto frames the origin story around roots, family memory, courage, empathy, curiosity, effort and the decision to build a personal path without denying where it began.",
        importance:
          "It makes the timeline more than a resume: the technical and business path is tied to identity, character and long-term purpose.",
        impact:
          "Specific childhood dates and private biographical details are intentionally not published.",
        tags: ["Roots", "Family", "Values", "Identity"],
        status: "Personal context",
      },
      {
        period: "Mar 2013 - Jul 2018",
        title: "Founding Council Member / Movimiento Adolescente Estigma",
        category: "Community leadership",
        body:
          "A long-term youth organization role focused on social awareness, values-based education, camps, mentorship and grassroots coordination.",
        importance:
          "This is the earliest documented leadership layer and helps explain later communication, mentoring and operating discipline.",
        impact:
          "Built habits around responsibility, organizing people, serving a community and sustaining commitments over several years.",
        tags: ["Leadership", "Community", "Mentorship", "Service"],
        status: "Documented",
      },
      {
        period: "Nov 2015 - Aug 2016",
        title: "Technical and creative formation",
        category: "Early formation",
        body:
          "Residential electrical installations through SEP, plus drawing, painting and theater at Universidad de Guadalajara.",
        importance:
          "The mix matters because it shows early practical skill, creative expression and comfort working beyond one narrow academic lane.",
        impact:
          "Created a first bridge between hands-on technical work, visual thinking and communication.",
        tags: ["Technical archive", "Creative archive", "UDG", "SEP"],
        status: "Documented",
      },
      {
        period: "Oct 2016 - Nov 2016",
        title: "Bilingual Agent / Teleperformance",
        category: "Early work",
        body:
          "An early bilingual support role that introduced client-facing problem solving, communication pressure and service discipline.",
        importance:
          "It gives the later technical profile a human-facing foundation rather than only an academic one.",
        impact:
          "Helped build communication range and comfort handling real customer situations.",
        tags: ["Bilingual", "Support", "Communication"],
        status: "Documented",
      },
    ],
  },
  {
    id: "timeline-robotics",
    period: "2017 - 2021",
    label: "Robotics",
    title: "University, robotics and applied experimentation.",
    summary:
      "Robotics engineering, early AI exposure, workshops, public projects and work outside the classroom built the technical base.",
    items: [
      {
        period: "Jan 2017 - Jun 2021",
        title: "Robotics Engineering / Universidad de Guadalajara",
        category: "Education",
        body:
          "Formal engineering foundation in robotics, intelligent systems, control, embedded work, computer vision, IoT and applied problem solving.",
        importance:
          "This is the core technical base behind the later AI, data and automation trajectory.",
        impact:
          "Established the engineering discipline and experimental mindset that still anchor the public profile.",
        tags: ["Robotics", "Engineering", "AI foundation", "UDG"],
        status: "Documented",
      },
      {
        period: "Apr 2019 - Dec 2021",
        title: "Mexcellence Scholarship Program",
        category: "Professional formation",
        body:
          "A formative bridge into Bosch-related professional context while the robotics foundation was still developing.",
        importance:
          "It connects the academic stage with the enterprise AI path that later becomes central.",
        impact:
          "Created early exposure to professional standards, structured work and corporate context.",
        tags: ["Bosch", "Formation", "Scholarship"],
        status: "Documented",
      },
      {
        period: "Summer 2019",
        title: "Robotics workshop for students",
        category: "Teaching / community",
        body:
          "A public workshop teaching robotics and programming basics through hands-on projects and practical exercises.",
        importance:
          "It shows an early pattern of explaining technical material, not just building it.",
        impact:
          "Strengthened teaching, communication and technical translation skills.",
        tags: ["Robotics", "Teaching", "Workshop"],
        status: "Public site reference",
      },
      {
        period: "Oct 2019 - Nov 2019",
        title: "Snowy Robot / DIVEC Innovation Challenge",
        category: "Academic project",
        body:
          "A multidisciplinary robotics and IoT project associated with Universidad de Guadalajara, combining embedded systems, mobility, audio, solar design and inclusive interaction.",
        importance:
          "It remains a strong public signal of hands-on engineering, rapid prototyping and team coordination.",
        impact:
          "Demonstrated how technical work can connect function, accessibility, storytelling and community-oriented design.",
        tags: ["Robotics", "IoT", "Embedded", "Accessibility"],
        status: "Documented",
      },
      {
        period: "Jun 2020 - Jan 2021",
        title: "Don Senor / Operations and search marketing",
        category: "Work experience",
        body:
          "A non-linear work stage that moved from operational work into search engine marketing, reporting and campaign review.",
        importance:
          "It adds real-world business exposure outside the purely technical lane.",
        impact:
          "Reinforced adaptability, execution under practical constraints and early exposure to performance reporting.",
        tags: ["Operations", "Marketing", "Reporting", "Adaptability"],
        status: "Documented",
      },
      {
        period: "Sep 2020",
        title: "TOEFL iBT score 78",
        category: "Language",
        body:
          "Public evidence of formal English development, later supported by bilingual professional work and public communication.",
        importance:
          "It supports the international and bilingual layer of the profile without overstating proficiency claims.",
        impact:
          "Helped reinforce access to technical, business and academic material in English.",
        tags: ["English", "TOEFL", "Bilingual"],
        status: "Documented",
      },
      {
        period: "Aug 2021 - Sep 2021",
        title: "TensorFlow, IoT and technical learning",
        category: "Certification / learning",
        body:
          "LinkedIn Learning courses in deep learning applications with TensorFlow, IoT operating systems fundamentals and reality capture foundations.",
        importance:
          "This closes the robotics stage with a visible move toward applied AI and software-oriented technical growth.",
        impact:
          "Helped prepare the shift from academic engineering into enterprise AI and data systems.",
        tags: ["TensorFlow", "IoT", "Deep learning", "Technical archive"],
        status: "Documented",
      },
    ],
  },
  {
    id: "timeline-enterprise-ai",
    period: "2022 - 2024",
    label: "Enterprise AI",
    title: "Corporate AI, data systems and public technical voice.",
    summary:
      "The robotics base expands into enterprise-facing AI, data engineering, dashboards, documentation and public technical communication.",
    items: [
      {
        period: "2022 - Feb 2026",
        title: "AI Engineer / Bosch Mexico",
        category: "Corporate context",
        body:
          "Enterprise work across applied AI, data engineering, analytics, ETL, SQL, automation, reporting and technical enablement, described at a high level.",
        importance:
          "This is the main professional consolidation layer of the timeline.",
        impact:
          "Shifted the profile from academic experimentation into practical systems that support complex business environments.",
        tags: ["AI", "Data engineering", "Analytics", "Automation"],
        status: "High-level public summary",
      },
      {
        period: "Mar 2022 - Jun 2022",
        title: "Jira and MySQL foundations",
        category: "Certification / tools",
        body:
          "Agile with Atlassian Jira and MySQL 8.0 certifications reinforced delivery discipline and database fundamentals early in the Bosch stage.",
        importance:
          "They support the practical operating side of data, systems and project work.",
        impact:
          "Added method, SQL literacy and workflow structure to the technical path.",
        tags: ["Jira", "SQL", "Delivery", "Data"],
        status: "Documented",
      },
      {
        period: "Oct 28, 2022",
        title: "Connectory Talks / Data Analytics",
        category: "Speaking",
        body:
          "A public talk on how data becomes a strategic asset and on practical fundamentals for responsible analysis.",
        importance:
          "It shows the profile beginning to communicate ideas publicly, not only execute internally.",
        impact:
          "Strengthened the bridge between technical knowledge, business value and public explanation.",
        tags: ["Talks", "Data analytics", "Communication"],
        status: "Public site reference",
      },
      {
        period: "Jan 2023 - May 2023",
        title: "Production ML and deployment learning",
        category: "Certification / AI",
        body:
          "Courses across machine learning in production, ML data lifecycle, TensorFlow Serving, Flask and Python web deployment.",
        importance:
          "This is the clearest certification bridge from AI experimentation to production-minded systems.",
        impact:
          "Reinforced model lifecycle, deployment and practical machine learning habits.",
        tags: ["ML production", "TensorFlow", "Flask", "Deployment"],
        status: "Documented",
      },
      {
        period: "Sep 2023",
        title: "Talent Land Guadalajara / Explainable AI",
        category: "Speaking / AI",
        body:
          "A public session around explainable AI, transparency, interpretability and the ethical implications of model-assisted decisions.",
        importance:
          "It adds a public thought layer around responsible AI, not just technical delivery.",
        impact:
          "Connected AI capability with clarity, trust and the need to understand why systems make decisions.",
        tags: ["Explainable AI", "Ethics", "Speaking", "Transparency"],
        status: "Public reference",
      },
      {
        period: "Feb 2024 - Aug 2024",
        title: "Cloud, AWS and formal engineering proof",
        category: "Credential / education",
        body:
          "AWS technical courses and formal documentation around the robotics degree strengthened the public evidence base around cloud literacy and the engineering foundation.",
        importance:
          "This stage confirms both the technical expansion and the official engineering credential without exposing sensitive identifiers.",
        impact:
          "Created a cleaner bridge between formal education, enterprise systems and cloud-adjacent data work.",
        tags: ["AWS", "Engineering", "Cloud", "Credentials"],
        status: "Documented",
      },
    ],
  },
  {
    id: "timeline-institutional",
    period: "2024 - 2025",
    label: "Institutional",
    title: "Finance, consulting, leadership and structured growth.",
    summary:
      "The profile expands from technical execution into business education, consulting structure, finance context and operating discipline.",
    items: [
      {
        period: "Jul 2024 - Present",
        title: "CFO / Cyrus Global Capital",
        category: "Institutional / finance",
        body:
          "Visible public role in a private capital initiative, framed carefully around institutional structure, financial coordination and long-term operating discipline.",
        importance:
          "This adds the finance and governance layer to the broader technology and data profile.",
        impact:
          "Expanded the trajectory toward capital structure, internal reporting discipline and long-term decision frameworks.",
        tags: ["CFO", "Finance", "Governance", "Long-term"],
        status: "Public role; cautious framing",
      },
      {
        period: "Current build",
        title: "Alpha Signature",
        category: "Consulting / implementation",
        body:
          "A consulting and implementation initiative focused on helping micro and mid-sized businesses move toward clearer systems, data and operating structure.",
        importance:
          "It translates Baruch's mix of technology, data, operations and business judgment into a more direct service layer.",
        impact:
          "Connects personal brand, consulting practice, digital systems and executive-standard follow-through.",
        tags: ["Consulting", "Data", "Systems", "Execution"],
        status: "Active build; details to confirm",
      },
      {
        period: "Jul 2025 - Mar 2027",
        title: "Dual MBA / MIU City University Miami and UNIR Mexico",
        category: "Graduate education",
        body:
          "MBA in progress focused on business administration, strategy, finance, innovation, operations, marketing and talent development.",
        importance:
          "This formalizes the business layer that had already started appearing through consulting and institutional work.",
        impact:
          "Extends the technical profile toward leadership, management and structured growth.",
        tags: ["MBA", "Strategy", "Finance", "Leadership"],
        status: "In progress",
      },
      {
        period: "Feb 2025 - Nov 2025",
        title: "Leadership, finance, AI agents and process discipline",
        category: "Certification / expansion",
        body:
          "A concentrated year of public certifications across technical leadership, finance fundamentals, Cognigy AI agents and Lean Six Sigma White Belt.",
        importance:
          "The certifications show a deliberate expansion from technical delivery into leadership, operations and applied AI systems.",
        impact:
          "Strengthened the profile around team context, finance literacy, conversational AI and continuous improvement.",
        tags: ["Leadership", "Finance", "AI agents", "Six Sigma"],
        status: "Documented",
      },
      {
        period: "Living document",
        title: "Values Manifesto",
        category: "Philosophy",
        body:
          "A bilingual manifesto that makes the internal operating system explicit: courage, empathy, curiosity, independence, loyalty, truth, effort, roots and purposeful growth.",
        importance:
          "It gives the public platform a philosophical layer and explains the values behind the professional decisions.",
        impact:
          "Positions growth as something personal, intellectual, familial, professional and financial, not only career-driven.",
        tags: ["Values", "Purpose", "Roots", "Legacy"],
        status: "Published on site",
      },
    ],
  },
  {
    id: "timeline-current",
    period: "2026 - Next",
    label: "Current build",
    title: "AI Engineer II, products and legacy architecture.",
    summary:
      "The current stage brings together role progression, technical proof, finance-adjacent products, documentation systems and the next version of the personal platform.",
    items: [
      {
        period: "Jan 2026 - Present",
        title: "AI Engineer II / Bosch Mexico",
        category: "Corporate context",
        body:
          "Current role around AI, data engineering, analytics, reporting, automation and business-facing systems, described at a high level.",
        importance:
          "It marks visible professional progression inside the enterprise AI path.",
        impact:
          "Signals increased seniority while preserving NDA-safe boundaries around internal systems and metrics.",
        tags: ["AI Engineer II", "Enterprise AI", "Data", "Enablement"],
        status: "Current role",
      },
      {
        period: "Mar 2026",
        title: "1st Place Innovation Hackathon / AI-Driven Product Recommendation",
        category: "Recognition / AI prototype",
        body:
          "A Bosch-associated hackathon recognition for an AI-powered recommendation prototype, described without internal implementation detail.",
        importance:
          "It is a current proof point of applied AI under time pressure, collaboration and product reasoning.",
        impact:
          "Adds a recent public signal of innovation without exposing internal implementation details.",
        tags: ["Hackathon", "Recommendation systems", "AI", "Prototype"],
        status: "Public recognition",
      },
      {
        period: "2026",
        title: "Project Center",
        category: "Documentation system",
        body:
          "A Markdown-first system for organizing profile, CV, projects, timeline and professional continuity.",
        importance:
          "It proves that the platform is not only a website; it is part of a larger documentation and operating discipline.",
        impact:
          "Creates a reusable foundation for keeping public identity, project archives and trajectory aligned over time.",
        tags: ["Documentation", "Knowledge systems", "Markdown", "Continuity"],
        status: "Public repository",
      },
      {
        period: "2026",
        title: "Patrimonia",
        category: "Finance / product",
        body:
          "An early-stage personal finance product direction centered on structure, clarity and offline-first control.",
        importance:
          "It connects the finance layer with product thinking while keeping the tone exploratory and non-advisory.",
        impact:
          "Shows a current interest in building tools around financial organization, personal systems and long-term control.",
        tags: ["Finance", "Product", "MVP", "Offline-first"],
        status: "MVP",
      },
      {
        period: "Next",
        title: "Systems with legacy in mind",
        category: "Future direction",
        body:
          "The public direction is to keep connecting AI, data, consulting, institutional discipline, family, roots and long-term systems thinking.",
        importance:
          "This closes the timeline as a living structure rather than a finished biography.",
        impact:
          "Frames the next stage around depth, discipline, leadership, useful technology and construction of legacy.",
        tags: ["Legacy", "Strategy", "AI", "Long-term systems"],
        status: "Direction",
      },
    ],
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
      "Best presented as an exploration of planning and optimization, not a finished product.",
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
      "A careful summary of a recommendation prototype recognized in a Bosch innovation context.",
    technologies: ["Recommendation systems", "Analytics", "Applied AI", "Hackathon"],
    note: "Keep the description high-level and avoid any internal details or metrics.",
    details: [
      "Best framed as a visible signal of applied innovation rather than as a case study with internal detail.",
      "Supports the narrative of turning complex information into decision-support systems.",
      "Keep the public description focused on capability and recognition.",
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
      "Best framed as an MVP and learning vehicle.",
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
      "Includes product ideas, forecasting experiments and tooling that need careful public framing.",
  },
];

export const aboutBio = {
  eyebrow: "ABOUT / STORY",
  title: "From robotics to useful business systems.",
  intro:
    "Baruch López works across artificial intelligence, data systems, automation and structured execution, with a trajectory that extends from robotics into corporate, consulting and finance-adjacent contexts.",
  body: [
    "The public story starts with robotics engineering and grows into AI, analytics, ETL, dashboards and business-facing systems.",
    "Over time, that engineering layer expands toward consulting, leadership, documentation, finance context and long-term operating discipline.",
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
      "MIU City University Miami and UNIR Mexico. A current expansion into business administration, leadership, finance and structured growth.",
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
  "Keep the personal platform current as the public center of the ecosystem.",
  "Expand the Project Lab with selected case narratives and technical writing when the facts are ready.",
  "Keep connecting AI, data, consulting, business education and long-term systems thinking.",
];

export const experienceHero = {
  eyebrow: "EXPERIENCE",
  title: "AI, data and business-facing execution.",
  intro:
    "A professional path built across AI systems, data engineering, analytics, automation and technical enablement.",
};

export const experienceSnapshots = [
  {
    title: "Current role",
    body: "AI Engineer II, focused publicly on AI, analytics, data flows, automation and business-facing systems.",
  },
  {
    title: "Cross-disciplinary range",
    body: "Robotics, machine learning, BI, documentation, stakeholder enablement and structured operations thinking.",
  },
  {
    title: "Institutional expansion",
    body: "Cyrus Global Capital and current MBA studies add a careful strategic and financial layer to the profile.",
  },
];

export const experienceTimeline: TimelineItem[] = [
  {
    period: "2026 - Present",
    title: "AI Engineer II / Bosch Mexico",
    body:
      "Current role across AI, data engineering, analytics, reporting and business-facing systems, described at a high level.",
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
  "Public recommendations point to automation, AI, collaboration, mentorship, reliability and technical ownership.",
  "The visible profile shows trust built across university, Bosch and broader professional relationships without overstating formal leadership claims.",
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
  eyebrow: "CORPORATE PROFILE",
  title: "Enterprise AI, data and enablement.",
  intro:
    "A high-level corporate profile across applied AI, analytics, ETL, automation and stakeholder-facing systems work.",
};

export const corporateThemes = [
  {
    title: "AI and decision support",
    body:
      "AI-assisted systems that improve visibility, decision support and structured business understanding.",
  },
  {
    title: "Data engineering and ETL",
    body:
      "Experience connecting data sources, transforming information and supporting operational reporting flows at a high level.",
  },
  {
    title: "Reporting and dashboards",
    body:
      "Executive-friendly reporting and dashboards aimed at clearer operational visibility without exposing internal systems.",
  },
  {
    title: "Documentation and enablement",
    body:
      "A recurring role in explaining systems, documenting workflows and helping stakeholders use technical outputs more effectively.",
  },
];

export const alphaPage = {
  eyebrow: "ALPHA SIGNATURE",
  title: "Alpha Signature",
  intro:
    "Alpha Signature is the consulting and implementation expression of Baruch's broader systems mindset: practical, sober and execution-oriented.",
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
    "Follow-through",
  ],
  officialHref: "https://alphasignaturefirm.com/",
};

// TODO(content): Confirm whether the preferred public role wording should remain "Co-Founder & CFO" or use a lighter personal-site formulation.
export const cyrusPage = {
  eyebrow: "CYRUS GLOBAL CAPITAL",
  title: "Cyrus Global Capital",
  intro:
    "Cyrus Global Capital is the finance-related institutional layer connected to Baruch's public profile.",
  disclaimer:
    "A public bridge only; not an investment solicitation, performance summary or advisory page.",
  officialHref: "https://www.cyrusglobalcapital.com/",
};

export const contactPathways = [
  {
    eyebrow: "Recruiting",
    title: "Professional profile",
    body: "LinkedIn is the clearest external reference for formal background, current role and public recommendations.",
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
    body: "Alpha Signature's official site carries the consulting and implementation offer.",
    href: "https://alphasignaturefirm.com/",
    label: "Visit Alpha Signature",
    external: true,
  },
  {
    eyebrow: "Institutional",
    title: "Cyrus Global Capital",
    body: "Cyrus Global Capital's official site carries the institutional context.",
    href: "https://www.cyrusglobalcapital.com/",
    label: "Visit Cyrus Global Capital",
    external: true,
  },
];

export const footerLinks = {
  internal: [
    { label: "About", href: "/about/" },
    { label: "Experience", href: "/experience/" },
    { label: "Corporate", href: "/corporate/" },
    { label: "Projects", href: "/projects/" },
    { label: "Mural", href: "/recognitions/" },
    { label: "Timeline", href: "/timeline/" },
    { label: "Manifesto", href: "/manifesto/" },
    { label: "Credentials", href: "/credentials/" },
    { label: "Contact", href: "/contact/" },
  ],
  external: externalLinks,
};

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Baruch López",
  alternateName: "Baruch Lopez",
  jobTitle: "AI Engineer II",
  url: "https://baruchlopez.com/",
  sameAs: [
    "https://www.linkedin.com/in/baruchlopez/",
    "https://github.com/OBaruch",
  ],
  description:
    "Robotics engineer and AI specialist working across data systems, automation, analytics and structured execution.",
};
