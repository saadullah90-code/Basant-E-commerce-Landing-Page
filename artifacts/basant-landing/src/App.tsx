import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Menu, Wind, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { DEFAULT_WHATSAPP_MESSAGE, FEATURED_PRODUCT_ID, PRODUCTS, TEMPORARY_BRAND_NAME, WHATSAPP_NUMBER, WHATSAPP_PLACEHOLDER, productWhatsAppMessage, type Product } from './config';

const TICKER_PHRASES = [
  '1. Rang Lahore de, khaabe taur de',
  '2. Guddi, Dor te khaba – udaayi ja, khaayi ja',
  '3. Pecha vi, Khabba vi',
];
const ANNOUNCEMENT_ITEMS = ['BASANT SEASON', 'LAHORE IN FULL COLOR', ...TICKER_PHRASES];
const ANNOUNCEMENT_LABEL = ['Basant season', 'Lahore in full color', ...TICKER_PHRASES].join('. ');

function ContinuousMarquee({
  variant,
  items,
  label,
  speed,
}: {
  variant: 'announcement' | 'ticker';
  items: string[];
  label: string;
  speed: number;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [copiesPerSegment, setCopiesPerSegment] = useState(2);
  const [duration, setDuration] = useState(42);

  useEffect(() => {
    const measure = () => {
      const itemRunWidth = measureRef.current?.scrollWidth ?? 0;
      const viewportWidth = viewportRef.current?.clientWidth ?? window.innerWidth;
      if (!itemRunWidth || !viewportWidth) return;

      // Each half of the track must be wider than the viewport so no blank
      // space appears while the next identical half scrolls into place.
      const nextCopies = Math.max(2, Math.ceil(viewportWidth / itemRunWidth) + 1);
      const segmentWidth = itemRunWidth * nextCopies;
      setCopiesPerSegment((current) => current === nextCopies ? current : nextCopies);
      setDuration((current) => Math.abs(current - segmentWidth / speed) < 0.1 ? current : segmentWidth / speed);
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    if (measureRef.current) observer.observe(measureRef.current);
    void document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [items, speed]);

  const renderItems = (keyPrefix: string) => items.map((item, index) => (
    <span className={variant === 'announcement' ? 'announce-unit' : 'ticker-unit'} key={`${keyPrefix}-${index}`}>
      {item}
      <i>{variant === 'announcement' ? '✦' : index % 2 ? '✦' : '✳'}</i>
    </span>
  ));
  const trackStyle = { '--marquee-duration': `${duration}s` } as CSSProperties;

  return (
    <div ref={viewportRef} className={variant} aria-label={label}>
      <div className={`${variant === 'announcement' ? 'announce-track' : 'ticker-track'} marquee-track`} style={trackStyle} aria-hidden="true">
        {[0, 1].map((segment) => (
          <div className={`${variant}-group marquee-segment`} key={segment} aria-hidden="true">
            {Array.from({ length: copiesPerSegment }, (_, copy) => renderItems(`${segment}-${copy}`))}
          </div>
        ))}
      </div>
      <div className={`marquee-measure ${variant}-group`} ref={measureRef} aria-hidden="true">
        {renderItems('measure')}
      </div>
    </div>
  );
}

function whatsappUrl(message: string) {
  const number = WHATSAPP_NUMBER.replace(/\D/g, '');
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : '';
}

function KiteMark({ color, secondColor = '#FFCC00', size = 64 }: { color: string; secondColor?: string; size?: number }) {
  return <svg width={size} height={size * 1.18} viewBox="0 0 72 84" aria-hidden="true" focusable="false"><path d="M36 3 68 35 36 67 4 35 36 3Z" fill={color} stroke="#302014" strokeWidth="2.5" strokeLinejoin="round" /><path d="m36 3 1 64M4 35l64 0" stroke="#302014" strokeWidth="1.5" opacity=".65" /><path className="kite-string" d="m36 67-5 10 7-2 3 7 5-10" fill="none" stroke="#302014" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="m36 3 32 32H37Z" fill={secondColor} opacity=".78" /></svg>;
}

function DecorativeKite({ className, color, secondColor = '#FFCC00', size = 48 }: { className: string; color: string; secondColor?: string; size?: number }) {
  return <span className={`ambient-kite ${className}`} aria-hidden="true"><KiteMark color={color} secondColor={secondColor} size={size} /></span>;
}

function ProductArtwork({ product }: { product: Product }) {
  const images = [product.image, ...(product.gallery ?? [])];
  const [activeIndex, setActiveIndex] = useState(0);
  const hasGallery = images.length > 1;
  return <div className="product-art product-photo-art" aria-label={`${product.name} ${hasGallery ? 'product photo gallery' : 'product photo'}`} role={hasGallery ? 'group' : 'img'}>
    <img className="product-photo" src={images[activeIndex]} alt={hasGallery ? `${product.name} design ${activeIndex + 1} of ${images.length}` : ''} loading="eager" decoding="async" />
    {hasGallery && <div className="product-photo-switcher" role="group" aria-label={`Choose ${product.name} design`}>
      {images.map((image, index) => <button key={image} className="product-photo-thumb" type="button" aria-label={`Show ${product.name} design ${index + 1}`} aria-pressed={activeIndex === index} onClick={() => setActiveIndex(index)}><img src={image} alt="" loading="lazy" decoding="async" /></button>)}
    </div>}
  </div>;
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    let frame = 0;
    let previous = window.scrollY > 24;
    setScrolled(previous);
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const next = window.scrollY > 24;
        if (next !== previous) {
          previous = next;
          setScrolled(next);
        }
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  const links = [['Home', '#top'], ['Collection', '#collection'], ['Our story', '#feeling'], ['Pre-order', '#preorder'], ['Contact', '#contact']];
  return <header className={`site-header ${scrolled ? 'header-scrolled' : ''}`}><div className="header-inner"><a className="brand-lockup focus-ring" href="#top" aria-label={`${TEMPORARY_BRAND_NAME} home`}><img src="/urr-lahore-logo-tight.png" alt="URR Lahore" /></a><nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</nav><a className="button button-dark header-collection-cta" href="#collection">SHOP COLLECTION <ArrowDownRight size={15} /></a><button className="mobile-menu-button focus-ring" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} type="button" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button></div>{menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{links.map(([label, href]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={16} /></a>)}<a className="mobile-collection-cta" href="#collection" onClick={() => setMenuOpen(false)}>SHOP COLLECTION <ArrowDownRight size={16} /></a></nav>}</header>;
}

function WhatsAppButton({ message, className = '', onUnavailable, children }: { message: string; className?: string; onUnavailable: () => void; children: ReactNode }) {
  const link = whatsappUrl(message);
  return <button className={`button whatsapp-action ${className}`} type="button" aria-label="Contact us on WhatsApp" title={link ? undefined : WHATSAPP_PLACEHOLDER} onClick={() => link ? window.open(link, '_blank', 'noopener,noreferrer') : onUnavailable()}><FaWhatsapp size={17} aria-hidden="true" />{children}<ArrowUpRight size={16} /></button>;
}

function ProductCard({ product, index, onUnavailable }: { product: Product; index: number; onUnavailable: () => void }) {
  return <article className="product-card reveal" data-card-number={String(index).padStart(2, '0')} data-testid={`card-product-${product.id}`}>
    <div className="product-image-wrap">
      <div className="product-poster-head"><span>URR LAHORE</span><span>BASANT / {String(index).padStart(2, '0')}</span></div>
      <ProductArtwork product={product} />
      <span className="placeholder-tag sale-font">BASANT 2026</span>
      <span className="product-card-sparkle" aria-hidden="true">✦</span>
    </div>
    <div className="product-copy">
      <div className="product-meta"><span>{product.category}</span><span className="unconfirmed">PRICE ON REQUEST</span></div>
      <h3 className="product-name">{product.name}</h3>
      <p>{product.description}</p>
      <div className="product-size"><span>SIZE / DETAILS</span><strong>{product.details}</strong></div>
      <WhatsAppButton className="button-small" message={productWhatsAppMessage(product.name)} onUnavailable={onUnavailable}>CONTACT US</WhatsAppButton>
    </div>
  </article>;
}

function App() {
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loaderLeaving, setLoaderLeaving] = useState(false);
  const waLink = whatsappUrl(DEFAULT_WHATSAPP_MESSAGE);
  useEffect(() => {
    const startedAt = performance.now();
    let finished = false;
    let hideTimer = 0;
    let removeTimer = 0;
    const dismiss = () => {
      if (finished) return;
      finished = true;
      const remaining = Math.max(0, 650 - (performance.now() - startedAt));
      hideTimer = window.setTimeout(() => {
        setLoaderLeaving(true);
        removeTimer = window.setTimeout(() => setIsLoading(false), 360);
      }, remaining);
    };
    const onLoad = () => dismiss();
    if (document.readyState === 'complete') dismiss();
    else window.addEventListener('load', onLoad, { once: true });
    const fallbackTimer = window.setTimeout(dismiss, 1550);
    return () => {
      window.removeEventListener('load', onLoad);
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);
  useEffect(() => {
    document.title = 'Rangon Ki Uraan — Basant in Lahore';
    let description = document.querySelector('meta[name="description"]');
    if (!description) { description = document.createElement('meta'); description.setAttribute('name', 'description'); document.head.appendChild(description); }
    description.setAttribute('content', 'Celebrate Basant. Fly High. Live in Color. Discover the URR Lahore Basant collection.');
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      const target = entry.target;
      if (target.classList.contains('motion-watch')) {
        target.classList.toggle('motion-active', entry.isIntersecting);
        return;
      }
      if (!entry.isIntersecting) return;
      if (target.classList.contains('reveal')) target.classList.add('is-visible');
      observer.unobserve(target);
    }), { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    document.querySelectorAll<HTMLElement>('.ambient-kite,.product-art').forEach((element) => {
      element.classList.add('motion-watch');
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(''), 4800); return () => window.clearTimeout(timer); }, [notice]);
  const contactWhatsApp = () => { if (waLink) window.open(waLink, '_blank', 'noopener,noreferrer'); else setNotice(`WhatsApp pre-orders are not available yet. ${WHATSAPP_PLACEHOLDER}.`); };
  const featured = PRODUCTS.find((product) => product.id === FEATURED_PRODUCT_ID);

  return <div className="page-shell grain" id="top">
    <ContinuousMarquee variant="announcement" items={ANNOUNCEMENT_ITEMS} label={ANNOUNCEMENT_LABEL} speed={48} />
    <Header />
    <main>
      <section className="hero hero-banner" aria-labelledby="hero-title">
        <h1 className="visually-hidden" id="hero-title">Premium Basant Collection — URR Lahore</h1>
        <div className="hero-banner-frame">
          <picture className="hero-banner-picture">
            <source media="(max-width: 700px)" srcSet="/basant-campaign-banner-mobile.webp" type="image/webp" />
            <img className="hero-banner-image" src="/basant-campaign-banner.webp" alt="Premium Basant Collection banner with colorful kites above Lahore rooftops and kite-string spools" fetchPriority="high" />
          </picture>
          <DecorativeKite className="banner-kite-one" color="#F1257A" secondColor="#FFCC00" size={38} />
          <DecorativeKite className="banner-kite-two" color="#06B6D4" secondColor="#FF5733" size={47} />
        </div>
        <div className="hero-banner-actions">
          <p>URR LAHORE <span>/ BASANT 2026</span></p>
          <div className="hero-banner-links">
            <a className="button button-dark" href="#collection">EXPLORE THE COLLECTION <ArrowDownRight size={17} /></a>
            <a className="button hero-banner-secondary" href="#feeling">DISCOVER THE STORY <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>
      <ContinuousMarquee
        variant="ticker"
        items={TICKER_PHRASES}
        label="1. Rang Lahore de, khaabe taur de. 2. Guddi, Dor te khaba – udaayi ja, khaayi ja. 3. Pecha vi, Khabba vi."
        speed={42}
      />
      <section className="collection section-pad" id="collection" aria-labelledby="collection-title">
        <DecorativeKite className="collection-kite kite-pop" color="#F1257A" secondColor="#FFCC00" size={46} />
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow"><span className="eyebrow-mark">02</span> THE COLLECTION</p>
            <h2 className="heading" id="collection-title">THE BASANT COLLECTION</h2>
          </div>
          <p className="section-intro">Made for the season. Reserved for the celebration.</p>
        </div>
        <div className="product-grid">
          {PRODUCTS.map((product, index) => <ProductCard key={product.id} product={product} index={index + 1} onUnavailable={() => setNotice(`WhatsApp pre-orders are not available yet. ${WHATSAPP_PLACEHOLDER}.`)} />)}
        </div>
        <div className="collection-note reveal"><span className="note-stamp sale-font">MADE<br />FOR SKY</span><p>Message us on WhatsApp to confirm prices and availability for items in this collection.</p><span className="note-doodle"><Wind size={29} /></span></div>
      </section>
      {featured && <section className="featured-section" aria-labelledby="featured-title"><DecorativeKite className="featured-kite" color="#06B6D4" secondColor="#FF5733" size={48} /><div className="featured-art reveal"><ProductArtwork product={featured} /><span className="featured-stamp sale-font">A CLOSER<br />LOOK</span></div><div className="featured-copy reveal"><p className="eyebrow"><span className="eyebrow-mark">FEATURED / BASANT COLLECTION</span></p><h2 className="heading" id="featured-title">{featured.name}</h2><p>{featured.description}</p><p className="featured-details">Confirm current details and availability through WhatsApp.</p><div className="featured-actions"><WhatsAppButton message={productWhatsAppMessage(featured.name)} onUnavailable={() => setNotice(`WhatsApp pre-orders are not available yet. ${WHATSAPP_PLACEHOLDER}.`)}>CONTACT US</WhatsAppButton></div></div></section>}
      <section className="feeling" id="feeling" aria-labelledby="feeling-title"><DecorativeKite className="feeling-kite kite-pop" color="#FF5733" secondColor="#FFCC00" size={44} /><div className="feeling-image reveal"><img src="/lahore-rooftop-basant-v2.webp" alt="Basant kites flying above Lahore rooftops in afternoon light" loading="lazy" /></div><div className="feeling-copy reveal"><p className="eyebrow"><span className="eyebrow-mark">03</span> THE FEELING</p><h2 className="heading" id="feeling-title">MORE THAN A FESTIVAL.<br /><em>IT’S A FEELING.</em></h2><p className="large-copy">There’s a moment when the rooftops turn gold, the breeze finds its way between old walls, and every pair of eyes tilts upward.</p><p className="body-copy">That’s the feeling we’re holding onto. Lahore, seen from above: close rooftops, faraway domes, a paper kite tugging at the day. No grand claims. Just a little love for a city that knows how to look up.</p><a className="text-link" href="#preorder">How pre-ordering works <ArrowRight size={17} /></a></div><span className="feeling-number">II</span></section>
      <section className="color-strip" aria-label="A sky of Basant colors"><div className="color-strip-inner"><span>THE COLORS OF A DAY WELL SPENT</span><div className="color-dots" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div><span>TAKE THE LONG WAY HOME</span></div></section>
      <section className="preorder-section" id="preorder" aria-labelledby="preorder-title"><DecorativeKite className="preorder-kite kite-pop" color="#F1257A" secondColor="#06B6D4" size={44} /><div className="preorder-heading reveal"><p className="eyebrow"><span className="eyebrow-mark">04</span> A SIMPLE NOTE</p><h2 className="heading" id="preorder-title">YOUR BASANT FAVORITES,<br /><em>RESERVED WITH A MESSAGE.</em></h2><p>Explore what catches your eye, then reach out to ask about price, availability and pre-order details. Your order is confirmed only in WhatsApp.</p></div><div className="steps"><article className="step reveal"><span className="step-number sale-font">01</span><h3 className="heading">01 — EXPLORE</h3><p>Browse the collection and choose your favorite product.</p></article><article className="step reveal"><span className="step-number sale-font">02</span><h3 className="heading">02 — MESSAGE US</h3><p>Tap WhatsApp to ask about price, availability and pre-order details.</p></article><article className="step reveal"><span className="step-number sale-font">03</span><h3 className="heading">03 — CONFIRM YOUR ORDER</h3><p>Your order is confirmed only through the brand’s WhatsApp process.</p></article></div><p className="preorder-note">WhatsApp ordering is being configured; no order is placed or confirmed on this page.</p></section>
      <section className="final-cta" aria-labelledby="final-cta-title"><div className="final-cta-kite kite-float"><KiteMark color="#F1257A" secondColor="#FFCC00" size={96} /></div><p className="eyebrow"><span className="eyebrow-mark">THE SKY IS WAITING</span></p><h2 className="display" id="final-cta-title">YOUR BASANT<br /><span>STORY STARTS HERE.</span></h2><p>Found something you love? Message us on WhatsApp to discuss your pre-order.</p><button className="button button-dark" type="button" onClick={contactWhatsApp}>CONTACT US <ArrowUpRight size={18} /></button></section>
      <section className="about-urr" id="about-urr" aria-labelledby="about-urr-title">
        <div className="about-urr-inner">
          <div className="about-urr-heading reveal">
            <p className="eyebrow"><span className="eyebrow-mark">ABOUT URR LAHORE</span></p>
            <h2 className="heading" id="about-urr-title">The Heartbeat of Lahore.<br /><em>The Spirit of Celebration.</em></h2>
          </div>
          <div className="about-urr-copy">
            <p className="about-urr-intro">Lahore is not just a city, it is a feeling, a flavor, and a celebration of life. Urr Lahore was created to keep that spirit soaring high. Powered by Sourcefixx, we are dedicated to celebrating the rich cultural roots, traditions, and timeless hospitality of Lahore.</p>
            <p>From the roaring rooftops of Basant where we provide top grade authentic kites, tradition crafted dor, and complete rooftop party setups to grand cultural gatherings, we bring the true colors and energy of the city to life.</p>
            <p>And because no Lahori gathering is complete without an unforgettable feast, we take deep pride in our authentic culinary experiences. We specialize in traditional Lahori catering, bringing together age old recipes, rich heritage flavors, and royal hospitality that treat every guest like family.</p>
            <p className="about-urr-closing">At Urr Lahore, we don't just organize events we preserve Lahore’s living culture, one kite, one feast, and one grand celebration at a time.</p>
          </div>
        </div>
      </section>
    </main>
    <footer className="site-footer" id="contact"><DecorativeKite className="footer-kite kite-pop" color="#FFCC00" secondColor="#F1257A" size={42} /><div className="footer-top"><div className="footer-brand-block"><a className="footer-brand" href="#top" aria-label={`${TEMPORARY_BRAND_NAME} home`}><img src="/urr-lahore-logo-tight.png" alt="URR Lahore" /></a><p>A seasonal collection inspired by Basant in Lahore. Product details and order confirmation are shared directly through WhatsApp.</p></div><div className="footer-callout"><h2 className="footer-tagline">LET’S MAKE THIS BASANT COLORFUL.</h2><button className="button footer-whatsapp-cta" type="button" onClick={contactWhatsApp}>CONTACT US <ArrowUpRight size={17} /></button></div></div><div className="footer-bottom"><nav className="footer-links" aria-label="Footer navigation"><a href="#top">Home</a><a href="#collection">Collection</a><a href="#feeling">About Basant</a><a href="#preorder">How pre-orders work</a><a href="#contact">Contact</a></nav><p>Prices and availability are confirmed by the brand on WhatsApp.</p><span className="footer-year">© {new Date().getFullYear()} URR Lahore</span></div></footer>
    <button className={`floating-whatsapp ${waLink ? '' : 'not-configured'}`} type="button" onClick={contactWhatsApp} aria-label="Contact us on WhatsApp" title={waLink ? 'Contact us on WhatsApp' : WHATSAPP_PLACEHOLDER} data-testid="button-floating-whatsapp"><FaWhatsapp size={23} aria-hidden="true" /><span>CONTACT US</span></button>
    {notice && <div className="notice-toast" role="status" aria-live="polite">{notice}<button type="button" aria-label="Dismiss message" onClick={() => setNotice('')}><X size={16} /></button></div>}
     {isLoading && <div className={`kite-preloader ${loaderLeaving ? 'is-leaving' : ''}`} role="status" aria-label="Loading URR Lahore Basant collection"><div className="preloader-sun" /><div className="preloader-kite"><KiteMark color="#F1257A" secondColor="#FFCC00" size={82} /></div><span className="preloader-brand">URR LAHORE <i> / </i> BASANT 2026</span><span className="preloader-message">THE SKY IS GETTING READY</span><span className="preloader-progress"><i /></span></div>}
  </div>;
}

export default App;
