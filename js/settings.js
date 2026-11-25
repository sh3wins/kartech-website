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
    supabaseUrl: 'https://zwnaufwunzaqchgxyrfv.supabase.co',
  supabaseKey: 'sb_publishable_-m1Qm057XAkFk9IX21wN7Q_de7zzP2C'
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
  /* ---- Pieces photographed in the workshop (Nov 2026). Prices to add. ---- */
  {
    id: 'tube-arm-chair-brown',
    name: 'Tube-Arm Dining Chair',
    price: null,
    images: ['photos/tube-arm-chair-brown.jpg'],
    tags: ['Furniture'],
    space: 'Restaurants & cafés',
    material: 'Bent steel tube frame · brown leatherette',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Bent steel tube frame · brown leatherette.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'visitor-armchair-blue',
    name: 'Padded Visitor Armchair',
    price: null,
    images: ['photos/visitor-armchair-blue.jpg'],
    tags: ['Waiting seats'],
    space: 'Offices & waiting areas',
    material: 'Steel frame · blue fabric',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Steel frame · blue fabric.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'cross-back-cafe-chair',
    name: 'Cross-Back Café Chair',
    price: null,
    images: ['photos/cross-back-cafe-chair.jpg'],
    tags: ['Furniture'],
    space: 'Restaurants & cafés',
    material: 'Bronze-finish steel · padded round seat',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Bronze-finish steel · padded round seat.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'studded-dining-chair-tan',
    name: 'Studded-Frame Dining Chair',
    price: null,
    images: ['photos/studded-dining-chair-tan.jpg'],
    tags: ['Furniture'],
    space: 'Restaurants & hotels',
    material: 'Hammered-finish steel · tan leatherette',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Hammered-finish steel · tan leatherette.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'two-tone-high-back-chair',
    name: 'Two-Tone High-Back Chair',
    price: null,
    images: ['photos/two-tone-high-back-chair.jpg'],
    tags: ['Furniture'],
    space: 'Restaurants & bars',
    material: 'Steel frame · two-colour leatherette',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Steel frame · two-colour leatherette.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'round-back-cafe-chair',
    name: 'Round-Back Café Chair',
    price: null,
    images: ['photos/round-back-cafe-chair.jpg'],
    tags: ['Furniture'],
    space: 'Restaurants & cafés',
    material: 'Bronze-finish steel · brown leatherette',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Bronze-finish steel · brown leatherette.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'rope-bar-chair-zebra',
    name: 'Rope-Back Bar Chair, Zebra Seat',
    price: null,
    images: ['photos/rope-bar-chair-zebra.jpg'],
    tags: ['Furniture'],
    space: 'Bars & lounges',
    material: 'Steel frame · woven rope · zebra-print seat',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Steel frame · woven rope · zebra-print seat.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'rope-lounge-zebra-cushions',
    name: 'Rope Lounge Chair with Zebra Cushions',
    price: null,
    images: ['photos/rope-lounge-zebra-cushions.jpg'],
    tags: ['Outdoor'],
    space: 'Lounges & terraces',
    material: 'Steel frame · woven rope · zebra-print cushions',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Steel frame · woven rope · zebra-print cushions.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'rope-back-bar-stool',
    name: 'Rope-Back Bar Stool',
    price: null,
    images: ['photos/rope-back-bar-stool.jpg'],
    tags: ['Furniture'],
    space: 'Bars & cafés',
    material: 'Hammered-finish steel · rope back · leatherette seat',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Hammered-finish steel · rope back · leatherette seat.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'red-bar-stool',
    name: 'Round-Seat Bar Stool, Red',
    price: null,
    images: ['photos/red-bar-stool.jpg'],
    tags: ['Furniture'],
    space: 'Bars & cafés',
    material: 'Hammered-finish steel · red leatherette',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Hammered-finish steel · red leatherette.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'classic-dining-chair-cream',
    name: 'Classic Dining Chair, Cream',
    price: null,
    images: ['photos/classic-dining-chair-cream.jpg'],
    tags: ['Furniture'],
    space: 'Restaurants & hotels',
    material: 'Hammered-finish steel · cream leatherette',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Hammered-finish steel · cream leatherette.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'padded-dining-chair-black',
    name: 'Padded Dining Chair, Black',
    price: null,
    images: ['photos/padded-dining-chair-black.jpg'],
    tags: ['Furniture'],
    space: 'Restaurants & cafés',
    material: 'Silver-finish steel · black leatherette',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Silver-finish steel · black leatherette.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'laser-cut-armchair',
    name: 'Laser-Cut Back Armchair',
    price: null,
    images: ['photos/laser-cut-armchair.jpg'],
    tags: ['Furniture'],
    space: 'Restaurants & terraces',
    material: 'Cut-steel back · padded seat',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Cut-steel back · padded seat.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'rope-lounge-armchair-beige',
    name: 'Rope Lounge Armchair, Beige',
    price: null,
    images: ['photos/rope-lounge-armchair-beige.jpg'],
    tags: ['Outdoor'],
    space: 'Lounges & terraces',
    material: 'Steel frame · woven rope · beige cushions',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Steel frame · woven rope · beige cushions.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'curved-arm-chair-tan',
    name: 'Curved-Arm Lounge Chair, Tan',
    price: null,
    images: ['photos/curved-arm-chair-tan.jpg'],
    tags: ['Furniture'],
    space: 'Lounges & offices',
    material: 'Steel frame · tan leatherette',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Steel frame · tan leatherette.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'striped-high-back-chair',
    name: 'Striped High-Back Chair',
    price: null,
    images: ['photos/striped-high-back-chair.jpg'],
    tags: ['Furniture'],
    space: 'Restaurants & bars',
    material: 'Steel frame · red and white leatherette',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Steel frame · red and white leatherette.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'branded-church-chair',
    name: 'Church Chair with Printed Logo',
    price: null,
    images: ['photos/branded-church-chair.jpg', 'photos/branded-church-chair-2.jpg'],
    tags: ['Waiting seats'],
    space: 'Churches & halls',
    material: 'Steel frame · fabric · your logo printed on the back',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Steel frame · fabric · your logo printed on the back.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'grey-dining-chair',
    name: 'Grey Dining Chair',
    price: null,
    images: ['photos/grey-dining-chair.jpg'],
    tags: ['Furniture'],
    space: 'Restaurants & canteens',
    material: 'Steel frame · grey leatherette',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Steel frame · grey leatherette.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'high-back-bar-chair-rust',
    name: 'High-Back Bar Chair, Rust',
    price: null,
    images: ['photos/high-back-bar-chair-rust.jpg'],
    tags: ['Furniture'],
    space: 'Bars & lounges',
    material: 'Steel frame · rust leatherette',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Steel frame · rust leatherette.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'banquet-chair-gold',
    name: 'Banquet Chair, Gold Frame',
    price: null,
    images: ['photos/banquet-chair-gold.jpg'],
    tags: ['Furniture'],
    space: 'Weddings, events & halls',
    material: 'Gold-finish steel · patterned fabric',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Gold-finish steel · patterned fabric.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'rope-armchair-brown',
    name: 'Rope Armchair, Brown Seat',
    price: null,
    images: ['photos/rope-armchair-brown.jpg'],
    tags: ['Outdoor'],
    space: 'Restaurants & terraces',
    material: 'Hammered-finish steel · woven rope · brown leatherette',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Hammered-finish steel · woven rope · brown leatherette.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  {
    id: 'oval-back-cafe-chair-cream',
    name: 'Oval-Back Café Chair, Cream',
    price: null,
    images: ['photos/oval-back-cafe-chair-cream.jpg'],
    tags: ['Furniture'],
    space: 'Restaurants & cafés',
    material: 'Bronze-finish steel · cream leatherette',
    finishes: [],
    availability: 'In stock',
    about: 'Made in the Kartech workshop. Ask us about colours, quantities and custom sizes.',
    dimensions: 'Ask us for the exact sizes.',
    materials: 'Bronze-finish steel · cream leatherette.',
    care: 'Wipe with a damp cloth. Avoid harsh chemicals on the seat.',
    delivery: 'Delivery across Kenya. Cost and timing confirmed with your order.'
  },
  /* ---- Earlier catalogue (no photos yet) ---- */
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
