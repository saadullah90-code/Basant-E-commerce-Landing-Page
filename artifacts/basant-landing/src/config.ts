export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageTone: string;
  accent: string;
  detail: string;
  placeholder: true;
};

// Replace these development placeholders with client-approved product facts.
// Keep price, stock, discount and review claims out until confirmed.
export const PRODUCTS: Product[] = [
  { id: 'kite-01', name: 'Product placeholder 01', category: 'Details TBC', description: 'Development placeholder. Product information, price and availability are awaiting client confirmation.', imageTone: '#FFCC00', accent: '#FF5733', detail: 'Product details to be supplied by the client.', placeholder: true },
  { id: 'kite-02', name: 'Product placeholder 02', category: 'Details TBC', description: 'Development placeholder. Product information, price and availability are awaiting client confirmation.', imageTone: '#F1257A', accent: '#8526C7', detail: 'Product details to be supplied by the client.', placeholder: true },
  { id: 'kite-03', name: 'Product placeholder 03', category: 'Details TBC', description: 'Development placeholder. Product information, price and availability are awaiting client confirmation.', imageTone: '#06B6D4', accent: '#FFCC00', detail: 'Product details to be supplied by the client.', placeholder: true },
  { id: 'kite-04', name: 'Product placeholder 04', category: 'Details TBC', description: 'Development placeholder. Product information, price and availability are awaiting client confirmation.', imageTone: '#8526C7', accent: '#16A34A', detail: 'Product details to be supplied by the client.', placeholder: true },
];

export const FEATURED_PRODUCT_ID = 'kite-01';
// Add the brand's country code + number, digits only, once confirmed.
// Until configured, WhatsApp actions remain safely disabled.
export const WHATSAPP_NUMBER = '';
export const DEFAULT_WHATSAPP_MESSAGE = "Assalam-o-Alaikum! I'm interested in your Basant Collection. Please share more details.";
export const TEMPORARY_BRAND_NAME = 'Basant';
