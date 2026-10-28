import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { MongoClient, Db } from 'mongodb';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Agent {
  name: string;
  phone: string;
  email: string;
  avatar: string;
  brokerage: string;
  rating: number;
  salesCount: number;
}

export interface PropertyDocument {
  _id: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  status: 'For Sale' | 'Under Contract' | 'Sold' | 'For Rent';
  listingType: 'sale' | 'rent';
  propertyType:
    | 'Portuguese Heritage Villa'
    | 'Luxury Sky Penthouse'
    | 'Diplomatic Bungalow'
    | 'Coastal Pavilion'
    | 'Backwater Nalukettu'
    | 'Architectural Residence'
    | 'Restored Heritage Haveli'
    | string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize: string;
  yearBuilt: number;
  garage: number;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: Coordinates;
  pricePerSqft: number;
  hoaFee: number;
  propertyTaxAnnual: number;
  description: string;
  highlights: string[];
  amenities: string[];
  features: {
    ceilingHeight: string;
    cooling: string;
    heating: string;
    flooring: string;
    views: string;
    parking: string;
  };
  images: string[];
  featured: boolean;
  agent: Agent;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryDocument {
  _id: string;
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  inquiryType: 'general' | 'schedule_tour' | 'make_offer' | 'request_brochure';
  offerAmount?: number;
  tourDate?: string;
  tourTime?: string;
  tourMode?: 'in_person' | 'video_walkthrough';
  message: string;
  status: 'pending' | 'contacted' | 'scheduled' | 'closed';
  createdAt: string;
}

export interface TourDocument {
  _id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  propertyImage: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  tourType: 'In-Person Private Showing' | 'Live Video Walkthrough';
  notes?: string;
  status: 'confirmed' | 'rescheduled' | 'cancelled';
  createdAt: string;
}

export function generateObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = crypto.randomBytes(8).toString('hex').slice(0, 16);
  return `${timestamp}${random}`;
}

const INITIAL_PROPERTIES: PropertyDocument[] = [
  {
    _id: "65e4a19f3a921d0012f10001",
    title: "The Malabar Hill Arabian Sea Sky Villa",
    slug: "malabar-hill-arabian-sea-sky-villa",
    price: 485000000,
    currency: "INR",
    status: "For Sale",
    listingType: "sale",
    propertyType: "Luxury Sky Penthouse",
    bedrooms: 5,
    bathrooms: 6,
    sqft: 7200,
    lotSize: "Tower Penthouse",
    yearBuilt: 2024,
    garage: 4,
    address: "68 Walkeshwar Road, Malabar Hill",
    neighborhood: "Malabar Hill",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400006",
    coordinates: { lat: 18.9553, lng: 72.7985 },
    pricePerSqft: 67361,
    hoaFee: 85000,
    propertyTaxAnnual: 950000,
    description: "Perched high above the prestigious ridges of Malabar Hill, this duplex sky villa commands panoramic 270-degree vistas across the Arabian Sea, Queen's Necklace, and the Marine Drive crescent. Features a private plunge pool on the cantilevered deck, Italian Statuario marble, and private high-speed elevator opening directly into the formal foyer.",
    highlights: [
      "Panoramic unobstructed Arabian Sea & Marine Drive Queen's Necklace views",
      "Private sky deck with temperature-controlled plunge pool",
      "Bespoke Valcucine Italian kitchen with Sub-Zero and Miele appliances",
      "4 dedicated automated basement podium car parking slots"
    ],
    amenities: [
      "Private Plunge Pool",
      "Arabian Sea Views",
      "Private High-Speed Elevator",
      "Wine Cellar",
      "Smart Home Automation",
      "Private Spa & Sauna",
      "24/7 White-Glove Concierge",
      "EV Fast Charger"
    ],
    features: {
      ceilingHeight: "14 ft clear volume",
      cooling: "Daikin VRV IV multi-zone central air conditioning",
      heating: "Integrated climate control",
      flooring: "Bookmatched Italian Statuario marble & Burma teak",
      views: "Arabian Sea, Marine Drive Queen's Necklace & City Skyline",
      parking: "4 reserved basement automated stack parking bays"
    },
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: true,
    agent: {
      name: "Aditya Singhania",
      phone: "+91 98200 14820",
      email: "a.singhania@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Mumbai Prime Advisory",
      rating: 4.99,
      salesCount: 38
    },
    createdAt: "2026-08-15T10:00:00.000Z",
    updatedAt: "2026-10-20T14:30:00.000Z"
  },
  {
    _id: "65e4a19f3a921d0012f10002",
    title: "Assagao Portuguese Heritage Villa & Courtyard Pool",
    slug: "assagao-portuguese-heritage-villa",
    price: 185000000,
    currency: "INR",
    status: "For Sale",
    listingType: "sale",
    propertyType: "Portuguese Heritage Villa",
    bedrooms: 5,
    bathrooms: 5.5,
    sqft: 5800,
    lotSize: "0.85 acres",
    yearBuilt: 2023,
    garage: 3,
    address: "Badem Village Road, Assagao",
    neighborhood: "Assagao",
    city: "Goa",
    state: "Goa",
    zipCode: "403507",
    coordinates: { lat: 15.5898, lng: 73.7732 },
    pricePerSqft: 31896,
    hoaFee: 25000,
    propertyTaxAnnual: 320000,
    description: "An evocative fusion of 18th-century Portuguese colonial architecture and contemporary minimalist tropical design. Set within the fashionable artisan enclave of Assagao, featuring soaring pitched timber roofs with Mangalore tiles, a deep traditional balcão porch, courtyard basalt swimming pool, and heritage well surrounded by ancient banyan and frangipani trees.",
    highlights: [
      "Restored Portuguese-Goan architectural facade with handcrafted oyster shell windows",
      "50ft central turquoise pool flanked by restored laterite colonnades",
      "Expansive wrap-around veranda (balcão) for quintessential susegad living",
      "Independent 1-bedroom artist studio / guest cottage"
    ],
    amenities: [
      "Courtyard Swimming Pool",
      "Heritage Balcão Veranda",
      "Independent Guest Cottage",
      "Landscaped Tropical Gardens",
      "Solar Power & Power Backup",
      "Wine Cellar",
      "Private Well with Filtration",
      "Gated Compound"
    ],
    features: {
      ceilingHeight: "16 - 20 ft pitched exposed timber rafters",
      cooling: "Concealed multi-split inverter AC + ceiling fans",
      heating: "Solar water heating system",
      flooring: "Handcrafted Bharat Floorings encaustic tiles & Jaisalmer yellow stone",
      views: "Lush Assagao forest canopy and manicured gardens",
      parking: "Covered carport for 3 large vehicles + paved motor court"
    },
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: true,
    agent: {
      name: "Tara D'Souza",
      phone: "+91 98230 45210",
      email: "t.dsouza@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Goa Coastal & Heritage",
      rating: 4.98,
      salesCount: 44
    },
    createdAt: "2026-09-02T12:00:00.000Z",
    updatedAt: "2026-10-22T09:15:00.000Z"
  },
  {
    _id: "65e4a19f3a921d0012f10003",
    title: "Amrita Shergill Marg Lutyens' Diplomatic Bungalow",
    slug: "amrita-shergill-marg-lutyens-bungalow",
    price: 850000000,
    currency: "INR",
    status: "For Sale",
    listingType: "sale",
    propertyType: "Diplomatic Bungalow",
    bedrooms: 6,
    bathrooms: 8,
    sqft: 11500,
    lotSize: "1.85 acres",
    yearBuilt: 2021,
    garage: 6,
    address: "24 Amrita Shergill Marg, Lutyens' Bungalow Zone",
    neighborhood: "Lutyens' Delhi",
    city: "New Delhi",
    state: "Delhi",
    zipCode: "110003",
    coordinates: { lat: 28.5965, lng: 77.2217 },
    pricePerSqft: 73913,
    hoaFee: 0,
    propertyTaxAnnual: 1850000,
    description: "An extraordinary private residence in India's most coveted diplomatic enclave, Lutyens' Bungalow Zone. Set amidst nearly two acres of verdant lawns with historic banyan trees and rose gardens. Classical symmetry, sprawling white colonnades, grand reception banquet halls, private security pavilion, and a formal library lined in solid teak.",
    highlights: [
      "1.85 acres of freehold prime Lutyens' Bungalow Zone land",
      "Grand ballroom banquet hall accommodating 150 guests",
      "Full staff quarters pavilion for 12 domestic and security personnel",
      "Direct adjacency to Lodhi Gardens and Delhi Golf Club"
    ],
    amenities: [
      "Sprawling Private Lawns",
      "Olympic-Length Lap Pool",
      "Bespoke Teak Library",
      "Grand Reception Hall",
      "Security Guard Barracks",
      "Private Tennis Court",
      "Full DG Power Backup",
      "Automated Irrigation"
    ],
    features: {
      ceilingHeight: "18 ft double-height formal reception",
      cooling: "High-efficiency Daikin central chilled water HVAC",
      heating: "Integrated hydronic heating + ornamental fireplaces",
      flooring: "Makrana white marble & vintage chevron walnut",
      views: "Sprawling heritage tree canopy and manicured lawns",
      parking: "Covered motor court for 6 VIP vehicles + 10 visitor slots"
    },
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566752734-2a0cd66c42f5?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: true,
    agent: {
      name: "Rohan Kapoor",
      phone: "+91 98110 33490",
      email: "r.kapoor@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Delhi Capital Advisory",
      rating: 4.97,
      salesCount: 31
    },
    createdAt: "2026-07-18T14:00:00.000Z",
    updatedAt: "2026-10-18T16:45:00.000Z"
  },
  {
    _id: "65e4a19f3a921d0012f10004",
    title: "Alibaug Mandwa Coastal Pavilion & Coconut Grove",
    slug: "alibaug-mandwa-coastal-pavilion",
    price: 220000000,
    currency: "INR",
    status: "For Sale",
    listingType: "sale",
    propertyType: "Coastal Pavilion",
    bedrooms: 5,
    bathrooms: 6,
    sqft: 6400,
    lotSize: "2.5 acres",
    yearBuilt: 2024,
    garage: 4,
    address: "Awas Beach Road, Mandwa",
    neighborhood: "Alibaug Coast",
    city: "Alibaug",
    state: "Maharashtra",
    zipCode: "402201",
    coordinates: { lat: 18.7845, lng: 72.8682 },
    pricePerSqft: 34375,
    hoaFee: 30000,
    propertyTaxAnnual: 380000,
    description: "Located a mere 10 minutes from Mandwa Speedboat Jetty (20 minutes by speedboat from Gateway of India, Mumbai). Designed with raw exposed laterite stone, board-formed concrete, and warm teak slatted screens. Includes a 60ft black slate swimming pool nestled under coconut groves with a private footpath leading to the secluded sands of Awas Beach.",
    highlights: [
      "10 minutes from Mandwa Jetty; 20-minute speedboat commute to Mumbai",
      "Private 2.5-acre manicured coconut and betel-nut plantation estate",
      "Direct gated trail to serene sandy beachfront",
      "Open-air pavilion dining with wood-fired tandoor and pizza oven"
    ],
    amenities: [
      "Beachfront Access",
      "60ft Black Slate Pool",
      "Private Coconut Plantation",
      "Outdoor Dining Pavilion",
      "Helipad Landing Clearance",
      "Smart Home Automation",
      "100% Solar & DG Backup"
    ],
    features: {
      ceilingHeight: "14 - 17 ft open pavilion volume",
      cooling: "Cross-breeze architecture + multi-zone AC",
      heating: "Solar water heaters",
      flooring: "Honed Kadapa black stone & teak wood planks",
      views: "Private coconut grove and coastal horizon",
      parking: "4-car dedicated motor port with charging"
    },
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566752229-250ed79470f8?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: false,
    agent: {
      name: "Aditya Singhania",
      phone: "+91 98200 14820",
      email: "a.singhania@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Mumbai Prime Advisory",
      rating: 4.99,
      salesCount: 38
    },
    createdAt: "2026-08-28T09:00:00.000Z",
    updatedAt: "2026-10-15T11:20:00.000Z"
  },
  {
    _id: "65e4a19f3a921d0012f10005",
    title: "Jubilee Hills Granite & Glass Architectural Villa",
    slug: "jubilee-hills-granite-glass-villa",
    price: 320000000,
    currency: "INR",
    status: "For Sale",
    listingType: "sale",
    propertyType: "Architectural Residence",
    bedrooms: 5,
    bathrooms: 6,
    sqft: 8400,
    lotSize: "1.1 acres",
    yearBuilt: 2024,
    garage: 4,
    address: "Road No. 36, Jubilee Hills",
    neighborhood: "Jubilee Hills",
    city: "Hyderabad",
    state: "Telangana",
    zipCode: "500033",
    coordinates: { lat: 17.4319, lng: 78.4073 },
    pricePerSqft: 38095,
    hoaFee: 35000,
    propertyTaxAnnual: 520000,
    description: "Dramatically integrated into the monolithic granite boulders of Jubilee Hills, this modernist residence features a 30-foot cantilevered glass living hall hovering above a cascading negative-edge infinity pool. Bespoke interiors by Minotti and a private home theater with Dolby Atmos.",
    highlights: [
      "Spectacular boulder architecture with integrated natural rock formations",
      "Negative-edge lap pool cantilevered over the city lights",
      "Private 14-seat 4K laser Dolby Atmos screening room",
      "Italian custom Poliform walk-in wardrobes and Rimadesio sliding partitions"
    ],
    amenities: [
      "Negative-Edge Pool",
      "Dolby Atmos Cinema",
      "Italian Valcucine Kitchen",
      "Smart Automation",
      "Private Elevator",
      "Zen Garden & Koi Pond",
      "Wine Cellar",
      "City Horizon Views"
    ],
    features: {
      ceilingHeight: "15 ft ceiling clearance",
      cooling: "Mitsubishi Electric VRF central cooling",
      heating: "Central heat pumps",
      flooring: "Large-format Italian porcelain & smoked French oak",
      views: "Jubilee Hills rocky skyline and Durgam Cheruvu lake glimpses",
      parking: "4 subterranean parking slots with EV chargers"
    },
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: true,
    agent: {
      name: "Kavita Reddy",
      phone: "+91 98490 88210",
      email: "k.reddy@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Deccan Luxury Residences",
      rating: 4.96,
      salesCount: 29
    },
    createdAt: "2026-09-12T16:00:00.000Z",
    updatedAt: "2026-10-24T18:00:00.000Z"
  },
  {
    _id: "65e4a19f3a921d0012f10006",
    title: "Kumarakom Backwater Heritage Sanctuary",
    slug: "kumarakom-backwater-heritage-sanctuary",
    price: 145000000,
    currency: "INR",
    status: "For Sale",
    listingType: "sale",
    propertyType: "Backwater Nalukettu",
    bedrooms: 4,
    bathrooms: 4.5,
    sqft: 5100,
    lotSize: "3.2 acres",
    yearBuilt: 2023,
    garage: 3,
    address: "Kavanattinkara, Kumarakom",
    neighborhood: "Kumarakom Backwaters",
    city: "Kottayam",
    state: "Kerala",
    zipCode: "686563",
    coordinates: { lat: 9.6175, lng: 76.4301 },
    pricePerSqft: 28431,
    hoaFee: 15000,
    propertyTaxAnnual: 240000,
    description: "An idyllic waterfront sanctuary on the edge of Vembanad Lake. Constructed according to classical Kerala Thachu Shastra architecture with an open central courtyard (Nadumuttam), antique teakwood wood-carved pillars, deep clay-tiled verandas, and a private traditional wooden boat jetty with electric cruising launch.",
    highlights: [
      "Direct private jetty with mooring rights on Vembanad Lake",
      "Authentic Nalukettu architectural courtyard design with rainwater collection",
      "Private Ayurvedic wellness spa pavilion with steam room",
      "3.2 acres of organic spice and coconut plantation"
    ],
    amenities: [
      "Private Boat Jetty",
      "Lakefront Views",
      "Ayurvedic Spa Room",
      "Central Open Courtyard",
      "Organic Spice Garden",
      "Infinity Pool Overlooking Lake",
      "Solar Power Array"
    ],
    features: {
      ceilingHeight: "14 - 18 ft pitched clay tile roof",
      cooling: "Natural lake cross-breeze ventilation + inverter ACs",
      heating: "Solar water heating",
      flooring: "Terracotta tiles & reclaimed seasoned Anjili timber",
      views: "Unobstructed Vembanad Lake & serene backwaters",
      parking: "3-car shaded garage + private boat slip"
    },
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: false,
    agent: {
      name: "Tara D'Souza",
      phone: "+91 98230 45210",
      email: "t.dsouza@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Goa Coastal & Heritage",
      rating: 4.98,
      salesCount: 44
    },
    createdAt: "2026-06-10T11:00:00.000Z",
    updatedAt: "2026-10-10T13:10:00.000Z"
  },
  {
    _id: "65e4a19f3a921d0012f10007",
    title: "Civil Lines Restored Heritage Haveli",
    slug: "civil-lines-restored-heritage-haveli",
    price: 165000000,
    currency: "INR",
    status: "For Sale",
    listingType: "sale",
    propertyType: "Restored Heritage Haveli",
    bedrooms: 5,
    bathrooms: 5.5,
    sqft: 6100,
    lotSize: "0.65 acres",
    yearBuilt: 2022,
    garage: 3,
    address: "Jacob Road, Civil Lines",
    neighborhood: "Civil Lines",
    city: "Jaipur",
    state: "Rajasthan",
    zipCode: "302006",
    coordinates: { lat: 26.9056, lng: 75.7873 },
    pricePerSqft: 27049,
    hoaFee: 18000,
    propertyTaxAnnual: 280000,
    description: "A meticulously restored aristocratic Haveli in Jaipur's most peaceful VIP neighborhood. Intricately carved pink sandstone jharokhas, cusped arches, central marble fountain courtyard, gold-leaf ceiling frescoes, and a rooftop terrace looking toward the historic Aravali hills.",
    highlights: [
      "Hand-carved Bansi Paharpur pink sandstone stone-masonry",
      "Central courtyard with marble fountain and fragrant jasmine garden",
      "Rooftop terrace pavilion with Aravali mountain views",
      "Private elevator connecting all 3 levels"
    ],
    amenities: [
      "Sandstone Jharokhas",
      "Marble Fountain Courtyard",
      "Rooftop Pavilion",
      "Private Elevator",
      "Wine Cellar",
      "Billiards & Cigar Lounge",
      "Full Security Gated Compound"
    ],
    features: {
      ceilingHeight: "14 - 16 ft arched ceilings",
      cooling: "Ducted VRV inverter AC system",
      heating: "Underfloor radiant heating in marble baths",
      flooring: "Makrana white marble & yellow Jaisalmer limestone",
      views: "Private courtyard gardens and distant Nahargarh fort ridge",
      parking: "Covered parking for 3 luxury vehicles"
    },
    images: [
      "https://images.unsplash.com/photo-1599818816938-164a2a16d860?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1585128792020-803d29415281?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: false,
    agent: {
      name: "Rohan Kapoor",
      phone: "+91 98110 33490",
      email: "r.kapoor@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Delhi Capital Advisory",
      rating: 4.97,
      salesCount: 31
    },
    createdAt: "2026-08-01T15:00:00.000Z",
    updatedAt: "2026-10-14T10:00:00.000Z"
  },
  {
    _id: "65e4a19f3a921d0012f10008",
    title: "Koramangala Biophilic Courtyard Residence",
    slug: "koramangala-biophilic-courtyard-residence",
    price: 450000,
    currency: "INR",
    status: "For Rent",
    listingType: "rent",
    propertyType: "Architectural Residence",
    bedrooms: 4,
    bathrooms: 4.5,
    sqft: 4800,
    lotSize: "0.35 acres",
    yearBuilt: 2024,
    garage: 2,
    address: "3rd Block, 14th Main, Koramangala",
    neighborhood: "Koramangala",
    city: "Bengaluru",
    state: "Karnataka",
    zipCode: "560034",
    coordinates: { lat: 12.9279, lng: 77.6271 },
    pricePerSqft: 94,
    hoaFee: 15000,
    propertyTaxAnnual: 85000,
    description: "Available for luxury executive lease. An award-winning contemporary biophilic residence in Bangalore's premier tech hub, Koramangala 3rd Block. Built around a double-height central indoor courtyard with a mature frangipani tree, green living walls, open skylights, and a heated plunge pool. Fully furnished with custom Scandinavian oak and Italian lighting.",
    highlights: [
      "Executive luxury lease in high-demand Koramangala 3rd Block",
      "Double-height glass courtyard with natural skylight and interior ficus tree",
      "Private heated garden plunge pool and rooftop terrace garden",
      "Fully turnkey with designer Italian furniture and smart home controls"
    ],
    amenities: [
      "Internal Tree Courtyard",
      "Heated Plunge Pool",
      "Rooftop Terrace Garden",
      "Smart Home Automation",
      "Fully Furnished Designer Interiors",
      "Solar & 100% DG Power Backup",
      "EV Car Charger"
    ],
    features: {
      ceilingHeight: "13 - 22 ft double height atrium",
      cooling: "Ducted multi-split inverter ACs throughout",
      heating: "Solar water heating system",
      flooring: "Polished Kota stone & wide-plank European white oak",
      views: "Lush green tree canopy of Koramangala tree-lined avenue",
      parking: "2-car enclosed garage with automated gate"
    },
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: true,
    agent: {
      name: "Kavita Reddy",
      phone: "+91 98490 88210",
      email: "k.reddy@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Deccan Luxury Residences",
      rating: 4.96,
      salesCount: 29
    },
    createdAt: "2026-09-20T17:00:00.000Z",
    updatedAt: "2026-10-25T12:00:00.000Z"
  },
  {
    _id: "65e4a19f3a921d0012f10009",
    title: "Worli Sea Face Duplex Sky Penthouse",
    slug: "worli-sea-face-duplex-sky-penthouse",
    price: 850000,
    currency: "INR",
    status: "For Rent",
    listingType: "rent",
    propertyType: "Luxury Sky Penthouse",
    bedrooms: 4,
    bathrooms: 5,
    sqft: 5600,
    lotSize: "Tower Penthouse",
    yearBuilt: 2024,
    garage: 3,
    address: "Khan Abdul Ghaffar Khan Road, Worli Sea Face",
    neighborhood: "Worli Sea Face",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400018",
    coordinates: { lat: 19.0144, lng: 72.8153 },
    pricePerSqft: 152,
    hoaFee: 45000,
    propertyTaxAnnual: 420000,
    description: "Available for premium lease. An ultra-exclusive duplex penthouse towering directly over the Worli Sea Face promenade with front-row sunset panoramas of the iconic Bandra-Worli Sea Link. Features a private glass elevator, sweeping 60ft sea-facing balcony, imported Italian marble throughout, and round-the-clock five-star hospitality services.",
    highlights: [
      "Front-row unobstructed views of the Bandra-Worli Sea Link and Arabian Sea",
      "Private internal elevator connecting lower and upper duplex levels",
      "Fully automated lighting, shade, and climate control via Lutron",
      "3 reserved basement parking spots + chauffeur waiting lounge"
    ],
    amenities: [
      "Sea Link & Ocean Views",
      "Private Sea-Facing Balcony",
      "Private Internal Elevator",
      "Smart Home Automation",
      "Bespoke Italian Kitchen",
      "24/7 Security & Concierge",
      "Gym & Swimming Pool Access",
      "3 Covered Car Parks"
    ],
    features: {
      ceilingHeight: "14 ft clear ceiling heights",
      cooling: "Ducted central VRF air conditioning",
      heating: "Integrated climate control",
      flooring: "Italian Botticino marble & natural hardwood",
      views: "Bandra-Worli Sea Link, Arabian Sea & Mumbai skyline",
      parking: "3 reserved basement parking bays"
    },
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: true,
    agent: {
      name: "Aditya Singhania",
      phone: "+91 98200 14820",
      email: "a.singhania@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Mumbai Prime Advisory",
      rating: 4.99,
      salesCount: 38
    },
    createdAt: "2026-09-28T10:00:00.000Z",
    updatedAt: "2026-10-26T16:00:00.000Z"
  },
  {
    _id: "65e4a19f3a921d0012f10010",
    title: "Fontainhas 1880s Latin Quarter Heritage Manor",
    slug: "fontainhas-latin-quarter-heritage-manor",
    price: 145000000,
    currency: "INR",
    status: "For Sale",
    listingType: "sale",
    propertyType: "Portuguese Heritage Villa",
    bedrooms: 4,
    bathrooms: 4.5,
    sqft: 4800,
    lotSize: "0.45 acres",
    yearBuilt: 2023,
    garage: 2,
    address: "Rua 31 de Janeiro, Fontainhas Latin Quarter",
    neighborhood: "Fontainhas",
    city: "Goa",
    state: "Goa",
    zipCode: "403001",
    coordinates: { lat: 15.4989, lng: 73.8278 },
    pricePerSqft: 30208,
    hoaFee: 20000,
    propertyTaxAnnual: 250000,
    description: "An authentic 19th-century Portuguese manor nestled in the historic Latin Quarter of Fontainhas, Panaji. Features hand-painted ceramic azulejo tiles, arched timber windows with mother-of-pearl oyster shells, central courtyard with a natural stone plunge pool surrounded by frangipani trees, and high-pitched timber roofs with authentic Mangalore tiles.",
    highlights: [
      "Protected architectural heritage zone in Fontainhas Latin Quarter",
      "Handcrafted Goan oyster-shell windows & Portuguese Azulejos",
      "Private internal courtyard plunge pool & outdoor shower",
      "Antique Burma teak rafters with soaring 18ft ceilings"
    ],
    amenities: [
      "Courtyard Plunge Pool",
      "Azulejo Hand-Painted Tiles",
      "Heritage Balcão Porch",
      "Private Wine Tasting Cellar",
      "Solar & Full Inverter Backup",
      "Bespoke Brass Fittings",
      "Walled Private Estate"
    ],
    features: {
      ceilingHeight: "18 ft vaulted timber ceiling",
      cooling: "Concealed multi-split inverter ACs",
      heating: "Solar water heating system",
      flooring: "Antique encaustic cement tiles & polished laterite",
      views: "Picturesque terracotta streetscape of Fontainhas",
      parking: "2-car enclosed garage with vintage teak gates"
    },
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585153490-76fb20a32601?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: true,
    agent: {
      name: "Tara D'Souza",
      phone: "+91 98230 45210",
      email: "t.dsouza@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Goa Coastal & Heritage",
      rating: 4.98,
      salesCount: 44
    },
    createdAt: "2026-09-18T10:00:00.000Z",
    updatedAt: "2026-10-24T12:00:00.000Z"
  },
  {
    _id: "65e4a19f3a921d0012f10011",
    title: "Moira Riverfront Portuguese Quinta & Orchard",
    slug: "moira-riverfront-portuguese-quinta",
    price: 375000,
    currency: "INR",
    status: "For Rent",
    listingType: "rent",
    propertyType: "Portuguese Heritage Villa",
    bedrooms: 4,
    bathrooms: 4,
    sqft: 5200,
    lotSize: "1.4 acres",
    yearBuilt: 2022,
    garage: 3,
    address: "Near St. Francis Xavier Church, Moira",
    neighborhood: "Moira",
    city: "Goa",
    state: "Goa",
    zipCode: "403507",
    coordinates: { lat: 15.6105, lng: 73.8341 },
    pricePerSqft: 72,
    hoaFee: 18000,
    propertyTaxAnnual: 180000,
    description: "Available for executive long-term lease. A serene 150-year-old restored riverfront Portuguese estate surrounded by 1.4 acres of organic mango, jackfruit, and cashew orchards. Features a classic susegad balcão veranda, private wooden boat jetty on the Moira River, lap pool with sun deck, and heritage timber rafters.",
    highlights: [
      "Private boat mooring and wooden jetty on the Moira River",
      "1.4 acres of organic tropical fruit groves and ancient trees",
      "Wrap-around Portuguese balcão veranda with river breezes",
      "Fully serviced with on-site caretaker suite & gardener"
    ],
    amenities: [
      "Riverfront Boat Jetty",
      "Private Lap Pool",
      "Balcão Veranda",
      "Organic Fruit Orchard",
      "Solar Water Heating",
      "Fully Furnished Heritage Antiques",
      "100% Power Generator Backup"
    ],
    features: {
      ceilingHeight: "16 ft pitched clay-tile roof",
      cooling: "Ducted Daikin multi-split inverter ACs",
      heating: "Solar water heating system",
      flooring: "Honed terracotta & Bharat heritage patterned tiles",
      views: "Tranquil Moira river bends and lush coconut groves",
      parking: "Covered 3-car port with paved driveway"
    },
    images: [
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: false,
    agent: {
      name: "Tara D'Souza",
      phone: "+91 98230 45210",
      email: "t.dsouza@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Goa Coastal & Heritage",
      rating: 4.98,
      salesCount: 44
    },
    createdAt: "2026-09-22T14:00:00.000Z",
    updatedAt: "2026-10-25T11:00:00.000Z"
  },
  {
    _id: "65e4a19f3a921d0012f10012",
    title: "Bandra Bandstand Sea-Facing Triplex Penthouse",
    slug: "bandra-bandstand-sea-facing-triplex-penthouse",
    price: 620000000,
    currency: "INR",
    status: "For Sale",
    listingType: "sale",
    propertyType: "Luxury Sky Penthouse",
    bedrooms: 5,
    bathrooms: 6,
    sqft: 8400,
    lotSize: "Tower Triplex",
    yearBuilt: 2024,
    garage: 5,
    address: "BJ Road, Bandra Bandstand",
    neighborhood: "Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400050",
    coordinates: { lat: 19.0435, lng: 72.8196 },
    pricePerSqft: 73809,
    hoaFee: 110000,
    propertyTaxAnnual: 1250000,
    description: "Occupying the top 3 levels of an ultra-luxury beachfront tower on Bandra Bandstand, this triplex penthouse offers unhindered sunset panoramas of the Arabian Sea and the Bandra-Worli Sea Link. Features a private rooftop glass infinity pool, internal private high-speed capsule elevator, 22-foot double-height living salon, and custom Boffi kitchen.",
    highlights: [
      "Frontline Arabian Sea sunset views directly over Bandstand promenade",
      "Private rooftop glass cantilevered infinity pool on 42nd level",
      "Dedicated high-speed private elevator across all 3 levels",
      "5 reserved basement podium parking bays"
    ],
    amenities: [
      "Private Glass Infinity Pool",
      "Arabian Sea Panoramas",
      "Private Capsule Elevator",
      "Double-Height Glass Salon",
      "Home Cinema with Barco 4K",
      "Private Sauna & Steam Spa",
      "24/7 Security & Chauffeur Lounge"
    ],
    features: {
      ceilingHeight: "22 ft double-height grand gallery",
      cooling: "Mitsubishi Electric VRF central air system",
      heating: "Integrated digital climate zoning",
      flooring: "Bookmatched Calacatta Gold marble & chevron French walnut",
      views: "Infinite Arabian Sea, Bandra-Worli Sea Link & Mumbai coastline",
      parking: "5 reserved underground parking slots"
    },
    images: [
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: true,
    agent: {
      name: "Aditya Singhania",
      phone: "+91 98200 14820",
      email: "a.singhania@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Mumbai Prime Advisory",
      rating: 4.99,
      salesCount: 38
    },
    createdAt: "2026-08-30T11:00:00.000Z",
    updatedAt: "2026-10-23T15:30:00.000Z"
  },
  {
    _id: "65e4a19f3a921d0012f10013",
    title: "Golf Course Road Sky Manor Duplex Penthouse",
    slug: "golf-course-road-sky-manor-duplex-penthouse",
    price: 360000000,
    currency: "INR",
    status: "For Sale",
    listingType: "sale",
    propertyType: "Luxury Sky Penthouse",
    bedrooms: 5,
    bathrooms: 6,
    sqft: 7800,
    lotSize: "Tower Duplex",
    yearBuilt: 2024,
    garage: 4,
    address: "The Camellias Corridor, Golf Course Road",
    neighborhood: "DLF Phase 5",
    city: "Gurugram",
    state: "Haryana",
    zipCode: "122002",
    coordinates: { lat: 28.4595, lng: 77.0988 },
    pricePerSqft: 46153,
    hoaFee: 75000,
    propertyTaxAnnual: 680000,
    description: "Perched high above the iconic DLF Golf Course, this duplex penthouse commands uninterrupted views of emerald fairways and the Aravalli hills. Features a private temperature-controlled pool on the sky deck, 18-foot ceiling heights, custom Italian Poliform walk-in closets, and Poggenpohl show kitchen.",
    highlights: [
      "Frontline panoramas of championship golf greens & Aravalli sanctuary",
      "Cantilevered private terrace pool with hydromassage jets",
      "Double-height living pavilion with wrap-around glass curtain walls",
      "Access to 100,000 sqft international club amenities"
    ],
    amenities: [
      "Private Sky Terrace Pool",
      "Golf Course Panoramic Views",
      "Private Club Access",
      "Valcucine Kitchen",
      "Dolby Atmos Home Theater",
      "Private Sauna & Steam Spa",
      "4 Covered Car Parks"
    ],
    features: {
      ceilingHeight: "18 ft clear volume in living salon",
      cooling: "Ducted central chilled water HVAC",
      heating: "Underfloor radiant heating in bathrooms",
      flooring: "Imported Greek Thassos marble & engineered smoked walnut",
      views: "Lush golf course greens, water hazards & Aravalli ridges",
      parking: "4 reserved basement parking bays with EV supercharger"
    },
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: false,
    agent: {
      name: "Rohan Kapoor",
      phone: "+91 98110 33490",
      email: "r.kapoor@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Delhi Capital Advisory",
      rating: 4.97,
      salesCount: 31
    },
    createdAt: "2026-09-05T12:30:00.000Z",
    updatedAt: "2026-10-21T18:00:00.000Z"
  },
  {
    _id: "65e4a19f3a921d0012f10014",
    title: "Prithviraj Road Diplomatic Colonial Estate & Lawns",
    slug: "prithviraj-road-diplomatic-colonial-estate",
    price: 920000000,
    currency: "INR",
    status: "For Sale",
    listingType: "sale",
    propertyType: "Diplomatic Bungalow",
    bedrooms: 6,
    bathrooms: 7.5,
    sqft: 12800,
    lotSize: "2.1 acres",
    yearBuilt: 2021,
    garage: 6,
    address: "17 Prithviraj Road, Lutyens' Bungalow Zone",
    neighborhood: "Lutyens' Delhi",
    city: "New Delhi",
    state: "Delhi",
    zipCode: "110011",
    coordinates: { lat: 28.5991, lng: 77.2185 },
    pricePerSqft: 71875,
    hoaFee: 0,
    propertyTaxAnnual: 2100000,
    description: "An iconic ambassadorial estate situated on Prithviraj Road in the prestigious Lutyens' Bungalow Zone. Sprawled across over two acres of rolling emerald lawns and century-old banyan and neem trees, featuring grand neo-classical white colonnades, ceremonial banquet hall, diplomatic security pavilion, and tennis court.",
    highlights: [
      "2.1 acres of prime freehold land in Lutyens' Bungalow Zone",
      "Stately neo-classical facade with grand ceremonial portico",
      "Diplomatic reception banquet hall seating 200 distinguished guests",
      "Independent 8-room diplomatic staff and security barracks"
    ],
    amenities: [
      "Sprawling Emerald Lawns",
      "Private Floodlit Tennis Court",
      "Colonial Lap Pool",
      "Ceremonial Banquet Hall",
      "Diplomatic Guard Pavilion",
      "Teakwood Library & Study",
      "100% DG Power Backup"
    ],
    features: {
      ceilingHeight: "18 ft double-height formal reception hall",
      cooling: "Daikin multi-zone VRV central system",
      heating: "Central hydronic heating and carved marble fireplaces",
      flooring: "Pure Makrana white marble & vintage chevron teak",
      views: "Unbroken green canopy of Lutyens' Delhi heritage trees",
      parking: "Covered motor court for 6 VIP limousines + 12 visitor slots"
    },
    images: [
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600047508788-786f3865b4b9?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: true,
    agent: {
      name: "Rohan Kapoor",
      phone: "+91 98110 33490",
      email: "r.kapoor@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Delhi Capital Advisory",
      rating: 4.97,
      salesCount: 31
    },
    createdAt: "2026-08-10T15:00:00.000Z",
    updatedAt: "2026-10-19T14:00:00.000Z"
  },
  {
    _id: "65e4a19f3a921d0012f10015",
    title: "Chanakyapuri Embassy Enclave Stately Residence",
    slug: "chanakyapuri-embassy-enclave-stately-residence",
    price: 1200000,
    currency: "INR",
    status: "For Rent",
    listingType: "rent",
    propertyType: "Diplomatic Bungalow",
    bedrooms: 5,
    bathrooms: 6,
    sqft: 8200,
    lotSize: "1.25 acres",
    yearBuilt: 2023,
    garage: 4,
    address: "Malcha Marg, Diplomatic Enclave, Chanakyapuri",
    neighborhood: "Chanakyapuri",
    city: "New Delhi",
    state: "Delhi",
    zipCode: "110021",
    coordinates: { lat: 28.6015, lng: 77.1892 },
    pricePerSqft: 146,
    hoaFee: 0,
    propertyTaxAnnual: 950000,
    description: "Available for diplomatic mission or multinational leadership lease. Positioned in the prime diplomatic corridor of Chanakyapuri. Features high-security perimeter walls, ambassadorial reception suites, expansive private garden, swimming pool, and dedicated staff quarters for 8.",
    highlights: [
      "Turnkey diplomatic lease in the Chanakyapuri Embassy belt",
      "High-security compound with fortified gates and CCTV perimeter",
      "Manicured private gardens with centuries-old neem shade trees",
      "Full staff pavilion and detached security guard post"
    ],
    amenities: [
      "Diplomatic High Security",
      "Private Swimming Pool",
      "Expansive Lawn Garden",
      "Formal Ambassadorial Dining",
      "Detached Staff Quarters",
      "100% Uninterrupted Power Backup",
      "4-Car Gated Port"
    ],
    features: {
      ceilingHeight: "15 ft ceiling volume",
      cooling: "Ducted central VRV inverter air conditioning",
      heating: "Central heating system",
      flooring: "Makrana white marble & seasoned teakwood",
      views: "Chanakyapuri diplomatic tree-lined avenues and lush lawns",
      parking: "Covered 4-car garage with separate motor entrance"
    },
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: false,
    agent: {
      name: "Rohan Kapoor",
      phone: "+91 98110 33490",
      email: "r.kapoor@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Delhi Capital Advisory",
      rating: 4.97,
      salesCount: 31
    },
    createdAt: "2026-09-15T09:00:00.000Z",
    updatedAt: "2026-10-22T17:00:00.000Z"
  },
  {
    _id: "65e4a19f3a921d0012f10016",
    title: "Awas Beachfront Coconut Grove Pavilion",
    slug: "awas-beachfront-coconut-grove-pavilion",
    price: 265000000,
    currency: "INR",
    status: "For Sale",
    listingType: "sale",
    propertyType: "Coastal Pavilion",
    bedrooms: 5,
    bathrooms: 6,
    sqft: 6900,
    lotSize: "2.2 acres",
    yearBuilt: 2024,
    garage: 4,
    address: "Awas Beach Frontage Road, Alibaug",
    neighborhood: "Alibaug Coast",
    city: "Alibaug",
    state: "Maharashtra",
    zipCode: "402201",
    coordinates: { lat: 18.7912, lng: 72.8594 },
    pricePerSqft: 38405,
    hoaFee: 32000,
    propertyTaxAnnual: 410000,
    description: "A tropical coastal masterpiece set amidst 2.2 acres of swaying coconut palms with a private gate leading directly onto the pristine sands of Awas Beach. Pavilion architecture seamlessly blends rough-hewn basalt stone, teak wood louvers, an open-to-sky living pavilion, and a 65ft black granite lap pool.",
    highlights: [
      "Direct gated access onto pristine Awas beachfront",
      "2.2 acres of private coconut and frangipani plantation estate",
      "65ft black granite lap pool under canopy of palms",
      "12-minute drive to Mandwa Speedboat Jetty to Mumbai Gateway"
    ],
    amenities: [
      "Beachfront Access",
      "65ft Black Granite Pool",
      "Private Coconut Plantation",
      "Open-Air Dining Pavilion",
      "Smart Home Automation",
      "Solar & Full DG Backup",
      "Security Gated Estate"
    ],
    features: {
      ceilingHeight: "16 ft pitched open pavilion ceiling",
      cooling: "Cross-ventilation tropical design + multi-zone AC",
      heating: "Solar water heating",
      flooring: "Honed Kadapa stone & wide teak planks",
      views: "Private coconut grove and sea horizon",
      parking: "4-car shaded garage with EV charging"
    },
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: true,
    agent: {
      name: "Aditya Singhania",
      phone: "+91 98200 14820",
      email: "a.singhania@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Mumbai Prime Advisory",
      rating: 4.99,
      salesCount: 38
    },
    createdAt: "2026-08-25T13:00:00.000Z",
    updatedAt: "2026-10-23T11:00:00.000Z"
  },
  {
    _id: "65e4a19f3a921d0012f10017",
    title: "ECR Oceanfront Tropical Glass Pavilion",
    slug: "ecr-oceanfront-tropical-glass-pavilion",
    price: 190000000,
    currency: "INR",
    status: "For Sale",
    listingType: "sale",
    propertyType: "Coastal Pavilion",
    bedrooms: 4,
    bathrooms: 5,
    sqft: 5800,
    lotSize: "1.5 acres",
    yearBuilt: 2024,
    garage: 3,
    address: "Golden Beach Avenue, East Coast Road (ECR)",
    neighborhood: "ECR Beachfront",
    city: "Chennai",
    state: "Tamil Nadu",
    zipCode: "600115",
    coordinates: { lat: 12.9125, lng: 80.2520 },
    pricePerSqft: 32758,
    hoaFee: 24000,
    propertyTaxAnnual: 310000,
    description: "Commanding uninterrupted vistas across the Bay of Bengal along Chennai's prestigious East Coast Road. Minimalist cantilevered pavilion design with automated floor-to-ceiling glass walls, expansive teakwood sunset decks, beachfront infinity pool, and fragrant frangipani coastal gardens.",
    highlights: [
      "Frontline ocean views of the Bay of Bengal coastline",
      "Floor-to-ceiling hurricane-rated sliding glass walls",
      "Cantilevered beachfront infinity pool and sun decks",
      "Private garden path directly to the beach sands"
    ],
    amenities: [
      "Direct Beach Access",
      "Oceanfront Infinity Pool",
      "Floor-to-Ceiling Glass Walls",
      "Cantilevered Teak Deck",
      "Outdoor Dining Barbecue",
      "Smart Home Automation",
      "Gated Coastal Enclave"
    ],
    features: {
      ceilingHeight: "15 ft ceiling clearance",
      cooling: "Concealed multi-zone VRV air conditioning",
      heating: "Solar water heating system",
      flooring: "Imported Italian terrazzo and treated teak decking",
      views: "Unbroken panoramas of the Bay of Bengal sunrise & ocean",
      parking: "3-car covered carport with EV charger"
    },
    images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: false,
    agent: {
      name: "Kavita Reddy",
      phone: "+91 98490 88210",
      email: "k.reddy@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Deccan Luxury Residences",
      rating: 4.96,
      salesCount: 29
    },
    createdAt: "2026-09-08T14:30:00.000Z",
    updatedAt: "2026-10-21T10:00:00.000Z"
  },
  {
    _id: "65e4a19f3a921d0012f10018",
    title: "Alleppey Vembanad Lake Teakwood Nalukettu Manor",
    slug: "alleppey-vembanad-lake-teakwood-nalukettu",
    price: 168000000,
    currency: "INR",
    status: "For Sale",
    listingType: "sale",
    propertyType: "Backwater Nalukettu",
    bedrooms: 5,
    bathrooms: 5.5,
    sqft: 5900,
    lotSize: "2.8 acres",
    yearBuilt: 2023,
    garage: 3,
    address: "Muhamma Lake Road, Vembanad Lake",
    neighborhood: "Alleppey Backwaters",
    city: "Alappuzha",
    state: "Kerala",
    zipCode: "688525",
    coordinates: { lat: 9.5892, lng: 76.3541 },
    pricePerSqft: 28474,
    hoaFee: 16000,
    propertyTaxAnnual: 260000,
    description: "An authentic, royal-lineage 120-year-old restored Nair Nalukettu estate fronting the serene waters of Vembanad Lake in Alleppey. Features a classical open central courtyard (Nadumuttam), masterfully carved solid teak pillars, traditional Kettuvallam boat mooring canal, infinity pool merging into the lake horizon, and private Ayurvedic massage pavilion.",
    highlights: [
      "Direct private jetty & traditional Kettuvallam mooring canal",
      "Authentic central open courtyard (Nadumuttam) with brass oil lamps",
      "Hand-carved centuries-old teak and Anjili wood rafters",
      "2.8 acres of spice and organic coconut waterfront groves"
    ],
    amenities: [
      "Private Boat Jetty",
      "Vembanad Lake Vistas",
      "Central Nadumuttam Courtyard",
      "Ayurvedic Spa Room",
      "Lake-Facing Infinity Pool",
      "Organic Coconut Plantation",
      "Solar Power & DG Backup"
    ],
    features: {
      ceilingHeight: "15 - 19 ft pitched clay roof with timber rafters",
      cooling: "Natural lake cross-ventilation + inverter ACs",
      heating: "Solar water heating",
      flooring: "Handcrafted terracotta & reclaimed polished teakwood",
      views: "Endless Vembanad lake horizon and serene houseboats",
      parking: "3-car garage + private boat hangar"
    },
    images: [
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: true,
    agent: {
      name: "Tara D'Souza",
      phone: "+91 98230 45210",
      email: "t.dsouza@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Goa Coastal & Heritage",
      rating: 4.98,
      salesCount: 44
    },
    createdAt: "2026-08-14T11:00:00.000Z",
    updatedAt: "2026-10-20T16:00:00.000Z"
  },
  {
    _id: "65e4a19f3a921d0012f10019",
    title: "Kochi Mattancherry Heritage Waterfront Nalukettu",
    slug: "kochi-mattancherry-heritage-waterfront-nalukettu",
    price: 280000,
    currency: "INR",
    status: "For Rent",
    listingType: "rent",
    propertyType: "Backwater Nalukettu",
    bedrooms: 3,
    bathrooms: 3.5,
    sqft: 3900,
    lotSize: "0.85 acres",
    yearBuilt: 2022,
    garage: 2,
    address: "Bazaar Road, Mattancherry, Fort Kochi",
    neighborhood: "Fort Kochi",
    city: "Kochi",
    state: "Kerala",
    zipCode: "682002",
    coordinates: { lat: 9.9576, lng: 76.2571 },
    pricePerSqft: 71,
    hoaFee: 12000,
    propertyTaxAnnual: 140000,
    description: "Available for premium lease. An exquisite waterfront nalukettu residence set on the Cochin lagoon near historic Jew Town and spice warehouses. Features antique timber woodwork, open courtyard with lotus pond, water-facing veranda for sunset boat watching, and private wooden slipway.",
    highlights: [
      "Historic Cochin waterfront setting near Jew Town & spice markets",
      "Open-to-sky central courtyard with flowering lotus pond",
      "Private boat slipway with access to Arabian Sea channel",
      "Turnkey furnished with authentic antique teakwood and rosewood"
    ],
    amenities: [
      "Lagoon Waterfront Slipway",
      "Central Lotus Pond Courtyard",
      "Water-Facing Veranda",
      "Antique Furnished Interiors",
      "Solar Water Heating",
      "100% Inverter Backup",
      "2-Car Covered Port"
    ],
    features: {
      ceilingHeight: "14 ft clay-tile roof",
      cooling: "Ducted split AC in all suites",
      heating: "Solar water heating",
      flooring: "Honed terracotta and seasoned teak floorboards",
      views: "Cochin backwater lagoon, fishing boats & Chinese fishing nets",
      parking: "2-car enclosed garage with automated wooden gate"
    },
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=80"
    ],
    featured: false,
    agent: {
      name: "Tara D'Souza",
      phone: "+91 98230 45210",
      email: "t.dsouza@auraestates.in",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      brokerage: "AURA Goa Coastal & Heritage",
      rating: 4.98,
      salesCount: 44
    },
    createdAt: "2026-09-10T12:00:00.000Z",
    updatedAt: "2026-10-24T14:30:00.000Z"
  }
];

class DatabaseService {
  private isConnectedToLiveMongo: boolean = false;
  private liveClient: MongoClient | null = null;
  private liveDb: Db | null = null;
  private dbFilePath: string;
  private memoryData: {
    properties: PropertyDocument[];
    inquiries: InquiryDocument[];
    tours: TourDocument[];
  };

  constructor() {
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.dbFilePath = path.join(dataDir, 'mongodb_store.json');
    this.memoryData = this.loadFromFile();
    this.initLiveMongo();
  }

  private loadFromFile() {
    // If store exists, verify it matches current schema and has all properties
    if (fs.existsSync(this.dbFilePath)) {
      try {
        const raw = fs.readFileSync(this.dbFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.properties) && parsed.properties.length > 0) {
          if (parsed.properties[0].currency === 'INR' && parsed.properties.length >= INITIAL_PROPERTIES.length) {
            const initialById = new Map(INITIAL_PROPERTIES.map((p) => [p._id, p]));
            const syncedProperties = parsed.properties.map((p: PropertyDocument) => {
              const seedProp = initialById.get(p._id);
              return seedProp ? { ...p, images: seedProp.images, propertyType: seedProp.propertyType } : p;
            });
            const synced = {
              properties: syncedProperties,
              inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
              tours: Array.isArray(parsed.tours) ? parsed.tours : []
            };
            this.saveToFile(synced);
            return synced;
          }
        }
      } catch (e) {
        console.warn('Could not parse local store, reinitializing with defaults', e);
      }
    }
    const fresh = {
      properties: [...INITIAL_PROPERTIES],
      inquiries: [],
      tours: []
    };
    this.saveToFile(fresh);
    return fresh;
  }

  private saveToFile(data: typeof this.memoryData) {
    try {
      fs.writeFileSync(this.dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed saving to store:', err);
    }
  }

  private async initLiveMongo() {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('<username>') || uri.includes('MY_MONGODB')) {
      return;
    }
    try {
      this.liveClient = new MongoClient(uri, { serverSelectionTimeoutMS: 4000 });
      await this.liveClient.connect();
      this.liveDb = this.liveClient.db();
      this.isConnectedToLiveMongo = true;
      console.log('Connected to live MongoDB instance');
      
      const count = await this.liveDb.collection('properties').countDocuments();
      if (count === 0) {
        await this.liveDb.collection('properties').insertMany(INITIAL_PROPERTIES as any);
      }
    } catch (e) {
      console.warn('MongoDB URI connection failed, continuing with built-in document engine:', (e as Error).message);
      this.isConnectedToLiveMongo = false;
    }
  }

  public getStatus() {
    return {
      connectedLive: this.isConnectedToLiveMongo,
      databaseType: this.isConnectedToLiveMongo ? 'MongoDB Atlas / Native Driver' : 'Persisted Document Engine',
      driver: 'mongodb ^6.x',
      collections: {
        properties: this.memoryData.properties.length,
        inquiries: this.memoryData.inquiries.length,
        tours: this.memoryData.tours.length
      },
      storageFile: this.dbFilePath,
      lastUpdated: new Date().toISOString()
    };
  }

  public async getProperties(filters: {
    q?: string;
    type?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    beds?: number;
    baths?: number;
    city?: string;
    sort?: string;
  } = {}): Promise<PropertyDocument[]> {
    if (this.isConnectedToLiveMongo && this.liveDb) {
      try {
        const query: any = {};
        if (filters.status && filters.status !== 'All') {
          query.status = filters.status;
        }
        if (filters.type && filters.type !== 'All') {
          query.propertyType = filters.type;
        }
        if (filters.city && filters.city !== 'All') {
          query.city = filters.city;
        }
        if (filters.beds && filters.beds > 0) {
          query.bedrooms = { $gte: Number(filters.beds) };
        }
        if (filters.baths && filters.baths > 0) {
          query.bathrooms = { $gte: Number(filters.baths) };
        }
        if (filters.minPrice || filters.maxPrice) {
          query.price = {};
          if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
          if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
        }
        if (filters.q) {
          const regex = new RegExp(filters.q, 'i');
          query.$or = [
            { title: regex },
            { address: regex },
            { city: regex },
            { neighborhood: regex },
            { description: regex }
          ];
        }

        let cursor = this.liveDb.collection<PropertyDocument>('properties').find(query);
        if (filters.sort === 'price-asc') cursor = cursor.sort({ price: 1 });
        else if (filters.sort === 'price-desc') cursor = cursor.sort({ price: -1 });
        else if (filters.sort === 'sqft-desc') cursor = cursor.sort({ sqft: -1 });
        else if (filters.sort === 'newest') cursor = cursor.sort({ createdAt: -1 });

        return await cursor.toArray();
      } catch (err) {
        console.error('Error querying live Mongo, fallback to memory store:', err);
      }
    }

    let list = [...this.memoryData.properties];

    if (filters.status && filters.status !== 'All') {
      list = list.filter(p => p.status.toLowerCase() === filters.status?.toLowerCase());
    }
    if (filters.type && filters.type !== 'All') {
      list = list.filter(p => p.propertyType === filters.type);
    }
    if (filters.city && filters.city !== 'All') {
      list = list.filter(p => p.city.toLowerCase() === filters.city?.toLowerCase());
    }
    if (filters.beds && filters.beds > 0) {
      list = list.filter(p => p.bedrooms >= filters.beds!);
    }
    if (filters.baths && filters.baths > 0) {
      list = list.filter(p => p.bathrooms >= filters.baths!);
    }
    if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
      list = list.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      list = list.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters.q && filters.q.trim()) {
      const q = filters.q.toLowerCase().trim();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.amenities.some(a => a.toLowerCase().includes(q))
      );
    }

    if (filters.sort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'sqft-desc') {
      list.sort((a, b) => b.sqft - a.sqft);
    } else if (filters.sort === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }

  public async getPropertyById(id: string): Promise<PropertyDocument | null> {
    if (this.isConnectedToLiveMongo && this.liveDb) {
      try {
        const doc = await this.liveDb.collection<PropertyDocument>('properties').findOne({ _id: id } as any);
        if (doc) return doc;
      } catch (err) {
        console.error('Error fetching by ID from live Mongo:', err);
      }
    }
    return this.memoryData.properties.find(p => p._id === id || p.slug === id) || null;
  }

  public async createProperty(data: Omit<PropertyDocument, '_id' | 'createdAt' | 'updatedAt' | 'slug' | 'pricePerSqft'>): Promise<PropertyDocument> {
    const _id = generateObjectId();
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + _id.slice(-6);
    const pricePerSqft = data.sqft > 0 ? Math.round(data.price / data.sqft) : 0;
    const now = new Date().toISOString();

    const newDoc: PropertyDocument = {
      ...data,
      _id,
      slug,
      pricePerSqft,
      createdAt: now,
      updatedAt: now
    };

    if (this.isConnectedToLiveMongo && this.liveDb) {
      try {
        await this.liveDb.collection('properties').insertOne(newDoc as any);
      } catch (err) {
        console.error('Failed inserting into live Mongo:', err);
      }
    }

    this.memoryData.properties.unshift(newDoc);
    this.saveToFile(this.memoryData);
    return newDoc;
  }

  public async deleteProperty(id: string): Promise<boolean> {
    if (this.isConnectedToLiveMongo && this.liveDb) {
      try {
        await this.liveDb.collection('properties').deleteOne({ _id: id } as any);
      } catch (err) {
        console.error('Failed deleting from live Mongo:', err);
      }
    }
    const idx = this.memoryData.properties.findIndex(p => p._id === id);
    if (idx !== -1) {
      this.memoryData.properties.splice(idx, 1);
      this.saveToFile(this.memoryData);
      return true;
    }
    return false;
  }

  public async createInquiry(data: Omit<InquiryDocument, '_id' | 'createdAt' | 'status'>): Promise<InquiryDocument> {
    const newInquiry: InquiryDocument = {
      ...data,
      _id: generateObjectId(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    if (this.isConnectedToLiveMongo && this.liveDb) {
      try {
        await this.liveDb.collection('inquiries').insertOne(newInquiry as any);
      } catch (e) {
        console.error('Failed inserting inquiry into live Mongo:', e);
      }
    }

    this.memoryData.inquiries.unshift(newInquiry);
    this.saveToFile(this.memoryData);
    return newInquiry;
  }

  public async getInquiries(): Promise<InquiryDocument[]> {
    if (this.isConnectedToLiveMongo && this.liveDb) {
      try {
        return await this.liveDb.collection<InquiryDocument>('inquiries').find({}).sort({ createdAt: -1 }).toArray();
      } catch (e) {
        console.error(e);
      }
    }
    return this.memoryData.inquiries;
  }

  public async createTour(data: Omit<TourDocument, '_id' | 'createdAt' | 'status'>): Promise<TourDocument> {
    const newTour: TourDocument = {
      ...data,
      _id: generateObjectId(),
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    if (this.isConnectedToLiveMongo && this.liveDb) {
      try {
        await this.liveDb.collection('tours').insertOne(newTour as any);
      } catch (e) {
        console.error('Failed inserting tour into live Mongo:', e);
      }
    }

    this.memoryData.tours.unshift(newTour);
    this.saveToFile(this.memoryData);
    return newTour;
  }

  public async getTours(): Promise<TourDocument[]> {
    if (this.isConnectedToLiveMongo && this.liveDb) {
      try {
        return await this.liveDb.collection<TourDocument>('tours').find({}).sort({ createdAt: -1 }).toArray();
      } catch (e) {
        console.error(e);
      }
    }
    return this.memoryData.tours;
  }

  public resetToSample() {
    this.memoryData = {
      properties: [...INITIAL_PROPERTIES],
      inquiries: [],
      tours: []
    };
    this.saveToFile(this.memoryData);
    return this.memoryData;
  }
}

export const dbService = new DatabaseService();
