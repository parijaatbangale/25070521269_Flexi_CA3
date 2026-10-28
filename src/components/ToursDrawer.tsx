import React, { useEffect, useState } from 'react';
import { X, Calendar, Clock, Video, UserCheck, RefreshCw, MessageSquare } from 'lucide-react';
import { TourBooking, Inquiry } from '../types/property.ts';
import { formatINR } from '../utils/formatters.ts';

interface ToursDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ToursDrawer: React.FC<ToursDrawerProps> = ({ isOpen, onClose }) => {
  const [tours, setTours] = useState<TourBooking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'tours' | 'inquiries'>('tours');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resTours, resInquiries] = await Promise.all([
        fetch('/api/tours'),
        fetch('/api/inquiries')
      ]);
      const dataTours = await resTours.json();
      const dataInquiries = await resInquiries.json();
      if (dataTours.success) setTours(dataTours.data);
      if (dataInquiries.success) setInquiries(dataInquiries.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-display">
              Transactions & Showings Portal
            </h3>
            <p className="text-xs text-stone-500 font-mono">
              Scheduled Client Appointments & Inbound Offers
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg transition-colors cursor-pointer"
              title="Refresh records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-5 pt-3 bg-white border-b border-stone-200 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('tours')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tours' ? 'border-amber-500 text-stone-950' : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Booked Showings ({tours.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'inquiries' ? 'border-amber-500 text-stone-950' : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Buyer Inquiries & Offers ({inquiries.length})</span>
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {activeTab === 'tours' && (
            tours.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <Calendar className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="text-sm font-semibold text-stone-700">No scheduled tours yet</p>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  When a client books an in-person or live video tour on any property, it appears here in real-time.
                </p>
              </div>
            ) : (
              tours.map((tour) => (
                <div key={tour._id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
                      {tour.tourType}
                    </span>
                    <span className="text-stone-400">
                      {new Date(tour.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-stone-900 font-display">{tour.propertyTitle}</h4>
                    <p className="text-xs font-mono text-stone-600 mt-0.5">
                      Client: <span className="font-semibold text-stone-900">{tour.name}</span> ({tour.email})
                    </p>
                    {tour.phone && (
                      <p className="text-xs font-mono text-stone-500">Phone: {tour.phone}</p>
                    )}
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-stone-200 text-xs flex items-center justify-between font-mono">
                    <span className="flex items-center gap-1.5 text-stone-700">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{tour.preferredDate} at {tour.preferredTime}</span>
                    </span>
                    <span className="text-emerald-700 font-semibold uppercase text-[10px] tracking-wider">
                      {tour.status}
                    </span>
                  </div>
                </div>
              ))
            )
          )}

          {activeTab === 'inquiries' && (
            inquiries.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <MessageSquare className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="text-sm font-semibold text-stone-700">No purchase offers or inquiries yet</p>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  Submit an offer or request a brochure in any property view to register an inquiry.
                </p>
              </div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq._id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-stone-900 font-bold uppercase text-[11px] tracking-wider">
                      {inq.inquiryType.replace('_', ' ')}
                    </span>
                    <span className="text-stone-400">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-stone-900">{inq.propertyTitle}</h4>
                  <p className="text-xs text-stone-600">
                    From: <span className="font-semibold text-stone-900">{inq.name}</span> ({inq.email})
                  </p>
                  {inq.offerAmount && (
                    <p className="text-xs font-mono font-bold text-amber-700">
                      Offer: {formatINR(inq.offerAmount)}
                    </p>
                  )}
                  <div className="p-2.5 bg-white rounded-lg border border-stone-200 text-xs text-stone-700 italic">
                    "{inq.message}"
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 text-right text-xs text-stone-400 font-mono">
          Live Concierge Synchronization
        </div>
      </div>
    </div>
  );
};
