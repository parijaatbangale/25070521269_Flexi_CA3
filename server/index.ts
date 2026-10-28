import express, { Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { dbService } from './db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// API Routes
app.get('/api/properties', async (req: Request, res: Response) => {
  try {
    const { q, type, status, minPrice, maxPrice, beds, baths, city, sort } = req.query;
    const properties = await dbService.getProperties({
      q: q as string,
      type: type as string,
      status: status as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      beds: beds ? Number(beds) : undefined,
      baths: baths ? Number(baths) : undefined,
      city: city as string,
      sort: sort as string
    });
    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/api/properties/:id', async (req: Request, res: Response) => {
  try {
    const property = await dbService.getPropertyById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    res.json({ success: true, data: property });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/api/properties', async (req: Request, res: Response) => {
  try {
    const {
      title,
      price,
      currency = 'INR',
      status = 'For Sale',
      listingType = 'sale',
      propertyType = 'Modern Villa',
      bedrooms = 3,
      bathrooms = 3,
      sqft = 3500,
      lotSize = '0.5 acres',
      yearBuilt = new Date().getFullYear(),
      garage = 2,
      address,
      neighborhood = 'Prime Enclave',
      city,
      state = 'Maharashtra',
      zipCode = '400001',
      coordinates = { lat: 18.9220, lng: 72.8347 },
      hoaFee = 15000,
      propertyTaxAnnual = 150000,
      description,
      highlights = [],
      amenities = [],
      features,
      images = [],
      agent
    } = req.body;

    if (!title || !price || !address || !city) {
      return res.status(400).json({
        success: false,
        error: 'Title, price, address, and city are required fields'
      });
    }

    const defaultAgent = {
      name: 'AURA Concierge Desk',
      phone: '+91 98200 11000',
      email: 'concierge@auraestates.in',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      brokerage: 'AURA Private Client Group India',
      rating: 5.0,
      salesCount: 35
    };

    const newProperty = await dbService.createProperty({
      title,
      price: Number(price),
      currency,
      status,
      listingType,
      propertyType,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      sqft: Number(sqft),
      lotSize,
      yearBuilt: Number(yearBuilt),
      garage: Number(garage),
      address,
      neighborhood,
      city,
      state,
      zipCode,
      coordinates,
      hoaFee: Number(hoaFee),
      propertyTaxAnnual: Number(propertyTaxAnnual),
      description: description || `Stunning ${propertyType} situated in the heart of ${city}. Offers bespoke finishes, light-filled living spaces, and world-class architectural craftsmanship.`,
      highlights: highlights.length > 0 ? highlights : [
        'Custom architectural finishes throughout',
        'Floor-to-ceiling glass design with natural light',
        'Premium chef kitchen with luxury appliances',
        'Prime tranquil location in coveted neighborhood'
      ],
      amenities: amenities.length > 0 ? amenities : ['Smart Home Automation', 'Panoramic Views', 'EV Fast Charger'],
      features: features || {
        ceilingHeight: '12 - 14 ft',
        cooling: 'High-efficiency multi-zone AC',
        heating: 'Hydronic radiant floor + forced air',
        flooring: 'Engineered oak & Italian porcelain',
        views: 'Neighborhood tree canopy and skyline',
        parking: `${garage}-car enclosed garage`
      },
      images: images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'
      ],
      featured: false,
      agent: agent || defaultAgent
    });

    res.status(201).json({
      success: true,
      message: 'Property listed successfully',
      data: newProperty
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.delete('/api/properties/:id', async (req: Request, res: Response) => {
  try {
    const success = await dbService.deleteProperty(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    res.json({ success: true, message: 'Property removed successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/api/inquiries', async (req: Request, res: Response) => {
  try {
    const { propertyId, propertyTitle, name, email, phone, inquiryType, offerAmount, message, tourDate, tourTime, tourMode } = req.body;
    if (!propertyId || !name || !email) {
      return res.status(400).json({ success: false, error: 'propertyId, name, and email are required' });
    }
    const inquiry = await dbService.createInquiry({
      propertyId,
      propertyTitle: propertyTitle || 'Exclusive Listing',
      name,
      email,
      phone: phone || '',
      inquiryType: inquiryType || 'general',
      offerAmount: offerAmount ? Number(offerAmount) : undefined,
      tourDate,
      tourTime,
      tourMode,
      message: message || 'Interested in learning more about this property.'
    });
    res.status(201).json({ success: true, message: 'Inquiry submitted successfully', data: inquiry });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/api/inquiries', async (_req: Request, res: Response) => {
  try {
    const inquiries = await dbService.getInquiries();
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/api/tours', async (req: Request, res: Response) => {
  try {
    const { propertyId, propertyTitle, propertyPrice, propertyImage, name, email, phone, preferredDate, preferredTime, tourType, notes } = req.body;
    if (!propertyId || !name || !email || !preferredDate || !preferredTime) {
      return res.status(400).json({ success: false, error: 'Missing required tour booking fields' });
    }
    const tour = await dbService.createTour({
      propertyId,
      propertyTitle: propertyTitle || 'Exclusive Estate',
      propertyPrice: Number(propertyPrice) || 0,
      propertyImage: propertyImage || '',
      name,
      email,
      phone: phone || '',
      preferredDate,
      preferredTime,
      tourType: tourType || 'In-Person Private Showing',
      notes
    });
    res.status(201).json({ success: true, message: 'Showing confirmed successfully', data: tour });
  } catch (error) {
    console.error('Error creating tour:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/api/tours', async (_req: Request, res: Response) => {
  try {
    const tours = await dbService.getTours();
    res.json({ success: true, count: tours.length, data: tours });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/api/db/stats', async (_req: Request, res: Response) => {
  try {
    const stats = dbService.getStatus();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/api/db/seed', async (_req: Request, res: Response) => {
  try {
    const data = dbService.resetToSample();
    res.json({ success: true, message: 'Database reseeded with premier properties', data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

export async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: rootDir,
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(rootDir, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(rootDir, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AURA Estates Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
