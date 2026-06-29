import heroVideo from "@/assets/hero-video.mp4.asset.json";
import burley from "@/assets/burley.webp.asset.json";
import burley2 from "@/assets/burley-2.webp.asset.json";
import a1 from "@/assets/a-1.webp.asset.json";
import b1 from "@/assets/b.webp.asset.json";
import c1 from "@/assets/c.webp.asset.json";
import verwood from "@/assets/verwood.webp.asset.json";
import project1 from "@/assets/project-1.jpg.asset.json";
import project2 from "@/assets/project-2.jpg.asset.json";
import project3 from "@/assets/project-3.jpg.asset.json";
import project4 from "@/assets/project-4.jpg.asset.json";

export const navItems = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "Process", to: "/process" },
  { label: "Blog", to: "/blog" },
  { label: "Contact Us", to: "/contact" },
];

export const siteSettings = {
  name: "UPPAL DESIGN",
  tagline: "Intelligent design. Lasting impact.",
  email: "hello@uppaldesign.co.uk",
  phone: "+44 7911 123456",
  altPhone: "+44 7700 900203",
  address: "71-75 Shelton Street, London, UK",
  studioAddress: "Unit 3, Design House, London, UK",
};

export const media = {
  video: heroVideo.url,
  heroMain: burley.url,
  heroAlt: burley2.url,
  collageA: a1.url,
  collageB: b1.url,
  collageC: c1.url,
  featured: verwood.url,
  project1: project1.url,
  project2: project2.url,
  project3: project3.url,
  project4: project4.url,
};

export const stats = [
  { value: "250+", label: "Projects completed" },
  { value: "15+", label: "Years of experience" },
  { value: "98%", label: "Client satisfaction" },
  { value: "20+", label: "Awards won" },
  { value: "50+", label: "Expert team" },
];

export const services = [
  {
    title: "BIM Modelling",
    description: "Accurate 3D models for better planning, coordination, and confident decision-making.",
  },
  {
    title: "3D Visualization",
    description: "High-quality renders that bring your ideas to life before work begins on site.",
  },
  {
    title: "Planning Drawings",
    description: "Planning support and technical drawing packages prepared around compliance and clarity.",
  },
  {
    title: "Structural Design",
    description: "Safe, efficient, and sustainable structural solutions for residential and commercial work.",
  },
  {
    title: "Construction Support",
    description: "On-site and delivery support for smooth project execution from approval to handover.",
  },
  {
    title: "Sustainable Design",
    description: "Eco-conscious design thinking that balances performance, longevity, and beauty.",
  },
];

export const processSteps = [
  {
    number: "01",
    title: "Concept",
    subtitle: "Ideation & Research",
    description:
      "We begin by understanding your vision, property constraints, and goals through collaborative discovery and early spatial thinking.",
    deliverables: ["Client brief", "Site analysis", "Concept moodboard", "Initial sketches"],
    image: media.project2,
  },
  {
    number: "02",
    title: "Planning",
    subtitle: "Design & Development",
    description:
      "Layouts are refined and coordinated around planning intent, functionality, budget awareness, and local authority context.",
    deliverables: ["Space planning", "Design development", "Material direction"],
    image: media.project1,
  },
  {
    number: "03",
    title: "Visualization",
    subtitle: "3D Modeling & Rendering",
    description:
      "We create detailed visualisations to help you understand the future space with confidence before construction starts.",
    deliverables: ["3D models", "Photorealistic views", "Presentation visuals"],
    image: media.featured,
  },
  {
    number: "04",
    title: "Documentation",
    subtitle: "Drawings & Approvals",
    description:
      "Technical information is prepared for approvals, tendering, and coordinated delivery with consultants and contractors.",
    deliverables: ["Technical drawings", "Approval documents", "Tender support"],
    image: media.collageB,
  },
  {
    number: "05",
    title: "Construction",
    subtitle: "Build & Deliver",
    description:
      "The final stage focuses on site coordination, quality control, timely delivery, and a smooth handover.",
    deliverables: ["Site execution", "Progress updates", "Quality assurance", "Handover"],
    image: media.collageC,
  },
];

export const projects = [
  {
    title: "London Business Hub",
    location: "London, UK",
    category: "Commercial",
    image: media.project1,
  },
  {
    title: "Modern Family House",
    location: "Surrey, UK",
    category: "Residential",
    image: media.project2,
  },
  {
    title: "Luxury Villa Haven",
    location: "Surrey, UK",
    category: "Residential",
    image: media.heroMain,
  },
  {
    title: "Birmingham Apartments",
    location: "Birmingham, UK",
    category: "Commercial",
    image: media.project4,
  },
  {
    title: "Private Villa",
    location: "Leeds, UK",
    category: "Residential",
    image: media.heroAlt,
  },
  {
    title: "Mixed Use Development",
    location: "Bristol, UK",
    category: "Mixed-use",
    image: media.project3,
  },
  {
    title: "Luxury Hotel & Spa",
    location: "Manchester, UK",
    category: "Hospitality",
    image: media.collageC,
  },
  {
    title: "Cambridge University",
    location: "Cambridge, UK",
    category: "Educational",
    image: media.collageA,
  },
];

export const teamLeads = [
  {
    name: "Ar. Harpreet Uppal",
    role: "Founder & Principal Architect",
    image: media.collageA,
  },
  {
    name: "Ar. Simran Kaur",
    role: "Senior Architect",
    image: media.collageB,
  },
  {
    name: "Ar. Gurpreet Sandhu",
    role: "Project Director",
    image: media.collageC,
  },
  {
    name: "Ar. Arvind Sharma",
    role: "BIM Coordinator",
    image: media.featured,
  },
];

export const teamMembers = [
  ["Ar. Kuhan Mehta", "Project Architect"],
  ["Ar. Neha Rawal", "Interior Architect"],
  ["Ar. Karan Malhotra", "Design Architect"],
  ["Ar. Pooja Sharma", "Landscape Architect"],
  ["Ar. Manav Sethi", "BIM Specialist"],
  ["Ar. Vivek Rao", "Technical Architect"],
  ["Ar. Isha Verma", "3D Visualiser"],
  ["Ar. Aditya Kapoor", "Design Researcher"],
  ["Ar. Mehak Arora", "Documentation Lead"],
  ["Ar. Sahil Grover", "Estimation Coordinator"],
].map((member, index) => ({
  name: member[0],
  role: member[1],
  image: [media.collageA, media.collageB, media.collageC, media.featured][index % 4],
}));

export const blogPosts = [
  {
    title: "The Future of Sustainable Architecture in the UK",
    category: "Sustainability",
    date: "May 20, 2024",
    readTime: "6 min read",
    image: media.heroAlt,
    excerpt:
      "Sustainable architecture is no longer a trend; it is shaping the next generation of responsible buildings across the UK.",
  },
  {
    title: "How Good Design Enhances Property Value",
    category: "Architecture",
    date: "May 18, 2024",
    readTime: "7 min read",
    image: media.project2,
    excerpt: "Smart design adds lasting value by improving performance, livability, and long-term appeal.",
  },
  {
    title: "Biophilic Design: Bringing Nature Indoors",
    category: "Interior Design",
    date: "May 15, 2024",
    readTime: "6 min read",
    image: media.collageC,
    excerpt: "Natural materials, daylight, and greenery can transform interiors into calmer, healthier spaces.",
  },
  {
    title: "Modern Materials Shaping Tomorrow",
    category: "Architecture",
    date: "May 12, 2024",
    readTime: "6 min read",
    image: media.project4,
    excerpt: "Material innovation is pushing architecture toward better efficiency, resilience, and expression.",
  },
  {
    title: "From Concept to Creation: Our Process",
    category: "News",
    date: "May 4, 2024",
    readTime: "4 min read",
    image: media.project1,
    excerpt: "A behind-the-scenes look at how we guide projects from briefing to build-ready delivery.",
  },
];

export const faqItems = [
  {
    question: "How long does the design process take?",
    answer: "Timelines depend on scope, approvals, and complexity, but every project begins with a clear program and realistic roadmap.",
  },
  {
    question: "Do you offer virtual consultations?",
    answer: "Yes. We work with clients across the UK and support remote consultations when projects require it.",
  },
  {
    question: "What is included in every stage?",
    answer: "Each stage includes clear deliverables, design coordination, and communication so you know exactly what is being produced.",
  },
  {
    question: "Can you help outside London?",
    answer: "Yes. We support residential and commercial work across the UK with a flexible, process-led approach.",
  },
];

export const values = [
  "Collaboration",
  "Innovation",
  "Excellence",
  "Sustainability",
  "Integrity",
  "Growth",
];
