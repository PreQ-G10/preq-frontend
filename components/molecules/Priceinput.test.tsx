import { render } from '@testing-library/react-native';
import React from 'react';
import { PriceInput } from './PriceInput';

describe('PriceInput', () => {
  it('renders the error message when provided', () => {
    const { getByTestId } = render(<PriceInput value="" onChangeText={jest.fn()} error="Ingresá un precio válido" />);
    expect(getByTestId('price-input-error')).toBeTruthy();
  });

  it('does not render an error when omitted', () => {
    const { queryByTestId } = render(<PriceInput value="" onChangeText={jest.fn()} />);
    expect(queryByTestId('price-input-error')).toBeNull();
  });
});