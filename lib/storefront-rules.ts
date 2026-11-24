import type { Product } from './products'

export const MIN_DEMO_QUANTITY = 1
export const MAX_DEMO_QUANTITY = 9
export const ONE_SIZE = 'one-size'
export const fittedSizes = ['7', '7⅛', '7¼', '7⅜', '7½', '7⅝', '7¾'] as const

export type SizeOption = { value: string; selectable: boolean }
export type CartLine = { product: Product; size: string; quantity: number }
type CartFeedback = { kind: 'added'; productName: string; size: string } | { kind: 'size' | 'quantity' }
export type DemoCartState = { lines: CartLine[]; feedback: CartFeedback | null }
export type DemoCartAction =
  | { type: 'add'; product: Product; size: string | null; quantity: number }
  | { type: 'change'; productId: string; size: string; change: -1 | 1 }
  | { type: 'dismiss' }

export function getSizeOptions(product: Product): readonly SizeOption[] {
  // These defaults are demonstration choices, never stock records. A future
  // catalog adapter must supply explicit options from verified variants.
  return product.sizeOptions ?? (product.style === 'Adjustable'
    ? [{ value: ONE_SIZE, selectable: true }]
    : fittedSizes.map((value) => ({ value, selectable: true })))
}

export function isValidSize(product: Product, size: string | null): size is string {
  return size !== null && getSizeOptions(product).some((option) => option.value === size && option.selectable)
}

export function initialSize(product: Product): string | null {
  return product.style === 'Adjustable' && isValidSize(product, ONE_SIZE) ? ONE_SIZE : null
}

export function isValidQuantity(quantity: number): boolean {
  return Number.isSafeInteger(quantity) && quantity >= MIN_DEMO_QUANTITY && quantity <= MAX_DEMO_QUANTITY
}

export function getLineQuantity(lines: readonly CartLine[], productId: string, size: string | null): number {
  return lines.find((line) => line.product.id === productId && line.size === size)?.quantity ?? 0
}

export function canAddItem(lines: readonly CartLine[], product: Product, size: string | null, quantity: number): boolean {
  return isValidSize(product, size) && isValidQuantity(quantity)
    && isValidQuantity(getLineQuantity(lines, product.id, size) + quantity)
}

export function demoCartReducer(state: DemoCartState, action: DemoCartAction): DemoCartState {
  if (action.type === 'dismiss') return { ...state, feedback: null }

  if (action.type === 'add') {
    const { product, size, quantity } = action
    if (!isValidSize(product, size)) return { ...state, feedback: { kind: 'size' } }
    if (!canAddItem(state.lines, product, size, quantity)) return { ...state, feedback: { kind: 'quantity' } }

    const existing = getLineQuantity(state.lines, product.id, size)
    const lines = existing
      ? state.lines.map((line) => line.product.id === product.id && line.size === size
        ? { ...line, quantity: line.quantity + quantity } : line)
      : [...state.lines, { product, size, quantity }]
    return { lines, feedback: { kind: 'added', productName: product.name, size } }
  }

  const existing = state.lines.find((line) => line.product.id === action.productId && line.size === action.size)
  if (!existing || (action.change !== -1 && action.change !== 1)) return state
  const quantity = existing.quantity + action.change
  if (quantity === 0) {
    return { lines: state.lines.filter((line) => line !== existing), feedback: null }
  }
  if (!isValidQuantity(quantity)) return { ...state, feedback: { kind: 'quantity' } }
  return { lines: state.lines.map((line) => line === existing ? { ...line, quantity } : line), feedback: null }
}

export function demoSubtotalUsdMinor(lines: readonly CartLine[]): number {
  return lines.reduce((total, line) => {
    if (!isValidQuantity(line.quantity) || !Number.isSafeInteger(line.product.priceUsdMinor) || line.product.priceUsdMinor < 0) {
      throw new Error('Invalid demo cart amount')
    }
    const next = total + line.product.priceUsdMinor * line.quantity
    if (!Number.isSafeInteger(next)) throw new Error('Demo subtotal exceeds exact integer range')
    return next
  }, 0)
}
