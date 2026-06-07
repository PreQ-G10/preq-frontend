import { CartItem, addToCart, removeFromCart, totalItems, updateQuantity } from '@/context/cartContext';
import { Product } from '@/types';
import { describe, expect, it } from 'vitest';

const mockProduct: Product = {
  id: 1,
  name: 'Leche La Serenísima',
  brand: 'La Serenísima',
  quantity: 1,
  quantityType: 'L',
  images: [],
};

const anotherProduct: Product = {
  id: 2,
  name: 'Pasta de Maní',
  brand: 'Maní King',
  quantity: 300,
  quantityType: 'g',
  images: [],
};

describe('addToCart', () => {
  it('adds a new product with quantity 1', () => {
    const result = addToCart([], mockProduct);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(1);
  });

  it('increments quantity when product already exists', () => {
    const items: CartItem[] = [{ product: mockProduct, quantity: 2 }];
    const result = addToCart(items, mockProduct);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(3);
  });

  it('adds a different product without affecting existing ones', () => {
    const items: CartItem[] = [{ product: mockProduct, quantity: 1 }];
    const result = addToCart(items, anotherProduct);
    expect(result).toHaveLength(2);
    expect(result[0].quantity).toBe(1);
    expect(result[1].quantity).toBe(1);
  });
});

describe('removeFromCart', () => {
  it('removes the product with the given id', () => {
    const items: CartItem[] = [
      { product: mockProduct, quantity: 1 },
      { product: anotherProduct, quantity: 2 },
    ];
    const result = removeFromCart(items, mockProduct.id);
    expect(result).toHaveLength(1);
    expect(result[0].product.id).toBe(anotherProduct.id);
  });

  it('returns the same list when product is not found', () => {
    const items: CartItem[] = [{ product: mockProduct, quantity: 1 }];
    const result = removeFromCart(items, 999);
    expect(result).toHaveLength(1);
  });
});

describe('updateQuantity', () => {
  it('updates the quantity for the given product', () => {
    const items: CartItem[] = [{ product: mockProduct, quantity: 1 }];
    const result = updateQuantity(items, mockProduct.id, 5);
    expect(result[0].quantity).toBe(5);
  });

  it('removes the product when quantity is set to 0', () => {
    const items: CartItem[] = [{ product: mockProduct, quantity: 1 }];
    const result = updateQuantity(items, mockProduct.id, 0);
    expect(result).toHaveLength(0);
  });

  it('removes the product when quantity is negative', () => {
    const items: CartItem[] = [{ product: mockProduct, quantity: 1 }];
    const result = updateQuantity(items, mockProduct.id, -1);
    expect(result).toHaveLength(0);
  });

  it('does not affect other products', () => {
    const items: CartItem[] = [
      { product: mockProduct, quantity: 1 },
      { product: anotherProduct, quantity: 3 },
    ];
    const result = updateQuantity(items, mockProduct.id, 5);
    expect(result[1].quantity).toBe(3);
  });
});

describe('totalItems', () => {
  it('returns 0 for an empty cart', () => {
    expect(totalItems([])).toBe(0);
  });

  it('returns the sum of all quantities', () => {
    const items: CartItem[] = [
      { product: mockProduct, quantity: 2 },
      { product: anotherProduct, quantity: 3 },
    ];
    expect(totalItems(items)).toBe(5);
  });
});