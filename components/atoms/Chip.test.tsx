import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Chip } from './Chip';

describe('Chip', () => {
  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<Chip label="Supermarket" onPress={onPress} />);
    fireEvent.press(getByTestId('chip'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<Chip label="Supermarket" disabled onPress={onPress} />);
    fireEvent.press(getByTestId('chip'));
    expect(onPress).not.toHaveBeenCalled();
  });
});