import heroVideo from "@/assets/hero-cranes.mp4.asset.json";
import vidHome from "@/assets/videos/home.mp4.asset.json";
import vidAbout from "@/assets/videos/about.mp4.asset.json";
import vidProjects from "@/assets/videos/projects.mp4.asset.json";
import vidServices from "@/assets/videos/services.mp4.asset.json";
import vidProcess from "@/assets/videos/process.mp4.asset.json";
import vidBlog from "@/assets/videos/blog.mp4.asset.json";
import vidCta from "@/assets/videos/cta.mp4.asset.json";
import heroBuilding from "@/assets/hero-building.jpg.asset.json";
import curvedBuilding from "@/assets/curved-building.jpg.asset.json";
import londonSkyline from "@/assets/london-skyline.jpg.asset.json";
import glassTower from "@/assets/glass-tower.jpg.asset.json";
import interiorLiving from "@/assets/interior-living.jpg.asset.json";
import interiorBedroom from "@/assets/interior-bedroom.jpg.asset.json";
import officeStudio from "@/assets/office-studio.jpg.asset.json";
import founderPortrait from "@/assets/founder-portrait.jpg.asset.json";
import projModernFamilyHouse from "@/assets/proj-modern-family-house.jpg.asset.json";
import projLondonBusinessHub from "@/assets/proj-london-business-hub.jpg.asset.json";
import projCambridge from "@/assets/proj-cambridge.jpg.asset.json";
import projLuxuryHotel from "@/assets/proj-luxury-hotel.jpg.asset.json";
import projBirminghamApartments from "@/assets/proj-birmingham-apartments.jpg.asset.json";
import projReadingOffice from "@/assets/proj-reading-office.jpg.asset.json";
import projPrivateVilla from "@/assets/proj-private-villa.jpg.asset.json";
import projMixedUse from "@/assets/proj-mixed-use.jpg.asset.json";

import vidFooter from "@/assets/videos/footer.mp4.asset.json";
import vidDetail from "@/assets/videos/detail.mp4.asset.json";

export const pageVideos = {
  home: heroVideo.url,
  about: vidAbout.url,
  projects: vidProjects.url,
  services: vidServices.url,
  process: vidProcess.url,
  blog: vidBlog.url,
  contact: vidCta.url,
  team: vidAbout.url,
  detail: vidDetail.url,
  cta: vidCta.url,
  footer: vidFooter.url,
};

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
  name: "UPPAL",
  tagline: "Intelligent design. Lasting impact.",
  email: "hello@uppaldesign.co.uk",
  phone: "+44 7911 123456",
  altPhone: "+44 7700 900203",
  address: "71-75 Shelton Street, London, UK",
  studioAddress: "Unit 3, Design House, London, UK",
};

export const media = {
  video: heroVideo.url,
  heroMain: heroBuilding.url,
  heroAlt: curvedBuilding.url,
  collageA: londonSkyline.url,
  collageB: glassTower.url,
  collageC: curvedBuilding.url,
  featured: heroBuilding.url,
  interiorLiving: interiorLiving.url,
  interiorBedroom: interiorBedroom.url,
  officeStudio: officeStudio.url,
  founder: founderPortrait.url,
  project1: projLondonBusinessHub.url,
  project2: projModernFamilyHouse.url,
  project3: projMixedUse.url,
  project4: projBirminghamApartments.url,
};

export const stats = [
  { value: "250+", label: "Projects completed", icon: "building" as const },
  { value: "15+", label: "Years of experience", icon: "badge" as const },
  { value: "98%", label: "Client satisfaction", icon: "heart" as const },
  { value: "20+", label: "Awards won", icon: "trophy" as const },
  { value: "50+", label: "Expert team", icon: "users" as const },
];

export const services = [
  { title: "BIM Modelling", description: "Accurate 3D models for better planning, coordination, and confident decision-making.", icon: "box" as const },
  { title: "3D Visualization", description: "High-quality renders that bring your ideas to life before work begins on site.", icon: "cube" as const },
  { title: "Planning Drawings", description: "Planning support and technical drawing packages prepared around compliance and clarity.", icon: "file" as const },
  { title: "Structural Design", description: "Safe, efficient, and sustainable structural solutions for residential and commercial work.", icon: "puzzle" as const },
  { title: "Construction Support", description: "On-site and delivery support for smooth project execution from approval to handover.", icon: "helmet" as const },
  { title: "Sustainable Design", description: "Eco-conscious design thinking that balances performance, longevity, and beauty.", icon: "leaf" as const },
];

export const processSteps = [
  { number: "01", title: "Concept", subtitle: "Ideation & Research", description: "We begin by understanding your vision, property constraints, and goals through collaborative discovery and early spatial thinking.", deliverables: ["Client brief", "Site analysis", "Concept moodboard", "Initial sketches"], image: media.interiorBedroom, icon: "lightbulb" as const },
  { number: "02", title: "Planning", subtitle: "Design & Development", description: "Layouts are refined and coordinated around planning intent, functionality, budget awareness, and local authority context.", deliverables: ["Space planning", "Design development", "Material direction"], image: media.project2, icon: "file" as const },
  { number: "03", title: "Visualization", subtitle: "3D Modeling & Rendering", description: "We create detailed visualisations to help you understand the future space with confidence before construction starts.", deliverables: ["3D models", "Photorealistic views", "Presentation visuals"], image: media.heroMain, icon: "cube" as const },
  { number: "04", title: "Documentation", subtitle: "Drawings & Approvals", description: "Technical information is prepared for approvals, tendering, and coordinated delivery with consultants and contractors.", deliverables: ["Technical drawings", "Approval documents", "Tender support"], image: media.project1, icon: "clipboard" as const },
  { number: "05", title: "Construction", subtitle: "Build & Deliver", description: "The final stage focuses on site coordination, quality control, timely delivery, and a smooth handover.", deliverables: ["Site execution", "Progress updates", "Quality assurance", "Handover"], image: media.interiorLiving, icon: "helmet" as const },
];

export const projects = [
  { title: "London Business Hub", location: "London, UK", category: "Commercial", image: media.project1, featured: true },
  { title: "Modern Family House", location: "Surrey, UK", category: "Residential", image: media.project2, featured: true },
  { title: "Luxury Villa Haven", location: "Surrey, UK", category: "Residential", image: media.heroMain, featured: true },
  { title: "Birmingham Apartments", location: "Birmingham, UK", category: "Commercial", image: media.project4 },
  { title: "Private Villa", location: "Leeds, UK", category: "Residential", image: projPrivateVilla.url },
  { title: "Mixed Use Development", location: "Bristol, UK", category: "Mixed-use", image: media.project3 },
  { title: "Luxury Hotel & Spa", location: "Manchester, UK", category: "Hospitality", image: projLuxuryHotel.url },
  { title: "Cambridge University", location: "Cambridge, UK", category: "Educational", image: projCambridge.url },
  { title: "Reading Office Complex", location: "Reading, UK", category: "Commercial", image: projReadingOffice.url },
];

export const teamLeads = [
  { name: "Ar. Harpreet Uppal", role: "Founder & Principal Architect", image: media.founder },
  { name: "Ar. Simran Kaur", role: "Senior Architect", image: media.founder },
  { name: "Ar. Gurpreet Sandhu", role: "Project Director", image: media.founder },
  { name: "Ar. Arvind Sharma", role: "BIM Coordinator", image: media.founder },
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
].map((member) => ({ name: member[0], role: member[1], image: media.founder }));

export const blogPosts = [
  { title: "The Future of Sustainable Architecture in the UK", category: "Sustainability", date: "May 20, 2024", readTime: "6 min read", image: media.heroAlt, excerpt: "Sustainable architecture is no longer a trend; it is shaping the next generation of responsible buildings across the UK." },
  { title: "How Good Design Enhances Property Value", category: "Architecture", date: "May 18, 2024", readTime: "7 min read", image: media.project2, excerpt: "Smart design adds lasting value by improving performance, livability, and long-term appeal." },
  { title: "Biophilic Design: Bringing Nature Indoors", category: "Interior Design", date: "May 15, 2024", readTime: "6 min read", image: media.interiorLiving, excerpt: "Natural materials, daylight, and greenery can transform interiors into calmer, healthier spaces." },
  { title: "Modern Materials Shaping Tomorrow", category: "Architecture", date: "May 12, 2024", readTime: "6 min read", image: media.project4, excerpt: "Material innovation is pushing architecture toward better efficiency, resilience, and expression." },
  { title: "Uppal Decor Wins Design Excellence Award 2024", category: "News", date: "May 9, 2024", readTime: "3 min read", image: media.project1, excerpt: "Honored to be recognized for our commitment to innovation and timeless design." },
  { title: "From Concept to Creation: Our Process", category: "News", date: "May 4, 2024", readTime: "4 min read", image: media.project1, excerpt: "A behind-the-scenes look at how we guide projects from briefing to build-ready delivery." },
];

export const faqItems = [
  { question: "How long does the design process take?", answer: "Timelines depend on scope, approvals, and complexity, but every project begins with a clear program and realistic roadmap." },
  { question: "Do you offer virtual consultations?", answer: "Yes. We work with clients across the UK and support remote consultations when projects require it." },
  { question: "What is included in every stage?", answer: "Each stage includes clear deliverables, design coordination, and communication so you know exactly what is being produced." },
  { question: "Can you help outside London?", answer: "Yes. We support residential and commercial work across the UK with a flexible, process-led approach." },
];

export const values = ["Collaboration", "Innovation", "Excellence", "Sustainability", "Integrity", "Growth"];
