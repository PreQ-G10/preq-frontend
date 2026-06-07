import { render } from '@testing-library/react-native';
import React from 'react';
import { Input } from './Input';

describe('Input', () => {
  it('renders the label when provided', () => {
    const { getByTestId } = render(<Input label="Email" />);
    expect(getByTestId('input-label')).toBeTruthy();
  });

  it('does not render a label when omitted', () => {
    const { queryByTestId } = render(<Input />);
    expect(queryByTestId('input-label')).toBeNull();
  });

  it('renders the error message when provided', () => {
    const { getByTestId } = render(<Input error="Field required" />);
    expect(getByTestId('input-error')).toBeTruthy();
  });

  it('does not render an error when omitted', () => {
    const { queryByTestId } = render(<Input />);
    expect(queryByTestId('input-error')).toBeNull();
  });
});