import { Product } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | null>(null);
const CART_STORAGE_KEY = 'preq:cart';

export function addToCart(items: CartItem[], product: Product): CartItem[] {
  const existing = items.find((i) => i.product.id === product.id);
  if (existing) {
    return items.map((i) =>
      i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
    );
  }
  return [...items, { product, quantity: 1 }];
}

export function removeFromCart(items: CartItem[], productId: number): CartItem[] {
  return items.filter((i) => i.product.id !== productId);
}

export function updateQuantity(items: CartItem[], productId: number, quantity: number): CartItem[] {
  if (quantity <= 0) return removeFromCart(items, productId);
  return items.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
}

export function totalItems(items: CartItem[]): number {
  return items.reduce((acc, i) => acc + i.quantity, 0);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(CART_STORAGE_KEY).then((stored) => {
      if (stored) setItems(JSON.parse(stored));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart: (product) => setItems((prev) => addToCart(prev, product)),
        removeFromCart: (productId) => setItems((prev) => removeFromCart(prev, productId)),
        updateQuantity: (productId, quantity) => setItems((prev) => updateQuantity(prev, productId, quantity)),
        clearCart: () => setItems([]),
        totalItems: totalItems(items),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}