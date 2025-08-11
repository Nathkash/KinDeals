export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  location: string;
  createdAt: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}