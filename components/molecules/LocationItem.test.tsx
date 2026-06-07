import { Location } from '@/types';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { LocationItem } from './LocationItem';

const mockLocation: Location = {
  id: 1,
  name: 'Carrefour Palermo',
  address: 'Av. Santa Fe 3280',
  type: 'SUPERMARKET',
};

describe('LocationItem', () => {
  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<LocationItem location={mockLocation} onPress={onPress} />);
    fireEvent.press(getByTestId('location-item'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});