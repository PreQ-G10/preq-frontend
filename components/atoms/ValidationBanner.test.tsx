import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { ValidationBanner } from './ValidationBanner';

describe('ValidationBanner', () => {
  it('renders singular message when count is 1', () => {
    const { getByTestId } = render(<ValidationBanner count={1} onPress={jest.fn()} />);
    expect(getByTestId('validation-banner-message').props.children).toBe(
      'Hay 1 precio cerca tuyo que necesita validación'
    );
  });

  it('renders plural message when count is greater than 1', () => {
    const { getByTestId } = render(<ValidationBanner count={5} onPress={jest.fn()} />);
    expect(getByTestId('validation-banner-message').props.children).toBe(
      'Hay 5 precios cerca tuyo que necesitan validación'
    );
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<ValidationBanner count={3} onPress={onPress} />);
    fireEvent.press(getByTestId('validation-banner'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});