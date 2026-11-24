export type Currency = 'USD' | 'SYP'
export type DemoCurrency = 'USD'

export const demoCurrencyOptions: readonly { currency: Currency; enabled: boolean }[] = [
  { currency: 'USD', enabled: true },
  // New-SYP prices and precision have not been approved. No conversion is offered.
  { currency: 'SYP', enabled: false },
]

export function selectDemoCurrency(value: string): DemoCurrency {
  return value === 'USD' ? value : 'USD'
}

export function formatDemoPrice(amountUsdMinor: number, currency: DemoCurrency): string {
  if (!Number.isSafeInteger(amountUsdMinor) || amountUsdMinor < 0 || currency !== 'USD') {
    throw new Error('Invalid demo USD price')
  }

  // Format whole units and cents separately so even large safe-integer amounts
  // retain their last cent. No SYP precision or conversion is implied here.
  const minor = BigInt(amountUsdMinor)
  const centsPerDollar = BigInt(100)
  const cents = minor % centsPerDollar
  const whole = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(minor / centsPerDollar)
  return cents === BigInt(0) ? whole : `${whole}.${cents.toString().padStart(2, '0')}`
}
