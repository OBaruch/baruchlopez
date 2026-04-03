import type { GatewayId } from "@/store/experienceStore";

export interface GatewayItem {
  id: GatewayId;
  label: string;
  title: string;
  summary: string;
  href: string;
  image: string;
}

export const navigationLinks = [
  { label: "Home", href: "#top" },
  { label: "Cyrus Global Capital", href: "/cyrus-global-capital/" },
  { label: "Alpha Signature", href: "#alpha-signature" },
  { label: "Corporate Profile", href: "#corporate-profile" },
  { label: "Personal Project Lab", href: "#personal-project-lab" },
  { label: "Talks / Writing", href: "#talks-writing" },
  { label: "Contact", href: "#contact" },
] as const;

export const gatewayItems: GatewayItem[] = [
  {
    id: "cyrus",
    label: "Venture",
    title: "Cyrus Global Capital",
    summary: "Investment, governance, and long-term capital strategy.",
    href: "/cyrus-global-capital/",
    image: "/assets/concept-board/cyrus-liquid.jpeg",
  },
  {
    id: "alpha",
    label: "Consulting",
    title: "Alpha Signature",
    summary: "Consulting, implementation, and executive-standard business transformation.",
    href: "#alpha-signature",
    image: "/assets/concept-board/alpha-glass-capsules.jpeg",
  },
  {
    id: "corporate",
    label: "Profile",
    title: "Corporate Profile",
    summary: "Professional background, enterprise experience, and selected credentials.",
    href: "#corporate-profile",
    image: "/assets/concept-board/corporate-emboss.jpeg",
  },
  {
    id: "lab",
    label: "Lab",
    title: "Personal Project Lab",
    summary: "Independent builds, prototypes, experiments, and selected technical work.",
    href: "#personal-project-lab",
    image: "/assets/concept-board/lab-glass-editorial.jpeg",
  },
];

export const highlights = [
  {
    label: "Corporate",
    title: "Bosch Mexico",
    description:
      "Current work around AI, data, analytics, SAP-to-modern-data, dashboards, and business-facing systems at a high-level, non-confidential summary layer.",
    meta: "Enterprise AI / Data / Analytics",
  },
  {
    label: "Ventures",
    title: "Cyrus Global Capital",
    description:
      "Investment, governance, and long-term capital strategy through a dedicated venture platform.",
    meta: "Capital / Governance / External",
  },
  {
    label: "Consulting",
    title: "Alpha Signature",
    description:
      "Consulting, implementation, and executive-standard business transformation for companies seeking clarity, structure, and scale.",
    meta: "Strategy / Systems / Execution",
  },
  {
    label: "Talks",
    title: "Data Analytics and Explainable AI",
    description:
      "Public talks and workshops covering data analytics, explainable AI, and robotics education.",
    meta: "Speaking / Workshops / Public Sessions",
  },
];

export const alphaFlow = [
  {
    step: "01",
    title: "What it is",
    description:
      "A strategy and systems studio focused on practical business transformation, operational design, and implementation support.",
  },
  {
    step: "02",
    title: "Problems it solves",
    description:
      "Helps clarify priorities, structure execution, improve process visibility, and turn fragmented business operations into coherent systems.",
  },
  {
    step: "03",
    title: "Operating model",
    description:
      "Works through diagnosis, architecture, implementation, and executive-ready documentation with a bias toward precision and measurable progress.",
  },
  {
    step: "04",
    title: "Founder",
    description:
      "Led by Baruch Lopez, combining AI systems, business analytics, and capital-oriented strategic thinking.",
  },
];

export const corporateCards = [
  {
    title: "Current Role",
    items: [
      "Bosch Mexico | Artificial Intelligence Engineer",
      "High-level focus on AI, data, analytics, dashboards, and business systems.",
      "Work summarized at a non-confidential level for public-facing clarity.",
    ],
  },
  {
    title: "Capabilities",
    items: [
      "AI / ML",
      "Data engineering",
      "BI / dashboards",
      "Business-facing analytics",
      "Documentation / enablement / workshops",
    ],
  },
  {
    title: "Selected Safe Work",
    items: [
      "Production analytics",
      "Scrap / PPC dashboards",
      "SAP data modernization",
      "Cross-functional analytics support",
    ],
  },
];

export const labTaxonomy = [
  "AI / ML",
  "Finance",
  "Data Engineering",
  "Automation",
  "Robotics",
  "Experimental",
  "Public",
  "Private Summary",
  "In Progress",
  "Archived",
];

export const labProjects = [
  {
    label: "Public / Independent / Model / AI",
    title: "Vehicle Detection Using IBM Clusters",
    description:
      "Multi-GPU training, aerial image processing, and deep learning workflows for vehicle detection.",
    meta: "PyTorch / TensorFlow / Computer Vision / High-Performance Training",
  },
  {
    label: "Corporate-safe / Dashboard / Data",
    title: "Production Data Dashboards",
    description:
      "Condensed, high-level summary of SAP, MES, SQL, ETL, and Power BI work for operations visibility.",
    meta: "SQL / Power BI / ETL / Operations",
  },
  {
    label: "Public / Tool / Automation",
    title: "Staff Mobility Tool",
    description:
      "Route optimization work using Python, graph logic, and geolocation-driven planning concepts.",
    meta: "Python / Graph Theory / Optimization",
  },
  {
    label: "In Progress / Concept / Experimental",
    title: "Systems & Capital Research Notes",
    description:
      "A future lane for publishing concept notes, operating models, and technical-business frameworks as the platform evolves.",
    meta: "Research / Strategy / Draft Systems",
  },
];

export const talks = [
  {
    date: "October 28, 2022",
    title: "Connectory Talks | Data Analytics",
    description:
      "Shared how data becomes a strategic asset and outlined practical fundamentals for responsible analysis.",
  },
  {
    date: "September 2023",
    title: "Talent Land Guadalajara | Explainable AI",
    description:
      "Focused on transparency, interpretability, and ethical implications of AI-assisted decision making.",
  },
  {
    date: "Summer 2019",
    title: "Workshop | Robotics",
    description:
      "Taught robotics and programming basics through hands-on projects and practical exercises.",
  },
];

export const mediaRoadmap = [
  {
    code: "01",
    title: "Writing / Essays",
    description:
      "Future long-form reflections on AI systems, capital strategy, and the operating logic behind selected ventures and projects. {dummie text}",
  },
  {
    code: "02",
    title: "Media / Interviews",
    description:
      "A future archive for interviews, public conversations, and external references once those assets are ready to publish. {dummie text}",
  },
  {
    code: "03",
    title: "Future formats",
    description:
      "A reserved space for essays, notes, presentations, and other editorial formats that extend the platform over time. {dummie text}",
  },
];

export const contactItems = [
  {
    label: "Email",
    value: "mmbarruchmm@gmail.com",
    href: "mailto:mmbarruchmm@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "{dummie text} LinkedIn URL pending",
    href: null,
  },
  {
    label: "GitHub",
    value: "github.com/OBaruch",
    href: "https://github.com/OBaruch",
  },
];
