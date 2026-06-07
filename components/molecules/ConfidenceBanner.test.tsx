import { render } from '@testing-library/react-native';
import React from 'react';
import { ConfidenceBanner } from './ConfidenceBanner';

describe('ConfidenceBanner', () => {
  it('renders confident message with correct percentage', () => {
    const { getByTestId } = render(<ConfidenceBanner isConfident similarity={0.92} />);
    expect(getByTestId('confidence-banner-message').props.children).toBe(
      'Alta coincidencia (92%) — probablemente es el mismo producto'
    );
  });

  it('renders not confident message with correct percentage', () => {
    const { getByTestId } = render(<ConfidenceBanner isConfident={false} similarity={0.45} />);
    expect(getByTestId('confidence-banner-message').props.children).toBe(
      'Coincidencia baja (45%) — verificá antes de confirmar'
    );
  });

  it('rounds the similarity percentage', () => {
    const { getByTestId } = render(<ConfidenceBanner isConfident similarity={0.876} />);
    expect(getByTestId('confidence-banner-message').props.children).toBe(
      'Alta coincidencia (88%) — probablemente es el mismo producto'
    );
  });
});