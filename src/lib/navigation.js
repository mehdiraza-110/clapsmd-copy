export const resourceLinks = [
  { name: "Insurance & Billing", href: "/insurance-billing" },
  { name: "Policies", href: "/policies" },
  { name: "Self Pay Pricing", href: "/self-pay-pricing" },
];

export const servicesLinks = [
  { name: "Asthma Management", href: "/asthma" },
];

export const primaryNavLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "PFT Lab", href: "/pft-lab" },
  { name: "Services", href: "/about#conditions", items: servicesLinks },
  { name: "Resources", href: "/insurance-billing", items: resourceLinks },
  { name: "Blog", href: "/blog" },
];
