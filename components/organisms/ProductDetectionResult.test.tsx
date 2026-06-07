import { ProductDetectionResponse } from '@/types';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { ProductDetectionResult } from './ProductDetectionResult';

const mockProduct: ProductDetectionResponse = {
  productId: 1,
  name: 'Pasta de Maní',
  brand: 'Maní King',
  quantity: 300,
  quantityType: 'g',
  similarity: 0.95,
  isConfident: true,
};

describe('ProductDetectionResult', () => {
  it('renders empty state when results is empty', () => {
    const { getByTestId } = render(
      <ProductDetectionResult results={[]} onConfirm={jest.fn()} onReject={jest.fn()} />
    );
    expect(getByTestId('detection-empty-state')).toBeTruthy();
  });

  it('renders result when a product is found', () => {
    const { getByTestId } = render(
      <ProductDetectionResult results={[mockProduct]} onConfirm={jest.fn()} onReject={jest.fn()} />
    );
    expect(getByTestId('detection-result')).toBeTruthy();
  });

  it('calls onConfirm with the top product when confirm is pressed', () => {
    const onConfirm = jest.fn();
    const { getByTestId } = render(
      <ProductDetectionResult results={[mockProduct]} onConfirm={onConfirm} onReject={jest.fn()} />
    );
    fireEvent.press(getByTestId('detection-confirm-button'));
    expect(onConfirm).toHaveBeenCalledWith(mockProduct);
  });

  it('calls onReject when reject is pressed', () => {
    const onReject = jest.fn();
    const { getByTestId } = render(
      <ProductDetectionResult results={[mockProduct]} onConfirm={jest.fn()} onReject={onReject} />
    );
    fireEvent.press(getByTestId('button'));
    expect(onReject).toHaveBeenCalledTimes(1);
  });
});