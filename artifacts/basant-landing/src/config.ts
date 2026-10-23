export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
};

export const PRODUCTS: Product[] = [
  { id: 'patang-01', name: 'Maroon Special Patang', category: 'SPECIAL PATANG', description: 'A distinctive maroon design. Ask us about price and availability.', image: '/products/maroon-special-patang.webp' },
  { id: 'patang-02', name: 'Black & Gold Patang', category: 'DESIGN PATANG', description: 'A black patang with gold details. Ask us about price and availability.', image: '/products/black-gold-patang.webp' },
  { id: 'patang-03', name: 'Striped Colour Patang', category: 'DESIGN PATANG', description: 'A bright striped patang. Ask us about price and availability.', image: '/products/striped-color-patang.webp' },
  { id: 'patang-04', name: 'Magenta Pattern Patang', category: 'DESIGN PATANG', description: 'A magenta, white and black design. Ask us about price and availability.', image: '/products/magenta-pattern-patang.webp' },
  { id: 'string-01', name: 'Kite String Assortment', category: 'KITE STRING', description: 'A colourful kite-string assortment. Ask us about price and availability.', image: '/products/kite-string-assortment.webp' },
  { id: 'string-02', name: 'Blue & Green Kite String', category: 'KITE STRING', description: 'A blue, green and purple string assortment. Ask us about price and availability.', image: '/products/blue-green-kite-string.webp' },
  { id: 'set-01', name: 'Mixed Patang Set', category: 'PATANG SET', description: 'A selection of colourful patangs. Ask us about price and availability.', image: '/products/mixed-patang-set.webp' },
  { id: 'set-02', name: 'Colourful Patang Mix', category: 'PATANG SET', description: 'A bright mix of Basant colours. Ask us about price and availability.', image: '/products/colorful-patang-mix.webp' },
];

export const FEATURED_PRODUCT_ID = 'patang-01';
/** URR Lahore business WhatsApp number in international format (digits only). */
export const WHATSAPP_NUMBER = '923248778775';
export const WHATSAPP_PLACEHOLDER = 'Pending confirmation from URR Lahore';
export const DEFAULT_WHATSAPP_MESSAGE = "Assalam-o-Alaikum! I'm interested in your Basant Collection. Please share your pre-order details.";
export const productWhatsAppMessage = (productName: string) => `Assalam-o-Alaikum! I would like to pre-order ${productName} from your Basant Collection. Please share the price, availability, and pre-order details.`;
export const TEMPORARY_BRAND_NAME = 'URR Lahore';
