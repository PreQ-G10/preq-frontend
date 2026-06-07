import { NearbyOffer } from '@/types';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { NearbyOffersBanner } from './NearbyOffersBanner';

const mockOffer: NearbyOffer = {
  product: { id: 1, name: 'Leche La Serenísima', brand: 'La Serenísima', quantity: 1, quantityType: 'L', images: [] },
  location: { id: 10, name: 'Coto Quilmes', address: 'Av. Calchaquí 600', type: 'SUPERMARKET' },
  distanceMeters: 300,
  price: 850,
  averagePrice: 1000,
};

describe('NearbyOffersBanner', () => {
  it('renders nothing when offers list is empty', () => {
    const { queryByTestId } = render(<NearbyOffersBanner offers={[]} onOfferPress={jest.fn()} />);
    expect(queryByTestId('nearby-offers-banner')).toBeNull();
  });

  it('renders singular subtitle when there is one offer', () => {
    const { getByTestId } = render(<NearbyOffersBanner offers={[mockOffer]} onOfferPress={jest.fn()} />);
    const children = getByTestId('nearby-offers-subtitle').props.children;
    expect(children).toEqual([1, ' ', 'producto', ' por debajo del promedio']);
  });

  it('renders plural subtitle when there are multiple offers', () => {
    const secondOffer: NearbyOffer = { ...mockOffer, product: { ...mockOffer.product, id: 2 } };
    const { getByTestId } = render(<NearbyOffersBanner offers={[mockOffer, secondOffer]} onOfferPress={jest.fn()} />);
    const children = getByTestId('nearby-offers-subtitle').props.children;
    expect(children).toEqual([2, ' ', 'productos', ' por debajo del promedio']);
  });

  it('calls onOfferPress when an offer card is tapped', () => {
    const onOfferPress = jest.fn();
    const { getByTestId } = render(<NearbyOffersBanner offers={[mockOffer]} onOfferPress={onOfferPress} />);
    fireEvent.press(getByTestId('offer-card-1'));
    expect(onOfferPress).toHaveBeenCalledWith(mockOffer);
  });
});