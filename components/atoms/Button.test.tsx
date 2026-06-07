import { fireEvent, render } from '@testing-library/react-native';
import '@testing-library/react-native/extend-expect';
import React from 'react';
import { Button } from './Button';

describe('Button', () => {
  it('renders the label', () => {
    const { getByTestId } = render(<Button label="Confirm" />);
    expect(getByTestId('button-label')).toBeTruthy();
  });

  it('renders a spinner when loading', () => {
    const { getByTestId } = render(<Button label="Confirm" loading />);
    expect(getByTestId('button-spinner')).toBeTruthy();
  });

  it('hides the label when loading', () => {
    const { queryByTestId } = render(<Button label="Confirm" loading />);
    expect(queryByTestId('button-label')).toBeNull();
  });

  it('is disabled when loading', () => {
    const { getByTestId } = render(<Button label="Confirm" loading />);
    expect(getByTestId('button')).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    const { getByTestId } = render(<Button label="Confirm" disabled />);
    expect(getByTestId('button')).toBeDisabled();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<Button label="Confirm" onPress={onPress} />);
    fireEvent.press(getByTestId('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<Button label="Confirm" disabled onPress={onPress} />);
    fireEvent.press(getByTestId('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});