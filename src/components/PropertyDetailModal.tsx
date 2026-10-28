import React, { useState } from 'react';
import { 
  X, Bookmark, Share2, MapPin, Check, Calendar, 
  Calculator, Phone, Mail, Award, CheckCircle2
} from 'lucide-react';
import { Property } from '../types/property.ts';
import { formatINR, formatINRFull } from '../utils/formatters.ts';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (property: Property) => void;
  onTourBooked: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  isSaved,
  onToggleSave,
  onTourBooked
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'tour' | 'mortgage' | 'inquiry'>('tour');
  const [copiedLink, setCopiedLink] = useState(false);

  // Tour Form State
  const [tourName, setTourName] = useState('');
  const [tourEmail, setTourEmail] = useState('');
  const [tourPhone, setTourPhone] = useState('');
  const [tourDate, setTourDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [tourTime, setTourTime] = useState('11:00 AM');
  const [tourType, setTourType] = useState<'In-Person Private Showing' | 'Live Video Walkthrough'>('In-Person Private Showing');
  const [tourSubmitting, setTourSubmitting] = useState(false);
  const [tourSuccess, setTourSuccess] = useState(false);

  // Inquiry Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryType, setInquiryType] = useState<'general' | 'make_offer' | 'request_brochure'>('general');
  const [offerAmount, setOfferAmount] = useState<string>(property ? property.price.toString() : '0');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Mortgage Calculator State
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTermYears, setLoanTermYears] = useState(20);

  // Update offer amount if property changes
  React.useEffect(() => {
    if (property) {
      setOfferAmount(property.price.toString());
      setActiveImageIndex(0);
      setTourSuccess(false);
      setInquirySuccess(false);
    }
  }, [property?._id]);

  if (!property) return null;

  // Mortgage Math
  const homePrice = property.price;
  const downPaymentAmount = Math.round(homePrice * (downPaymentPercent / 100));
  const principal = homePrice - downPaymentAmount;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const monthlyPrincipalAndInterest = monthlyRate > 0
    ? Math.round(principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1))
    : Math.round(principal / numberOfPayments);
  
  const monthlyPropertyTax = Math.round((property.propertyTaxAnnual || homePrice * 0.012) / 12);
  const monthlyHomeInsurance = Math.round((homePrice * 0.0035) / 12);
  const monthlyHoa = property.hoaFee || 0;
  const totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyHoa;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleBookTour = async (e: React.FormEvent) => {
    e.preventDefault();
    setTourSubmitting(true);
    try {
      const res = await fetch('/api/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property._id,
          propertyTitle: property.title,
          propertyPrice: property.price,
          propertyImage: property.images[0],
          name: tourName,
          email: tourEmail,
          phone: tourPhone,
          preferredDate: tourDate,
          preferredTime: tourTime,
          tourType
        })
      });
      const data = await res.json();
      if (data.success) {
        setTourSuccess(true);
        onTourBooked();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTourSubmitting(false);
    }
  };

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property._id,
          propertyTitle: property.title,
          name: inquiryName,
          email: inquiryEmail,
          phone: inquiryPhone,
          inquiryType,
          offerAmount: inquiryType === 'make_offer' ? Number(offerAmount) : undefined,
          message: inquiryMessage || `Inquiry regarding ${property.title}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setInquirySuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInquirySubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex justify-center p-0 sm:p-4 md:p-6 lg:p-8 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-6xl rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar inside modal */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-stone-500 font-mono">
              ID: {property._id.slice(-8)}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              {property.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share listing"
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onToggleSave(property)}
              title={isSaved ? "Saved" : "Save property"}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isSaved ? 'text-amber-500 bg-amber-50' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto max-h-[85vh]">
          {/* Gallery Showcase */}
          <div className="space-y-3">
            {/* Main Stage Image */}
            <div className="aspect-[16/9] sm:aspect-[21/9] w-full bg-stone-900 rounded-xl overflow-hidden relative group">
              <img
                src={property.images[activeImageIndex] || property.images[0]}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';
                }}
              />
              <div className="absolute bottom-4 left-4 bg-stone-950/75 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded font-mono">
                Photo {activeImageIndex + 1} of {property.images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {property.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Core Content Grid: Left Details, Right Purchase/Action Module */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Architectural Description, Specs, Amenities */}
            <div className="lg:col-span-7 space-y-8">
              {/* Title & Location Header */}
              <div>
                <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>{property.address}, {property.neighborhood}, {property.city}, {property.state} {property.zipCode}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 tracking-tight">
                  {property.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-stone-500 font-mono mt-2">
                  <span>{property.propertyType}</span>
                  <span aria-hidden="true">·</span>
                  <span>Built {property.yearBuilt}</span>
                  <span aria-hidden="true">·</span>
                  <span>Lot: {property.lotSize}</span>
                </div>
              </div>

              {/* Specs Quick Strip */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200 text-center font-mono">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">{property.bedrooms}</p>
                  <p className="text-xs text-stone-500 mt-0.5">Bedrooms</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">{property.bathrooms}</p>
                  <p className="text-xs text-stone-500 mt-0.5">Bathrooms</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">{property.sqft.toLocaleString()}</p>
                  <p className="text-xs text-stone-500 mt-0.5">Living Sqft</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">{property.garage}</p>
                  <p className="text-xs text-stone-500 mt-0.5">Garage Cars</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-base font-bold text-stone-900 font-display mb-3">
                  Architectural Overview
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Key Highlights */}
              {property.highlights && property.highlights.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-stone-900 font-display mb-3">
                    Curated Highlights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {property.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-stone-700">
                        <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Luxury Amenities */}
              <div>
                <h3 className="text-base font-bold text-stone-900 font-display mb-3">
                  Property Amenities & Features
                </h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-stone-100 text-stone-800 text-xs font-medium rounded-md border border-stone-200"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Construction Specifications Table */}
              <div>
                <h3 className="text-base font-bold text-stone-900 font-display mb-3">
                  Building & Construction Specifications
                </h3>
                <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-200 text-xs">
                  <div className="grid grid-cols-3 p-3 bg-stone-50 font-medium text-stone-600">
                    <div>Ceiling Height</div>
                    <div className="col-span-2 text-stone-900 font-mono">{property.features.ceilingHeight}</div>
                  </div>
                  <div className="grid grid-cols-3 p-3 bg-white font-medium text-stone-600">
                    <div>Climate Cooling</div>
                    <div className="col-span-2 text-stone-900">{property.features.cooling}</div>
                  </div>
                  <div className="grid grid-cols-3 p-3 bg-stone-50 font-medium text-stone-600">
                    <div>Heating System</div>
                    <div className="col-span-2 text-stone-900">{property.features.heating}</div>
                  </div>
                  <div className="grid grid-cols-3 p-3 bg-white font-medium text-stone-600">
                    <div>Flooring & Surfaces</div>
                    <div className="col-span-2 text-stone-900">{property.features.flooring}</div>
                  </div>
                  <div className="grid grid-cols-3 p-3 bg-stone-50 font-medium text-stone-600">
                    <div>View Orientation</div>
                    <div className="col-span-2 text-stone-900">{property.features.views}</div>
                  </div>
                  <div className="grid grid-cols-3 p-3 bg-white font-medium text-stone-600">
                    <div>Parking Arrangement</div>
                    <div className="col-span-2 text-stone-900">{property.features.parking}</div>
                  </div>
                </div>
              </div>

              {/* Agent Representative Card */}
              <div className="p-5 bg-stone-900 text-stone-100 rounded-xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={property.agent.avatar}
                    alt={property.agent.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-400"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">{property.agent.name}</h4>
                      <span className="flex items-center gap-0.5 text-xs text-amber-400 font-mono">
                        <Award className="w-3.5 h-3.5" />
                        <span>{property.agent.rating}</span>
                      </span>
                    </div>
                    <p className="text-xs text-stone-400">{property.agent.brokerage}</p>
                    <p className="text-[11px] text-stone-500 font-mono mt-0.5">{property.agent.salesCount} closed transactions</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors cursor-pointer"
                    title="Call representative"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors cursor-pointer"
                    title="Email representative"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Contiguous Purchase / Schedule Module */}
            <div className="lg:col-span-5 sticky top-20 bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-6">
              {/* Pricing Header */}
              <div className="border-b border-stone-200 pb-4">
                <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
                  {property.listingType === 'rent' ? 'Lease / Monthly Rental' : 'Offered At'}
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="text-3xl sm:text-4xl font-bold font-mono tabular-nums text-stone-900">
                    {formatINR(property.price, property.listingType === 'rent')}
                  </p>
                  <p className="text-xs font-mono text-stone-500">
                    ₹{property.pricePerSqft.toLocaleString('en-IN')}/sqft
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-2 font-mono">
                  <span>{property.listingType === 'rent' ? 'Security Deposit:' : 'Est. EMI:'}</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    {property.listingType === 'rent' ? formatINR(property.price * 3) : `₹${totalMonthlyPayment.toLocaleString('en-IN')}/mo`}
                  </span>
                </div>
              </div>

              {/* Action Tabs: Tour, Mortgage, Inquiry */}
              <div className="flex items-center p-1 bg-stone-200/80 rounded-lg">
                <button
                  onClick={() => setActiveTab('tour')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    activeTab === 'tour'
                      ? 'bg-white text-stone-950 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Schedule Tour
                </button>
                <button
                  onClick={() => setActiveTab('mortgage')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    activeTab === 'mortgage'
                      ? 'bg-white text-stone-950 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Mortgage Calc
                </button>
                <button
                  onClick={() => setActiveTab('inquiry')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    activeTab === 'inquiry'
                      ? 'bg-white text-stone-950 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Make Offer
                </button>
              </div>

              {/* Tab 1: Schedule Tour Form */}
              {activeTab === 'tour' && (
                <div className="space-y-4">
                  {tourSuccess ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                      <h4 className="text-sm font-bold text-emerald-900">Showing Confirmed</h4>
                      <p className="text-xs text-emerald-700">
                        Your private showing request for {tourDate} at {tourTime} has been registered in our database. The concierge will contact you shortly.
                      </p>
                      <button
                        onClick={() => setTourSuccess(false)}
                        className="text-xs text-emerald-800 underline font-semibold mt-2 cursor-pointer"
                      >
                        Schedule another time
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleBookTour} className="space-y-3">
                      {/* Tour Mode */}
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Viewing Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setTourType('In-Person Private Showing')}
                            className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                              tourType === 'In-Person Private Showing'
                                ? 'bg-stone-900 text-white border-stone-900'
                                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            In-Person Showing
                          </button>
                          <button
                            type="button"
                            onClick={() => setTourType('Live Video Walkthrough')}
                            className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                              tourType === 'Live Video Walkthrough'
                                ? 'bg-stone-900 text-white border-stone-900'
                                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            Live Video Walkthrough
                          </button>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">
                            Preferred Date
                          </label>
                          <input
                            type="date"
                            required
                            value={tourDate}
                            onChange={(e) => setTourDate(e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">
                            Time Window
                          </label>
                          <select
                            value={tourTime}
                            onChange={(e) => setTourTime(e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                          >
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:30 AM">11:30 AM</option>
                            <option value="2:00 PM">2:00 PM</option>
                            <option value="4:00 PM">4:00 PM</option>
                            <option value="5:30 PM (Sunset)">5:30 PM (Sunset)</option>
                          </select>
                        </div>
                      </div>

                      {/* Contact Fields */}
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Eleanor Vance"
                          value={tourName}
                          onChange={(e) => setTourName(e.target.value)}
                          className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="eleanor@example.com"
                            value={tourEmail}
                            onChange={(e) => setTourEmail(e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={tourPhone}
                            onChange={(e) => setTourPhone(e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={tourSubmitting}
                        className="w-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>{tourSubmitting ? 'Confirming Tour...' : 'Request Private Showing'}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Tab 2: Mortgage Calculator */}
              {activeTab === 'mortgage' && (
                <div className="space-y-4">
                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-3">
                    {/* Down payment slider */}
                    <div>
                      <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                        <span>Down Payment ({downPaymentPercent}%)</span>
                        <span className="font-mono tabular-nums font-semibold">₹{downPaymentAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        step="5"
                        value={downPaymentPercent}
                        onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                    </div>

                    {/* Interest Rate */}
                    <div>
                      <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                        <span>Interest Rate</span>
                        <span className="font-mono tabular-nums font-semibold">{interestRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="3.0"
                        max="10.0"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                    </div>

                    {/* Loan Term */}
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Loan Term
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setLoanTermYears(20)}
                          className={`py-1.5 text-xs font-semibold rounded-md border cursor-pointer ${
                            loanTermYears === 20 ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-700 border-stone-200'
                          }`}
                        >
                          20 Years Fixed
                        </button>
                        <button
                          type="button"
                          onClick={() => setLoanTermYears(15)}
                          className={`py-1.5 text-xs font-semibold rounded-md border cursor-pointer ${
                            loanTermYears === 15 ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-700 border-stone-200'
                          }`}
                        >
                          15 Years Fixed
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Cost Breakdown */}
                  <div className="p-3 bg-stone-900 text-stone-100 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center text-sm font-bold border-b border-stone-800 pb-2">
                      <span>Total Estimated EMI</span>
                      <span className="font-mono text-amber-400 tabular-nums text-base">
                        ₹{totalMonthlyPayment.toLocaleString('en-IN')}/mo
                      </span>
                    </div>
                    <div className="flex justify-between text-stone-300">
                      <span>Principal & Interest</span>
                      <span className="font-mono tabular-nums">₹{monthlyPrincipalAndInterest.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-stone-300">
                      <span>Property Taxes (est.)</span>
                      <span className="font-mono tabular-nums">₹{monthlyPropertyTax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-stone-300">
                      <span>Home Insurance</span>
                      <span className="font-mono tabular-nums">₹{monthlyHomeInsurance.toLocaleString('en-IN')}</span>
                    </div>
                    {monthlyHoa > 0 && (
                      <div className="flex justify-between text-stone-300">
                        <span>Society / Maintenance</span>
                        <span className="font-mono tabular-nums">₹{monthlyHoa.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Make Offer / Send Inquiry */}
              {activeTab === 'inquiry' && (
                <div className="space-y-4">
                  {inquirySuccess ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                      <h4 className="text-sm font-bold text-emerald-900">Offer Submitted</h4>
                      <p className="text-xs text-emerald-700">
                        Your transaction inquiry has been routed to the listing broker. An agent will reach out within 2 hours.
                      </p>
                      <button
                        onClick={() => setInquirySuccess(false)}
                        className="text-xs text-emerald-800 underline font-semibold mt-2 cursor-pointer"
                      >
                        Send another note
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSendInquiry} className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Inquiry Intent
                        </label>
                        <select
                          value={inquiryType}
                          onChange={(e: any) => setInquiryType(e.target.value)}
                          className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                        >
                          <option value="general">Request Property Dossier & Specs</option>
                          <option value="make_offer">Submit Purchase Offer</option>
                          <option value="request_brochure">Architectural Brochure PDF</option>
                        </select>
                      </div>

                      {inquiryType === 'make_offer' && (
                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">
                            Offer Price (INR ₹)
                          </label>
                          <div className="relative">
                            <span className="text-stone-400 font-bold absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                            <input
                              type="number"
                              required
                              value={offerAmount}
                              onChange={(e) => setOfferAmount(e.target.value)}
                              className="w-full bg-white border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs font-mono font-semibold text-stone-900 focus:outline-none focus:border-stone-900"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="your.email@example.com"
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Message / Conditions
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Financing readiness, proposed closing timeframe, or specific inquiries..."
                          value={inquiryMessage}
                          onChange={(e) => setInquiryMessage(e.target.value)}
                          className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={inquirySubmitting}
                        className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <span>{inquirySubmitting ? 'Transmitting Offer...' : 'Transmit Offer to Listing Agent'}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Verified Trust Markers */}
              <div className="pt-3 border-t border-stone-200 text-[11px] text-stone-500 space-y-1 font-mono">
                <p>✓ Direct representation by licensed listing brokerage</p>
                <p>✓ Title and escrow guaranteed transaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
