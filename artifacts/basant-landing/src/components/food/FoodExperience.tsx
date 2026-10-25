import { useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Search, Utensils, X } from 'lucide-react';
import { cateringLiveStations, cateringMenu } from '../../data/catering-menu';
import './food-experience.css';

type FoodExperienceProps = { onContact: () => void };

const categoryNotes: Record<string, string> = {
  appetizers: 'A first round for the table: crisp, warm, bright and made to be passed around.',
  'main-course': 'The heart of the daawat. Slow-cooked favourites and generous Lahori classics.',
  desserts: 'A sweet finish, from familiar halwa to the chilled favourites that disappear first.',
  rice: 'Fragrant rice, layered and ready for the second helping.',
  naan: 'Straight from the tandoor and made for tearing, sharing and mopping up every last bite.',
  bbq: 'Smoky, charred and served with the pleasure of a proper rooftop feast.',
  chinese: 'A lively counterpoint of wok-tossed favourites for a table with many tastes.',
};

function FoodExperience({ onContact }: FoodExperienceProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredCategories = useMemo(() => {
    const term = query.trim().toLowerCase();
    return cateringMenu
      .filter((category) => activeCategory === 'all' || category.id === activeCategory)
      .map((category) => ({
        ...category,
        items: term ? category.items.filter((item) => item.toLowerCase().includes(term)) : category.items,
      }))
      .filter((category) => category.items.length > 0);
  }, [activeCategory, query]);

  const totalDishes = cateringMenu.reduce((total, category) => total + category.items.length, 0);
  const hasSearch = query.trim().length > 0;

  return (
    <section className="urr-food" id="food" aria-labelledby="urr-food-title">
      <div className="food-opening">
        <div className="food-opening-top">
          <p className="food-eyebrow"><span>05</span> THE LAHORI DAWAT</p>
          <span className="food-edition">URR LAHORE <i> / </i> MADE FOR GATHERING</span>
        </div>
        <div className="food-opening-grid">
          <div className="food-opening-copy">
            <h2 id="urr-food-title">A feast<br />with <em>feeling.</em></h2>
            <p className="food-opening-lede">In Lahore, the welcome is never just a hello. It is a table made generous, a plate passed across, and room for one more.</p>
            <a className="food-scroll-link" href="#food-menu">EXPLORE THE MENU <ArrowDown size={15} /></a>
          </div>
          <div className="food-art" aria-hidden="true">
            <div className="food-art-sun" />
            <div className="food-art-plate"><div className="food-art-inner"><span className="food-art-kicker">THE TABLE IS SET</span><Utensils size={43} strokeWidth={1.1} /><span className="food-art-word">LAHORE<br />ON A PLATE</span></div></div>
            <span className="food-art-side">A GOOD GATHERING ALWAYS<br />MAKES ROOM FOR MORE</span>
            <span className="food-art-coordinate">31° 32' N&nbsp; / &nbsp;74° 21' E</span>
            <svg className="food-art-line" viewBox="0 0 500 350" fill="none"><path d="M6 302C100 260 118 335 205 274S321 225 368 276 429 314 494 230" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 8"/><path d="m487 224 8 6-9 4" stroke="currentColor" strokeWidth="1.2"/></svg>
          </div>
        </div>
        <div className="food-opening-foot"><span>THE FOOD OF A CITY THAT KNOWS HOW TO HOST</span><span>7 MENU CHAPTERS <b>·</b> {totalDishes} DISHES</span></div>
      </div>

      <div className="food-manifesto">
        <span className="food-manifesto-mark">01 / THE WAY WE GATHER</span>
        <p>Big tables. <em>Full plates.</em><br />Stories that run past supper.</p>
        <span className="food-manifesto-note">AUTHENTIC LAHORI CATERING<br />FOR FAMILY & FRIENDS</span>
      </div>

      <div className="food-menu-wrap" id="food-menu">
        <div className="food-menu-heading">
          <div>
            <p className="food-eyebrow"><span>02</span> SOMETHING FOR EVERY PLACE AT THE TABLE</p>
            <h3>The menu, <em>our way.</em></h3>
          </div>
          <p className="food-menu-intro">From the first bowl to the last sweet bite, choose the flavours that feel like your kind of gathering.</p>
        </div>

        <div className="food-controls">
          <div className="food-category-nav" role="group" aria-label="Filter menu by category">
            <button type="button" className={activeCategory === 'all' ? 'is-active' : ''} onClick={() => setActiveCategory('all')} aria-pressed={activeCategory === 'all'}>ALL <span>{totalDishes}</span></button>
            {cateringMenu.map((category) => (
              <button key={category.id} type="button" className={activeCategory === category.id ? 'is-active' : ''} onClick={() => setActiveCategory(category.id)} aria-pressed={activeCategory === category.id}>
                {category.name}<span>{category.items.length}</span>
              </button>
            ))}
          </div>
          <label className="food-search">
            <Search size={16} aria-hidden="true" />
            <span className="food-visually-hidden">Search dishes</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a dish" type="search" />
            {query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')}><X size={15} /></button>}
          </label>
        </div>

        <div className={`food-category-list ${activeCategory !== 'all' ? 'food-category-single' : ''}`}>
          {filteredCategories.map((category) => (
            <article className="food-category" key={category.id} id={`food-${category.id}`}>
              <div className="food-category-heading">
                <span className="food-category-number">{String(cateringMenu.findIndex((item) => item.id === category.id) + 1).padStart(2, '0')}</span>
                <div><h4>{category.name}</h4><p>{categoryNotes[category.id]}</p></div>
                <span className="food-category-count">{String(category.items.length).padStart(2, '0')} <i>ON THE MENU</i></span>
              </div>
              <ul className="food-dish-list">
                {category.items.map((item, index) => (
                  <li key={item}><span className="food-dish-index">{String(index + 1).padStart(2, '0')}</span><span>{item}</span><span className="food-dish-rule" aria-hidden="true" /></li>
                ))}
              </ul>
            </article>
          ))}
          {filteredCategories.length === 0 && (
            <div className="food-no-results"><span>NO MATCH JUST YET</span><p>Try another dish name, or browse the full menu.</p><button type="button" onClick={() => { setQuery(''); setActiveCategory('all'); }}>SHOW THE FULL MENU <ArrowRight size={15} /></button></div>
          )}
        </div>
        <div className="food-menu-foot"><span>THE FULL SPREAD, READY TO MAKE YOURS</span><span>MENU SELECTIONS CAN BE DISCUSSED FOR YOUR GATHERING</span></div>
      </div>

      <section className="food-live" aria-labelledby="food-live-title">
        <div className="food-live-top">
          <div>
            <p className="food-eyebrow"><span>03</span> MADE FRESH, RIGHT THERE</p>
            <h3 id="food-live-title">The kitchen<br />comes <em>to you.</em></h3>
          </div>
          <div className="food-live-aside"><span className="food-live-stamp">LIVE<br />AT YOUR<br />GATHERING</span><p>Bring a little theatre to the feast. Our live stations turn the making into part of the memory.</p></div>
        </div>
        <div className="food-stations" aria-label="Live catering stations">
          {cateringLiveStations.map((station, index) => (
            <div className="food-station" key={station}><span>{String(index + 1).padStart(2, '0')}</span><strong>{station}</strong><i aria-hidden="true">+</i></div>
          ))}
        </div>
        <div className="food-live-bottom"><span>THE AROMA. THE SIZZLE. THE FIRST SERVING.</span><span>{String(cateringLiveStations.length).padStart(2, '0')} WAYS TO BRING THE COUNTER TO LIFE</span></div>
      </section>

      <div className="food-contact">
        <span className="food-contact-orbit" aria-hidden="true"><i /><i /><i /></span>
        <div className="food-contact-copy">
          <p className="food-eyebrow"><span>04</span> MAKE IT A GATHERING</p>
          <h3>Your table.<br /><em>Lahore's way.</em></h3>
          <p>Tell us what you are celebrating. We would love to help shape a feast around it.</p>
          <button type="button" onClick={onContact}>LET'S TALK CATERING <ArrowUpRight size={17} /></button>
        </div>
        <div className="food-contact-aside"><span>GOOD FOOD</span><b>+</b><span>GOOD COMPANY</span><b>=</b><span>A VERY LAHORI DAY</span></div>
      </div>
    </section>
  );
}

export default FoodExperience;
