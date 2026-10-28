/**
 * Helper to format Indian Rupee (INR) currency values
 */
export function formatINR(amount: number, isRent: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }

  // For rent: e.g. ₹4.5 Lakh/mo or ₹4,50,000/mo
  if (isRent) {
    if (amount >= 10000000) {
      const cr = (amount / 10000000).toFixed(2).replace(/\.00$/, '');
      return `₹${cr} Cr/mo`;
    }
    if (amount >= 100000) {
      const lakh = (amount / 100000).toFixed(1).replace(/\.0$/, '');
      return `₹${lakh} Lakh/mo`;
    }
    return `₹${amount.toLocaleString('en-IN')}/mo`;
  }

  // For sale: e.g. ₹14.85 Cr or ₹85 Lakh
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2).replace(/\.00$/, '');
    return `₹${cr} Cr`;
  }
  if (amount >= 100000) {
    const lakh = (amount / 100000).toFixed(1).replace(/\.0$/, '');
    return `₹${lakh} Lakh`;
  }

  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Full Indian Rupee formatted number (e.g. ₹14,85,00,000)
 */
export function formatINRFull(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}
