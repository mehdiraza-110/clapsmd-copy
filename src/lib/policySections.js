import {
  Accessibility,
  FileCheck2,
  FileText,
  Globe,
  Lock,
  Scale,
  ShieldCheck,
} from "lucide-react";

export const policySections = [
  {
    title: "Privacy Policy",
    icon: Lock,
    paragraphs: [
      "CLAPS MD and the PFT Lab respect your privacy and are committed to protecting your personal and medical information. This Privacy Policy explains how we collect, use, store, and safeguard the information you provide when using our website or receiving services at our facility.",
      "We may collect personal information including your name, date of birth, contact information, insurance details, and medical information when necessary for scheduling, referral processing, Pulmonary Function Testing (PFT), billing, and communication with your Primary Care Provider (PCP) or referring physician.",
      "Information submitted through our website, referral pages, or communication forms is used only for healthcare-related purposes. We do not sell, rent, or share personal information with unauthorized third parties.",
      "We maintain secure systems and procedures to protect all patient information from unauthorized access or disclosure.",
    ],
    bullets: [
      "Treatment coordination with your PCP or referring provider",
      "Insurance verification and billing",
      "Healthcare operations and documentation",
      "Legal or regulatory requirements",
    ],
    bulletLabel: "Your information may be shared only when necessary for:",
  },
  {
    title: "HIPAA Notice",
    icon: ShieldCheck,
    paragraphs: [
      "CLAPS MD and the PFT Lab comply with the Health Insurance Portability and Accountability Act (HIPAA) and all applicable federal and state privacy regulations.",
      "We will not release your medical information without your authorization except as permitted by law.",
      "We take all reasonable precautions to keep your medical information secure and confidential.",
    ],
    bullets: [
      "Providing medical care and Pulmonary Function Testing",
      "Communicating with your Primary Care Provider (PCP) or referring provider",
      "Insurance billing and payment processing",
      "Healthcare operations such as quality review and record keeping",
      "Legal reporting requirements when required by law",
    ],
    bulletLabel: "Your Protected Health Information (PHI) may be used for:",
    secondaryBullets: [
      "Request access to your medical records",
      "Request corrections to your records",
      "Request restrictions on certain uses of your information",
      "Receive a copy of our full HIPAA Notice of Privacy Practices",
    ],
    secondaryBulletLabel: "You have the right to:",
  },
  {
    title: "Terms & Conditions",
    icon: FileText,
    paragraphs: [
      "By accessing or using the CLAPS MD and PFT Lab website, you agree to the terms and conditions described below.",
      "The information provided on this website is for informational purposes only and should not be considered medical advice. Use of this website does not establish a provider-patient relationship.",
      "Pulmonary Function Testing and related diagnostic services require a valid referral from a licensed healthcare provider, usually your Primary Care Provider (PCP) or specialist. Testing cannot be performed without proper medical authorization when required.",
      "Users agree not to submit false information, attempt unauthorized access, or misuse the website in any way.",
      "CLAPS MD reserves the right to update or modify website content, policies, and procedures at any time without prior notice.",
    ],
  },
  {
    title: "Accessibility Statement",
    icon: Accessibility,
    paragraphs: [
      "CLAPS MD and the PFT Lab are committed to making our website accessible to all individuals, including those with disabilities.",
      "We aim to provide content that is easy to read, navigate, and understand for all users. If you have difficulty accessing any part of this website, please contact our office and we will make reasonable efforts to provide the information in another format.",
      "Our goal is to ensure equal access to information for patients, providers, and visitors.",
    ],
    bullets: [
      "Phone assistance",
      "Email communication",
      "Printed documents",
      "Direct office support",
    ],
    bulletLabel: "Alternative access may include:",
  },
  {
    title: "Website Disclaimer",
    icon: Scale,
    paragraphs: [
      "The information provided on this website is for general informational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment.",
      "Pulmonary Function Testing (PFT) services provided by CLAPS MD require a valid referral from a licensed healthcare provider when required by law or insurance policy.",
      "Use of this website does not create a doctor-patient relationship.",
      "While we make every effort to keep website information accurate and up to date, CLAPS MD does not guarantee that all content is complete, current, or free from errors.",
      "Use of this website is at your own risk.",
    ],
  },
  {
    title: "Price Transparency",
    icon: FileCheck2,
    paragraphs: [
      "CLAPS MD and the PFT Lab support healthcare price transparency and believe patients should have clear information about the cost of their testing.",
      "Patients are encouraged to contact our office before their appointment to request an estimate of charges.",
      "Final costs are determined after insurance verification and completion of the ordered services.",
      "We will make reasonable efforts to provide accurate pricing information whenever possible.",
    ],
    bullets: [
      "The type of test ordered by the referring provider",
      "Insurance coverage and benefits",
      "Deductibles, copayments, or coinsurance",
      "Additional testing required during the visit",
    ],
    bulletLabel: "The cost of Pulmonary Function Testing may vary depending on:",
  },
  {
    title: "Data Use Statement",
    icon: Globe,
    paragraphs: [
      "Information submitted through the CLAPS MD website, referral page, or contact forms is used only for legitimate healthcare and administrative purposes.",
      "Patient information is stored in secure systems that follow healthcare privacy regulations.",
      "CLAPS MD does not sell personal data and does not use patient information for marketing without consent.",
      "By using this website, you acknowledge and agree that information submitted may be used for these purposes in accordance with our privacy and compliance policies.",
    ],
    bullets: [
      "Appointment scheduling",
      "Provider referral processing",
      "Pulmonary Function Testing documentation",
      "Insurance verification and billing",
      "Communication with patients and referring providers",
      "Maintaining medical records as required by law",
    ],
    bulletLabel: "Data may be used for:",
  },
];
