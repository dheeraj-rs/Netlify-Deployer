import { Template } from "./types";

// Sample template data
export const templates: Template[] = [
  {
    id: "blog-starter",
    name: "Blog Starter",
    description: "A clean, modern blog template with a minimalist design",
    imageUrl: "https://images.pexels.com/photos/6444/pencil-typography-black-design.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Blog",
    tags: ["blog", "markdown", "responsive"]
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Showcase your work with this elegant portfolio template",
    imageUrl: "https://images.pexels.com/photos/326501/pexels-photo-326501.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Portfolio",
    tags: ["portfolio", "gallery", "professional"]
  },
  {
    id: "ecommerce",
    name: "E-commerce Store",
    description: "A complete e-commerce solution with product listings and cart",
    imageUrl: "https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "E-commerce",
    tags: ["shop", "products", "commerce"]
  },
  {
    id: "landing-page",
    name: "Landing Page",
    description: "High-converting landing page template with call-to-action sections",
    imageUrl: "https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Marketing",
    tags: ["landing", "conversion", "marketing"]
  },
  {
    id: "docs-site",
    name: "Documentation Site",
    description: "Well-structured documentation template with search functionality",
    imageUrl: "https://images.pexels.com/photos/6980429/pexels-photo-6980429.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Documentation",
    tags: ["docs", "technical", "reference"]
  },
  {
    id: "agency",
    name: "Agency Website",
    description: "Professional agency website with service showcases",
    imageUrl: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Business",
    tags: ["agency", "services", "business"]
  }
];

// Get template by ID
export function getTemplateById(id: string): Template | undefined {
  return templates.find(template => template.id === id);
}

// Get templates by category
export function getTemplatesByCategory(category: string): Template[] {
  return templates.filter(template => template.category === category);
}

// Get templates by tag
export function getTemplatesByTag(tag: string): Template[] {
  return templates.filter(template => template.tags.includes(tag));
}

// Get all unique categories
export function getAllCategories(): string[] {
  return Array.from(new Set(templates.map(template => template.category)));
}

// Get all unique tags
export function getAllTags(): string[] {
  const allTags = templates.flatMap(template => template.tags);
  return Array.from(new Set(allTags));
}