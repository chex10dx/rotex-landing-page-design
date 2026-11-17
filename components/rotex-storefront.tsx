'use client'

import Image from 'next/image'
import { useMemo, useState, type FormEvent } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Globe2,
  Menu,
  Minus,
  Plus,
  Ruler,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from 'lucide-react'
import { fittedSizes, products, type Product } from '@/lib/products'

type Currency = 'USD' | 'SYP'
type CartLine = { product: Product; size: string; quantity: number }

const copy = {
  en: {
    announcement: 'THE FIRST DROP IS HERE',
    navigation: ['New arrivals', 'Fitted caps', 'Adjustable caps', 'Collections', 'Our story'],
    headline: 'BUILT TO\nSTAND OUT.',
    subhead: 'Premium headwear. Distinctive designs. Made for your everyday statement.',
    shop: 'Shop the first drop',
    explore: 'Explore ROTEX',
    collection: 'THE FIRST DROP',
    collectionSub: 'Discover the pieces that define ROTEX.',
    all: 'View all pieces',
    styles: 'FIND YOUR FIT',
    fitted: 'FITTED CAPS',
    fittedSub: 'Precision fit. Timeless profile.',
    adjustable: 'ADJUSTABLE CAPS',
    adjustableSub: 'Your fit. Your style.',
    preview: 'A future release',
    storyKicker: 'A POINT OF VIEW, WORN EVERY DAY',
    storyTitle: 'MORE THAN\nA CAP.',
    story: 'ROTEX was created for people who express themselves through the details. Every silhouette, color, and stitch is designed to bring confidence and character to everyday style.',
    details: 'DETAILS MAKE THE DIFFERENCE.',
    detailsSub: 'A closer look at what makes a ROTEX cap unmistakably yours.',
    community: 'JOIN THE MOVEMENT.',
    communitySub: 'The next chapter is better together.',
    follow: 'Follow ROTEX',
    newsletter: 'BE FIRST.\nSTAY AHEAD.',
    newsletterSub: 'Get early access to new drops, exclusive releases, and ROTEX news.',
    email: 'Your email address',
    subscribe: 'Subscribe',
    sample: 'SAMPLE PRICE · NOT A LIVE OFFER',
    fittedLabel: 'Fitted cap',
    add: 'Add to bag',
    quick: 'Quick view',
    search: 'Search the first drop',
    size: 'Select size',
    sizeGuide: 'Size guide',
    material: 'Structured crown',
    detailLabel: 'Embroidered details',
    fitLabel: 'Fitted silhouette',
    demo: 'Prototype only · checkout is not available',
  },
  ar: {
    announcement: 'الإصدار الأول وصل',
    navigation: ['وصل حديثاً', 'قبعات ثابتة المقاس', 'قبعات قابلة للتعديل', 'المجموعات', 'قصتنا'],
    headline: 'صُمّمت\nلتتميّز.',
    subhead: 'قبعات فاخرة. تصاميم مميّزة. لتكون جزءاً من أسلوبك اليومي.',
    shop: 'تسوّق الإصدار الأول',
    explore: 'اكتشف روتكس',
    collection: 'الإصدار الأول',
    collectionSub: 'اكتشف القطع التي ترسم هوية روتكس.',
    all: 'اكتشف كل القطع',
    styles: 'اختر مقاسك',
    fitted: 'قبعات ثابتة المقاس',
    fittedSub: 'مقاس دقيق. تصميم خالد.',
    adjustable: 'قبعات قابلة للتعديل',
    adjustableSub: 'مقاسك. أسلوبك.',
    preview: 'إصدار قادم',
    storyKicker: 'تفاصيل تعبّر عنك كل يوم',
    storyTitle: 'أكثر من\nقبعة.',
    story: 'ابتكرنا روتكس لمن يعبّرون عن أنفسهم من خلال التفاصيل. صُمّم كل شكل ولون وغرزة لتضيف الثقة والطابع إلى أسلوبك اليومي.',
    details: 'التفاصيل تصنع الفرق.',
    detailsSub: 'اكتشف ما يجعل قبعة روتكس مميّزة.',
    community: 'انضم إلى الحركة.',
    communitySub: 'الفصل القادم أجمل معاً.',
    follow: 'تابع روتكس',
    newsletter: 'كن الأول.\nابقَ متقدماً.',
    newsletterSub: 'احصل على وصول مبكر للإصدارات الجديدة والأخبار الحصرية.',
    email: 'بريدك الإلكتروني',
    subscribe: 'اشترك',
    sample: 'سعر تجريبي · ليس عرضاً للبيع',
    fittedLabel: 'قبعة ثابتة المقاس',
    add: 'أضف إلى الحقيبة',
    quick: 'عرض سريع',
    search: 'ابحث في الإصدار الأول',
    size: 'اختر المقاس',
    sizeGuide: 'دليل المقاسات',
    material: 'تاج منظّم',
    detailLabel: 'تفاصيل مطرّزة',
    fitLabel: 'قصة ثابتة المقاس',
    demo: 'نسخة تجريبية · الشراء غير متاح',
  },
} as const

function Price({ currency, amount = 58 }: { currency: Currency; amount?: number }) {
  return <span>{currency === 'USD' ? `$${amount}` : `${amount} SYP`}</span>
}

export default function RotexStorefront() {
  const [currency, setCurrency] = useState<Currency>('USD')
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<CartLine[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [quickView, setQuickView] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState('7¼')
  const [spotlightSize, setSpotlightSize] = useState('7¼')
  const [quantity, setQuantity] = useState(1)
  const [notice, setNotice] = useState('')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const [accountOpen, setAccountOpen] = useState(false)
  const t = copy[language]
  const isArabic = language === 'ar'
  const visibleProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return products
    return products.filter((product) => `${product.name} ${product.color} ${product.style}`.toLowerCase().includes(query))
  }, [searchTerm])
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  function addToCart(product: Product, size: string, count = 1) {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id && item.size === size)
      if (existing) {
        return current.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + count } : item,
        )
      }
      return [...current, { product, size, quantity: count }]
    })
    setNotice(`${product.name} · ${size} added to your demo bag`)
    window.setTimeout(() => setNotice(''), 2800)
  }

  function changeQuantity(productId: string, size: string, change: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.product.id === productId && item.size === size
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function openQuickView(product: Product) {
    setSelectedSize('7¼')
    setQuickView(product)
  }

  function submitNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!newsletterEmail.trim()) return
    setNewsletterMessage(
      isArabic
        ? 'شكراً لاهتمامك. هذه نسخة تجريبية، ولم يتم حفظ بريدك الإلكتروني.'
        : 'Thanks for your interest. This is a demo; your email has not been stored.',
    )
    setNewsletterEmail('')
  }

  return (
    <main lang={language} dir={isArabic ? 'rtl' : 'ltr'} className={isArabic ? 'site-shell is-rtl' : 'site-shell'}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="announcement-bar">
        <span className="announcement-mark" aria-hidden="true">R.</span>
        <span>{t.announcement}</span>
        <span className="announcement-note">{t.sample}</span>
      </div>
      <header className="site-header">
        <a href="#top" className="wordmark" aria-label="ROTEX home">ROTEX<span>®</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#new">{t.navigation[0]}</a>
          <a href="#fitted">{t.navigation[1]}</a>
          <a href="#adjustable">{t.navigation[2]}</a>
          <a href="#collections">{t.navigation[3]}</a>
          <a href="#story">{t.navigation[4]}</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button search-trigger" type="button" aria-label="Open search" onClick={() => setSearchOpen((open) => !open)}>
            {searchOpen ? <X size={19} /> : <Search size={19} />}
          </button>
          <label className="currency-select-label">
            <span className="sr-only">Sample currency</span>
            <Globe2 size={15} aria-hidden="true" />
            <select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)} aria-label="Sample currency">
              <option value="USD">USD</option>
              <option value="SYP">SYP</option>
            </select>
            <ChevronDown size={12} aria-hidden="true" />
          </label>
          <button className="icon-button account-button" type="button" aria-label="Account information" onClick={() => setAccountOpen(true)}>
            <UserRound size={19} />
          </button>
          <button className="icon-button bag-button" type="button" aria-label={`Open shopping bag, ${cartCount} items`} onClick={() => setCartOpen(true)}>
            <ShoppingBag size={19} /><span className="bag-count">{cartCount}</span>
          </button>
          <button className="language-toggle" type="button" onClick={() => setLanguage(isArabic ? 'en' : 'ar')} aria-label={isArabic ? 'Switch language to English' : 'تغيير اللغة إلى العربية'}>
            {isArabic ? 'EN' : 'عربي'}
          </button>
          <button className="icon-button mobile-menu-trigger" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {searchOpen && (
          <form className="search-panel" role="search" onSubmit={(event) => { event.preventDefault(); document.getElementById('new')?.scrollIntoView({ behavior: 'smooth' }); setSearchOpen(false) }}>
            <Search size={18} aria-hidden="true" />
            <input autoFocus value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder={t.search} aria-label={t.search} />
            {searchTerm && <button type="button" className="search-clear" onClick={() => setSearchTerm('')}>Clear</button>}
            <button type="submit" className="search-submit">{isArabic ? 'بحث' : 'Search'}</button>
          </form>
        )}
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {t.navigation.map((label, index) => <a key={label} href={['#new', '#fitted', '#adjustable', '#collections', '#story'][index]} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={16} /></a>)}
            <p>{t.sample}</p>
          </nav>
        )}
      </header>

      <div id="main-content">
        <section className="hero-section" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> {isArabic ? 'قبعات، بوجهة نظر جديدة' : 'HEADWEAR, WITH A POINT OF VIEW'}</p>
            <h1 id="hero-title">{t.headline.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
            <p className="hero-description">{t.subhead}</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#new">{t.shop}<ArrowUpRight size={16} /></a>
              <a className="text-link" href="#story">{t.explore}<ArrowRight size={16} /></a>
            </div>
            <div className="hero-bottom-note">
              <span>01 / 06</span><span className="hero-note-rule" /><span>{isArabic ? 'المجموعة الأولى' : 'THE DEBUT COLLECTION'}</span>
            </div>
          </div>
          <a className="hero-art" href="#new" aria-label="Explore the ROTEX Midnight cap">
            <Image
              src={products[0].image}
              alt="ROTEX Midnight fitted cap shown from the front, side, back, and interior"
              fill
              priority
              sizes="(max-width: 720px) 100vw, 58vw"
              className="hero-image"
            />
            <span className="hero-image-tag"><span>ROTEX</span> / FIRST DROP <ArrowUpRight size={14} /></span>
            <span className="hero-image-index">01</span>
          </a>
          <a className="hero-scroll" href="#new" aria-label="Scroll to the first drop"><ArrowDown size={15} /> SCROLL TO DISCOVER</a>
        </section>

        <section className="drop-section section-pad" id="new" aria-labelledby="drop-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span className="eyebrow-line" /> 001 — ROTEX DEBUT</p>
              <h2 id="drop-title">{t.collection}</h2>
              <p className="section-subtitle">{t.collectionSub}</p>
            </div>
            <a href="#fitted" className="text-link desktop-link">{t.all}<ArrowUpRight size={16} /></a>
          </div>
          {searchTerm && <p className="search-result-note" aria-live="polite">{isArabic ? 'نتائج البحث' : 'Showing results for'} “{searchTerm}”</p>}
          {visibleProducts.length ? (
            <div className="product-grid">
              {visibleProducts.map((product, index) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image-wrap">
                    <a href="#spotlight" className="product-image-link" aria-label={`View ${product.name}`} onClick={(event) => { event.preventDefault(); openQuickView(product) }}>
                      <Image src={product.image} alt={`${product.name} cap product board`} fill sizes="(max-width: 680px) 50vw, (max-width: 1080px) 33vw, 25vw" className="product-image" />
                    </a>
                    <span className="product-index">0{index + 1}</span>
                    <span className="product-label">{product.style.toUpperCase()}</span>
                    <button type="button" className="quick-view-button" onClick={() => openQuickView(product)}>{t.quick}<ArrowUpRight size={14} /></button>
                    <button type="button" className="quick-add-button" aria-label={`Add ${product.name} to bag`} onClick={() => addToCart(product, '7¼')}><Plus size={18} /></button>
                  </div>
                  <div className="product-info">
                    <div><h3>{product.name}</h3><p>{product.color}</p></div>
                    <div className="product-price"><Price currency={currency} amount={product.price} /><span className="price-note">{t.sample}</span></div>
                  </div>
                  <div className="product-card-foot"><span className="color-chip" style={{ backgroundColor: product.accent }} /> <span>{isArabic ? 'لون الإصدار' : 'DEBUT COLORWAY'}</span><span className="product-type">{t.fittedLabel}</span></div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-search"><p>{isArabic ? 'لا توجد قطع مطابقة.' : 'No pieces found for that search.'}</p><button type="button" className="text-link" onClick={() => setSearchTerm('')}>{isArabic ? 'عرض المجموعة كاملة' : 'Show the full collection'} <ArrowRight size={16} /></button></div>
          )}
          <a href="#fitted" className="text-link mobile-link">{t.all}<ArrowUpRight size={16} /></a>
        </section>

        <section className="style-section" id="collections" aria-labelledby="style-title">
          <div className="style-heading"><p className="eyebrow"><span className="eyebrow-line" /> 002 — CHOOSE YOUR SILHOUETTE</p><h2 id="style-title">{t.styles}</h2></div>
          <div className="style-grid">
            <a href="#fitted" className="style-card fitted-style">
              <Image src={products[4].image} alt="Royal blue ROTEX cap product board" fill sizes="(max-width: 720px) 100vw, 50vw" className="style-image" />
              <span className="style-card-number">01 / THE ORIGINAL</span>
              <span className="style-card-copy"><strong>{t.fitted}</strong><span>{t.fittedSub}</span></span>
              <span className="style-card-arrow"><ArrowUpRight size={21} /></span>
            </a>
            <a href="#newsletter" className="style-card adjustable-style" id="adjustable">
              <Image src={products[2].image} alt="ROTEX Heritage cap shown in several angles" fill sizes="(max-width: 720px) 100vw, 50vw" className="style-image" />
              <span className="style-card-number">02 / NEXT IN ROTATION</span>
              <span className="style-card-copy"><strong>{t.adjustable}</strong><span>{t.adjustableSub}</span></span>
              <span className="style-coming">{t.preview}</span>
              <span className="style-card-arrow"><ArrowUpRight size={21} /></span>
            </a>
          </div>
          <p className="style-disclaimer">{isArabic ? 'صور المنتجات تمثل مجموعة القبعات الثابتة الحالية. المجموعة القابلة للتعديل للمعاينة فقط.' : 'Product imagery reflects the current fitted-cap collection. Adjustable styles are a future-release preview.'}</p>
        </section>

        <section className="story-section" id="story" aria-labelledby="story-title">
          <div className="story-image-wrap">
            <Image src={products[1].image} alt="Forest green ROTEX cap, including its embroidered front, side mark, and inside branding" fill sizes="(max-width: 720px) 100vw, 50vw" className="story-image" />
            <span className="story-image-caption">ROTEX / OBJECT STUDY 01</span>
          </div>
          <div className="story-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> 003 — {t.storyKicker}</p>
            <h2 id="story-title">{t.storyTitle.split('\n').map((line) => <span key={line}>{line}</span>)}</h2>
            <p>{t.story}</p>
            <a href="#details" className="text-link">{isArabic ? 'اكتشف التفاصيل' : 'Discover the details'}<ArrowRight size={16} /></a>
            <span className="story-watermark" aria-hidden="true">R.</span>
          </div>
        </section>

        <section className="spotlight-section section-pad" id="spotlight" aria-labelledby="spotlight-title">
          <div className="spotlight-image-wrap">
            <Image src={products[0].image} alt="ROTEX Midnight premium fitted cap product image" fill sizes="(max-width: 800px) 100vw, 55vw" className="spotlight-image" />
            <span className="spotlight-stamp">ROTEX<br />PREMIUM<br />CAP — 01</span>
          </div>
          <div className="spotlight-details">
            <p className="eyebrow"><span className="eyebrow-line" /> 004 — EDITOR&apos;S PICK</p>
            <h2 id="spotlight-title">ROTEX<br /><em>Midnight</em></h2>
            <p className="spotlight-blurb">{products[0].detail}</p>
            <div className="spotlight-price"><Price currency={currency} /><span>{t.sample}</span></div>
            <div className="selector-block">
              <div className="selector-title"><span>{t.size}</span><button type="button" className="size-guide-link" onClick={() => setNotice(isArabic ? 'دليل تجريبي: اختر المقاس المعتاد. المقاسات الفعلية ستُؤكّد عند إطلاق المتجر.' : 'Demo size guide: choose your usual fitted-cap size. Final sizing details will be confirmed at launch.')}><Ruler size={14} />{t.sizeGuide}</button></div>
              <div className="size-options" role="group" aria-label="Choose fitted cap size">
                {fittedSizes.map((size) => <button key={size} type="button" className={spotlightSize === size ? 'size-option selected' : 'size-option'} aria-pressed={spotlightSize === size} onClick={() => setSpotlightSize(size)}>{size}</button>)}
              </div>
            </div>
            <div className="spotlight-quantity-row">
              <div className="quantity-stepper" aria-label="Quantity selector">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((current) => Math.max(1, current - 1))}><Minus size={14} /></button>
                <span aria-live="polite">{quantity}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((current) => Math.min(9, current + 1))}><Plus size={14} /></button>
              </div>
              <span className="quantity-hint">{isArabic ? 'بحد أقصى 9 في النسخة التجريبية' : 'Demo quantity limit: 9'}</span>
            </div>
            <button type="button" className="button button-dark add-bag-button" onClick={() => addToCart(products[0], spotlightSize, quantity)}>{t.add}<ShoppingBag size={17} /></button>
            <p className="prototype-caption"><span className="prototype-dot" />{t.demo}</p>
            <div className="product-facts"><span>{t.material}</span><span>{t.detailLabel}</span><span>{t.fitLabel}</span></div>
          </div>
        </section>

        <section className="craft-section" id="details" aria-labelledby="craft-title">
          <div className="craft-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> 005 — THE FINER POINTS</p><h2 id="craft-title">{t.details}</h2></div><p>{t.detailsSub}</p></div>
          <div className="craft-grid">
            <article className="craft-card craft-card-large"><div className="craft-image-wrap"><Image src={products[0].image} alt="Close details from a navy ROTEX cap product board" fill sizes="(max-width: 700px) 100vw, 40vw" className="craft-image craft-image-focus" /></div><div className="craft-caption"><span>01 / SHAPE</span><h3>{t.material}</h3><p>{isArabic ? 'قصة واضحة تحافظ على مظهرها.' : 'A defined silhouette with a clean, confident profile.'}</p></div></article>
            <article className="craft-card"><div className="craft-image-wrap"><Image src={products[3].image} alt="Crimson ROTEX cap showcasing embroidered artwork" fill sizes="(max-width: 700px) 100vw, 30vw" className="craft-image craft-image-focus" /></div><div className="craft-caption"><span>02 / EMBROIDERY</span><h3>{t.detailLabel}</h3><p>{isArabic ? 'شعار وتفاصيل بارزة.' : 'Distinctive artwork, finished with dimensional stitching.'}</p></div></article>
            <article className="craft-card"><div className="craft-image-wrap"><Image src={products[2].image} alt="ROTEX cap interior with branded seam tape and size label" fill sizes="(max-width: 700px) 100vw, 30vw" className="craft-image craft-image-focus" /></div><div className="craft-caption"><span>03 / INSIDE</span><h3>{isArabic ? 'هوية ROTEX الداخلية' : 'Branded inside details'}</h3><p>{isArabic ? 'تظهر العلامة التجارية في التفاصيل الداخلية.' : 'ROTEX branding carries through to the interior.'}</p></div></article>
          </div>
        </section>

        <section className="community-section" id="community" aria-labelledby="community-title">
          <div className="community-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> 006 — ROTEX IN FRAME</p><h2 id="community-title">{t.community}</h2><p>{t.communitySub}</p></div><span className="community-side-note">{isArabic ? 'المشهد يتطوّر' : 'THE SCENE IS YOURS'}</span></div>
          <div className="community-grid" aria-label="ROTEX collection gallery">
            {products.slice(0, 5).map((product, index) => <a className={`community-tile community-tile-${index + 1}`} href="#new" key={product.id} aria-label={`Explore ${product.name}`}><Image src={product.image} alt={`${product.name} colorway detail`} fill sizes="(max-width: 720px) 33vw, 20vw" className="community-image" /><span className="community-tile-label">0{index + 1} / ROTEX</span></a>)}
            <a href="#newsletter" className="community-follow"><span>ROTEX<br />COMMUNITY</span><strong>{t.follow}<ArrowUpRight size={18} /></strong><span className="community-follow-note">{isArabic ? 'القنوات الاجتماعية قريباً' : 'Social channels coming soon'}</span></a>
          </div>
        </section>

        <section className="newsletter-section" id="newsletter" aria-labelledby="newsletter-title">
          <div className="newsletter-copy"><p className="eyebrow"><span className="eyebrow-line" /> ROTEX NOTES / 001</p><h2 id="newsletter-title">{t.newsletter.split('\n').map((line) => <span key={line}>{line}</span>)}</h2><p>{t.newsletterSub}</p></div>
          <div className="newsletter-form-wrap"><form className="newsletter-form" onSubmit={submitNewsletter}><label className="sr-only" htmlFor="newsletter-email">{t.email}</label><input id="newsletter-email" type="email" value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} placeholder={t.email} required autoComplete="email" /><button type="submit" aria-label={t.subscribe}>{t.subscribe}<ArrowUpRight size={16} /></button></form><p className="newsletter-disclaimer">{isArabic ? 'نموذج تجريبي فقط. لن يتم حفظ البريد الإلكتروني أو إرساله.' : 'Demo form only. Your email will not be saved or sent.'}</p><p className="newsletter-feedback" aria-live="polite">{newsletterMessage && <><Check size={15} />{newsletterMessage}</>}</p></div>
        </section>
      </div>

      <footer className="site-footer">
        <div className="footer-main"><div className="footer-brand"><a href="#top" className="wordmark footer-wordmark">ROTEX<span>®</span></a><p>{isArabic ? 'قبعات مميّزة. أسلوبك اليومي.' : 'Distinctive headwear for everyday expression.'}</p><span className="footer-origin">DAMASCUS — EVERYWHERE</span></div><div className="footer-column"><h3>{isArabic ? 'تسوّق' : 'EXPLORE'}</h3><a href="#new">{t.navigation[0]}</a><a href="#fitted">{t.navigation[1]}</a><a href="#adjustable">{t.navigation[2]}</a></div><div className="footer-column"><h3>{isArabic ? 'روتكس' : 'ROTEX'}</h3><a href="#story">{t.navigation[4]}</a><a href="#details">{isArabic ? 'التفاصيل' : 'Craft & detail'}</a><a href="#community">{isArabic ? 'المجتمع' : 'Community'}</a></div><div className="footer-column"><h3>{isArabic ? 'المعلومات' : 'INFORMATION'}</h3><a href="#spotlight" onClick={() => setNotice(isArabic ? 'معلومات الشحن ستتوفر عند إطلاق المتجر.' : 'Shipping information will be available when the store launches.')}>{isArabic ? 'الشحن والإرجاع' : 'Shipping & returns'}</a><a href="#spotlight" onClick={() => setNotice(isArabic ? 'دليل المقاسات تجريبي.' : 'The size guide is a demo.')}>{t.sizeGuide}</a><a href="#newsletter">{isArabic ? 'تواصل معنا' : 'Contact'}</a></div></div>
        <div className="footer-bottom"><span>© 2026 ROTEX. {isArabic ? 'جميع الحقوق محفوظة.' : 'ALL RIGHTS RESERVED.'}</span><span className="footer-demo">{t.sample}</span><div className="footer-controls"><label><span className="sr-only">Currency</span><select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}><option value="USD">USD</option><option value="SYP">SYP</option></select></label><button type="button" onClick={() => setLanguage(isArabic ? 'en' : 'ar')}>{isArabic ? 'العربية' : 'English'} / {isArabic ? 'EN' : 'العربية'}</button></div></div>
      </footer>

      {notice && <div className="toast-notice" role="status"><Check size={16} />{notice}<button type="button" aria-label="Dismiss notice" onClick={() => setNotice('')}><X size={15} /></button></div>}

      {quickView && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setQuickView(null) }}><section className="quick-modal" role="dialog" aria-modal="true" aria-labelledby="quick-modal-title"><button type="button" className="modal-close" aria-label="Close quick view" onClick={() => setQuickView(null)}><X size={20} /></button><div className="quick-modal-image"><Image src={quickView.image} alt={`${quickView.name} cap product board`} fill sizes="(max-width: 700px) 100vw, 50vw" className="product-image" /></div><div className="quick-modal-content"><p className="eyebrow"><span className="eyebrow-line" /> QUICK LOOK / 0{products.findIndex((product) => product.id === quickView.id) + 1}</p><h2 id="quick-modal-title">{quickView.name}</h2><p className="quick-modal-color">{quickView.color} · {t.fittedLabel}</p><p>{quickView.detail}</p><div className="spotlight-price"><Price currency={currency} amount={quickView.price} /><span>{t.sample}</span></div><div className="selector-block"><div className="selector-title"><span>{t.size}</span></div><div className="size-options" role="group" aria-label="Choose fitted cap size">{fittedSizes.map((size) => <button key={size} type="button" className={selectedSize === size ? 'size-option selected' : 'size-option'} aria-pressed={selectedSize === size} onClick={() => setSelectedSize(size)}>{size}</button>)}</div></div><button type="button" className="button button-dark add-bag-button" onClick={() => { addToCart(quickView, selectedSize); setQuickView(null) }}>{t.add}<ShoppingBag size={17} /></button><p className="prototype-caption"><span className="prototype-dot" />{t.demo}</p></div></section></div>}

      {cartOpen && <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title"><div className="drawer-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> ROTEX / SAMPLE BAG</p><h2 id="cart-title">{isArabic ? 'حقيبتك' : 'Your bag'} <span>({cartCount})</span></h2></div><button type="button" className="modal-close" aria-label="Close shopping bag" onClick={() => setCartOpen(false)}><X size={20} /></button></div>{cart.length ? <><div className="cart-items">{cart.map((line) => <article className="cart-line" key={`${line.product.id}-${line.size}`}><div className="cart-line-image"><Image src={line.product.image} alt={`${line.product.name} cap`} fill sizes="100px" className="product-image" /></div><div className="cart-line-detail"><h3>{line.product.name}</h3><p>{line.product.color} / {line.size}</p><div className="cart-line-controls"><button type="button" aria-label={`Remove one ${line.product.name}`} onClick={() => changeQuantity(line.product.id, line.size, -1)}><Minus size={13} /></button><span>{line.quantity}</span><button type="button" aria-label={`Add one ${line.product.name}`} onClick={() => changeQuantity(line.product.id, line.size, 1)}><Plus size={13} /></button></div></div><Price currency={currency} amount={line.product.price * line.quantity} /></article>)}</div><div className="cart-summary"><div><span>{isArabic ? 'المجموع التجريبي' : 'Sample subtotal'}</span><strong><Price currency={currency} amount={total} /></strong></div><p>{t.demo}. {t.sample}.</p><button type="button" className="button button-dark checkout-demo" onClick={() => setNotice(isArabic ? 'لا يمكن إتمام الشراء في هذه النسخة التجريبية.' : 'Checkout is disabled in this storefront prototype.')}>{isArabic ? 'متابعة' : 'Continue'}<ArrowRight size={16} /></button></div></> : <div className="empty-cart"><ShoppingBag size={28} /><p>{isArabic ? 'حقيبتك فارغة حالياً.' : 'Your bag is currently empty.'}</p><button type="button" className="button button-dark" onClick={() => { setCartOpen(false); document.getElementById('new')?.scrollIntoView({ behavior: 'smooth' }) }}>{isArabic ? 'اكتشف المجموعة' : 'Explore the collection'}<ArrowRight size={15} /></button></div>}</aside></div>}

      {accountOpen && <div className="modal-backdrop account-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAccountOpen(false) }}><section className="account-modal" role="dialog" aria-modal="true" aria-labelledby="account-modal-title"><button type="button" className="modal-close" aria-label="Close account information" onClick={() => setAccountOpen(false)}><X size={20} /></button><span className="account-icon"><UserRound size={22} /></span><p className="eyebrow"><span className="eyebrow-line" /> ROTEX / MEMBERS</p><h2 id="account-modal-title">{isArabic ? 'قريباً.' : 'Coming into focus.'}</h2><p>{isArabic ? 'ميزات الحساب والتسجيل غير مفعّلة في النسخة التجريبية.' : 'Account and sign-in features are not enabled in this storefront prototype.'}</p><button type="button" className="button button-dark" onClick={() => setAccountOpen(false)}>{isArabic ? 'فهمت' : 'Got it'}<Check size={15} /></button></section></div>}
    </main>
  )
}
