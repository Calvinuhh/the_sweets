export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string; 
  purchaseType?: "quantity" | "portion"; 
  portion?: number; 
  additions?: { id: string; name: string; price: number }[]; 
}

export interface Cart {
  items: CartItem[];
  total: number;
}
