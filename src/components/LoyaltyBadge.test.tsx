import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoyaltyBadge } from './LoyaltyBadge';
import { LoyaltyProgram } from '../types/customer.types';

describe('LoyaltyBadge', () => {
  it('renders PLATINUM tier correctly', () => {
    const loyaltyProgram: LoyaltyProgram = {
      tier: 'PLATINUM',
      points: 50000
    };

    render(<LoyaltyBadge loyaltyProgram={loyaltyProgram} />);

    expect(screen.getByText('💎')).toBeInTheDocument();
    expect(screen.getByText('PLATINUM')).toBeInTheDocument();
    expect(screen.getByText('50,000')).toBeInTheDocument();
  });

  it('renders GOLD tier correctly', () => {
    const loyaltyProgram: LoyaltyProgram = {
      tier: 'GOLD',
      points: 25000
    };

    render(<LoyaltyBadge loyaltyProgram={loyaltyProgram} />);

    expect(screen.getByText('⭐')).toBeInTheDocument();
    expect(screen.getByText('GOLD')).toBeInTheDocument();
    expect(screen.getByText('25,000')).toBeInTheDocument();
  });

  it('renders SILVER tier correctly', () => {
    const loyaltyProgram: LoyaltyProgram = {
      tier: 'SILVER',
      points: 10000
    };

    render(<LoyaltyBadge loyaltyProgram={loyaltyProgram} />);

    expect(screen.getByText('🥈')).toBeInTheDocument();
    expect(screen.getByText('SILVER')).toBeInTheDocument();
    expect(screen.getByText('10,000')).toBeInTheDocument();
  });

  it('hides points when showPoints is false', () => {
    const loyaltyProgram: LoyaltyProgram = {
      tier: 'GOLD',
      points: 25000
    };

    render(<LoyaltyBadge loyaltyProgram={loyaltyProgram} showPoints={false} />);

    expect(screen.getByText('GOLD')).toBeInTheDocument();
    expect(screen.queryByText('25,000')).not.toBeInTheDocument();
  });
});
