export function formatRupiah(amount: number, withPrefix = true): string {
  const formatted = Math.abs(amount).toLocaleString('id-ID');
  return withPrefix ? `Rp ${formatted}` : formatted;
}

export function formatSignedRupiah(amount: number, type: 'inflow' | 'outflow'): string {
  const formatted = Math.abs(amount).toLocaleString('id-ID');
  if (type === 'inflow') {
    return `+Rp ${formatted}`;
  } else {
    return `-Rp ${formatted}`;
  }
}

export function formatCompactRupiah(amount: number, withSign = false, type?: 'inflow' | 'outflow'): string {
  const abs = Math.abs(amount);
  let text = '';
  if (abs >= 1000000) {
    const val = abs / 1000000;
    // e.g. 6.2jt or 6jt
    text = `${val % 1 === 0 ? val.toFixed(0) : val.toFixed(2).replace(/\.?0+$/, '')}jt`;
  } else if (abs >= 1000) {
    const val = abs / 1000;
    text = `${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace(/\.?0+$/, '')}rb`;
  } else {
    text = abs.toString();
  }

  if (withSign) {
    if (type === 'inflow' || amount > 0) return `+${text}`;
    if (type === 'outflow' || amount < 0) return `-${text}`;
  }
  return text;
}
