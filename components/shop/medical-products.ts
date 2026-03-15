export interface MedicalProduct {
  id: number
  name: string
  description: string
  price: number
  rating: number
  image: string
  category: string
  requiresPrescription: boolean
  inStock: boolean
  discount?: number
  brand?: string
  contents?: string
}

export const medicalProducts: MedicalProduct[] = [
  {
    id: 1,
    name: "Pain Relief Tablets",
    description: "Fast-acting pain relief for headaches and body aches",
    price: 199.99,
    rating: 4.5,
    image: "/Images/pain_relief.webp",
    category: "tablets",
    requiresPrescription: false,
    inStock: true,
    discount: 10,
    brand: "Derma AI Healthcare",
    contents: "30 tablets"
  },
  {
    id: 2,
    name: "Skin Healing Cream",
    description: "Advanced formula for treating skin conditions and promoting healing",
    price: 349.99,
    rating: 4.7,
    image: "/Images/51GtNzvjBOL._AC_UL480_FMwebp_QL65_Healing cream.webp",
    category: "creams",
    requiresPrescription: false,
    inStock: true,
    brand: "Derma AI Healthcare",
    contents: "50g tube"
  },
  {
    id: 3,
    name: "Vitamin D3 Supplements",
    description: "Essential vitamin D3 supplements for bone health and immunity",
    price: 499.99,
    rating: 4.8,
    image: "/Images/6190UgiDfNL._AC_UL480_FMwebp_QL65_.webp",
    category: "supplements",
    requiresPrescription: false,
    inStock: true,
    discount: 15,
    brand: "VitaCore",
    contents: "60 capsules"
  },
  {
    id: 4,
    name: "Digital Blood Pressure Monitor",
    description: "Accurate and easy-to-use digital blood pressure monitor for home use",
    price: 1999.99,
    rating: 4.6,
    image: "/Images/omron_automatic_blood_pressure_monitor_hem_7121_0_0.jpg",
    category: "equipment",
    requiresPrescription: false,
    inStock: true,
    brand: "MediTech Pro",
    contents: "1 monitor with cuff"
  },
  {
    id: 5,
    name: "Moisturizing Lotion",
    description: "Deeply hydrating lotion for dry and sensitive skin",
    price: 299.99,
    rating: 4.4,
    image: "/Images/maxrich_intensive_moisturizing_lotion_150gm_208902_0_1.jpg",
    category: "lotions",
    requiresPrescription: false,
    inStock: true,
    brand: "SkinCare Plus",
    contents: "200ml bottle"
  },
  {
    id: 6,
    name: "Antibiotic Ointment",
    description: "Medical-grade antibiotic ointment for treating minor cuts and burns",
    price: 149.99,
    rating: 4.3,
    image: "/Images/t_bact_ointment_5gm_35656_0_1.jpg",
    category: "creams",
    requiresPrescription: true,
    inStock: true,
    brand: "MediHeal",
    contents: "25g tube"
  },
  {
    id: 7,
    name: "Glucose Monitor Kit",
    description: "Complete glucose monitoring kit for diabetes management",
    price: 2499.99,
    rating: 4.9,
    image: "/Images/omron_automatic_blood_pressure_monitor_hem_7121_0_0.jpg",
    category: "equipment",
    requiresPrescription: false,
    inStock: true,
    discount: 20,
    brand: "DiabetCare",
    contents: "Monitor, 50 test strips, lancets"
  },
  {
    id: 8,
    name: "Multivitamin Tablets",
    description: "Daily multivitamin tablets for overall health and wellness",
    price: 599.99,
    rating: 4.7,
    image: "/Images/prd_3968831-MuscleBlaze-MBVITE-Daily-Multivitamin-for-Enhanced-Energy-Stamina-Gut-Health-60-tablets-Unflavoured_o.webp",
    category: "tablets",
    requiresPrescription: false,
    inStock: true,
    brand: "VitaCore",
    contents: "90 tablets"
  },
  {
    id: 9,
    name: "Anti-Aging Serum",
    description: "Advanced anti-aging serum with retinol and peptides",
    price: 899.99,
    rating: 4.6,
    image: "/Images/maxrich_intensive_moisturizing_lotion_150gm_208902_0_1.jpg",
    category: "creams",
    requiresPrescription: false,
    inStock: true,
    discount: 25,
    brand: "Derma AI Healthcare",
    contents: "30ml serum"
  },
  {
    id: 10,
    name: "Omega-3 Fish Oil",
    description: "Premium omega-3 supplements for heart and brain health",
    price: 799.99,
    rating: 4.8,
    image: "/Images/variant-5265-featured_image-Now_Foods_Omega3_Fish_Oil__200_Softgels.webp",
    category: "supplements",
    requiresPrescription: false,
    inStock: true,
    brand: "OceanPure",
    contents: "120 softgels"
  },
  {
    id: 11,
    name: "Sunscreen Lotion SPF 50",
    description: "Broad-spectrum sunscreen for daily protection",
    price: 249.99,
    rating: 4.5,
    image: "/Images/nivea_sun_protect_moisture_spf_50_lotion_75_ml_0.jpg",
    category: "lotions",
    requiresPrescription: false,
    inStock: true,
    brand: "SkinShield",
    contents: "100ml bottle"
  },
  {
    id: 12,
    name: "Digital Thermometer",
    description: "Fast and accurate digital thermometer for fever monitoring",
    price: 299.99,
    rating: 4.4,
    image: "/Images/dr_morepen_digi_classic_thermometer_mt110_1s_480878_0_0.jpg",
    category: "equipment",
    requiresPrescription: false,
    inStock: true,
    brand: "TempCheck",
    contents: "1 thermometer with case"
  }
]

export const productCategories = [
  { id: "tablets", name: "Tablets & Capsules" },
  { id: "creams", name: "Creams & Ointments" },
  { id: "lotions", name: "Lotions" },
  { id: "supplements", name: "Supplements" },
  { id: "equipment", name: "Medical Equipment" },
]

export const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
]