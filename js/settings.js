/* =====================================================================
   KARTECH SETTINGS — this is the only part you need to edit
   ===================================================================== */

/* 1. CONTACT DETAILS */
const KARTECH = {
  whatsapp: '',                      // WhatsApp number with country code, no + or spaces. e.g. '254712345678'
                                     // Leave empty while testing: WhatsApp opens and the customer picks the chat.
  phoneDisplay: '[+254 7XX XXX XXX]', // How the number is shown in the footer
  email: '',                         // e.g. 'orders@kartech.co.ke'  (leave empty to hide the "send by email" options)
  formEndpoint: '',                  // Optional, for later: a form-service URL (e.g. Formspree) so custom requests
                                     // and their photos arrive by email automatically. Empty = send via WhatsApp.
  currency: 'KSh',

  /* SUPABASE (the database) — from Supabase → Project Settings → API.
     Leave both empty and the site still works, sending everything through WhatsApp instead. */
  supabaseUrl: '',                   // e.g. 'https://abcdefghijk.supabase.co'
  supabaseKey: ''                    // the "anon public" / "publishable" key (safe to put on a website)
};

/* 2. PRODUCTS — one block per piece.
   • name      → shown everywhere the product appears
   • price     → a number, e.g. 18500  (shows "KSh 18,500"). Use null for "Price on request".
   • images    → your photo files, e.g. ['photos/waiting-bench-3-1.jpg', 'photos/waiting-bench-3-2.jpg']
                 The first image is the main one. Up to 3 are shown on the product page.
   • tags      → which shop tabs it appears under: Furniture, Waiting seats, Catering equipment, Outdoor
   • space     → the small label under the name
   Anything in [brackets] is a placeholder: confirm it with Kartech before launch.
   To add a new product, copy one whole block { ... }, paste it below, and give it a new id. */
const PRODUCTS = [
  {
    id: 'dining-set',
    name: 'Restaurant Dining Set',
    price: null,
    images: [],
    tags: ['Furniture'],
    space: 'Restaurants',
    material: 'Steel frame · [top material — to confirm]',
    finishes: [
      { name: 'Black', color: '#2b2820' },
      { name: 'Grey', color: '#8B8D89' },
      { name: 'White', color: '#EDEBE6' },
      { name: 'Green', color: '#3F5A3D' }
    ],
    availability: '',
    about: 'A table with matching chairs for restaurants and cafés. Ordered in the quantity your space needs. [Real description — to confirm]',
    dimensions: '[Table and chair sizes — to confirm]',
    materials: '[Frame, top and seat details — to confirm]',
    care: '[Care instructions — to confirm with Kartech]',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'bar-stool',
    name: 'Bar Stool',
    price: null,
    images: [],
    tags: ['Furniture'],
    space: 'Bars & cafés',
    material: 'Steel frame · [seat — to confirm]',
    finishes: [
      { name: 'Black', color: '#2b2820' },
      { name: 'Grey', color: '#8B8D89' },
      { name: 'White', color: '#EDEBE6' },
      { name: 'Green', color: '#3F5A3D' }
    ],
    availability: '',
    about: 'A high stool for bar counters and high tables. [Real description — to confirm]',
    dimensions: '[Seat height — to confirm]',
    materials: '[Frame and seat details — to confirm]',
    care: '[Care instructions — to confirm with Kartech]',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'high-table-set',
    name: 'High Table Set',
    price: null,
    images: [],
    tags: ['Furniture'],
    space: 'Bars & cafés',
    material: 'Steel frame · [top — to confirm]',
    finishes: [
      { name: 'Black', color: '#2b2820' },
      { name: 'Grey', color: '#8B8D89' },
      { name: 'White', color: '#EDEBE6' },
      { name: 'Green', color: '#3F5A3D' }
    ],
    availability: '',
    about: 'A high table with matching bar stools. [Real description — to confirm]',
    dimensions: '[Table height and top size — to confirm]',
    materials: '[Frame and top details — to confirm]',
    care: '[Care instructions — to confirm with Kartech]',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'church-chair',
    name: 'Church Chair',
    price: null,
    images: [],
    tags: ['Furniture'],
    space: 'Churches & halls',
    material: 'Steel frame · padded seat',
    finishes: [
      { name: 'Black', color: '#2b2820' },
      { name: 'Grey', color: '#8B8D89' },
      { name: 'Blue', color: '#2F4A7A' },
      { name: 'Red', color: '#8E2A22' }
    ],
    availability: '',
    about: 'Seating for churches, halls and events, made in large quantities. [Real description — to confirm]',
    dimensions: '[Seat size — to confirm]',
    materials: '[Frame, foam and fabric — to confirm]',
    care: '[Care instructions — to confirm with Kartech]',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'school-desk',
    name: 'School Desk and Chair',
    price: null,
    images: [],
    tags: ['Furniture'],
    space: 'Schools',
    material: 'Steel frame · [top — to confirm]',
    finishes: [
      { name: 'Black', color: '#2b2820' },
      { name: 'Grey', color: '#8B8D89' },
      { name: 'White', color: '#EDEBE6' },
      { name: 'Green', color: '#3F5A3D' }
    ],
    availability: '',
    about: 'Strong desks and chairs for classrooms. [Real description — to confirm]',
    dimensions: '[Sizes by age — to confirm]',
    materials: '[Frame and top details — to confirm]',
    care: '[Care instructions — to confirm with Kartech]',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'outdoor-lounge-set',
    name: 'Outdoor Lounge Set',
    price: null,
    images: [],
    tags: ['Furniture','Outdoor'],
    space: 'Outdoor',
    material: 'Steel frame · outdoor cushions',
    finishes: [
      { name: 'Black', color: '#2b2820' },
      { name: 'Grey', color: '#8B8D89' },
      { name: 'White', color: '#EDEBE6' },
      { name: 'Green', color: '#3F5A3D' }
    ],
    availability: '',
    about: 'Sofas and a table for terraces, gardens and hotels. [Real description — to confirm]',
    dimensions: '[Sizes — to confirm]',
    materials: '[Frame and cushion details — to confirm]',
    care: '[Care instructions — to confirm with Kartech]',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'waiting-bench-3',
    name: '3-Seater Waiting Bench',
    price: null,
    images: [],
    tags: ['Waiting seats'],
    space: 'Hospitals, banks & offices',
    material: 'Steel beam · [seat type — to confirm]',
    finishes: [
      { name: 'Black', color: '#2b2820' },
      { name: 'Grey', color: '#8B8D89' },
      { name: 'Blue', color: '#2F4A7A' },
      { name: 'Red', color: '#8E2A22' }
    ],
    availability: '',
    about: 'Linked metal seating for reception and waiting areas. [Real description — to confirm]',
    dimensions: '[Length and seat height — to confirm]',
    materials: '[Beam, legs and seats — to confirm]',
    care: '[Care instructions — to confirm with Kartech]',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'waiting-bench-4',
    name: '4-Seater Waiting Bench',
    price: null,
    images: [],
    tags: ['Waiting seats'],
    space: 'Hospitals, banks & offices',
    material: 'Steel beam · [seat type — to confirm]',
    finishes: [
      { name: 'Black', color: '#2b2820' },
      { name: 'Grey', color: '#8B8D89' },
      { name: 'Blue', color: '#2F4A7A' },
      { name: 'Red', color: '#8E2A22' }
    ],
    availability: '',
    about: 'Linked metal seating for reception and waiting areas. [Real description — to confirm]',
    dimensions: '[Length and seat height — to confirm]',
    materials: '[Beam, legs and seats — to confirm]',
    care: '[Care instructions — to confirm with Kartech]',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'waiting-bench-5',
    name: '5-Seater Waiting Bench',
    price: null,
    images: [],
    tags: ['Waiting seats'],
    space: 'Hospitals, banks & offices',
    material: 'Steel beam · [seat type — to confirm]',
    finishes: [
      { name: 'Black', color: '#2b2820' },
      { name: 'Grey', color: '#8B8D89' },
      { name: 'Blue', color: '#2F4A7A' },
      { name: 'Red', color: '#8E2A22' }
    ],
    availability: '',
    about: 'Linked metal seating for larger waiting halls. [Real description — to confirm]',
    dimensions: '[Length and seat height — to confirm]',
    materials: '[Beam, legs and seats — to confirm]',
    care: '[Care instructions — to confirm with Kartech]',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'gas-cooker-2',
    name: 'Two-Burner Gas Cooker',
    price: null,
    images: [],
    tags: ['Catering equipment'],
    space: 'Commercial kitchens',
    material: 'Stainless steel',
    finishes: [
      { name: 'Stainless steel', color: '#C9CBC8' }
    ],
    availability: '',
    about: 'A high-pressure gas cooker for restaurant, hotel and school kitchens. [Real description — to confirm]',
    dimensions: '[Width × depth × height — to confirm]',
    materials: '[Steel grade and burner type — to confirm]',
    care: '[Care instructions — to confirm with Kartech]',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'gas-cooker-3',
    name: 'Three-Burner Gas Cooker',
    price: null,
    images: [],
    tags: ['Catering equipment'],
    space: 'Commercial kitchens',
    material: 'Stainless steel',
    finishes: [
      { name: 'Stainless steel', color: '#C9CBC8' }
    ],
    availability: '',
    about: 'A larger high-pressure gas cooker for busy kitchens. [Real description — to confirm]',
    dimensions: '[Width × depth × height — to confirm]',
    materials: '[Steel grade and burner type — to confirm]',
    care: '[Care instructions — to confirm with Kartech]',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'cooker-griddle',
    name: 'Gas Cooker with Griddle',
    price: null,
    images: [],
    tags: ['Catering equipment'],
    space: 'Commercial kitchens',
    material: 'Stainless steel',
    finishes: [
      { name: 'Stainless steel', color: '#C9CBC8' }
    ],
    availability: '',
    about: 'Burners and a flat griddle in one unit. [Real description — to confirm]',
    dimensions: '[Width × depth × height — to confirm]',
    materials: '[Steel grade and burner type — to confirm]',
    care: '[Care instructions — to confirm with Kartech]',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'stockpot-burner',
    name: 'Single Stock Pot Burner',
    price: null,
    images: [],
    tags: ['Catering equipment'],
    space: 'Commercial kitchens',
    material: 'Stainless steel',
    finishes: [
      { name: 'Stainless steel', color: '#C9CBC8' }
    ],
    availability: '',
    about: 'A low, heavy burner for large cooking pots. [Real description — to confirm]',
    dimensions: '[Width × depth × height — to confirm]',
    materials: '[Steel grade and burner type — to confirm]',
    care: '[Care instructions — to confirm with Kartech]',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  }
];

/* 3. ORDER STATUS — update this when an order moves forward.
   Copy the order number from the WhatsApp message and pick one stage:
   'received'  'confirmed'  'workshop'  'ready'  'delivered'          */
const ORDER_STATUS = {
  // 'KT-260923-AB12': 'workshop',
};
