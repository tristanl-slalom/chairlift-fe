import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FlightCard } from './FlightCard';
import { Flight } from '../types/flight.types';

const mockFlight: Flight = {
  flightId: '123',
  flightNumber: 'SK100',
  airlineCode: 'SL',
  origin: 'SEA',
  destination: 'LAX',
  departureDate: '2026-03-15',
  departureTime: '10:00',
  arrivalDate: '2026-03-15',
  arrivalTime: '12:30',
  duration: 150,
  aircraft: 'Boeing 737',
  capacity: { economy: 120, business: 20, first: 10 },
  availableSeats: { economy: 30, business: 10, first: 2 },
  pricing: { economy: 299, business: 899, first: 1499 },
  status: 'SCHEDULED',
  createdAt: '2026-02-01T00:00:00Z',
  updatedAt: '2026-02-01T00:00:00Z'
};

describe('FlightCard', () => {
  it('renders flight information correctly', () => {
    render(<FlightCard flight={mockFlight} />);

    expect(screen.getByText(/SL SK100/)).toBeInTheDocument();
    expect(screen.getByText('Boeing 737')).toBeInTheDocument();
    expect(screen.getByText('SEA')).toBeInTheDocument();
    expect(screen.getByText('LAX')).toBeInTheDocument();
    expect(screen.getByText('$299')).toBeInTheDocument();
    expect(screen.getByText('42 seats available')).toBeInTheDocument();
  });

  it('calls onSelect when select button is clicked', () => {
    const handleSelect = vi.fn();
    render(<FlightCard flight={mockFlight} onSelect={handleSelect} />);

    const selectButton = screen.getByText('Select Flight');
    fireEvent.click(selectButton);

    expect(handleSelect).toHaveBeenCalledWith(mockFlight);
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it('does not render select button when onSelect is not provided', () => {
    render(<FlightCard flight={mockFlight} />);

    expect(screen.queryByText('Select Flight')).not.toBeInTheDocument();
  });
});
