import { Product, LegacyProduct } from "./types";
import { estimateOriginalValue, calculateSecurityDeposit } from "./utils/deposit";

export const PRODUCTS: LegacyProduct[] = [
  {
    id: "1",
    designer: "SAINT LAURENT",
    name: "Silk Midnight Gown",
    pricePerDay: 45,
    imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600",
    badge: "Sustainability Badge",
    badgeType: "sustainability",
    category: "dresses"
  },
  {
    id: "2",
    designer: "MAX MARA",
    name: "Oversized Cashmere Coat",
    pricePerDay: 72,
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600",
    badge: "Rare Piece",
    badgeType: "rare",
    category: "outerwear"
  },
  {
    id: "3",
    designer: "PRADA",
    name: "Cleo Metallic Bag",
    pricePerDay: 25,
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600",
    badge: "4.9 (124 rentals)",
    badgeType: "standard",
    rating: 4.9,
    rentalsCount: 124,
    category: "for-you"
  },
  {
    id: "4",
    designer: "GUCCI",
    name: "Velvet Heritage Blazer",
    pricePerDay: 58,
    imageUrl: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=600",
    badge: "Limited Availability",
    badgeType: "limited",
    category: "outerwear"
  },
  {
    id: "5",
    designer: "BALENCIAGA",
    name: "Classic Hourglass Jacket",
    pricePerDay: 65,
    imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600",
    badge: "New Arrival",
    badgeType: "standard",
    category: "outerwear"
  },
  {
    id: "6",
    designer: "CHANEL",
    name: "Tweed Evening Dress",
    pricePerDay: 85,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600",
    badge: "Rare Piece",
    badgeType: "rare",
    category: "dresses"
  },
  {
    id: "7",
    designer: "DIOR",
    name: "Saddle Shoulder Bag",
    pricePerDay: 30,
    imageUrl: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=600",
    badge: "Sustainability Badge",
    badgeType: "sustainability",
    category: "for-you"
  },
  {
    id: "8",
    designer: "VERSACE",
    name: "Baroque Silk Shirt Dress",
    pricePerDay: 50,
    imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600",
    badge: "Limited Availability",
    badgeType: "limited",
    category: "dresses"
  }
];

export const STYLE_OPTIONS = [
  { id: "minimalist", label: "Modern Minimalist", desc: "Clean lines, neutral palette, tailored fits" },
  { id: "streetwear", label: "Luxury Streetwear", desc: "Premium hoodies, rare sneakers, bold graphic aesthetics" },
  { id: "classic", label: "Classic Luxury", desc: "Timeless tweed, heritage blazers, iconic bags" },
  { id: "avant_garde", label: "Avant-Garde", desc: "Deconstructed shapes, striking silhouettes, runway highlights" },
  { id: "vintage", label: "Archival & Vintage", desc: "Rare finds, retro leather, unique curated statement pieces" }
];

const RAW_PRODUCTS: Product[] = [
  // Curated Essentials
  {
    id: 'midnight-velvet-blazer',
    name: 'Midnight Velvet Blazer',
    price: 2499,
    currency: '₹',
    brand: 'Maison Velours',
    description: 'A luxury designer midnight blue velvet blazer for men, styled elegantly on a high-fashion mannequin against a clean, minimalist studio background. The lighting is soft and directional, highlighting the rich texture of the velvet. The overall mood is sophisticated and expensive, following a clean light-mode layout.',
    size: 'M (IT 48)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCH9QKNkOHlix7RYdHZMku-E0VMk3IBe4m7NsZi_npy3gop0HV7L2-L5r1JQuzjM4qCaG9xZC3J5KcfWsVUgmzcNqZn5xL_nS5-14LEr97f7rzK6YUkmD2JF8zdGlNBqivTOUUhlGw6gMVG9olt0oYjWaF3TxLFYZ5lBxJ8dWFJP6Fp1VgkR3yn0_zliD5A7-RYktLSQLashlDJP1DfVQBqf65wg_5SADsVK--LvjGEPOg9qTJ_2v9C',
    rating: 4.9,
    distance: '2.4 km',
    tag: 'Available Now',
    category: 'Formal'
  },
  {
    id: 'emerald-sequin-dress',
    name: 'Emerald Sequin Dress',
    price: 1850,
    currency: '₹',
    brand: 'Atelier Suede',
    description: 'A stunning emerald green sequined cocktail dress displayed in a high-end boutique setting with warm, ambient lighting. The dress is captured at a three-quarter angle to show its silhouette and light reflection. The background is blurred and neutral, maintaining focus on the premium garment. High-quality fashion photography style.',
    size: 'S',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCi2eU6xgIuakNMfrdKd54AsfBgpgqY74-zYMf0xBWhBfAJ7bGVUWrA3YfnBQah7rR5z0wsppbYZyna81pCZjQcufuoZKH4-Lfi0pastZJMV2yuiwCnTBIR6qZP_voC43uRMmStuep8FUpimopa_JPZqoj4Nytd1HUogObtMpNOX6AhxqCkMwcOzFyqqhtMj8I5tgxfWNtrDgxypHSdS5XXDfVTvyXV6oLNbXxsFo8gXdQIPzMQihgK',
    rating: 4.8,
    distance: '0.8 km',
    category: 'Party'
  },
  {
    id: 'artisan-leather-boots',
    name: 'Artisan Leather Boots',
    price: 950,
    currency: '₹',
    brand: 'Gucci',
    description: 'A pair of luxury tan leather chelsea boots, perfectly polished, set on a dark wood pedestal with soft minimalist lighting from the side. The photography is crisp and professional, showcasing the leather\'s grain and the boots\' sleek silhouette. The background is a clean white, typical of high-fashion catalog imagery.',
    size: '42',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxYVEvzBTNEQ3lgu-kKqWl5nANHwKrftL1k_SMeYKWx26915O6t7KXakPrLD66j-o1npAB6hhZI-1gfZNU4WEU_mP_NyKyQwpt4M48Pk3JhnKPyD4w6E-uwgqnyGlf5ApYopObvOnX-cVMVs1tY1U99L7bNYAJWvLkQ9JTg4lAL9Cg0O7wL22fw1cH3MyWI4bpUXuoAHCMEymVzA9wD83cu97-hw7MHPIdueqm8goyxGU8xCe8I2al',
    rating: 5.0,
    distance: '3.2 km',
    category: 'Casual'
  },
  {
    id: 'classic-camel-trench',
    name: 'Classic Camel Trench',
    price: 1500,
    currency: '₹',
    brand: 'Prada',
    description: 'A chic designer oversized camel-colored trench coat, draped effortlessly over a minimalist white chair. The setting is a bright, sunlit loft apartment with large windows. The fabric texture is clearly visible, suggesting high quality. The aesthetic is clean, modern, and very high-end fashion magazine editorial style.',
    size: 'L',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_C3O88YxS9Np2cXwbqD5HKDzm7pOSwK8ijH1-EWQtIjKzmOIkggGUyHYfnmBSG2StsLK0pUlJaXpHQTc5ND0Afe-mkVyTJUhPb7IwKkzWqapToho_TCInkSeKCJqVrma5mdPFSNMxtyPEaA85I4TAvR3bh6E6CGqB4Cj2Zwm3kvjQtVaWweL25UzrwiSvqWpR7hSDMUUzPWSoduHfJdtNTUmJM2ez9R0z--2VODyU1lIoHwrFYPjn',
    rating: 4.7,
    distance: '1.5 km',
    category: 'Casual'
  },

  // Streetwear Category
  {
    id: 'phantom-oversized-hoodie',
    name: 'Phantom Oversized Hoodie',
    price: 180,
    currency: '₹',
    brand: 'OFF-GRID STUDIO',
    description: 'A high-end editorial product shot of a minimalist black oversized hoodie featuring white embroidered typography on the chest. The fabric texture is premium heavyweight cotton. The lighting is studio-quality with soft shadows against a neutral light grey background, emphasizing the tactile quality of the garment in a modern luxury fashion style.',
    size: 'M',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzJKLTpqpK9R4YnmsicBdvOOimQnLGpNCnfS1dzG0iFELlwG0pWO6L9aymq5u3X6upX2Hjy4jlyREmE22iA6dqx49bg80nB38UVqdMowA-3jLQoChheS6WpVfwo9dK3QucA-CXeJP-RCm6yR3iufg9guoNqUWss_x0bDbxr1sO0f6H3izRjOJqVKi12dSJ-fwYr0aYWyVRVNIhjT0mOVQV5OavnrfZAAo_EIpFZroUY381CKRoNkqp',
    tag: 'LIMITED',
    category: 'Streetwear'
  },
  {
    id: 'alpha-cargo-20',
    name: 'Alpha Cargo 2.0',
    price: 215,
    currency: '₹',
    brand: 'TECHWEAR LAB',
    description: 'A detailed fashion shot of high-tech sage green cargo pants with multiple utility pockets and tactical straps. The material has a subtle technical sheen. The pants are styled with clean white sneakers in a bright, airy studio setting. The visual language is clean, modern, and high-contrast, following a contemporary streetwear aesthetic.',
    size: 'M',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTly3Idumv-6Mm7YLSv-x4GMJViaIl2O4OjIJ-2XPOxhj5Kb31ZRLwGj0Ttcfy8zll8jWbIj3A7ORsD2zLwvGaN9nI8Q-6tTrgk_fLExuHwDxIJ8HXKvojj6_2395AQ4h-0UJbMAggL_F5v9sdFFH4h0-GE3WmL14B05L-gzYXqeH5V2E7luZxwbjnBb4H6Ugfo8JHPN1wUVGG1vIVYgeN4vCe4L5AqgVtO0UVn1P4xunFntkOVRqw',
    category: 'Streetwear'
  },
  {
    id: 'velocity-low-top',
    name: 'Velocity Low-Top',
    price: 295,
    currency: '₹',
    brand: 'URBAN RUNNER',
    description: 'A close-up aesthetic shot of premium leather and suede chunky sneakers in a mix of cream, beige, and vibrant red accents. The sneakers are placed on a reflective white surface with soft studio lighting that creates a high-end commercial feel. The design is complex and layered, appealing to a Gen Z fashion-conscious audience.',
    size: '41',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7jjGu0sNLcT1oqrKU9sKk7dc6JCHvJHRdHnoVZB08AIcwgL6k1HJk8zQAwdnlNrFqaRI5w43omrtKrZYOf54s9oAPkkN4YTQj4cNIqlPFpWKSiFzsnSrioI15tMYX2FLnPs225UnafyQ2GXiHxNorium8N8X_dvngiip4x6L_fQrz95qirHSY9Bc0uzm5aTfJQVKLSzx5LZEm00gNMq9fcvM_4WFQvvY_2HBrs8XP6bs0Wd56XmGh',
    category: 'Streetwear'
  },
  {
    id: 'sustainability-graphic-tee',
    name: 'Sustainability Graphic Tee',
    price: 85,
    currency: '₹',
    brand: 'EARTH CORE',
    description: 'An editorial fashion shot of an oversized white t-shirt featuring a large, abstract graphic print in vibrant cherry red. The model\'s hands are visible, showing minimal silver jewelry. The lighting is bright and crisp, emphasizing the white space and high-contrast red graphic. The look is effortless, premium, and sustainable streetwear.',
    size: 'M',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBW8xtj7tlJq-fehhwdpNN91PpOtg-80ptWHrwJpwjh_h1-PBOiyqd4C50LHcYWZom4hQzNr2h5fpY67K2WrdJDK3YeXi-AO37AnK2-_zl5NUIZW_jwUkVZLXEw17FYAQKRHZ7C7a3ByxUZ3c3rM1KImGDHxlk6XQAi4gGDz9XG5-q6blBQa7gMO1NETkH9MYjmztFInV7YzVxThmTaw3Ro3PplJZl0qCm4W9-N2tFA5HBD9o6vRU_D',
    tag: 'ECO',
    category: 'Streetwear'
  },
  {
    id: 'utility-technical-vest',
    name: 'Utility Technical Vest',
    price: 145,
    currency: '₹',
    brand: 'TECHWEAR LAB',
    description: 'Product shot of a sleek black technical vest with numerous pockets and high-vis reflective detailing. Studio lighting highlights the different fabric textures.',
    size: 'L',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLbFwzSGYstK5K8k_DhyPuQGF4BdI9D-dvgB3WsbTfebJjsUYb6JH7-OjmZPKqqsqCBWsTzskioPIaFtjbBnQoOVjCQlz38ttOI5CmkMB5g4cLY1skOtaVvw7TKbZaGD_YU06a3J3LYUQLzpdWjV8iQWUZBuW6ZTFpgEfoB8ouJmCef3GiEg2pjOSyZ6eLfvK_XX2gGySPIULVk6uPZR7j7hGwYihMwBLTfv3ncxluWbRCLrTT1roG',
    category: 'Streetwear'
  },
  {
    id: 'crimson-speed-breaker',
    name: 'Crimson Speed Breaker',
    price: 210,
    currency: '₹',
    brand: 'OFF-GRID STUDIO',
    description: 'Vibrant red windbreaker jacket with white accents, styled in a dynamic outdoor urban setting with blurred movement in the background.',
    size: 'M',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeG8rT4Ah3-Rnm5t9qwxSYQzj-udh3wqBpSyaRFo4lq89r92FJ_zD-y7FCX5TQusl-96A64QiyNZDsP1vnVkicXjP9K9yVHOlMPuh5yQZT5uZhltK2SE3c2alSs3FhdV_73X1O1A0s8IuWl_qtnysDy-V1X_CcM9a2Wr9nxrgGKLR-rGsyGsvz-R_IJ8KDH32-DgxL2WLR9eByVZMlteD6RCC1H6PAhCAXOP2ZWickTlCspy5UkzOD',
    category: 'Streetwear'
  },

  // Search results for "Red Gala Dress"
  {
    id: 'valentino-silk-gown',
    name: 'Valentino Silk Gown',
    price: 120,
    currency: '₹',
    brand: 'Valentino',
    description: 'A stunning floor-length crimson gala dress with a dramatic slit, worn by a model in a luxury penthouse setting. The lighting is warm and ambient from floor-to-ceiling windows. The aesthetic is high-fashion and sophisticated, using a palette of deep reds and soft grays.',
    size: 'S, M',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_bDzhhexFIBzX4YVV8ZAB5joDn6D0VxEd9kxzAfmx_govKMhugcQ-iR4BdJKXuAgpxSwqmsDdRRy4XbkJfGUAJGl5iyhmK7ElHKguBFnI87z2ekxa4iAOEH95ZxwYwNPrAbhMj19fLGCAr2_AK_miKjsReLIxKEEn1ChRQldtlu55qAE-6mbPnLdwLotKKxTL0zXOPsCmPEGX1rykvG--Tzme-qIocqpG_jTRI4QZ9G2FKXVP4kfY',
    rating: 4.9,
    distance: '2.4 miles away',
    tag: 'AVAILABLE NOW',
    category: 'Party'
  },
  {
    id: 'alexander-mcqueen-satin',
    name: 'Alexander McQueen Satin',
    price: 185,
    currency: '₹',
    brand: 'Alexander McQueen',
    description: 'A modern red satin gala dress with structural ruffles and a minimalist silhouette. The image is captured in a minimalist concrete gallery with harsh sunlight creating sharp shadows. The vibe is Gen Z luxury, blending high fashion with industrial textures.',
    size: 'XS',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkz-2fcgYzoSx9RgQf2nmKGIQiF6CTXiiGg7nxZVj3V2G-xSCRtzRsbgyYmKhWVIo1Flovgp2eKHNfcEsuj0ci4zKK2eG4ESLewXgXLHa7hSKQQto8ommIO2ZC6E-hLStlYDIpAk2uErr2okF1C2DziktydNU7EGdQKyRu2cB-blrKbPzUE9rv-EqglJ9PLaHUuJcEBoiOXqLkNv3jSf3m_OGsiibF5DPZ0l9vRCylZ8VAKUo7YGgt',
    rating: 4.8,
    distance: '0.8 miles away',
    category: 'Party'
  },
  {
    id: 'velvet-mermaid-gown',
    name: 'Velvet Mermaid Gown',
    price: 95,
    currency: '₹',
    brand: 'Atelier Suede',
    description: 'An elegant ruby red backless evening dress made of velvet, showcased in a classical ballroom with opulent chandeliers. The lighting is soft and golden, creating a rich and tactile feel. The dress stands out against the neutral, sophisticated background of the luxury venue.',
    size: 'L',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDOsBh-3kQ24Wj8YCzCNMWDfrmDogc2h6_i-7HKDGqJJBhMVc9wRyEISMIbO_zCTz31W4D0csEef-j59wGi3-VqJ_aqsbHTaZPgB-_oJKSlcT-dzS1DFMdS_5JkFWNn_RGQbAeP_JTnxkKuwjf-GOKQ1oEhRPFXQCwlTznMIHJYYfLaUP9ZM1Lh726Yai26BpE63e85rETlDEnPZ_YyXjv65Fdz3yuFD5OJmPJwzOIOAizaPZ8z_8o',
    rating: 4.6,
    distance: '5.1 miles away',
    category: 'Party'
  },
  {
    id: 'organza-flare-dress',
    name: 'Organza Flare Dress',
    price: 140,
    currency: '₹',
    brand: 'Maison Velours',
    description: 'A striking contemporary red gala outfit featuring a structured bodice and sheer organza layers. The model is standing in a minimalist white studio with high-key lighting that emphasizes the architectural details of the garment. The mood is aspirational and digitally native.',
    size: 'S',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxYdNH7-JMlUpVX6qUKaV3PL0lHwOLt_D41RpWCWHMjUf2cneWrosb9pmRSla860RM50mvp3-uQX0dAR86N-yxKoAettsU6sRbKep2o8I79KqwzewzWavEkjBdsgrPkOgnVQtOudWU52b9rguhb8sIG4U3M40k40QQ_o5k7EbVQNZTJK3sELOmRBVbniyUHi-qmSyMPL7HB412F84BBIbdvC79ufXWqXZ0y1OUy_A3BThhnRMtwqn',
    rating: 4.5,
    distance: '1.2 miles away',
    category: 'Party'
  },

  // Product Details Prada Cleo Metallic Bag
  {
    id: 'prada-cleo-metallic',
    name: 'Cleo Metallic Bag',
    price: 25,
    currency: '₹',
    brand: 'Prada',
    description: 'The Prada Cleo bag with sophisticated allure reinterprets an iconic design of the brand from the 90s. Sleek curved lines emphasized by the particular construction rounded on the bottom and sides give this flap bag a soft, light look.',
    size: 'One Size',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATiB0opDuX66dz5G_xRHTrVR3fI7yHGsLlSWZtykk0Q3iulL3aoCIpT8tsLz0kbYCPc9QE-GuEjRoM-08DzqKb2p4pc-HnGB60O07vGNwEiQQxs0njFxkjU6rLC9Do-QLkPhxUnHLKHpsox24ZjV_xHSVo_7ARkEzqXtywxpr8uhZKcf9Xlx8GGaGsEwFHCo5A9LULPCEBeKaXB3kFvCWLVxADhvDU0seG8vLVlw8Zdac9p3T-fAKT',
    rating: 4.9,
    distance: 'Local pickup available',
    tag: 'Sustainable Choice',
    category: 'Accessories',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuATiB0opDuX66dz5G_xRHTrVR3fI7yHGsLlSWZtykk0Q3iulL3aoCIpT8tsLz0kbYCPc9QE-GuEjRoM-08DzqKb2p4pc-HnGB60O07vGNwEiQQxs0njFxkjU6rLC9Do-QLkPhxUnHLKHpsox24ZjV_xHSVo_7ARkEzqXtywxpr8uhZKcf9Xlx8GGaGsEwFHCo5A9LULPCEBeKaXB3kFvCWLVxADhvDU0seG8vLVlw8Zdac9p3T-fAKT',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCQx2a31TJcjEo96testfyMejxZr5BTJIUf5nOeA1jwYUzfeD7IJfaabiuAQ2CpRMT8G9n9NNYZ9trj-6CFVfwSYPsPFj1JGAYLyZnSewjySBbpklmqemHYd_jym9ZL3LRZXbqjkXHEcpbfjYra_BAEWu_vU1lfpLLlDAiLe-2jM5RLqi07W-ELT7u0J8InJ-3iZONXV2tz1anx3hQMxbGQRAaUex5uKcSMHTfbcq_eHkfwJV25VXSB'
    ],
    refundableDeposit: '$150',
    owner: {
      name: 'Sarah J.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrP4YLmVoPHlWngy73CiZXU-fZf7ngYPYJBMxS9mJf-p-poaxITabUBzk5RiVqzqHgvP963tCDUzaB2ZqZdkKVFa0HC0gWYZWQlbf__6O-IE0ZroNqmYEQ2750zCXfQ3pB0fiVqEnrqksCr9KqP300sC9ncEMGyYSfk1lDoneKp4jEr7dskWah7xS4cVXeFzbHx3xwvxGVm1hUOCkEI68yVCXIXuEZPTF4nucPnZIkyA3tZOnPIdCB',
      role: 'Verified Student • Delhi University'
    }
  },

  // Wishlist Items
  {
    id: 'cherry-red-velvet-blazer',
    name: 'Cherry Red Velvet Blazer',
    price: 120,
    currency: '₹',
    brand: 'Maison Velours',
    description: 'A high-fashion editorial portrait of a model wearing a luxurious cherry red velvet blazer. The lighting is soft and directional, emphasizing the rich texture of the fabric. The background is a clean, minimalist studio setting in off-white, reflecting a premium light-mode aesthetic. The composition is clean and centered, focusing on the craftsmanship of the luxury garment.',
    size: 'M (IT 48)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiG9uiwGGmdEGZaye74f-_9cSDmnFYoH0a8piiOv17XhMXimKxpDLVYvUaLhcWQs39YZ60c_ChybiaTC9MFPbjeCaEDg-p6Fah5DXbfhKdCyJuhn3n00shujePtYytzjYfdu_UnQOGQwbUGR6n-Vwt5jLw1y1giWCcACM_TUVpy7_D4mhvhCa21zWkf2Q4SL8oM0j7BSnEDzeKBhoPjjl__Iku23h-npmNTrJTkjymdvdDHDe2T3XT',
    tag: 'New In',
    category: 'Formal'
  },
  {
    id: 'gilded-hardware-tote',
    name: 'Gilded Hardware Tote',
    price: 85,
    currency: '₹',
    brand: 'Atelier Suede',
    description: 'Close-up shot of a sophisticated leather designer handbag in deep oxblood color. The bag features high-gloss gold hardware that catches a bright, crisp studio light. The aesthetic is ultra-modern luxury, with the item sitting on a reflective glass surface against a neutral grey background. The image evokes a sense of high-end quality and artisanal detail.',
    color: 'Oxblood',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK60B6OBt1YcfsXkgFzHa12BGeQRDyRzTHgzPZbCZwZm27FfzfTPwy122-5bCcY01_qv1ewLUh5lol0wDpmdqza03cbXizIK7eURIOkN5awf1EsCoad4vu6GNVioNXZ_ez4OAPUTo3ZXJwMnoyMdJ_7QRe6MoflGiTQArkjf2TJFP_8g244JweQj4P9-Hv8xLA2vT-XV6CUTNrZmy3Bqv9ra8UaN5WG_s49ZPYp6IoZ-cFNYF3RLy0',
    tag: 'Sustainable',
    category: 'Accessories'
  },
  {
    id: 'fluid-drape-silk-trousers',
    name: 'Fluid Drape Silk Trousers',
    price: 55,
    currency: '₹',
    brand: 'Lusso Silk',
    description: 'A minimalist architectural fashion shot of premium silk trousers in a cream palette. The trousers are displayed flowing in a gentle breeze, highlighting the liquid-like drape of the high-end fabric. The setting is a bright, airy sunlit room with sharp geometric shadows, aligning with a sophisticated Gen Z \'New Luxury\' design philosophy.',
    size: 'S',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFy3WPfEnles8VdyUKm-sEd3shLTSyYYWKY6gl74CKp6z6IR9Ur0pfRQRScvDjg_ifuul85tPLohufww7QCN0W9delxaqhHUuHj28bRALBW_4lqsL4cxeUedHJD0aX5S7ZaqGD5l9RCRrlZG9aY94tW7tDaZ4nYWLZ5iI4lpTJlU4nmsN6UA5lKqRqRIc_cSSyMRxs3zg9gD_PCPa2ipGlzEOZV0H7NJ_s9icisE4CzNzdcE09tSx1',
    category: 'Casual'
  }
];

export const products: Product[] = RAW_PRODUCTS.map(p => {
    const val = estimateOriginalValue(p.price, p.category);
    const dep = calculateSecurityDeposit(p.price, p.category, val);
    return {
        ...p,
        estimatedOriginalValue: val,
        securityDeposit: dep,
        isHighValue: val > 10000,
        refundableDeposit: `₹${dep.toLocaleString('en-IN')}`
    };
});

export const categories = [
  'Party',
  'Casual',
  'Streetwear',
  'Date Night',
  'Formal',
  'Accessories'
];

export const brands = [
  'ZARA',
  'H&M',
  'NIKE',
  'PRADA',
  'GUCCI',
  'Valentino',
  'Alexander McQueen'
];
import { Outfit, Order } from './types';

export const OUTFITS: Outfit[] = [
  {
    id: 'prada-cleo',
    name: 'Prada Cleo Metallic Bag',
    brand: 'Prada',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQCVw0TEkeVQnz8POX7KkL_vPaGAqiEMlsxOikhG4Szr16MqwjAdx-UZGk9s5OJ8EC0B9W7C9kv7F0wrMSUHFbQxXVknT1CV1gNfK_ZV6bLrKYizDyrfjngjaWq4sqvR7XvPEWtt-iirRFIUVcnA2lezDzvQXSpAU1PQG79g9qVefpL-sv-JqnE1OQ0v_He91Yfny-qKuUJnsvQDRT_cFgFxifatfCxA2mLPy64IZErLJLQB0980ac',
    pricePerDay: 25,
    sellerName: 'Sarah J.',
    sellerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    sellerRating: 4.9,
    securityDeposit: 150,
    rules: [
      'Handle with clean hands',
      'Store in dust bag provided',
      'No exposure to strong perfumes'
    ],
    description: 'The Prada Cleo bag with sophisticated allure reinterprets an iconic design of the brand from the nineties. Sleek, curved lines emphasized by the peculiar construction sloped on the bottom and sides give this flap bag a soft, light look.'
  },
  {
    id: 'ysl-gown',
    name: 'Saint Laurent Silk Gown',
    brand: 'Saint Laurent',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPyb3IFLFTi35lPepdEITFmDAm00kOEFrifWIqOymlZMvvn7VjPCgPeybBZFTvsxNe01aqnrRUB-fNZFWdArwtloFEAmN-EhX37fvjNJ89zC8FdaC0CFYGgFuCWtN_iuDh3qdGT3VFIfNm7C7KlPDsdsciC0uHk-evyeHRS2lYkbRq3KhB4545GXJNLfhtw7-sBKxc28lVqMRaAoAuo-06IyDI5tZjVAgdg-9kdenNZo-xcF-oI3MJ',
    pricePerDay: 85,
    sellerName: 'Marcus K.',
    sellerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    sellerRating: 4.8,
    securityDeposit: 250,
    rules: [
      'Dry clean only',
      'Do not alter the hem',
      'No direct contact with body oils'
    ],
    description: 'Stunning floor-length Saint Laurent black silk gown with a deep V-neck and open back. Elegant, ultra-chic silhouette perfect for galas and premium red carpet events.'
  }
];

export const SAVED_ADDRESSES = [
  'Vivekananda Global University, Admin Block Lawn',
  '88 Soho Grand Boulevard, Suite 4B, New York, NY 10013',
  '120 Greene St, SoHo, New York, NY 10012'
];

export const PROMO_CODES: Record<string, { type: 'percent' | 'flat' | 'free_shipping'; value: number }> = {
  'ZIGSY20': { type: 'percent', value: 20 },
  'VIPDEAL': { type: 'flat', value: 30 },
  'FREEDEL': { type: 'free_shipping', value: 10 }
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ZGS-88219',
    outfit: OUTFITS[0],
    startDate: '2026-06-04',
    endDate: '2026-06-07',
    rentalDays: 4,
    status: 'upcoming',
    amount: 250, // 4 * 25 + 150 = 250 (free delivery)
    securityDeposit: 150,
    deliveryOption: 'pickup',
    address: 'Vivekananda Global University, Admin Block Lawn',
    paymentMethod: 'upi',
    trackingTimeline: [
      { key: 'confirmed', label: 'Booking Confirmed', date: 'Jun 28, 2026', description: 'Your rental booking has been verified and confirmed by Sarah J.', completed: true, active: true },
      { key: 'preparing', label: 'Preparing Outfit', description: 'Seller is dry cleaning and packaging the outfit.', completed: false, active: false },
      { key: 'ready_pickup', label: 'Ready for Pickup', description: 'Outfit is ready to be picked up by delivery partner.', completed: false, active: false },
      { key: 'picked_up', label: 'Picked Up', description: 'Delivery courier has received the outfit.', completed: false, active: false },
      { key: 'active', label: 'Rental Active', description: 'Outfit is in your possession. Have a fabulous time!', completed: false, active: false },
      { key: 'return_reminder', label: 'Return Reminder', description: 'Reminder to pack and prepare outfit for return courier.', completed: false, active: false },
      { key: 'returned', label: 'Returned Successfully', description: 'Outfit has been returned to the seller.', completed: false, active: false },
      { key: 'refunded', label: 'Security Deposit Refunded', description: 'Refund has been processed back to your original payment method.', completed: false, active: false }
    ]
  },
  {
    id: 'ZGS-72412',
    outfit: OUTFITS[1],
    startDate: '2026-05-16',
    endDate: '2026-05-20',
    rentalDays: 5,
    status: 'completed',
    amount: 675, // 5 * 85 + 250 = 675 (free delivery)
    securityDeposit: 250,
    deliveryOption: 'pickup',
    address: 'Vivekananda Global University, Admin Block Lawn',
    paymentMethod: 'card',
    trackingTimeline: [
      { key: 'confirmed', label: 'Booking Confirmed', date: 'May 14, 2026', description: 'Your booking is confirmed.', completed: true, active: false },
      { key: 'preparing', label: 'Preparing Outfit', date: 'May 15, 2026', description: 'Outfit prepared.', completed: true, active: false },
      { key: 'ready_pickup', label: 'Ready for Pickup', date: 'May 15, 2026', description: 'Ready.', completed: true, active: false },
      { key: 'picked_up', label: 'Picked Up', date: 'May 16, 2026', description: 'Picked up.', completed: true, active: false },
      { key: 'active', label: 'Rental Active', date: 'May 16, 2026', description: 'Active.', completed: true, active: false },
      { key: 'return_reminder', label: 'Return Reminder', date: 'May 19, 2026', description: 'Reminder sent.', completed: true, active: false },
      { key: 'returned', label: 'Returned Successfully', date: 'May 20, 2026', description: 'Returned.', completed: true, active: false },
      { key: 'refunded', label: 'Security Deposit Refunded', date: 'May 21, 2026', description: 'Fully refunded.', completed: true, active: true }
    ]
  }
];
