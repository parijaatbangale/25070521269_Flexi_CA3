import React, { useState } from 'react';
import { X, Database, RefreshCw, Terminal, CheckCircle2, Server, FileCode, Layers } from 'lucide-react';
import { DatabaseStats, Property } from '../types/property.ts';

interface DatabaseInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  dbStats: DatabaseStats | null;
  properties: Property[];
  onReseed: () => void;
}

export const DatabaseInspectorModal: React.FC<DatabaseInspectorModalProps> = ({
  isOpen,
  onClose,
  dbStats,
  properties,
  onReseed
}) => {
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'documents' | 'architecture' | 'endpoints'>('documents');
  const [reseeding, setReseeding] = useState(false);
  const [reseedDone, setReseedDone] = useState(false);

  if (!isOpen) return null;

  const activeDoc = properties[selectedDocIndex] || properties[0];

  const handleReseed = async () => {
    setReseeding(true);
    try {
      const res = await fetch('/api/db/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        onReseed();
        setReseedDone(true);
        setTimeout(() => setReseedDone(false), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReseeding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex justify-center p-0 sm:p-4 md:p-6 lg:p-8 animate-in fade-in duration-200">
      <div 
        className="relative bg-stone-900 text-stone-100 w-full max-w-5xl rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400/10 rounded-lg text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">
                  System Infrastructure & Data Console
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono">
                Enterprise Real Estate Data Architecture & Services
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Strip */}
        <div className="px-6 py-3 bg-stone-900 border-b border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-stone-500 block">ENGINE</span>
            <span className="text-amber-400 font-semibold">{dbStats?.databaseType || 'Persisted Engine'}</span>
          </div>
          <div>
            <span className="text-stone-500 block">COLLECTIONS</span>
            <span className="text-stone-200">properties, inquiries, tours</span>
          </div>
          <div>
            <span className="text-stone-500 block">TOTAL ESTATES</span>
            <span className="text-stone-200 tabular-nums">{properties.length} Documents</span>
          </div>
          <div className="flex items-center justify-end">
            <button
              onClick={handleReseed}
              disabled={reseeding}
              className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${reseeding ? 'animate-spin' : ''}`} />
              <span>{reseedDone ? 'Reseeded!' : 'Reset Sample Data'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-stone-950 border-b border-stone-800 flex gap-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-2.5 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'documents' ? 'border-amber-400 text-amber-400' : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Raw BSON/JSON Documents
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-2.5 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'architecture' ? 'border-amber-400 text-amber-400' : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            MERN Architecture
          </button>
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`pb-2.5 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'endpoints' ? 'border-amber-400 text-amber-400' : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Node.js REST Endpoints
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'documents' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Document List Selector */}
              <div className="md:col-span-4 space-y-1.5 max-h-[420px] overflow-y-auto pr-2">
                <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider block mb-2">
                  Select Document (_id)
                </span>
                {properties.map((prop, idx) => (
                  <button
                    key={prop._id}
                    onClick={() => setSelectedDocIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      selectedDocIndex === idx
                        ? 'bg-amber-400 text-stone-950 font-semibold shadow-xs'
                        : 'bg-stone-800/60 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="truncate font-bold">{prop.title}</div>
                    <div className="text-[10px] opacity-75 truncate">_id: {prop._id}</div>
                  </button>
                ))}
              </div>

              {/* Document JSON Preview */}
              <div className="md:col-span-8 bg-stone-950 rounded-xl p-4 border border-stone-800 font-mono text-xs overflow-x-auto max-h-[420px]">
                <div className="flex items-center justify-between text-stone-400 pb-2 mb-2 border-b border-stone-800 text-[11px]">
                  <span>MongoDB Document: db.properties.findOne(&#123; _id: "{activeDoc?._id}" &#125;)</span>
                  <span className="text-amber-400">{activeDoc?.propertyType}</span>
                </div>
                <pre className="text-emerald-400 whitespace-pre leading-relaxed">
                  {JSON.stringify(activeDoc, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-6 text-xs text-stone-300">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
                    <Layers className="w-4 h-4" />
                    <span>React Frontend</span>
                  </div>
                  <p className="text-stone-400">
                    Vite-powered React application with functional hooks, typed models, responsive architectural layouts, mortgage calculator, and showing scheduler.
                  </p>
                </div>

                <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
                    <Server className="w-4 h-4" />
                    <span>Node.js & Express</span>
                  </div>
                  <p className="text-stone-400">
                    Express server running on port 3000 handling REST routes for property CRUD, buyer inquiries, showing reservations, and database seeding.
                  </p>
                </div>

                <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
                    <Database className="w-4 h-4" />
                    <span>MongoDB Store</span>
                  </div>
                  <p className="text-stone-400">
                    Official mongodb driver integration with support for live MongoDB Atlas connection via <code>MONGODB_URI</code>, backed by a persistent file document engine.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3 font-mono">
                <span className="text-amber-400 font-semibold block">Connecting to Live MongoDB Atlas:</span>
                <p className="text-stone-400">
                  To connect your own MongoDB Atlas cluster, set the environment variable in <code className="text-white">.env</code>:
                </p>
                <div className="p-3 bg-stone-900 rounded border border-stone-800 text-stone-200 select-all">
                  MONGODB_URI="mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.mongodb.net/aura_estates?retryWrites=true&amp;w=majority"
                </div>
                <p className="text-stone-400">
                  The Node.js server automatically detects the URI on boot, provisions the collections, and queries your cluster.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'endpoints' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-blue-900/60 text-blue-400 rounded font-bold">GET</span>
                  <span className="text-stone-200">/api/properties</span>
                </div>
                <span className="text-stone-400">Filter, search, and sort property listings</span>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-blue-900/60 text-blue-400 rounded font-bold">GET</span>
                  <span className="text-stone-200">/api/properties/:id</span>
                </div>
                <span className="text-stone-400">Fetch specific listing by ObjectId or slug</span>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-emerald-900/60 text-emerald-400 rounded font-bold">POST</span>
                  <span className="text-stone-200">/api/properties</span>
                </div>
                <span className="text-stone-400">List new estate into MongoDB collection</span>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-emerald-900/60 text-emerald-400 rounded font-bold">POST</span>
                  <span className="text-stone-200">/api/inquiries</span>
                </div>
                <span className="text-stone-400">Submit buyer purchase offer or information request</span>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-emerald-900/60 text-emerald-400 rounded font-bold">POST</span>
                  <span className="text-stone-200">/api/tours</span>
                </div>
                <span className="text-stone-400">Schedule private in-person showing or video tour</span>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-blue-900/60 text-blue-400 rounded font-bold">GET</span>
                  <span className="text-stone-200">/api/db/stats</span>
                </div>
                <span className="text-stone-400">Database health, connection status, and document counts</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
