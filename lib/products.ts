export type Product = {
  id: string
  name: string
  style: 'Fitted' | 'Adjustable'
  color: string
  colorName: string
  image: string
  detail: string
  accent: string
  priceUsdMinor: number
  // Optional explicit choices, including disabled/unavailable variants. The
  // current records remain demos without claims about actual SKU inventory.
  sizeOptions?: readonly { value: string; selectable: boolean }[]
}

export const products: Product[] = [
  {
    id: 'midnight',
    name: 'ROTEX Midnight',
    style: 'Fitted',
    color: 'Deep navy',
    colorName: 'Midnight',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ff776965-e339-4504-bdee-430e442c5a24-yNm9qeLGw0kSmyvCzBHAUi6CIz7p1B.png',
    detail: 'A deep navy profile with crisp, tonal detailing.',
    accent: '#122344',
    priceUsdMinor: 5800,
  },
  {
    id: 'forest',
    name: 'ROTEX Forest',
    style: 'Fitted',
    color: 'Forest green',
    colorName: 'Forest',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/eefc98b0-3984-429e-bec9-ae8490bb053f-bozoI50xObkD4Pc6uUezXumAX5VlKC.png',
    detail: 'A statement green colorway with bright embroidered artwork.',
    accent: '#075c36',
    priceUsdMinor: 5800,
  },
  {
    id: 'heritage',
    name: 'ROTEX Heritage',
    style: 'Fitted',
    color: 'Black, red & olive',
    colorName: 'Heritage',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/194da757-b51d-4891-9509-3530a89cdca3-AEeEkScIqQgTzJGwhgZCDGut83zOQj.png',
    detail: 'A three-tone mix with a contrast brim and side monogram.',
    accent: '#870d18',
    priceUsdMinor: 5800,
  },
  {
    id: 'crimson',
    name: 'ROTEX Crimson',
    style: 'Fitted',
    color: 'Crimson & black',
    colorName: 'Crimson',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a9f1e012-0bd5-4084-9433-f7ae2d7666c7-GW58wlktLc3j3GsoISX1yDBwC8fBV5.png',
    detail: 'A rich crimson crown grounded by a dark contrast brim.',
    accent: '#96060a',
    priceUsdMinor: 5800,
  },
  {
    id: 'royal',
    name: 'ROTEX Royal',
    style: 'Fitted',
    color: 'Royal blue',
    colorName: 'Royal',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7c189cd9-5def-4470-a365-bb4c322214ea-z4IfMCkWac1Tbs7PBRQmcHx29T1voW.png',
    detail: 'A vivid blue cap with bright embroidered contrast.',
    accent: '#1559d5',
    priceUsdMinor: 5800,
  },
  {
    id: 'sand',
    name: 'ROTEX Sand',
    style: 'Fitted',
    color: 'Golden yellow & black',
    colorName: 'Sand',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2c2c8ef0-7266-43ed-88f9-97fb7c901489-UXleRByqlPwL5cEbOnOJxsjEy7RMee.png',
    detail: 'A warm, high-impact colorway with dark detailing.',
    accent: '#e5a100',
    priceUsdMinor: 5800,
  },
]
