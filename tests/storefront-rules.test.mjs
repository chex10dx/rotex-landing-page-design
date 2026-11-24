import assert from 'node:assert/strict'
import test from 'node:test'
import { products } from '../lib/products.ts'
import {
  MAX_DEMO_QUANTITY,
  ONE_SIZE,
  canAddItem,
  demoCartReducer,
  demoSubtotalUsdMinor,
  getSizeOptions,
  initialSize,
  isValidQuantity,
} from '../lib/storefront-rules.ts'
import { demoCurrencyOptions, formatDemoPrice, selectDemoCurrency } from '../lib/money/demo.ts'

const empty = () => ({ lines: [], feedback: null })
const add = (state, product = products[0], size = '7¼', quantity = 1) =>
  demoCartReducer(state, { type: 'add', product, size, quantity })

test('fitted choices require an explicit valid size in every add action', () => {
  for (const product of products) {
    assert.equal(initialSize(product), null)
    for (const size of [null, '', 'not-a-size', ONE_SIZE]) {
      const result = add(empty(), product, size)
      assert.deepEqual(result.lines, [])
      assert.equal(result.feedback.kind, 'size')
    }
    assert.equal(add(empty(), product, '7⅛').lines[0].size, '7⅛')
  }
})

test('explicit catalog choices reject disabled or missing sizes without inventing availability', () => {
  const product = { ...products[0], sizeOptions: [{ value: '7', selectable: true }, { value: '7¼', selectable: false }] }
  assert.equal(canAddItem([], product, '7', 1), true)
  assert.deepEqual(add(empty(), product, '7¼').lines, [])
  assert.deepEqual(add(empty(), product, '7⅛').lines, [])
  assert.deepEqual(getSizeOptions({ ...product, sizeOptions: [] }), [])
  assert.deepEqual(add(empty(), { ...product, sizeOptions: [] }, '7').lines, [])
})

test('adjustable one-size support uses fixtures only and respects explicit unavailability', () => {
  const adjustable = { ...products[0], id: 'test-only-adjustable', style: 'Adjustable' }
  assert.equal(initialSize(adjustable), ONE_SIZE)
  assert.equal(add(empty(), adjustable, ONE_SIZE).lines[0].size, ONE_SIZE)
  assert.deepEqual(add(empty(), adjustable, '7¼').lines, [])
  const unavailable = { ...adjustable, sizeOptions: [{ value: ONE_SIZE, selectable: false }] }
  assert.equal(initialSize(unavailable), null)
  assert.deepEqual(add(empty(), unavailable, ONE_SIZE).lines, [])
  assert.equal(products.length, 6)
  assert.ok(products.every((product) => product.style === 'Fitted'))
})

test('invalid quantities cannot enter the bag', () => {
  for (const quantity of [0, -1, 1.5, NaN, Infinity, -Infinity, MAX_DEMO_QUANTITY + 1, Number.MAX_SAFE_INTEGER, '2']) {
    assert.equal(isValidQuantity(quantity), false)
    assert.deepEqual(add(empty(), products[0], '7', quantity).lines, [])
  }
})

test('repeated adds merge a variant and cannot exceed the limit', () => {
  let state = empty()
  for (let index = 0; index < 30; index++) state = add(state)
  assert.equal(state.lines.length, 1)
  assert.equal(state.lines[0].quantity, MAX_DEMO_QUANTITY)
  assert.equal(state.feedback.kind, 'quantity')
  state = add(state, products[0], '7', 2)
  state = add(state, products[1], '7¼', 3)
  assert.equal(state.lines.length, 3)
  assert.deepEqual(state.lines.map((line) => line.quantity), [MAX_DEMO_QUANTITY, 2, 3])
})

test('cart controls share limits and removing the last unit removes its line', () => {
  let state = add(empty(), products[0], '7', MAX_DEMO_QUANTITY)
  const change = (delta) => { state = demoCartReducer(state, { type: 'change', productId: products[0].id, size: '7', change: delta }) }
  change(1)
  assert.equal(state.lines[0].quantity, MAX_DEMO_QUANTITY)
  change(1.5)
  assert.equal(state.lines[0].quantity, MAX_DEMO_QUANTITY)
  for (let index = 0; index < MAX_DEMO_QUANTITY; index++) change(-1)
  assert.deepEqual(state.lines, [])
  change(-1)
  assert.deepEqual(state.lines, [])
})

test('demo amounts use exact integer cents and reject unsafe totals', () => {
  const product = { ...products[0], priceUsdMinor: 25 }
  assert.equal(demoSubtotalUsdMinor(add(empty(), product, '7', 3).lines), 75)
  assert.equal(formatDemoPrice(75, 'USD'), '$0.75')
  assert.equal(formatDemoPrice(50, 'USD'), '$0.50')
  assert.equal(formatDemoPrice(Number.MAX_SAFE_INTEGER, 'USD'), '$90,071,992,547,409.91')
  assert.equal(formatDemoPrice(products[0].priceUsdMinor, 'USD'), '$58')
  assert.equal(demoSubtotalUsdMinor([]), 0)
  assert.throws(() => demoSubtotalUsdMinor([{ product: { ...product, priceUsdMinor: Number.MAX_SAFE_INTEGER }, size: '7', quantity: 2 }]))
  assert.throws(() => demoSubtotalUsdMinor([{ product, size: '7', quantity: 1.5 }]))
  assert.throws(() => formatDemoPrice(1.5, 'USD'))
})

test('unapproved new-SYP selection never relabels a USD amount', () => {
  assert.deepEqual(demoCurrencyOptions.filter((option) => option.enabled).map((option) => option.currency), ['USD'])
  for (const requested of ['USD', 'SYP', 'old-SYP', 'EUR', '']) assert.equal(selectDemoCurrency(requested), 'USD')
  assert.throws(() => formatDemoPrice(5800, 'SYP'))
})
