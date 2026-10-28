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

export interface Property {
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

export interface Inquiry {
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

export interface TourBooking {
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

export interface FilterState {
  q: string;
  listingType: 'all' | 'sale' | 'rent';
  propertyType: string;
  city: string;
  minPrice: number | '';
  maxPrice: number | '';
  beds: number | '';
  baths: number | '';
  sort: string;
  amenities: string[];
}

export interface DatabaseStats {
  connectedLive: boolean;
  databaseType: string;
  driver: string;
  collections: {
    properties: number;
    inquiries: number;
    tours: number;
  };
  storageFile: string;
  lastUpdated: string;
}
