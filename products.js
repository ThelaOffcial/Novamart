/* ============================================================
   NovaMart Global — Product Database & Smart Search Engine
   File: js/products.js
   ------------------------------------------------------------
   This file contains:
   1. The full product catalog (PRODUCTS)
   2. A synonym dictionary used to power "smart search"
   3. Helper/query functions used across the site
      (index, product page, search results, related products, etc.)

   NOTE: This is static demo data. In a future backend integration,
   PRODUCTS would instead be fetched from an API, and the helper
   functions below would simply become wrappers around fetch calls.
   ============================================================ */

/* ------------------------------------------------------------
   1. PRODUCT CATALOG
   ------------------------------------------------------------ */
const PRODUCTS = [
  {
    "id": 1,
    "name": "Wireless Bluetooth Earbuds Pro",
    "description": "High-quality wireless bluetooth earbuds pro designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 161.66,
    "originalPrice": 161.66,
    "discount": 0,
    "rating": 4.6,
    "reviewCount": 2018,
    "soldCount": 3707,
    "category": "Electronics",
    "tags": [
      "wireless",
      "bluetooth",
      "earbuds",
      "pro",
      "electronics"
    ],
    "stock": 71,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/electronics1/500/500"
  },
  {
    "id": 2,
    "name": "Noise Cancelling Headphones",
    "description": "High-quality noise cancelling headphones designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 26.3,
    "originalPrice": 40.46,
    "discount": 35,
    "rating": 3.5,
    "reviewCount": 779,
    "soldCount": 3632,
    "category": "Electronics",
    "tags": [
      "noise",
      "cancelling",
      "headphones",
      "electronics"
    ],
    "stock": 119,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/electronics2/500/500"
  },
  {
    "id": 3,
    "name": "Smart Watch Series X",
    "description": "High-quality smart watch series x designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 142.51,
    "originalPrice": 475.03,
    "discount": 70,
    "rating": 4.6,
    "reviewCount": 3448,
    "soldCount": 3661,
    "category": "Electronics",
    "tags": [
      "smart",
      "watch",
      "series",
      "x",
      "electronics"
    ],
    "stock": 229,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/electronics3/500/500"
  },
  {
    "id": 4,
    "name": "Essential 4K Action Camera",
    "description": "High-quality 4k action camera designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 190.91,
    "originalPrice": 224.6,
    "discount": 15,
    "rating": 4.5,
    "reviewCount": 2799,
    "soldCount": 4602,
    "category": "Electronics",
    "tags": [
      "4k",
      "action",
      "camera",
      "electronics"
    ],
    "stock": 79,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/electronics4/500/500"
  },
  {
    "id": 5,
    "name": "Portable Bluetooth Speaker",
    "description": "High-quality portable bluetooth speaker designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 27.72,
    "originalPrice": 30.8,
    "discount": 10,
    "rating": 4.0,
    "reviewCount": 2829,
    "soldCount": 9941,
    "category": "Electronics",
    "tags": [
      "portable",
      "bluetooth",
      "speaker",
      "electronics"
    ],
    "stock": 135,
    "shippingInfo": "Ships within 24 hours",
    "image": "https://picsum.photos/seed/electronics5/500/500"
  },
  {
    "id": 6,
    "name": "Mechanical Keyboard RGB",
    "description": "High-quality mechanical keyboard rgb designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 136.38,
    "originalPrice": 209.82,
    "discount": 35,
    "rating": 3.6,
    "reviewCount": 2413,
    "soldCount": 13638,
    "category": "Electronics",
    "tags": [
      "mechanical",
      "keyboard",
      "rgb",
      "electronics"
    ],
    "stock": 321,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/electronics6/500/500"
  },
  {
    "id": 7,
    "name": "Wireless Gaming Mouse",
    "description": "High-quality wireless gaming mouse designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 146.45,
    "originalPrice": 162.72,
    "discount": 10,
    "rating": 3.6,
    "reviewCount": 1878,
    "soldCount": 12715,
    "category": "Electronics",
    "tags": [
      "wireless",
      "gaming",
      "mouse",
      "electronics"
    ],
    "stock": 148,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/electronics7/500/500"
  },
  {
    "id": 8,
    "name": "Classic USB-C Fast Charger 65W",
    "description": "High-quality usb-c fast charger 65w designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 217.29,
    "originalPrice": 334.29,
    "discount": 35,
    "rating": 3.9,
    "reviewCount": 3000,
    "soldCount": 2714,
    "category": "Electronics",
    "tags": [
      "usb-c",
      "fast",
      "charger",
      "65w",
      "electronics"
    ],
    "stock": 189,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/electronics8/500/500"
  },
  {
    "id": 9,
    "name": "Portable Power Bank 20000mAh",
    "description": "High-quality power bank 20000mah designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 154.24,
    "originalPrice": 181.46,
    "discount": 15,
    "rating": 4.3,
    "reviewCount": 2017,
    "soldCount": 2727,
    "category": "Electronics",
    "tags": [
      "power",
      "bank",
      "20000mah",
      "electronics"
    ],
    "stock": 236,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/electronics9/500/500"
  },
  {
    "id": 10,
    "name": "Deluxe Mini Projector HD",
    "description": "High-quality mini projector hd designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 172.73,
    "originalPrice": 172.73,
    "discount": 0,
    "rating": 3.8,
    "reviewCount": 274,
    "soldCount": 13239,
    "category": "Electronics",
    "tags": [
      "mini",
      "projector",
      "hd",
      "electronics"
    ],
    "stock": 161,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/electronics10/500/500"
  },
  {
    "id": 11,
    "name": "Compact Smart LED Strip Lights",
    "description": "High-quality smart led strip lights designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 228.72,
    "originalPrice": 571.8,
    "discount": 60,
    "rating": 4.8,
    "reviewCount": 2589,
    "soldCount": 3533,
    "category": "Electronics",
    "tags": [
      "smart",
      "led",
      "strip",
      "lights",
      "electronics"
    ],
    "stock": 335,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/electronics11/500/500"
  },
  {
    "id": 12,
    "name": "Wireless Charging Pad",
    "description": "High-quality wireless charging pad designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 69.9,
    "originalPrice": 87.38,
    "discount": 20,
    "rating": 4.6,
    "reviewCount": 4427,
    "soldCount": 4354,
    "category": "Electronics",
    "tags": [
      "wireless",
      "charging",
      "pad",
      "electronics"
    ],
    "stock": 382,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/electronics12/500/500"
  },
  {
    "id": 13,
    "name": "Premium Bluetooth Car Adapter",
    "description": "High-quality bluetooth car adapter designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 102.85,
    "originalPrice": 128.56,
    "discount": 20,
    "rating": 5.0,
    "reviewCount": 1145,
    "soldCount": 8398,
    "category": "Electronics",
    "tags": [
      "bluetooth",
      "car",
      "adapter",
      "electronics"
    ],
    "stock": 252,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/electronics13/500/500"
  },
  {
    "id": 14,
    "name": "Modern Digital Voice Recorder",
    "description": "High-quality digital voice recorder designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 42.45,
    "originalPrice": 49.94,
    "discount": 15,
    "rating": 4.7,
    "reviewCount": 3470,
    "soldCount": 9821,
    "category": "Electronics",
    "tags": [
      "digital",
      "voice",
      "recorder",
      "electronics"
    ],
    "stock": 32,
    "shippingInfo": "Ships within 24 hours",
    "image": "https://picsum.photos/seed/electronics14/500/500"
  },
  {
    "id": 15,
    "name": "Portable Portable SSD 1TB",
    "description": "High-quality portable ssd 1tb designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 134.63,
    "originalPrice": 269.26,
    "discount": 50,
    "rating": 4.8,
    "reviewCount": 106,
    "soldCount": 11195,
    "category": "Electronics",
    "tags": [
      "portable",
      "ssd",
      "1tb",
      "electronics"
    ],
    "stock": 369,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/electronics15/500/500"
  },
  {
    "id": 16,
    "name": "Classic Webcam 1080p HD",
    "description": "High-quality webcam 1080p hd designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 193.31,
    "originalPrice": 276.16,
    "discount": 30,
    "rating": 3.7,
    "reviewCount": 3573,
    "soldCount": 2641,
    "category": "Electronics",
    "tags": [
      "webcam",
      "1080p",
      "hd",
      "electronics"
    ],
    "stock": 232,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/electronics16/500/500"
  },
  {
    "id": 17,
    "name": "Smart Home Security Camera",
    "description": "High-quality smart home security camera designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 191.68,
    "originalPrice": 383.36,
    "discount": 50,
    "rating": 4.9,
    "reviewCount": 2456,
    "soldCount": 13839,
    "category": "Electronics",
    "tags": [
      "smart",
      "home",
      "security",
      "camera",
      "electronics"
    ],
    "stock": 327,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/electronics17/500/500"
  },
  {
    "id": 18,
    "name": "Premium Wireless Keyboard and Mouse Combo",
    "description": "High-quality wireless keyboard and mouse combo designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 42.45,
    "originalPrice": 49.94,
    "discount": 15,
    "rating": 4.3,
    "reviewCount": 4356,
    "soldCount": 59,
    "category": "Electronics",
    "tags": [
      "wireless",
      "keyboard",
      "and",
      "mouse",
      "combo",
      "electronics"
    ],
    "stock": 306,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/electronics18/500/500"
  },
  {
    "id": 19,
    "name": "Noise Cancelling Earplugs Bluetooth",
    "description": "High-quality noise cancelling earplugs bluetooth designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 232.63,
    "originalPrice": 310.17,
    "discount": 25,
    "rating": 3.9,
    "reviewCount": 1985,
    "soldCount": 14435,
    "category": "Electronics",
    "tags": [
      "noise",
      "cancelling",
      "earplugs",
      "bluetooth",
      "electronics"
    ],
    "stock": 290,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/electronics19/500/500"
  },
  {
    "id": 20,
    "name": "Compact Multi-Port USB Hub",
    "description": "High-quality multi-port usb hub designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 184.32,
    "originalPrice": 204.8,
    "discount": 10,
    "rating": 5.0,
    "reviewCount": 4375,
    "soldCount": 12597,
    "category": "Electronics",
    "tags": [
      "multi-port",
      "usb",
      "hub",
      "electronics"
    ],
    "stock": 64,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/electronics20/500/500"
  },
  {
    "id": 21,
    "name": "Shockproof Silicone Phone Case",
    "description": "High-quality shockproof silicone phone case designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 45.46,
    "originalPrice": 90.92,
    "discount": 50,
    "rating": 4.8,
    "reviewCount": 3478,
    "soldCount": 3520,
    "category": "Phone Accessories",
    "tags": [
      "shockproof",
      "silicone",
      "phone",
      "case",
      "phone accessories"
    ],
    "stock": 475,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/phonecase21/500/500"
  },
  {
    "id": 22,
    "name": "Tempered Glass Screen Protector",
    "description": "High-quality tempered glass screen protector designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 179.67,
    "originalPrice": 276.42,
    "discount": 35,
    "rating": 5.0,
    "reviewCount": 3071,
    "soldCount": 7227,
    "category": "Phone Accessories",
    "tags": [
      "tempered",
      "glass",
      "screen",
      "protector",
      "phone accessories"
    ],
    "stock": 460,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/phonecase22/500/500"
  },
  {
    "id": 23,
    "name": "Deluxe Magnetic Wireless Car Mount",
    "description": "High-quality magnetic wireless car mount designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 65.74,
    "originalPrice": 73.04,
    "discount": 10,
    "rating": 4.0,
    "reviewCount": 4549,
    "soldCount": 3820,
    "category": "Phone Accessories",
    "tags": [
      "magnetic",
      "wireless",
      "car",
      "mount",
      "phone accessories"
    ],
    "stock": 301,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/phonecase23/500/500"
  },
  {
    "id": 24,
    "name": "Compact Phone Ring Holder Stand",
    "description": "High-quality phone ring holder stand designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 61.09,
    "originalPrice": 61.09,
    "discount": 0,
    "rating": 4.8,
    "reviewCount": 592,
    "soldCount": 8473,
    "category": "Phone Accessories",
    "tags": [
      "phone",
      "ring",
      "holder",
      "stand",
      "phone accessories"
    ],
    "stock": 121,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/phonecase24/500/500"
  },
  {
    "id": 25,
    "name": "Fast Charging USB-C Cable",
    "description": "High-quality fast charging usb-c cable designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 137.11,
    "originalPrice": 342.78,
    "discount": 60,
    "rating": 4.4,
    "reviewCount": 2002,
    "soldCount": 12905,
    "category": "Phone Accessories",
    "tags": [
      "fast",
      "charging",
      "usb-c",
      "cable",
      "phone accessories"
    ],
    "stock": 242,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/phonecase25/500/500"
  },
  {
    "id": 26,
    "name": "Universal Phone Camera Lens Kit",
    "description": "High-quality universal phone camera lens kit designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 28.11,
    "originalPrice": 93.7,
    "discount": 70,
    "rating": 4.1,
    "reviewCount": 3481,
    "soldCount": 6785,
    "category": "Phone Accessories",
    "tags": [
      "universal",
      "phone",
      "camera",
      "lens",
      "kit",
      "phone accessories"
    ],
    "stock": 239,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/phonecase26/500/500"
  },
  {
    "id": 27,
    "name": "Clear Protective Phone Case",
    "description": "High-quality clear protective phone case designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 169.97,
    "originalPrice": 566.57,
    "discount": 70,
    "rating": 3.6,
    "reviewCount": 3310,
    "soldCount": 11981,
    "category": "Phone Accessories",
    "tags": [
      "clear",
      "protective",
      "phone",
      "case",
      "phone accessories"
    ],
    "stock": 173,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/phonecase27/500/500"
  },
  {
    "id": 28,
    "name": "Ultra Foldable Phone Stand",
    "description": "High-quality foldable phone stand designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 65.92,
    "originalPrice": 82.4,
    "discount": 20,
    "rating": 4.3,
    "reviewCount": 1160,
    "soldCount": 6962,
    "category": "Phone Accessories",
    "tags": [
      "foldable",
      "phone",
      "stand",
      "phone accessories"
    ],
    "stock": 93,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/phonecase28/500/500"
  },
  {
    "id": 29,
    "name": "Phone Lanyard Strap",
    "description": "High-quality phone lanyard strap designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 113.57,
    "originalPrice": 227.14,
    "discount": 50,
    "rating": 3.6,
    "reviewCount": 4440,
    "soldCount": 13747,
    "category": "Phone Accessories",
    "tags": [
      "phone",
      "lanyard",
      "strap",
      "phone accessories"
    ],
    "stock": 7,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/phonecase29/500/500"
  },
  {
    "id": 30,
    "name": "Premium Waterproof Phone Pouch",
    "description": "High-quality waterproof phone pouch designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 45.75,
    "originalPrice": 76.25,
    "discount": 40,
    "rating": 4.2,
    "reviewCount": 3297,
    "soldCount": 14835,
    "category": "Phone Accessories",
    "tags": [
      "waterproof",
      "phone",
      "pouch",
      "phone accessories"
    ],
    "stock": 30,
    "shippingInfo": "Ships within 24 hours",
    "image": "https://picsum.photos/seed/phonecase30/500/500"
  },
  {
    "id": 31,
    "name": "Ultra Portable Phone Charger Case",
    "description": "High-quality portable phone charger case designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 69.97,
    "originalPrice": 116.62,
    "discount": 40,
    "rating": 3.9,
    "reviewCount": 4564,
    "soldCount": 10894,
    "category": "Phone Accessories",
    "tags": [
      "portable",
      "phone",
      "charger",
      "case",
      "phone accessories"
    ],
    "stock": 367,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/phonecase31/500/500"
  },
  {
    "id": 32,
    "name": "Premium Bluetooth Selfie Stick Tripod",
    "description": "High-quality bluetooth selfie stick tripod designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 58.34,
    "originalPrice": 58.34,
    "discount": 0,
    "rating": 4.4,
    "reviewCount": 4453,
    "soldCount": 1048,
    "category": "Phone Accessories",
    "tags": [
      "bluetooth",
      "selfie",
      "stick",
      "tripod",
      "phone accessories"
    ],
    "stock": 382,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/phonecase32/500/500"
  },
  {
    "id": 33,
    "name": "Modern PopSocket Phone Grip",
    "description": "High-quality popsocket phone grip designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 121.81,
    "originalPrice": 243.62,
    "discount": 50,
    "rating": 3.7,
    "reviewCount": 4172,
    "soldCount": 1362,
    "category": "Phone Accessories",
    "tags": [
      "popsocket",
      "phone",
      "grip",
      "phone accessories"
    ],
    "stock": 435,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/phonecase33/500/500"
  },
  {
    "id": 34,
    "name": "Leather Wallet Phone Case",
    "description": "High-quality leather wallet phone case designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 170.43,
    "originalPrice": 213.04,
    "discount": 20,
    "rating": 4.1,
    "reviewCount": 4678,
    "soldCount": 4083,
    "category": "Phone Accessories",
    "tags": [
      "leather",
      "wallet",
      "phone",
      "case",
      "phone accessories"
    ],
    "stock": 296,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/phonecase34/500/500"
  },
  {
    "id": 35,
    "name": "Essential Anti-Spy Privacy Screen Protector",
    "description": "High-quality anti-spy privacy screen protector designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 25.09,
    "originalPrice": 83.63,
    "discount": 70,
    "rating": 4.4,
    "reviewCount": 4294,
    "soldCount": 5233,
    "category": "Phone Accessories",
    "tags": [
      "anti-spy",
      "privacy",
      "screen",
      "protector",
      "phone accessories"
    ],
    "stock": 478,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/phonecase35/500/500"
  },
  {
    "id": 36,
    "name": "Casual Cotton T-Shirt",
    "description": "High-quality casual cotton t-shirt designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 70.08,
    "originalPrice": 82.45,
    "discount": 15,
    "rating": 4.5,
    "reviewCount": 2469,
    "soldCount": 7541,
    "category": "Fashion",
    "tags": [
      "casual",
      "cotton",
      "t-shirt",
      "fashion"
    ],
    "stock": 161,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/fashion36/500/500"
  },
  {
    "id": 37,
    "name": "Classic Slim Fit Denim Jeans",
    "description": "High-quality slim fit denim jeans designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 7.28,
    "originalPrice": 18.2,
    "discount": 60,
    "rating": 5.0,
    "reviewCount": 831,
    "soldCount": 1250,
    "category": "Fashion",
    "tags": [
      "slim",
      "fit",
      "denim",
      "jeans",
      "fashion"
    ],
    "stock": 275,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/fashion37/500/500"
  },
  {
    "id": 38,
    "name": "Portable Oversized Hoodie Unisex",
    "description": "High-quality oversized hoodie unisex designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 233.65,
    "originalPrice": 259.61,
    "discount": 10,
    "rating": 4.8,
    "reviewCount": 3039,
    "soldCount": 4719,
    "category": "Fashion",
    "tags": [
      "oversized",
      "hoodie",
      "unisex",
      "fashion"
    ],
    "stock": 80,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/fashion38/500/500"
  },
  {
    "id": 39,
    "name": "Summer Floral Dress",
    "description": "High-quality summer floral dress designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 154.86,
    "originalPrice": 516.2,
    "discount": 70,
    "rating": 4.3,
    "reviewCount": 4555,
    "soldCount": 4955,
    "category": "Fashion",
    "tags": [
      "summer",
      "floral",
      "dress",
      "fashion"
    ],
    "stock": 477,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/fashion39/500/500"
  },
  {
    "id": 40,
    "name": "Classic Leather Jacket",
    "description": "High-quality classic leather jacket designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 69.79,
    "originalPrice": 77.54,
    "discount": 10,
    "rating": 4.6,
    "reviewCount": 1285,
    "soldCount": 4512,
    "category": "Fashion",
    "tags": [
      "classic",
      "leather",
      "jacket",
      "fashion"
    ],
    "stock": 144,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/fashion40/500/500"
  },
  {
    "id": 41,
    "name": "Running Sneakers Unisex",
    "description": "High-quality running sneakers unisex designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 54.88,
    "originalPrice": 182.93,
    "discount": 70,
    "rating": 4.8,
    "reviewCount": 4152,
    "soldCount": 8054,
    "category": "Fashion",
    "tags": [
      "running",
      "sneakers",
      "unisex",
      "fashion"
    ],
    "stock": 128,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/fashion41/500/500"
  },
  {
    "id": 42,
    "name": "Knitted Wool Sweater",
    "description": "High-quality knitted wool sweater designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 27.61,
    "originalPrice": 42.48,
    "discount": 35,
    "rating": 4.7,
    "reviewCount": 373,
    "soldCount": 108,
    "category": "Fashion",
    "tags": [
      "knitted",
      "wool",
      "sweater",
      "fashion"
    ],
    "stock": 170,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/fashion42/500/500"
  },
  {
    "id": 43,
    "name": "Pro High Waist Yoga Leggings",
    "description": "High-quality high waist yoga leggings designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 44.59,
    "originalPrice": 74.32,
    "discount": 40,
    "rating": 4.3,
    "reviewCount": 3515,
    "soldCount": 9239,
    "category": "Fashion",
    "tags": [
      "high",
      "waist",
      "yoga",
      "leggings",
      "fashion"
    ],
    "stock": 4,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/fashion43/500/500"
  },
  {
    "id": 44,
    "name": "Essential Polarized Sunglasses",
    "description": "High-quality polarized sunglasses designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 13.83,
    "originalPrice": 19.76,
    "discount": 30,
    "rating": 4.4,
    "reviewCount": 1225,
    "soldCount": 7091,
    "category": "Fashion",
    "tags": [
      "polarized",
      "sunglasses",
      "fashion"
    ],
    "stock": 65,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/fashion44/500/500"
  },
  {
    "id": 45,
    "name": "Minimalist Leather Wallet",
    "description": "High-quality minimalist leather wallet designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 225.24,
    "originalPrice": 281.55,
    "discount": 20,
    "rating": 4.5,
    "reviewCount": 854,
    "soldCount": 5844,
    "category": "Fashion",
    "tags": [
      "minimalist",
      "leather",
      "wallet",
      "fashion"
    ],
    "stock": 399,
    "shippingInfo": "Ships within 24 hours",
    "image": "https://picsum.photos/seed/fashion45/500/500"
  },
  {
    "id": 46,
    "name": "Canvas Tote Bag",
    "description": "High-quality canvas tote bag designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 243.59,
    "originalPrice": 286.58,
    "discount": 15,
    "rating": 4.9,
    "reviewCount": 1951,
    "soldCount": 14215,
    "category": "Fashion",
    "tags": [
      "canvas",
      "tote",
      "bag",
      "fashion"
    ],
    "stock": 83,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/fashion46/500/500"
  },
  {
    "id": 47,
    "name": "Ultra Woven Fashion Belt",
    "description": "High-quality woven fashion belt designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 220.95,
    "originalPrice": 220.95,
    "discount": 0,
    "rating": 3.8,
    "reviewCount": 2733,
    "soldCount": 12868,
    "category": "Fashion",
    "tags": [
      "woven",
      "fashion",
      "belt",
      "fashion"
    ],
    "stock": 476,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/fashion47/500/500"
  },
  {
    "id": 48,
    "name": "Compact Wide Brim Sun Hat",
    "description": "High-quality wide brim sun hat designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 44.0,
    "originalPrice": 48.89,
    "discount": 10,
    "rating": 4.1,
    "reviewCount": 329,
    "soldCount": 14117,
    "category": "Fashion",
    "tags": [
      "wide",
      "brim",
      "sun",
      "hat",
      "fashion"
    ],
    "stock": 240,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/fashion48/500/500"
  },
  {
    "id": 49,
    "name": "Deluxe Statement Chain Necklace",
    "description": "High-quality statement chain necklace designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 79.77,
    "originalPrice": 99.71,
    "discount": 20,
    "rating": 3.8,
    "reviewCount": 1594,
    "soldCount": 6578,
    "category": "Fashion",
    "tags": [
      "statement",
      "chain",
      "necklace",
      "fashion"
    ],
    "stock": 168,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/fashion49/500/500"
  },
  {
    "id": 50,
    "name": "Classic Classic Analog Wrist Watch",
    "description": "High-quality classic analog wrist watch designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 91.03,
    "originalPrice": 182.06,
    "discount": 50,
    "rating": 4.1,
    "reviewCount": 4404,
    "soldCount": 5475,
    "category": "Fashion",
    "tags": [
      "classic",
      "analog",
      "wrist",
      "watch",
      "fashion"
    ],
    "stock": 480,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/fashion50/500/500"
  },
  {
    "id": 51,
    "name": "Wireless Gaming Controller",
    "description": "High-quality wireless gaming controller designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 147.24,
    "originalPrice": 196.32,
    "discount": 25,
    "rating": 3.6,
    "reviewCount": 3571,
    "soldCount": 5713,
    "category": "Gaming",
    "tags": [
      "wireless",
      "gaming",
      "controller",
      "gaming"
    ],
    "stock": 373,
    "shippingInfo": "Ships within 24 hours",
    "image": "https://picsum.photos/seed/gaming51/500/500"
  },
  {
    "id": 52,
    "name": "Advanced RGB Mechanical Gaming Keyboard",
    "description": "High-quality rgb mechanical gaming keyboard designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 153.52,
    "originalPrice": 307.04,
    "discount": 50,
    "rating": 3.7,
    "reviewCount": 4735,
    "soldCount": 3164,
    "category": "Gaming",
    "tags": [
      "rgb",
      "mechanical",
      "gaming",
      "keyboard",
      "gaming"
    ],
    "stock": 130,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/gaming52/500/500"
  },
  {
    "id": 53,
    "name": "Essential Gaming Headset with Mic",
    "description": "High-quality gaming headset with mic designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 132.38,
    "originalPrice": 264.76,
    "discount": 50,
    "rating": 4.5,
    "reviewCount": 1626,
    "soldCount": 6017,
    "category": "Gaming",
    "tags": [
      "gaming",
      "headset",
      "with",
      "mic",
      "gaming"
    ],
    "stock": 220,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/gaming53/500/500"
  },
  {
    "id": 54,
    "name": "Gaming Mouse Pad XL",
    "description": "High-quality gaming mouse pad xl designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 81.91,
    "originalPrice": 91.01,
    "discount": 10,
    "rating": 4.6,
    "reviewCount": 2472,
    "soldCount": 8358,
    "category": "Gaming",
    "tags": [
      "gaming",
      "mouse",
      "pad",
      "xl",
      "gaming"
    ],
    "stock": 158,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/gaming54/500/500"
  },
  {
    "id": 55,
    "name": "Ergonomic Gaming Chair",
    "description": "High-quality ergonomic gaming chair designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 103.59,
    "originalPrice": 138.12,
    "discount": 25,
    "rating": 4.3,
    "reviewCount": 1583,
    "soldCount": 6938,
    "category": "Gaming",
    "tags": [
      "ergonomic",
      "gaming",
      "chair",
      "gaming"
    ],
    "stock": 340,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/gaming55/500/500"
  },
  {
    "id": 56,
    "name": "Modern Retro Handheld Game Console",
    "description": "High-quality retro handheld game console designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 155.8,
    "originalPrice": 207.73,
    "discount": 25,
    "rating": 4.1,
    "reviewCount": 15,
    "soldCount": 5028,
    "category": "Gaming",
    "tags": [
      "retro",
      "handheld",
      "game",
      "console",
      "gaming"
    ],
    "stock": 146,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/gaming56/500/500"
  },
  {
    "id": 57,
    "name": "Gaming Mouse 16000 DPI",
    "description": "High-quality gaming mouse 16000 dpi designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 165.4,
    "originalPrice": 275.67,
    "discount": 40,
    "rating": 4.2,
    "reviewCount": 1762,
    "soldCount": 8425,
    "category": "Gaming",
    "tags": [
      "gaming",
      "mouse",
      "16000",
      "dpi",
      "gaming"
    ],
    "stock": 242,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/gaming57/500/500"
  },
  {
    "id": 58,
    "name": "Controller Charging Dock",
    "description": "High-quality controller charging dock designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 166.42,
    "originalPrice": 221.89,
    "discount": 25,
    "rating": 4.3,
    "reviewCount": 2757,
    "soldCount": 1580,
    "category": "Gaming",
    "tags": [
      "controller",
      "charging",
      "dock",
      "gaming"
    ],
    "stock": 419,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/gaming58/500/500"
  },
  {
    "id": 59,
    "name": "Compact VR Headset Lens Protector",
    "description": "High-quality vr headset lens protector designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 169.83,
    "originalPrice": 212.29,
    "discount": 20,
    "rating": 4.7,
    "reviewCount": 1219,
    "soldCount": 450,
    "category": "Gaming",
    "tags": [
      "vr",
      "headset",
      "lens",
      "protector",
      "gaming"
    ],
    "stock": 23,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/gaming59/500/500"
  },
  {
    "id": 60,
    "name": "Gaming Capture Card 4K",
    "description": "High-quality gaming capture card 4k designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 213.19,
    "originalPrice": 236.88,
    "discount": 10,
    "rating": 4.2,
    "reviewCount": 4727,
    "soldCount": 3235,
    "category": "Gaming",
    "tags": [
      "gaming",
      "capture",
      "card",
      "4k",
      "gaming"
    ],
    "stock": 367,
    "shippingInfo": "Ships within 24 hours",
    "image": "https://picsum.photos/seed/gaming60/500/500"
  },
  {
    "id": 61,
    "name": "LED Gaming Desk Mat",
    "description": "High-quality led gaming desk mat designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 102.91,
    "originalPrice": 121.07,
    "discount": 15,
    "rating": 4.5,
    "reviewCount": 57,
    "soldCount": 14675,
    "category": "Gaming",
    "tags": [
      "led",
      "gaming",
      "desk",
      "mat",
      "gaming"
    ],
    "stock": 384,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/gaming61/500/500"
  },
  {
    "id": 62,
    "name": "Joystick Flight Simulator Controller",
    "description": "High-quality joystick flight simulator controller designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 195.71,
    "originalPrice": 244.64,
    "discount": 20,
    "rating": 3.8,
    "reviewCount": 4255,
    "soldCount": 7661,
    "category": "Gaming",
    "tags": [
      "joystick",
      "flight",
      "simulator",
      "controller",
      "gaming"
    ],
    "stock": 25,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/gaming62/500/500"
  },
  {
    "id": 63,
    "name": "Gamepad Bluetooth Wireless",
    "description": "High-quality gamepad bluetooth wireless designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 116.83,
    "originalPrice": 194.72,
    "discount": 40,
    "rating": 4.5,
    "reviewCount": 4590,
    "soldCount": 9805,
    "category": "Gaming",
    "tags": [
      "gamepad",
      "bluetooth",
      "wireless",
      "gaming"
    ],
    "stock": 162,
    "shippingInfo": "Ships within 24 hours",
    "image": "https://picsum.photos/seed/gaming63/500/500"
  },
  {
    "id": 64,
    "name": "Compact Gaming Laptop Cooling Pad",
    "description": "High-quality gaming laptop cooling pad designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 155.1,
    "originalPrice": 310.2,
    "discount": 50,
    "rating": 4.1,
    "reviewCount": 4500,
    "soldCount": 7355,
    "category": "Gaming",
    "tags": [
      "gaming",
      "laptop",
      "cooling",
      "pad",
      "gaming"
    ],
    "stock": 459,
    "shippingInfo": "Ships within 24 hours",
    "image": "https://picsum.photos/seed/gaming64/500/500"
  },
  {
    "id": 65,
    "name": "Custom Keycap Set RGB",
    "description": "High-quality custom keycap set rgb designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 68.5,
    "originalPrice": 85.62,
    "discount": 20,
    "rating": 4.8,
    "reviewCount": 2283,
    "soldCount": 12597,
    "category": "Gaming",
    "tags": [
      "custom",
      "keycap",
      "set",
      "rgb",
      "gaming"
    ],
    "stock": 398,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/gaming65/500/500"
  },
  {
    "id": 66,
    "name": "Portable Aromatherapy Essential Oil Diffuser",
    "description": "High-quality aromatherapy essential oil diffuser designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 72.28,
    "originalPrice": 80.31,
    "discount": 10,
    "rating": 4.6,
    "reviewCount": 1932,
    "soldCount": 4501,
    "category": "Home & Living",
    "tags": [
      "aromatherapy",
      "essential",
      "oil",
      "diffuser",
      "home & living"
    ],
    "stock": 171,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/home66/500/500"
  },
  {
    "id": 67,
    "name": "Advanced Memory Foam Pillow Set",
    "description": "High-quality memory foam pillow set designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 38.9,
    "originalPrice": 48.62,
    "discount": 20,
    "rating": 4.1,
    "reviewCount": 1263,
    "soldCount": 11623,
    "category": "Home & Living",
    "tags": [
      "memory",
      "foam",
      "pillow",
      "set",
      "home & living"
    ],
    "stock": 109,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/home67/500/500"
  },
  {
    "id": 68,
    "name": "Non-Stick Cookware Set",
    "description": "High-quality non-stick cookware set designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 137.94,
    "originalPrice": 212.22,
    "discount": 35,
    "rating": 3.6,
    "reviewCount": 3453,
    "soldCount": 6431,
    "category": "Home & Living",
    "tags": [
      "non-stick",
      "cookware",
      "set",
      "home & living"
    ],
    "stock": 463,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/home68/500/500"
  },
  {
    "id": 69,
    "name": "LED Ceiling Light Modern",
    "description": "High-quality led ceiling light modern designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 214.9,
    "originalPrice": 537.25,
    "discount": 60,
    "rating": 4.1,
    "reviewCount": 60,
    "soldCount": 5813,
    "category": "Home & Living",
    "tags": [
      "led",
      "ceiling",
      "light",
      "modern",
      "home & living"
    ],
    "stock": 152,
    "shippingInfo": "Ships within 24 hours",
    "image": "https://picsum.photos/seed/home69/500/500"
  },
  {
    "id": 70,
    "name": "Compact Stainless Steel Water Bottle",
    "description": "High-quality stainless steel water bottle designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 136.86,
    "originalPrice": 273.72,
    "discount": 50,
    "rating": 4.7,
    "reviewCount": 1818,
    "soldCount": 8049,
    "category": "Home & Living",
    "tags": [
      "stainless",
      "steel",
      "water",
      "bottle",
      "home & living"
    ],
    "stock": 112,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/home70/500/500"
  },
  {
    "id": 71,
    "name": "Soft Throw Blanket",
    "description": "High-quality soft throw blanket designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 100.27,
    "originalPrice": 334.23,
    "discount": 70,
    "rating": 4.5,
    "reviewCount": 3324,
    "soldCount": 11914,
    "category": "Home & Living",
    "tags": [
      "soft",
      "throw",
      "blanket",
      "home & living"
    ],
    "stock": 84,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/home71/500/500"
  },
  {
    "id": 72,
    "name": "Multi-Purpose Storage Organizer",
    "description": "High-quality multi-purpose storage organizer designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 245.28,
    "originalPrice": 490.56,
    "discount": 50,
    "rating": 3.5,
    "reviewCount": 3239,
    "soldCount": 9747,
    "category": "Home & Living",
    "tags": [
      "multi-purpose",
      "storage",
      "organizer",
      "home & living"
    ],
    "stock": 288,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/home72/500/500"
  },
  {
    "id": 73,
    "name": "Ultra Ceramic Coffee Mug Set",
    "description": "High-quality ceramic coffee mug set designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 162.47,
    "originalPrice": 191.14,
    "discount": 15,
    "rating": 4.8,
    "reviewCount": 1500,
    "soldCount": 873,
    "category": "Home & Living",
    "tags": [
      "ceramic",
      "coffee",
      "mug",
      "set",
      "home & living"
    ],
    "stock": 133,
    "shippingInfo": "Ships within 24 hours",
    "image": "https://picsum.photos/seed/home73/500/500"
  },
  {
    "id": 74,
    "name": "Premium Automatic Soap Dispenser",
    "description": "High-quality automatic soap dispenser designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 85.08,
    "originalPrice": 130.89,
    "discount": 35,
    "rating": 3.9,
    "reviewCount": 3465,
    "soldCount": 4183,
    "category": "Home & Living",
    "tags": [
      "automatic",
      "soap",
      "dispenser",
      "home & living"
    ],
    "stock": 427,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/home74/500/500"
  },
  {
    "id": 75,
    "name": "Bamboo Cutting Board Set",
    "description": "High-quality bamboo cutting board set designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 17.76,
    "originalPrice": 25.37,
    "discount": 30,
    "rating": 3.8,
    "reviewCount": 574,
    "soldCount": 12849,
    "category": "Home & Living",
    "tags": [
      "bamboo",
      "cutting",
      "board",
      "set",
      "home & living"
    ],
    "stock": 490,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/home75/500/500"
  },
  {
    "id": 76,
    "name": "Deluxe Wall Mounted Coat Rack",
    "description": "High-quality wall mounted coat rack designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 237.65,
    "originalPrice": 297.06,
    "discount": 20,
    "rating": 4.8,
    "reviewCount": 1260,
    "soldCount": 3958,
    "category": "Home & Living",
    "tags": [
      "wall",
      "mounted",
      "coat",
      "rack",
      "home & living"
    ],
    "stock": 64,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/home76/500/500"
  },
  {
    "id": 77,
    "name": "Electric Kettle Stainless Steel",
    "description": "High-quality electric kettle stainless steel designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 237.2,
    "originalPrice": 395.33,
    "discount": 40,
    "rating": 4.5,
    "reviewCount": 3033,
    "soldCount": 2799,
    "category": "Home & Living",
    "tags": [
      "electric",
      "kettle",
      "stainless",
      "steel",
      "home & living"
    ],
    "stock": 310,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/home77/500/500"
  },
  {
    "id": 78,
    "name": "Scented Candle Gift Set",
    "description": "High-quality scented candle gift set designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 195.56,
    "originalPrice": 230.07,
    "discount": 15,
    "rating": 4.9,
    "reviewCount": 897,
    "soldCount": 9531,
    "category": "Home & Living",
    "tags": [
      "scented",
      "candle",
      "gift",
      "set",
      "home & living"
    ],
    "stock": 13,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/home78/500/500"
  },
  {
    "id": 79,
    "name": "Adjustable Laptop Desk Stand",
    "description": "High-quality adjustable laptop desk stand designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 170.95,
    "originalPrice": 263.0,
    "discount": 35,
    "rating": 4.1,
    "reviewCount": 1636,
    "soldCount": 1295,
    "category": "Home & Living",
    "tags": [
      "adjustable",
      "laptop",
      "desk",
      "stand",
      "home & living"
    ],
    "stock": 303,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/home79/500/500"
  },
  {
    "id": 80,
    "name": "Robot Vacuum Cleaner",
    "description": "High-quality robot vacuum cleaner designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 29.97,
    "originalPrice": 39.96,
    "discount": 25,
    "rating": 4.8,
    "reviewCount": 1003,
    "soldCount": 13095,
    "category": "Home & Living",
    "tags": [
      "robot",
      "vacuum",
      "cleaner",
      "home & living"
    ],
    "stock": 289,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/home80/500/500"
  },
  {
    "id": 81,
    "name": "Advanced Vitamin C Facial Serum",
    "description": "High-quality vitamin c facial serum designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 135.52,
    "originalPrice": 451.73,
    "discount": 70,
    "rating": 4.1,
    "reviewCount": 4156,
    "soldCount": 10659,
    "category": "Beauty",
    "tags": [
      "vitamin",
      "c",
      "facial",
      "serum",
      "beauty"
    ],
    "stock": 174,
    "shippingInfo": "Ships within 24 hours",
    "image": "https://picsum.photos/seed/beauty81/500/500"
  },
  {
    "id": 82,
    "name": "Portable Hydrating Sheet Mask Set",
    "description": "High-quality hydrating sheet mask set designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 30.86,
    "originalPrice": 44.09,
    "discount": 30,
    "rating": 4.5,
    "reviewCount": 3778,
    "soldCount": 11638,
    "category": "Beauty",
    "tags": [
      "hydrating",
      "sheet",
      "mask",
      "set",
      "beauty"
    ],
    "stock": 78,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/beauty82/500/500"
  },
  {
    "id": 83,
    "name": "Electric Facial Cleansing Brush",
    "description": "High-quality electric facial cleansing brush designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 155.9,
    "originalPrice": 311.8,
    "discount": 50,
    "rating": 4.7,
    "reviewCount": 3820,
    "soldCount": 7186,
    "category": "Beauty",
    "tags": [
      "electric",
      "facial",
      "cleansing",
      "brush",
      "beauty"
    ],
    "stock": 422,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/beauty83/500/500"
  },
  {
    "id": 84,
    "name": "Compact Matte Liquid Lipstick Set",
    "description": "High-quality matte liquid lipstick set designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 83.96,
    "originalPrice": 104.95,
    "discount": 20,
    "rating": 4.7,
    "reviewCount": 721,
    "soldCount": 4619,
    "category": "Beauty",
    "tags": [
      "matte",
      "liquid",
      "lipstick",
      "set",
      "beauty"
    ],
    "stock": 451,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/beauty84/500/500"
  },
  {
    "id": 85,
    "name": "Ultra Professional Makeup Brush Set",
    "description": "High-quality professional makeup brush set designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 154.53,
    "originalPrice": 237.74,
    "discount": 35,
    "rating": 4.0,
    "reviewCount": 4061,
    "soldCount": 13992,
    "category": "Beauty",
    "tags": [
      "professional",
      "makeup",
      "brush",
      "set",
      "beauty"
    ],
    "stock": 166,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/beauty85/500/500"
  },
  {
    "id": 86,
    "name": "Rechargeable Hair Trimmer",
    "description": "High-quality rechargeable hair trimmer designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 200.47,
    "originalPrice": 286.39,
    "discount": 30,
    "rating": 3.9,
    "reviewCount": 2275,
    "soldCount": 9156,
    "category": "Beauty",
    "tags": [
      "rechargeable",
      "hair",
      "trimmer",
      "beauty"
    ],
    "stock": 5,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/beauty86/500/500"
  },
  {
    "id": 87,
    "name": "Ceramic Hair Straightener",
    "description": "High-quality ceramic hair straightener designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 25.98,
    "originalPrice": 39.97,
    "discount": 35,
    "rating": 4.2,
    "reviewCount": 1980,
    "soldCount": 11364,
    "category": "Beauty",
    "tags": [
      "ceramic",
      "hair",
      "straightener",
      "beauty"
    ],
    "stock": 243,
    "shippingInfo": "Ships within 24 hours",
    "image": "https://picsum.photos/seed/beauty87/500/500"
  },
  {
    "id": 88,
    "name": "Modern Nail Art Gel Polish Set",
    "description": "High-quality nail art gel polish set designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 114.8,
    "originalPrice": 114.8,
    "discount": 0,
    "rating": 3.6,
    "reviewCount": 1827,
    "soldCount": 6675,
    "category": "Beauty",
    "tags": [
      "nail",
      "art",
      "gel",
      "polish",
      "set",
      "beauty"
    ],
    "stock": 354,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/beauty88/500/500"
  },
  {
    "id": 89,
    "name": "Charcoal Face Mask",
    "description": "High-quality charcoal face mask designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 120.95,
    "originalPrice": 241.9,
    "discount": 50,
    "rating": 4.0,
    "reviewCount": 4520,
    "soldCount": 5469,
    "category": "Beauty",
    "tags": [
      "charcoal",
      "face",
      "mask",
      "beauty"
    ],
    "stock": 180,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/beauty89/500/500"
  },
  {
    "id": 90,
    "name": "Rose Water Facial Toner",
    "description": "High-quality rose water facial toner designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 80.12,
    "originalPrice": 100.15,
    "discount": 20,
    "rating": 3.7,
    "reviewCount": 1589,
    "soldCount": 5219,
    "category": "Beauty",
    "tags": [
      "rose",
      "water",
      "facial",
      "toner",
      "beauty"
    ],
    "stock": 61,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/beauty90/500/500"
  },
  {
    "id": 91,
    "name": "LED Makeup Mirror",
    "description": "High-quality led makeup mirror designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 51.93,
    "originalPrice": 86.55,
    "discount": 40,
    "rating": 3.9,
    "reviewCount": 4309,
    "soldCount": 9827,
    "category": "Beauty",
    "tags": [
      "led",
      "makeup",
      "mirror",
      "beauty"
    ],
    "stock": 144,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/beauty91/500/500"
  },
  {
    "id": 92,
    "name": "Premium Anti-Aging Eye Cream",
    "description": "High-quality anti-aging eye cream designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 77.58,
    "originalPrice": 110.83,
    "discount": 30,
    "rating": 3.8,
    "reviewCount": 127,
    "soldCount": 11650,
    "category": "Beauty",
    "tags": [
      "anti-aging",
      "eye",
      "cream",
      "beauty"
    ],
    "stock": 273,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/beauty92/500/500"
  },
  {
    "id": 93,
    "name": "Classic Electric Nail File Kit",
    "description": "High-quality electric nail file kit designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 140.57,
    "originalPrice": 165.38,
    "discount": 15,
    "rating": 4.5,
    "reviewCount": 4033,
    "soldCount": 1730,
    "category": "Beauty",
    "tags": [
      "electric",
      "nail",
      "file",
      "kit",
      "beauty"
    ],
    "stock": 446,
    "shippingInfo": "Ships within 24 hours",
    "image": "https://picsum.photos/seed/beauty93/500/500"
  },
  {
    "id": 94,
    "name": "Volumizing Mascara",
    "description": "High-quality volumizing mascara designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 122.28,
    "originalPrice": 174.69,
    "discount": 30,
    "rating": 3.8,
    "reviewCount": 432,
    "soldCount": 4186,
    "category": "Beauty",
    "tags": [
      "volumizing",
      "mascara",
      "beauty"
    ],
    "stock": 481,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/beauty94/500/500"
  },
  {
    "id": 95,
    "name": "Pro Organic Body Lotion",
    "description": "High-quality organic body lotion designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 206.42,
    "originalPrice": 317.57,
    "discount": 35,
    "rating": 4.2,
    "reviewCount": 4738,
    "soldCount": 10362,
    "category": "Beauty",
    "tags": [
      "organic",
      "body",
      "lotion",
      "beauty"
    ],
    "stock": 351,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/beauty95/500/500"
  },
  {
    "id": 96,
    "name": "Modern Yoga Mat Non-Slip",
    "description": "High-quality yoga mat non-slip designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 237.54,
    "originalPrice": 263.93,
    "discount": 10,
    "rating": 5.0,
    "reviewCount": 982,
    "soldCount": 9193,
    "category": "Sports",
    "tags": [
      "yoga",
      "mat",
      "non-slip",
      "sports"
    ],
    "stock": 391,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/sports96/500/500"
  },
  {
    "id": 97,
    "name": "Adjustable Dumbbell Set",
    "description": "High-quality adjustable dumbbell set designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 60.29,
    "originalPrice": 120.58,
    "discount": 50,
    "rating": 4.1,
    "reviewCount": 3638,
    "soldCount": 4921,
    "category": "Sports",
    "tags": [
      "adjustable",
      "dumbbell",
      "set",
      "sports"
    ],
    "stock": 440,
    "shippingInfo": "Ships within 24 hours",
    "image": "https://picsum.photos/seed/sports97/500/500"
  },
  {
    "id": 98,
    "name": "Resistance Bands Set",
    "description": "High-quality resistance bands set designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 79.82,
    "originalPrice": 199.55,
    "discount": 60,
    "rating": 3.6,
    "reviewCount": 824,
    "soldCount": 12546,
    "category": "Sports",
    "tags": [
      "resistance",
      "bands",
      "set",
      "sports"
    ],
    "stock": 106,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/sports98/500/500"
  },
  {
    "id": 99,
    "name": "Compact Running Fitness Tracker Band",
    "description": "High-quality running fitness tracker band designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 166.8,
    "originalPrice": 196.24,
    "discount": 15,
    "rating": 3.9,
    "reviewCount": 4533,
    "soldCount": 1279,
    "category": "Sports",
    "tags": [
      "running",
      "fitness",
      "tracker",
      "band",
      "sports"
    ],
    "stock": 80,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/sports99/500/500"
  },
  {
    "id": 100,
    "name": "Ultra Insulated Sports Water Bottle",
    "description": "High-quality insulated sports water bottle designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 120.13,
    "originalPrice": 120.13,
    "discount": 0,
    "rating": 3.8,
    "reviewCount": 2328,
    "soldCount": 11567,
    "category": "Sports",
    "tags": [
      "insulated",
      "sports",
      "water",
      "bottle",
      "sports"
    ],
    "stock": 440,
    "shippingInfo": "Express Shipping Available",
    "image": "https://picsum.photos/seed/sports100/500/500"
  },
  {
    "id": 101,
    "name": "Foldable Camping Chair",
    "description": "High-quality foldable camping chair designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 198.02,
    "originalPrice": 660.07,
    "discount": 70,
    "rating": 4.4,
    "reviewCount": 1632,
    "soldCount": 7015,
    "category": "Sports",
    "tags": [
      "foldable",
      "camping",
      "chair",
      "sports"
    ],
    "stock": 58,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/sports101/500/500"
  },
  {
    "id": 102,
    "name": "Cycling Helmet Ventilated",
    "description": "High-quality cycling helmet ventilated designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 227.56,
    "originalPrice": 267.72,
    "discount": 15,
    "rating": 3.6,
    "reviewCount": 1371,
    "soldCount": 13036,
    "category": "Sports",
    "tags": [
      "cycling",
      "helmet",
      "ventilated",
      "sports"
    ],
    "stock": 157,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/sports102/500/500"
  },
  {
    "id": 103,
    "name": "Jump Rope Speed Cable",
    "description": "High-quality jump rope speed cable designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 230.69,
    "originalPrice": 384.48,
    "discount": 40,
    "rating": 3.7,
    "reviewCount": 2503,
    "soldCount": 11514,
    "category": "Sports",
    "tags": [
      "jump",
      "rope",
      "speed",
      "cable",
      "sports"
    ],
    "stock": 206,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/sports103/500/500"
  },
  {
    "id": 104,
    "name": "Sports Duffel Gym Bag",
    "description": "High-quality sports duffel gym bag designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 137.3,
    "originalPrice": 228.83,
    "discount": 40,
    "rating": 3.6,
    "reviewCount": 338,
    "soldCount": 14622,
    "category": "Sports",
    "tags": [
      "sports",
      "duffel",
      "gym",
      "bag",
      "sports"
    ],
    "stock": 221,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/sports104/500/500"
  },
  {
    "id": 105,
    "name": "Classic Foam Roller Muscle Recovery",
    "description": "High-quality foam roller muscle recovery designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 66.34,
    "originalPrice": 73.71,
    "discount": 10,
    "rating": 3.8,
    "reviewCount": 4724,
    "soldCount": 9669,
    "category": "Sports",
    "tags": [
      "foam",
      "roller",
      "muscle",
      "recovery",
      "sports"
    ],
    "stock": 486,
    "shippingInfo": "Free Shipping - Estimated 7-15 days",
    "image": "https://picsum.photos/seed/sports105/500/500"
  },
  {
    "id": 106,
    "name": "Waterproof Hiking Backpack",
    "description": "High-quality waterproof hiking backpack designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 14.86,
    "originalPrice": 17.48,
    "discount": 15,
    "rating": 4.2,
    "reviewCount": 3634,
    "soldCount": 4607,
    "category": "Sports",
    "tags": [
      "waterproof",
      "hiking",
      "backpack",
      "sports"
    ],
    "stock": 92,
    "shippingInfo": "Ships within 24 hours",
    "image": "https://picsum.photos/seed/sports106/500/500"
  },
  {
    "id": 107,
    "name": "Deluxe Football Training Cones Set",
    "description": "High-quality football training cones set designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 160.52,
    "originalPrice": 267.53,
    "discount": 40,
    "rating": 5.0,
    "reviewCount": 3862,
    "soldCount": 5750,
    "category": "Sports",
    "tags": [
      "football",
      "training",
      "cones",
      "set",
      "sports"
    ],
    "stock": 209,
    "shippingInfo": "Free Shipping over $20",
    "image": "https://picsum.photos/seed/sports107/500/500"
  },
  {
    "id": 108,
    "name": "Swimming Goggles Anti-Fog",
    "description": "High-quality swimming goggles anti-fog designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 85.8,
    "originalPrice": 143.0,
    "discount": 40,
    "rating": 3.9,
    "reviewCount": 3292,
    "soldCount": 13379,
    "category": "Sports",
    "tags": [
      "swimming",
      "goggles",
      "anti-fog",
      "sports"
    ],
    "stock": 389,
    "shippingInfo": "Ships within 24 hours",
    "image": "https://picsum.photos/seed/sports108/500/500"
  },
  {
    "id": 109,
    "name": "Tennis Racket Grip Tape",
    "description": "High-quality tennis racket grip tape designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 26.57,
    "originalPrice": 35.43,
    "discount": 25,
    "rating": 4.0,
    "reviewCount": 3323,
    "soldCount": 14220,
    "category": "Sports",
    "tags": [
      "tennis",
      "racket",
      "grip",
      "tape",
      "sports"
    ],
    "stock": 263,
    "shippingInfo": "Free Worldwide Shipping",
    "image": "https://picsum.photos/seed/sports109/500/500"
  },
  {
    "id": 110,
    "name": "Compact Fitness Resistance Loop Bands",
    "description": "High-quality fitness resistance loop bands designed for everyday use. Combines durability, comfort, and modern design to deliver excellent performance and value for money.",
    "price": 166.13,
    "originalPrice": 332.26,
    "discount": 50,
    "rating": 4.2,
    "reviewCount": 456,
    "soldCount": 3123,
    "category": "Sports",
    "tags": [
      "fitness",
      "resistance",
      "loop",
      "bands",
      "sports"
    ],
    "stock": 265,
    "shippingInfo": "Ships within 24 hours",
    "image": "https://picsum.photos/seed/sports110/500/500"
  }
];

/* ------------------------------------------------------------
   2. SMART SEARCH — SYNONYM DICTIONARY
   ------------------------------------------------------------
   Maps a "search concept" to a list of related keywords.
   When a user searches for any keyword in a group, all keywords
   in that group are used to match against product name/tags/description.
   ------------------------------------------------------------ */
const SEARCH_SYNONYMS = [
  {
    keywords: [
      "back cover", "phone cover", "mobile cover", "phone case",
      "protective case", "shockproof case", "silicone case", "cover"
    ]
  },
  {
    keywords: [
      "headphones", "earbuds", "wireless earbuds", "bluetooth headphones",
      "gaming headset", "headset", "earphones"
    ]
  },
  {
    keywords: [
      "screen protector", "tempered glass", "glass protector", "screen guard"
    ]
  },
  {
    keywords: [
      "charger", "fast charger", "usb-c charger", "power adapter", "wall charger"
    ]
  },
  {
    keywords: [
      "power bank", "portable charger", "battery pack", "external battery"
    ]
  },
  {
    keywords: [
      "smart watch", "smartwatch", "fitness tracker", "watch", "wearable"
    ]
  },
  {
    keywords: [
      "speaker", "bluetooth speaker", "portable speaker", "wireless speaker"
    ]
  },
  {
    keywords: [
      "keyboard", "mechanical keyboard", "gaming keyboard", "rgb keyboard"
    ]
  },
  {
    keywords: [
      "mouse", "gaming mouse", "wireless mouse", "computer mouse"
    ]
  },
  {
    keywords: [
      "sneakers", "running shoes", "sports shoes", "trainers", "shoes"
    ]
  },
  {
    keywords: [
      "jacket", "coat", "leather jacket", "outerwear"
    ]
  },
  {
    keywords: [
      "yoga mat", "exercise mat", "fitness mat", "workout mat"
    ]
  },
  {
    keywords: [
      "dumbbell", "weights", "adjustable dumbbell", "hand weights"
    ]
  },
  {
    keywords: [
      "face mask", "sheet mask", "facial mask", "skincare mask"
    ]
  },
  {
    keywords: [
      "serum", "facial serum", "skincare serum", "face serum"
    ]
  },
  {
    keywords: [
      "lipstick", "lip color", "matte lipstick", "lip makeup"
    ]
  },
  {
    keywords: [
      "vacuum", "robot vacuum", "vacuum cleaner", "cleaning robot"
    ]
  },
  {
    keywords: [
      "diffuser", "essential oil diffuser", "aromatherapy diffuser", "aroma diffuser"
    ]
  },
  {
    keywords: [
      "backpack", "bag", "gym bag", "duffel bag", "hiking backpack"
    ]
  },
  {
    keywords: [
      "sunglasses", "shades", "polarized sunglasses", "eyewear"
    ]
  }
];

/* ------------------------------------------------------------
   3. HELPER / QUERY FUNCTIONS
   ------------------------------------------------------------ */

/**
 * Expand a raw search query into a list of related keywords
 * using the synonym dictionary above.
 * @param {string} query
 * @returns {string[]} list of lowercase keywords to match against
 */
function expandSearchQuery(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const expanded = new Set([q]);

  SEARCH_SYNONYMS.forEach(group => {
    const matchesGroup = group.keywords.some(
      k => k.includes(q) || q.includes(k)
    );
    if (matchesGroup) {
      group.keywords.forEach(k => expanded.add(k));
    }
  });

  return Array.from(expanded);
}

/**
 * Build a single searchable text blob for a product
 * (name + description + tags + category).
 */
function getProductSearchText(product) {
  return [
    product.name,
    product.description,
    product.category,
    ...(product.tags || [])
  ]
    .join(" ")
    .toLowerCase();
}

/**
 * Escape special regex characters in a string.
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Whole-word / whole-phrase match test, so short keywords like "cover"
 * don't falsely match inside unrelated words like "recovery".
 */
function containsKeyword(text, keyword) {
  const pattern = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i");
  return pattern.test(text);
}

/**
 * Smart search across the full product catalog.
 * Matches exact keyword, partial keyword, and synonym expansions.
 * @param {string} query
 * @returns {Array} matching products, best matches first
 */
function searchProducts(query) {
  if (!query || !query.trim()) return [];

  const keywords = expandSearchQuery(query);

  const scored = PRODUCTS.map(product => {
    const searchText = getProductSearchText(product);
    let score = 0;

    keywords.forEach(keyword => {
      if (containsKeyword(searchText, keyword)) {
        // Exact / whole-word match in name gets the highest weight
        if (containsKeyword(product.name.toLowerCase(), keyword)) score += 5;
        else score += 2;
      }
    });

    return { product, score };
  });

  return scored
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.product);
}

/**
 * Get a single product by its ID.
 * @param {number|string} id
 */
function getProductById(id) {
  const numId = Number(id);
  return PRODUCTS.find(p => p.id === numId) || null;
}

/**
 * Get all products belonging to a given category.
 */
function getProductsByCategory(category, excludeId = null) {
  return PRODUCTS.filter(
    p => p.category === category && p.id !== Number(excludeId)
  );
}

/**
 * "Customers Also Viewed" — related products from the same category.
 */
function getRelatedProducts(productId, limit = 8) {
  const product = getProductById(productId);
  if (!product) return [];

  return getProductsByCategory(product.category, productId).slice(0, limit);
}

/**
 * Flash Sales — products with a high discount, sorted by discount desc.
 */
function getFlashSaleProducts(limit = 10) {
  return [...PRODUCTS]
    .filter(p => p.discount >= 30)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, limit);
}

/**
 * Trending Products — highest sold count.
 */
function getTrendingProducts(limit = 10) {
  return [...PRODUCTS]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, limit);
}

/**
 * Recommended Products — highest rated with a healthy review count.
 */
function getRecommendedProducts(limit = 10) {
  return [...PRODUCTS]
    .filter(p => p.reviewCount >= 50)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

/**
 * Get a list of unique category names, with product counts.
 */
function getAllCategories() {
  const map = {};
  PRODUCTS.forEach(p => {
    map[p.category] = (map[p.category] || 0) + 1;
  });
  return Object.keys(map).map(name => ({
    name,
    count: map[name]
  }));
}

/* ------------------------------------------------------------
   4. RECENTLY VIEWED (localStorage-backed)
   ------------------------------------------------------------ */
const RECENTLY_VIEWED_KEY = "novamart_recently_viewed";
const RECENTLY_VIEWED_MAX = 10;

/**
 * Record that a product was viewed (called from product.html).
 */
function addToRecentlyViewed(productId) {
  let viewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
  viewed = viewed.filter(id => id !== Number(productId));
  viewed.unshift(Number(productId));
  viewed = viewed.slice(0, RECENTLY_VIEWED_MAX);
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(viewed));
}

/**
 * Get the list of recently viewed products (product objects).
 */
function getRecentlyViewed() {
  const viewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
  return viewed.map(id => getProductById(id)).filter(Boolean);
}