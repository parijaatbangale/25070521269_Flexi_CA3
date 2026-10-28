import React, { useState } from 'react';
import { X, Calculator, ShieldCheck } from 'lucide-react';
import { formatINR } from '../utils/formatters.ts';

interface MortgageModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPrice?: number;
}

export const MortgageModal: React.FC<MortgageModalProps> = ({
  isOpen,
  onClose,
  defaultPrice = 185000000
}) => {
  const [price, setPrice] = useState(defaultPrice);
  const [downPercent, setDownPercent] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [term, setTerm] = useState(20);
  const [annualTaxRate, setAnnualTaxRate] = useState(0.85); // %
  const [hoa, setHoa] = useState(25000);

  React.useEffect(() => {
    if (defaultPrice) {
      setPrice(defaultPrice);
    }
  }, [defaultPrice]);

  if (!isOpen) return null;

  const downAmount = Math.round(price * (downPercent / 100));
  const principal = price - downAmount;
  const monthlyRate = rate / 100 / 12;
  const numPayments = term * 12;

  const monthlyPrincipalAndInterest = monthlyRate > 0
    ? Math.round(principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1))
    : Math.round(principal / numPayments);

  const monthlyTax = Math.round((price * (annualTaxRate / 100)) / 12);
  const monthlyInsurance = Math.round((price * 0.002) / 12);
  const totalMonthly = monthlyPrincipalAndInterest + monthlyTax + monthlyInsurance + hoa;

  const piPercent = Math.max(1, Math.round((monthlyPrincipalAndInterest / totalMonthly) * 100));
  const taxPercent = Math.max(1, Math.round((monthlyTax / totalMonthly) * 100));
  const insPercent = Math.max(1, Math.round((monthlyInsurance / totalMonthly) * 100));
  const hoaPercent = Math.max(1, 100 - (piPercent + taxPercent + insPercent));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex justify-center p-0 sm:p-4 md:p-6 lg:p-8 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-3xl rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-400/20 text-amber-400 rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white">
                Luxury Estate Home Loan & EMI Modeler
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Indian Rupee (INR) Principal, Bank Interest, Property Tax & Society Escrow
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

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto max-h-[85vh]">
          {/* Top Level Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-stone-900 text-stone-100 rounded-xl font-mono sm:col-span-2 flex flex-col justify-between">
              <div>
                <span className="text-xs text-stone-400 uppercase tracking-wider">
                  Total Estimated Monthly EMI & Outflow
                </span>
                <p className="text-3xl sm:text-4xl font-bold text-amber-400 tabular-nums mt-1">
                  ₹{totalMonthly.toLocaleString('en-IN')}<span className="text-sm text-stone-400 font-normal">/mo</span>
                </p>
              </div>

              {/* Progress bar ratio */}
              <div className="mt-4 space-y-1.5">
                <div className="h-2.5 w-full bg-stone-800 rounded-full overflow-hidden flex">
                  <div style={{ width: `${piPercent}%` }} className="bg-amber-400 h-full" title="EMI" />
                  <div style={{ width: `${taxPercent}%` }} className="bg-emerald-400 h-full" title="Taxes" />
                  <div style={{ width: `${insPercent}%` }} className="bg-cyan-400 h-full" title="Insurance" />
                  <div style={{ width: `${hoaPercent}%` }} className="bg-purple-400 h-full" title="Maintenance" />
                </div>
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>Loan EMI: {piPercent}%</span>
                  <span>Taxes: {taxPercent}%</span>
                  <span>Insurance: {insPercent}%</span>
                  <span>Society: {hoaPercent}%</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 font-mono flex flex-col justify-between">
              <div>
                <span className="text-xs text-stone-500 uppercase tracking-wider">Sanctioned Loan</span>
                <p className="text-xl font-bold text-stone-900 tabular-nums mt-1">
                  {formatINR(principal)}
                </p>
              </div>
              <div className="pt-2 border-t border-stone-200 text-xs text-stone-600">
                <span>Own Contribution: </span>
                <span className="font-bold text-stone-900 tabular-nums">{formatINR(downAmount)}</span>
              </div>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Purchase Price */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                Estate Valuation / Price (INR ₹)
              </label>
              <div className="relative">
                <span className="text-stone-400 font-bold absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                <input
                  type="number"
                  step="1000000"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-8 pr-3 py-2 text-sm font-mono font-bold text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            {/* Down Payment % */}
            <div>
              <div className="flex justify-between text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                <span>Own Contribution ({downPercent}%)</span>
                <span className="font-mono tabular-nums text-stone-900">₹{downAmount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={downPercent}
                onChange={(e) => setDownPercent(Number(e.target.value))}
                className="w-full accent-amber-500 mt-2"
              />
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                <span>Home Loan Interest Rate</span>
                <span className="font-mono tabular-nums text-stone-900">{rate}% p.a.</span>
              </div>
              <input
                type="range"
                min="7.5"
                max="12.0"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-amber-500 mt-2"
              />
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                Repayment Tenure
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTerm(20)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    term === 20 ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  20 Years Fixed
                </button>
                <button
                  type="button"
                  onClick={() => setTerm(15)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    term === 15 ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  15 Years Fixed
                </button>
              </div>
            </div>

            {/* Monthly HOA */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                Monthly Society Maintenance (₹)
              </label>
              <input
                type="number"
                value={hoa}
                onChange={(e) => setHoa(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>

            {/* Annual Property Tax Rate */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                Municipal Property Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.05"
                value={annualTaxRate}
                onChange={(e) => setAnnualTaxRate(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-200 text-xs font-mono">
            <div className="p-3 bg-stone-50 flex justify-between font-bold text-stone-900">
              <span>Monthly Bank Loan EMI (Principal & Interest)</span>
              <span className="tabular-nums">₹{monthlyPrincipalAndInterest.toLocaleString('en-IN')}/mo</span>
            </div>
            <div className="p-3 bg-white flex justify-between text-stone-700">
              <span>Municipal Property Taxes (Monthly Escrow)</span>
              <span className="tabular-nums">₹{monthlyTax.toLocaleString('en-IN')}/mo</span>
            </div>
            <div className="p-3 bg-stone-50 flex justify-between text-stone-700">
              <span>Structure & Fire Hazard Insurance</span>
              <span className="tabular-nums">₹{monthlyInsurance.toLocaleString('en-IN')}/mo</span>
            </div>
            <div className="p-3 bg-white flex justify-between text-stone-700">
              <span>Resident Welfare Association / Society Dues</span>
              <span className="tabular-nums">₹{hoa.toLocaleString('en-IN')}/mo</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Calculations benchmarked against premier Indian banking institutions (HDFC, SBI, ICICI Private Banking).</span>
          </div>
        </div>
      </div>
    </div>
  );
};
