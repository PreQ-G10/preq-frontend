import { ProductDetectionResponse } from '@/types';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { BarcodeProductFound } from './BarcodeProductFound';

const mockProduct: ProductDetectionResponse = {
  productId: 1,
  name: 'Leche La Serenísima',
  brand: 'La Serenísima',
  quantity: 1,
  quantityType: 'L',
  similarity: 1,
  isConfident: true,
};

describe('BarcodeProductFound', () => {
  it('calls onCollaborate when collaborate button is pressed', () => {
    const onCollaborate = jest.fn();
    const { getByTestId } = render(
      <BarcodeProductFound product={mockProduct} onCollaborate={onCollaborate} onViewPrices={jest.fn()} />
    );
    fireEvent.press(getByTestId('barcode-collaborate-button'));
    expect(onCollaborate).toHaveBeenCalledTimes(1);
  });

  it('calls onViewPrices when view prices button is pressed', () => {
    const onViewPrices = jest.fn();
    const { getByTestId } = render(
      <BarcodeProductFound product={mockProduct} onCollaborate={jest.fn()} onViewPrices={onViewPrices} />
    );
    fireEvent.press(getByTestId('barcode-view-prices-button'));
    expect(onViewPrices).toHaveBeenCalledTimes(1);
  });
});