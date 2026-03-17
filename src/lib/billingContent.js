import {
  BadgeDollarSign,
  Coins,
  Landmark,
  WalletCards,
} from "lucide-react";

export const PATIENT_PORTAL_URL =
  "https://phr.charmtracker.com/login.sas?FACILITY_ID=3a3047be28b32bf95dac27bd660a2fb90a976cc644c8922b2e62fe42203ae47ddda3124f8ffc5ce6";

export const insuranceCarriers = [
  {
    name: "Aetna (most commercial plans)",
    logo: "/logos/aetna.webp",
    logoAlt: "Aetna logo",
  },
  {
    name: "Horizon BCBS",
    logo: "/logos/HBCBS.webp",
    logoAlt: "Horizon BCBS logo",
  },
  {
    name: "Horizon NJ Health (Medicaid)",
    logo: "/logos/HNJH.webp",
    logoAlt: "Horizon NJ Health logo",
  },
  {
    name: "Cigna",
    logo: "/logos/cigna.webp",
    logoAlt: "Cigna logo",
  },
  {
    name: "United Healthcare (commercial)",
    logo: "/logos/united.webp",
    logoAlt: "United Healthcare logo",
  },
  {
    name: "Wellpoint / Amerigroup (Medicaid)",
    logo: "/logos/wellpoint.webp",
    logoAlt: "Wellpoint logo",
  },
  {
    name: "Magnacare",
    logo: "/logos/magnacare.webp",
    logoAlt: "Magnacare logo",
  },
  {
    name: "1199 SEIU Benefit and Pension Funds",
    logo: "/logos/1199seiu.webp",
    logoAlt: "1199 SEIU logo",
  },
  {
    name: "Meritain Health",
    logo: "/logos/meritain.webp",
    logoAlt: "Meritain Health logo",
  },
  {
    name: "AmeriHealth",
    logo: "/logos/amerihealth.webp",
    logoAlt: "AmeriHealth logo",
  },
  {
    name: "Tricare",
    logo: "/logos/tricare.webp",
    logoAlt: "Tricare logo",
  },
  {
    name: "Commercial plans accepted by contract",
  },
  {
    name: "Medicaid plans accepted by contract",
  },
  {
    name: "Additional participating plans may apply",
  },
];

export const selfPayRows = [
  ["New Patient (Infants-Toddlers)", "$___"],
  ["New Patient (Older Kids-Adolescents)", "$___"],
  ["Follow-Up", "$___"],
  ["Telemedicine", "$___"],
  ["Spirometry", "$___"],
  ["Bronchospasm", "$___"],
  ["Lung Volumes", "$___"],
  ["Rapid Strep", "$___"],
  ["FeNO", "$___"],
  ["Oscillometry", "$___"],
  ["Methacholine Challenge", "$___"],
  ["Complete PFT", "$___"],
];

export const insuranceTerms = [
  {
    title: "Copay",
    icon: WalletCards,
    description:
      "A fixed amount you pay at each visit, such as $20 or $30, based on your insurance plan.",
  },
  {
    title: "Deductible",
    icon: Landmark,
    description:
      "The amount you must pay out of pocket each year before your insurance begins sharing the cost of covered medical services.",
  },
  {
    title: "Coinsurance",
    icon: Coins,
    description:
      "After your deductible is met, coinsurance is the percentage split between you and your insurance plan, such as 20% from you and 80% from insurance.",
  },
  {
    title: "Out-of-Pocket Costs",
    icon: BadgeDollarSign,
    description:
      "This includes the total you pay in a year through deductible, copays, and coinsurance until you reach your out-of-pocket maximum.",
  },
];

export const paymentPolicyItems = [
  "Payment is due at the time of service for all self-pay visits and procedures.",
  "We accept major credit cards, debit cards, and cash.",
  "Rates are subject to change. Please confirm pricing at the time of visit.",
  "For detailed estimates, call the office or send questions to info@clapsmd.org.",
];

export const transparencyItems = [
  "Office visits",
  "Telehealth",
  "PFT Lab testing",
];
