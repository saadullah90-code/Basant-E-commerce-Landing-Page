import { useEffect, useState, type ReactNode } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Menu, Wind, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { DEFAULT_WHATSAPP_MESSAGE, FEATURED_PRODUCT_ID, PRODUCTS, TEMPORARY_BRAND_NAME, WHATSAPP_NUMBER, WHATSAPP_PLACEHOLDER, productWhatsAppMessage, type Product } from './config';

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
  return <div className="product-art" style={{ backgroundColor: product.imageTone }} aria-label={`${product.name} illustrated kite artwork`} role="img"><div className="product-art-sun" /><div className="art-kite art-kite-main kite-float"><KiteMark color={product.accent} secondColor="#FFF4C5" size={112} /></div><div className="art-kite art-kite-small kite-float kite-float-slow"><KiteMark color="#FFF2B9" secondColor={product.imageTone} size={43} /></div><span className="art-cloud cloud-one" /><span className="art-cloud cloud-two" /><span className="art-roof" /><span className="art-caption">A little more sky</span></div>;
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
  return <button className={`button whatsapp-action ${className}`} type="button" aria-label="Pre-order on WhatsApp" title={link ? undefined : WHATSAPP_PLACEHOLDER} onClick={() => link ? window.open(link, '_blank', 'noopener,noreferrer') : onUnavailable()}><FaWhatsapp size={17} aria-hidden="true" />{children}<ArrowUpRight size={16} /></button>;
}

function ProductCard({ product, index, onUnavailable }: { product: Product; index: number; onUnavailable: () => void }) {
  return <article className="product-card reveal" data-card-number={String(index).padStart(2, '0')} data-testid={`card-product-${product.id}`}>
    <div className="product-image-wrap">
      <div className="product-poster-head"><span>URR LAHORE</span><span>BASANT / {String(index).padStart(2, '0')}</span></div>
      <ProductArtwork product={product} />
      <span className="placeholder-tag sale-font">ARTWORK TBC</span>
      <span className="product-card-sparkle" aria-hidden="true">✦</span>
    </div>
    <div className="product-copy">
      <div className="product-meta"><span>{product.category}</span><span className="unconfirmed">Details TBC</span></div>
      <h3 className="product-name">{product.name}</h3>
      <p>{product.description}</p>
      <WhatsAppButton className="button-small" message={productWhatsAppMessage(product.name)} onUnavailable={onUnavailable}>PRE-ORDER ON WHATSAPP</WhatsAppButton>
    </div>
  </article>;
}

function App() {
  const [notice, setNotice] = useState('');
  const waLink = whatsappUrl(DEFAULT_WHATSAPP_MESSAGE);
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
      if (target.classList.contains('text-reveal')) target.classList.add('text-visible');
      observer.unobserve(target);
    }), { threshold: 0.08, rootMargin: '70px 0px' });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    const textTargets = document.querySelectorAll<HTMLElement>('h1,h2,h3,p,a,button,.announce-unit,.ticker-unit,.product-poster-head,.product-meta,.placeholder-tag,.product-card-sparkle,.step-number,.note-stamp,.art-caption,.footer-year,.footer-tagline');
    textTargets.forEach((element, index) => {
      if (!element.textContent?.trim()) return;
      element.classList.add('text-reveal');
      element.style.setProperty('--text-delay', `${(index % 5) * 35}ms`);
      observer.observe(element);
    });
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
    <div className="announcement" aria-label="Basant season. Celebrate in full color."><div className="announce-track marquee-track" aria-hidden="true">{Array.from({ length: 4 }, (_, index) => <span className="announce-unit" key={index}>BASANT SEASON <i>✦</i> LAHORE IN FULL COLOR <i>✦</i></span>)}</div></div>
    <Header />
    <main>
      <section className="hero hero-banner" aria-labelledby="hero-title"><h1 className="visually-hidden" id="hero-title">Premium Basant Collection — URR Lahore</h1><div className="hero-banner-frame"><img className="hero-banner-image" src="/basant-campaign-banner.webp" alt="Premium Basant Collection banner with colorful kites above Lahore rooftops and kite-string spools" fetchPriority="high" /><DecorativeKite className="banner-kite-one" color="#F1257A" secondColor="#FFCC00" size={38} /><DecorativeKite className="banner-kite-two" color="#06B6D4" secondColor="#FF5733" size={47} /></div><div className="hero-banner-actions"><p>URR LAHORE <span>/ BASANT 2026</span></p><div className="hero-banner-links"><a className="button button-dark" href="#collection">EXPLORE THE COLLECTION <ArrowDownRight size={17} /></a><a className="button hero-banner-secondary" href="#feeling">DISCOVER THE STORY <ArrowRight size={16} /></a></div></div></section>
      <div className="ticker" aria-label="Basant. Lahore. Sky full of color."><div className="ticker-track marquee-track" aria-hidden="true">{Array.from({ length: 4 }, (_, index) => <span className="ticker-unit" key={index}>BASANT <i>✳</i> LAHORE <b>✦</b> SKY FULL OF COLOR <i>✳</i></span>)}</div></div>
      <section className="collection section-pad" id="collection" aria-labelledby="collection-title"><DecorativeKite className="collection-kite kite-pop" color="#F1257A" secondColor="#FFCC00" size={46} /><div className="section-heading reveal"><div><p className="eyebrow"><span className="eyebrow-mark">02</span> THE COLLECTION</p><h2 className="heading" id="collection-title">THE BASANT COLLECTION</h2></div><p className="section-intro">Made for the season. Reserved for the celebration.</p></div><div className="product-grid">{PRODUCTS.map((product, index) => <ProductCard key={product.id} product={product} index={index + 1} onUnavailable={() => setNotice(`WhatsApp pre-orders are not available yet. ${WHATSAPP_PLACEHOLDER}.`)} />)}</div><div className="collection-note reveal"><span className="note-stamp sale-font">MADE<br />FOR SKY</span><p>Product names and illustrations are placeholders; ask us for confirmed product details, price and availability when pre-orders open.</p><span className="note-doodle"><Wind size={29} /></span></div></section>
      {featured && <section className="featured-section" aria-labelledby="featured-title"><DecorativeKite className="featured-kite" color="#06B6D4" secondColor="#FF5733" size={48} /><div className="featured-art reveal"><ProductArtwork product={featured} /><span className="featured-stamp sale-font">A CLOSER<br />LOOK</span></div><div className="featured-copy reveal"><p className="eyebrow"><span className="eyebrow-mark">FEATURED / COLLECTION PLACEHOLDER</span></p><h2 className="heading" id="featured-title">{featured.name}</h2><p>{featured.description}</p><p className="featured-details">Request confirmed product information, price and availability through WhatsApp.</p><div className="featured-actions"><WhatsAppButton message={productWhatsAppMessage(featured.name)} onUnavailable={() => setNotice(`WhatsApp pre-orders are not available yet. ${WHATSAPP_PLACEHOLDER}.`)}>PRE-ORDER ON WHATSAPP</WhatsAppButton></div></div></section>}
      <section className="feeling" id="feeling" aria-labelledby="feeling-title"><DecorativeKite className="feeling-kite kite-pop" color="#FF5733" secondColor="#FFCC00" size={44} /><div className="feeling-image reveal"><img src="/lahore-rooftop-basant.png" alt="Colorful kites drift over a layered illustration of Lahore rooftops" loading="lazy" /><div className="feeling-image-label"><span>LAHORE / LATE AFTERNOON</span><span>THE ROOFTOP IS THE PLACE</span></div><div className="feeling-scribble">up, up<br />and away</div></div><div className="feeling-copy reveal"><p className="eyebrow"><span className="eyebrow-mark">03</span> THE FEELING</p><h2 className="heading" id="feeling-title">MORE THAN A FESTIVAL.<br /><em>IT’S A FEELING.</em></h2><p className="large-copy">There’s a moment when the rooftops turn gold, the breeze finds its way between old walls, and every pair of eyes tilts upward.</p><p className="body-copy">That’s the feeling we’re holding onto. Lahore, seen from above: close rooftops, faraway domes, a paper kite tugging at the day. No grand claims. Just a little love for a city that knows how to look up.</p><a className="text-link" href="#preorder">How pre-ordering works <ArrowRight size={17} /></a></div><span className="feeling-number">II</span></section>
      <section className="color-strip" aria-label="A sky of Basant colors"><div className="color-strip-inner"><span>THE COLORS OF A DAY WELL SPENT</span><div className="color-dots" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div><span>TAKE THE LONG WAY HOME</span></div></section>
      <section className="preorder-section" id="preorder" aria-labelledby="preorder-title"><DecorativeKite className="preorder-kite kite-pop" color="#F1257A" secondColor="#06B6D4" size={44} /><div className="preorder-heading reveal"><p className="eyebrow"><span className="eyebrow-mark">04</span> A SIMPLE NOTE</p><h2 className="heading" id="preorder-title">YOUR BASANT FAVORITES,<br /><em>RESERVED WITH A MESSAGE.</em></h2><p>Explore what catches your eye, then reach out to ask about price, availability and pre-order details. Your order is confirmed only in WhatsApp.</p></div><div className="steps"><article className="step reveal"><span className="step-number sale-font">01</span><h3 className="heading">01 — EXPLORE</h3><p>Browse the collection and choose your favorite product.</p></article><article className="step reveal"><span className="step-number sale-font">02</span><h3 className="heading">02 — MESSAGE US</h3><p>Tap WhatsApp to ask about price, availability and pre-order details.</p></article><article className="step reveal"><span className="step-number sale-font">03</span><h3 className="heading">03 — CONFIRM YOUR ORDER</h3><p>Your order is confirmed only through the brand’s WhatsApp process.</p></article></div><p className="preorder-note">WhatsApp ordering is being configured; no order is placed or confirmed on this page.</p></section>
      <section className="final-cta" aria-labelledby="final-cta-title"><div className="final-cta-kite kite-float"><KiteMark color="#F1257A" secondColor="#FFCC00" size={96} /></div><p className="eyebrow"><span className="eyebrow-mark">THE SKY IS WAITING</span></p><h2 className="display" id="final-cta-title">YOUR BASANT<br /><span>STORY STARTS HERE.</span></h2><p>Found something you love? Message us on WhatsApp to discuss your pre-order.</p><button className="button button-dark" type="button" onClick={contactWhatsApp}>PRE-ORDER ON WHATSAPP <ArrowUpRight size={18} /></button></section>
    </main>
    <footer className="site-footer" id="contact"><DecorativeKite className="footer-kite kite-pop" color="#FFCC00" secondColor="#F1257A" size={42} /><div className="footer-top"><div className="footer-brand-block"><a className="footer-brand" href="#top" aria-label={`${TEMPORARY_BRAND_NAME} home`}><img src="/urr-lahore-logo-tight.png" alt="URR Lahore" /></a><p>A seasonal collection inspired by Basant in Lahore. Product details and order confirmation are shared directly through WhatsApp.</p></div><div className="footer-callout"><h2 className="footer-tagline">LET’S MAKE THIS BASANT COLORFUL.</h2><button className="button footer-whatsapp-cta" type="button" onClick={contactWhatsApp}>PRE-ORDER ON WHATSAPP <ArrowUpRight size={17} /></button></div></div><div className="footer-bottom"><nav className="footer-links" aria-label="Footer navigation"><a href="#top">Home</a><a href="#collection">Collection</a><a href="#feeling">About Basant</a><a href="#preorder">How pre-orders work</a><a href="#contact">Contact</a></nav><p>Prices and availability are confirmed by the brand on WhatsApp.</p><span className="footer-year">© {new Date().getFullYear()} URR Lahore</span></div></footer>
    <button className={`floating-whatsapp ${waLink ? '' : 'not-configured'}`} type="button" onClick={contactWhatsApp} aria-label="Pre-order on WhatsApp" title={waLink ? 'Pre-order on WhatsApp' : WHATSAPP_PLACEHOLDER} data-testid="button-floating-whatsapp"><FaWhatsapp size={23} aria-hidden="true" /><span>PRE-ORDER</span></button>
    {notice && <div className="notice-toast" role="status" aria-live="polite">{notice}<button type="button" aria-label="Dismiss message" onClick={() => setNotice('')}><X size={16} /></button></div>}
  </div>;
}

export default App;
