import { render } from '@testing-library/react-native';
import React from 'react';
import { Divider } from './Divider';

describe('Divider', () => {
  it('renders a plain line when no label is provided', () => {
    const { getByTestId } = render(<Divider />);
    expect(getByTestId('divider-line')).toBeTruthy();
  });

  it('renders with label when provided', () => {
    const { getByTestId } = render(<Divider label="or" />);
    expect(getByTestId('divider-with-label')).toBeTruthy();
  });
});