export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  details: string;
  image: string;
  gallery?: string[];
};

export const PRODUCTS: Product[] = [
  { id: 'patang-01', name: 'Patang', category: 'PATANG', description: 'A colourful kite for the Basant sky.', details: '4.5 GITHI', image: '/products/kite-patang-maroon.webp' },
  { id: 'gudda-01', name: 'Gudda', category: 'GUDDA', description: 'A classic Gudda for your Basant celebration.', details: '1 tawa · 1.5 Tawa', image: '/products/kite-red-card.webp', gallery: ['/products/kite-brown-gold.webp'] },
  { id: 'dor-01', name: 'Dor', category: 'DOR', description: 'Colourful kite string, ready for the rooftop.', details: 'PINNA · 2 PIECE', image: '/products/kite-string-assortment.webp' },
];

export const FEATURED_PRODUCT_ID = 'patang-01';
/** URR Lahore business contact number in international format (digits only). */
export const CONTACT_NUMBER = '923248778775';
export const CONTACT_PLACEHOLDER = 'Pending confirmation from URR Lahore';
export const DEFAULT_CONTACT_MESSAGE = "Assalam-o-Alaikum! I'm interested in your Basant Collection. Please share your pre-order details.";
export const productInquiryMessage = (productName: string) => `Assalam-o-Alaikum! I would like to pre-order ${productName} from your Basant Collection. Please share the price, availability, and pre-order details.`;
export const TEMPORARY_BRAND_NAME = 'URR Lahore';
