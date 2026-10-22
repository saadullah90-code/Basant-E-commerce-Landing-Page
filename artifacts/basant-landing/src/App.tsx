import { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Menu, Minus, Plus, ShoppingBag, Sparkles, Sun, Wind, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { DEFAULT_WHATSAPP_MESSAGE, FEATURED_PRODUCT_ID, PRODUCTS, TEMPORARY_BRAND_NAME, WHATSAPP_NUMBER, type Product } from './config';

type Cart = Record<string, number>;

function whatsappUrl(message: string) {
  const number = WHATSAPP_NUMBER.replace(/\D/g, '');
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : '';
}

function KiteMark({ color, secondColor = '#FFCC00', size = 64 }: { color: string; secondColor?: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.18} viewBox="0 0 72 84" aria-hidden="true" focusable="false">
      <path d="M36 3 68 35 36 67 4 35 36 3Z" fill={color} stroke="#302014" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="m36 3 1 64M4 35l64 0" stroke="#302014" strokeWidth="1.5" opacity=".65" />
      <path className="kite-string" d="m36 67-5 10 7-2 3 7 5-10" fill="none" stroke="#302014" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m36 3 32 32H37Z" fill={secondColor} opacity=".78" />
    </svg>
  );
}

function ProductArtwork({ product }: { product: Product }) {
  return (
    <div className="product-art" style={{ backgroundColor: product.imageTone }} aria-label={`${product.name} illustrated kite artwork`} role="img">
      <div className="product-art-sun" />
      <div className="art-kite art-kite-main"><KiteMark color={product.accent} secondColor="#FFF4C5" size={112} /></div>
      <div className="art-kite art-kite-small"><KiteMark color="#FFF2B9" secondColor={product.imageTone} size={43} /></div>
      <span className="art-cloud cloud-one" />
      <span className="art-cloud cloud-two" />
      <span className="art-roof" />
      <span className="art-caption">A little more sky</span>
    </div>
  );
}

function Header({ count, onCart }: { count: number; onCart: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  const links = [['Home', '#top'], ['Collection', '#collection'], ['About Basant', '#feeling'], ['Contact', '#contact']];
  return (
    <header className={`site-header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-inner">
        <a className="brand-lockup focus-ring" href="#top" aria-label={`${TEMPORARY_BRAND_NAME} home`} data-testid="link-brand-home">
          <span className="brand-kite"><KiteMark color="#FF5733" secondColor="#FFCC00" size={27} /></span>
          <span className="brand-word">{TEMPORARY_BRAND_NAME}<small>LAHORE, IN THE SKY</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => <a href={href} key={href} data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="bag-button focus-ring" type="button" onClick={onCart} aria-label={`Open basket, ${count} items`} data-testid="button-open-cart">
            <ShoppingBag size={19} strokeWidth={2.1} /><span className="bag-label">Basket</span><span className="bag-count">{count}</span>
          </button>
          <button className="mobile-menu-button focus-ring" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} type="button" onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{links.map(([label, href]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={16} /></a>)}<button type="button" onClick={() => { setMenuOpen(false); onCart(); }}>Open basket <ShoppingBag size={16} /></button></nav>}
    </header>
  );
}

function CartDrawer({ cart, onClose, onQuantity }: { cart: Cart; onClose: () => void; onQuantity: (id: string, amount: number) => void }) {
  const selected = PRODUCTS.filter((product) => cart[product.id]);
  const quantityTotal = Object.values(cart).reduce((sum, amount) => sum + amount, 0);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);
  return (
    <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="drawer-heading"><div><span className="eyebrow">A little rooftop edit</span><h2 id="cart-title" className="heading">Your basket <span>({quantityTotal})</span></h2></div><button className="icon-button" type="button" aria-label="Close basket" onClick={onClose}><X /></button></div>
        {selected.length ? <div className="cart-lines">{selected.map((product) => <div className="cart-line" key={product.id}>
          <div className="cart-kite" style={{ backgroundColor: product.imageTone }}><KiteMark color={product.accent} size={43} /></div>
          <div className="cart-line-info"><strong className="product-name">{product.name}</strong><span>Development placeholder · details to be confirmed</span>
            <div className="quantity-control"><button type="button" aria-label={`Remove one ${product.name}`} onClick={() => onQuantity(product.id, -1)}><Minus size={14} /></button><span>{cart[product.id]}</span><button type="button" aria-label={`Add one ${product.name}`} onClick={() => onQuantity(product.id, 1)}><Plus size={14} /></button></div>
          </div>
          <button type="button" className="remove-line" aria-label={`Remove ${product.name} from basket`} onClick={() => onQuantity(product.id, -cart[product.id])}>Remove</button>
        </div>)}</div> : <div className="cart-empty"><div className="empty-kite"><KiteMark color="#FF5733" size={62} /></div><h3 className="heading">Nothing in the breeze yet.</h3><p>Find a little color for your rooftop.</p><button className="text-link" type="button" onClick={onClose}>Explore the collection <ArrowRight size={16} /></button></div>}
        <div className="drawer-foot"><div className="no-checkout-note"><Sparkles size={17} /><p>This is a local basket preview only. No checkout, payment or order processing is available here.</p></div><button className="button button-outline full-width" type="button" onClick={onClose}>Keep exploring <ArrowDownRight size={17} /></button></div>
      </aside>
    </div>
  );
}

function ProductCard({ product, onAdd, onInquiry }: { product: Product; onAdd: (product: Product) => void; onInquiry: (product: Product) => void }) {
  return (
    <article className="product-card reveal" data-testid={`card-product-${product.id}`}>
      <div className="product-image-wrap"><ProductArtwork product={product} /><span className="placeholder-tag">DEVELOPMENT PLACEHOLDER</span></div>
      <div className="product-copy">
        <div className="product-meta"><span>{product.category}</span><span className="unconfirmed">Details TBC</span></div>
        <h3 className="product-name">{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-card-actions">
          <button className="button button-dark button-small" type="button" onClick={() => onAdd(product)} data-testid={`button-add-${product.id}`}>Add to cart <Plus size={15} /></button>
          <button className="inquiry-link" type="button" onClick={() => onInquiry(product)} data-testid={`button-inquire-${product.id}`}>Inquire on WhatsApp <ArrowUpRight size={15} /></button>
        </div>
      </div>
    </article>
  );
}

function App() {
  const [cart, setCart] = useState<Cart>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const itemCount = useMemo(() => Object.values(cart).reduce((sum, value) => sum + value, 0), [cart]);
  const waLink = whatsappUrl(DEFAULT_WHATSAPP_MESSAGE);

  useEffect(() => {
    document.title = 'Rangon Ki Uraan — Basant in Lahore';
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.setAttribute('name', 'description');
      document.head.appendChild(description);
    }
    description.setAttribute('content', 'Celebrate Basant in Lahore with a sky full of color. Explore the collection and the feeling of the rooftops.');
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function addProduct(product: Product) {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + 1 }));
    setNotice(`${product.name} added to your local basket.`);
  }
  function changeQuantity(id: string, amount: number) {
    setCart((current) => {
      const next = { ...current, [id]: (current[id] ?? 0) + amount };
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }
  function inquire(product: Product) {
    const message = `Assalam-o-Alaikum! I'm interested in ${product.name} from your Basant Collection. Please share its details and availability.`;
    const link = whatsappUrl(message);
    if (link) window.open(link, '_blank', 'noopener,noreferrer');
    else setNotice('Product inquiry is ready once the brand WhatsApp number is added in src/config.ts.');
  }
  function contactWhatsApp() {
    if (waLink) window.open(waLink, '_blank', 'noopener,noreferrer');
    else setNotice('WhatsApp is not configured yet. Add the confirmed number in src/config.ts to enable contact.');
  }

  return (
    <div className="page-shell grain" id="top">
      <div className="announcement" aria-label="Basant season is here. Celebrate in full color.">
        <div className="announce-track marquee-track" aria-hidden="true">{Array.from({ length: 4 }, (_, index) => <span className="announce-unit" key={index}>BASANT SEASON IS HERE <i>✦</i> CELEBRATE IN FULL COLOR <i>✦</i></span>)}</div>
      </div>
      <Header count={itemCount} onCart={() => setCartOpen(true)} />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-sky">
            <div className="hero-sun" aria-hidden="true" />
            <div className="hero-topline"><span>SPRING, THE LAHORE WAY</span><span>31° 32′ N · 74° 20′ E</span></div>
            <div className="hero-copy">
              <p className="hero-kicker"><span /> THE SKY IS OURS TODAY</p>
              <h1 className="display" id="hero-title">RANGON KI<br /><span>URAAN</span></h1>
              <p className="hero-intro">Celebrate Basant. Fly High. Live in Color.</p>
              <div className="hero-actions">
                <a className="button button-dark hero-cta" href="#collection">EXPLORE THE COLLECTION <ArrowDownRight size={19} /></a>
                <a className="button hero-secondary" href="#feeling">CELEBRATE BASANT <ArrowDownRight size={17} /></a>
              </div>
              <p className="hero-micro">A seasonal collection in the making · product details coming soon</p>
            </div>
            <div className="hero-art-wrap">
              <img className="hero-art" src="/lahore-rooftop-basant.png" alt="Illustrated Lahore rooftops beneath a golden Basant sky, with colorful kites aloft" fetchPriority="high" />
              <div className="hero-sticker"><span>LAHORE</span><strong>LOOKS<br />UP.</strong><KiteMark color="#F1257A" secondColor="#FFCC00" size={32} /></div>
              <div className="hero-coordinate">WALLED CITY / AFTERNOON LIGHT</div>
            </div>
            <div className="hero-cloud cloud-a" /><div className="hero-cloud cloud-b" />
            <div className="floating-kite kite-one"><KiteMark color="#F1257A" secondColor="#FFCC00" size={45} /></div>
            <div className="floating-kite kite-two"><KiteMark color="#06B6D4" secondColor="#FF5733" size={57} /></div>
            <div className="hero-bottom-note"><span>01 — THE FIRST FLIGHT</span><a href="#feeling" aria-label="Scroll to the feeling section"><ArrowDownRight size={19} /></a></div>
          </div>
        </section>

        <div className="ticker" aria-label="Basant. Lahore. Sky full of color.">
          <div className="ticker-track marquee-track" aria-hidden="true">{Array.from({ length: 4 }, (_, index) => <span className="ticker-unit" key={index}>BASANT <i>✳</i> LAHORE <b>✦</b> SKY FULL OF COLOR <i>✳</i></span>)}</div>
        </div>

        <section className="collection section-pad" id="collection" aria-labelledby="collection-title">
          <div className="section-heading reveal">
          <div><p className="eyebrow"><span className="eyebrow-mark">02</span> THE COLLECTION</p><h2 className="heading" id="collection-title">THE BASANT COLLECTION</h2></div>
            <p className="section-intro">Bring home the colors, joy, and spirit of Basant. Product details, prices and availability are development placeholders until confirmed by the client.</p>
          </div>
          <div className="product-grid">{PRODUCTS.map((product) => <ProductCard key={product.id} product={product} onAdd={addProduct} onInquiry={inquire} />)}</div>
          <div className="collection-note reveal"><span className="note-stamp">A NOTE<br />FROM US</span><p>We’re still putting the final details in place. No prices, stock or product specifications are shown until confirmed by the brand.</p><span className="note-doodle"><Wind size={29} /></span></div>
        </section>

        {PRODUCTS.find((product) => product.id === FEATURED_PRODUCT_ID) && (() => {
          const featured = PRODUCTS.find((product) => product.id === FEATURED_PRODUCT_ID)!;
          return <section className="featured-section" aria-labelledby="featured-title">
            <div className="featured-art reveal"><ProductArtwork product={featured} /><span className="featured-stamp">A CLOSER<br />LOOK</span></div>
            <div className="featured-copy reveal">
              <p className="eyebrow"><span className="eyebrow-mark">FEATURED / DEVELOPMENT PLACEHOLDER</span></p>
              <h2 className="heading" id="featured-title">{featured.name}</h2>
              <p>{featured.description}</p>
              <p className="featured-details">Product image, specifications and price will be replaced with approved client information.</p>
              <div className="featured-actions"><button className="button button-dark" type="button" onClick={() => addProduct(featured)}>Add to cart <Plus size={16} /></button><button className="inquiry-link" type="button" onClick={() => inquire(featured)}>Inquire on WhatsApp <ArrowUpRight size={15} /></button></div>
            </div>
          </section>;
        })()}

        <section className="feeling" id="feeling" aria-labelledby="feeling-title">
          <div className="feeling-image reveal">
            <img src="/lahore-rooftop-basant.png" alt="Colorful kites drift over a layered illustration of Lahore rooftops" loading="lazy" />
            <div className="feeling-image-label"><span>LAHORE / LATE AFTERNOON</span><span>THE ROOFTOP IS THE PLACE</span></div>
            <div className="feeling-scribble">up, up<br />and away</div>
          </div>
          <div className="feeling-copy reveal">
            <p className="eyebrow"><span className="eyebrow-mark">03</span> THE FEELING</p>
            <h2 className="heading" id="feeling-title">MORE THAN A FESTIVAL.<br /><em>IT’S A FEELING.</em></h2>
            <p className="large-copy">There’s a moment when the rooftops turn gold, the breeze finds its way between old walls, and every pair of eyes tilts upward.</p>
            <p className="body-copy">That’s the feeling we’re holding onto. Lahore, seen from above: close rooftops, faraway domes, a paper kite tugging at the day. No grand claims. Just a little love for a city that knows how to look up.</p>
            <a className="text-link" href="#note">A note on this collection <ArrowRight size={17} /></a>
          </div>
          <span className="feeling-number">II</span>
        </section>

        <section className="color-strip" aria-label="A sky of Basant colors"><div className="color-strip-inner"><span>THE COLORS OF A DAY WELL SPENT</span><div className="color-dots"><i /><i /><i /><i /><i /><i /></div><span>TAKE THE LONG WAY HOME</span></div></section>

        <section className="note-section" id="note" aria-labelledby="note-title">
          <div className="note-topline"><span className="eyebrow"><span className="eyebrow-mark">04</span> A SMALL NOTE</span><span className="note-index">EST. FOR THIS SEASON / LAHORE</span></div>
          <div className="note-layout">
            <div className="note-title-wrap reveal"><div className="note-sun"><Sun size={33} strokeWidth={1.5} /></div><h2 className="display" id="note-title">COLOR<br />IS A<br />FEELING.</h2></div>
            <div className="note-text reveal"><p className="note-lede">This page is a window into a Basant mood—not a live shop just yet.</p><p>The collection names and illustrations here are clearly marked development placeholders. Final products, prices, stock, policies and contact details are waiting on the brand’s confirmation.</p><p>Until then, wander a little. Imagine the breeze. And keep your eyes on the sky.</p><div className="handwritten">with warmth,<br />from Lahore <KiteMark color="#FF5733" size={29} /></div></div>
          </div>
          <div className="note-bottom-kites"><span /><span /><span /><span /></div>
        </section>

        <section className="final-cta" aria-labelledby="final-cta-title">
          <div className="final-cta-kite"><KiteMark color="#F1257A" secondColor="#FFCC00" size={96} /></div>
          <p className="eyebrow"><span className="eyebrow-mark">THE SKY IS WAITING</span></p>
          <h2 className="display" id="final-cta-title">LET THE COLORS<br /><span>TAKE OVER!</span></h2>
          <p>Find your favorites and celebrate the season in style.</p>
          <a className="button button-dark" href="#collection">SHOP THE COLLECTION <ArrowDownRight size={18} /></a>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-sky">
            <div className="contact-top"><p className="eyebrow"><span className="eyebrow-mark">05</span> WHEN THE DETAILS ARE READY</p><div className="contact-kite"><KiteMark color="#FFCC00" secondColor="#FF5733" size={55} /></div></div>
            <div className="contact-main reveal"><div><h2 className="heading" id="contact-title">Let’s talk<br /><em>when the time is right.</em></h2><p>Questions about the collection? The brand’s direct contact is being confirmed. We’ll make it easy to say salaam when it’s ready.</p></div><button className="button button-dark contact-button" type="button" onClick={contactWhatsApp} data-testid="button-contact-whatsapp">{waLink ? 'Say salaam on WhatsApp' : 'WhatsApp details coming soon'} <ArrowUpRight size={18} /></button></div>
            {!waLink && <p className="contact-config-note">Contact is safely disabled until a real WhatsApp number is entered in <code>src/config.ts</code>.</p>}
            <div className="contact-bottom"><span>NO MADE-UP DETAILS. JUST GOOD COLOR.</span><a href="#top">BACK TO THE SKY <ArrowUpRight size={15} /></a></div>
          </div>
        </section>
      </main>
      <footer className="site-footer"><a className="footer-brand" href="#top"><span className="brand-kite"><KiteMark color="#FF5733" size={26} /></span><span className="brand-word">{TEMPORARY_BRAND_NAME}<small>LAHORE, IN THE SKY</small></span></a><p>Temporary text lockup · replace with the client’s approved brand identity</p><span>© {new Date().getFullYear()} · A little more sky.</span><div className="footer-policy">Shipping, returns and social links will appear once supplied by the brand.</div></footer>
      <button className={`floating-whatsapp ${waLink ? '' : 'not-configured'}`} type="button" onClick={contactWhatsApp} aria-label="Chat with us on WhatsApp" data-testid="button-floating-whatsapp"><FaWhatsapp size={21} aria-hidden="true" /><span>{waLink ? 'Chat with us' : 'Contact soon'}</span></button>
      {notice && <div className="notice-toast" role="status" aria-live="polite"><Sparkles size={17} />{notice}<button type="button" aria-label="Dismiss message" onClick={() => setNotice('')}><X size={16} /></button></div>}
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onQuantity={changeQuantity} />}
    </div>
  );
}

export default App;
