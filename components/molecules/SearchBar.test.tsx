import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('shows the clear button when value is non-empty', () => {
    const { getByTestId } = render(<SearchBar value="leche" onChangeText={jest.fn()} />);
    expect(getByTestId('search-bar-clear')).toBeTruthy();
  });

  it('hides the clear button when value is empty', () => {
    const { queryByTestId } = render(<SearchBar value="" onChangeText={jest.fn()} />);
    expect(queryByTestId('search-bar-clear')).toBeNull();
  });

  it('clears the value when clear button is pressed', () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(<SearchBar value="leche" onChangeText={onChangeText} />);
    fireEvent.press(getByTestId('search-bar-clear'));
    expect(onChangeText).toHaveBeenCalledWith('');
  });
});