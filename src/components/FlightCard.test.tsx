import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FlightCard } from './FlightCard';
import { Flight } from '../types/flight.types';

const mockFlight: Flight = {
  flightId: '123',
  flightNumber: 'SK100',
  airline: 'Slalom Airlines',
  origin: 'SEA',
  destination: 'LAX',
  departureTime: '2026-03-15T10:00:00Z',
  arrivalTime: '2026-03-15T12:30:00Z',
  price: 299,
  availableSeats: 42,
  createdAt: '2026-02-01T00:00:00Z',
  updatedAt: '2026-02-01T00:00:00Z'
};

describe('FlightCard', () => {
  it('renders flight information correctly', () => {
    render(<FlightCard flight={mockFlight} />);

    expect(screen.getByText('Slalom Airlines')).toBeInTheDocument();
    expect(screen.getByText(/Flight SK100/)).toBeInTheDocument();
    expect(screen.getByText('SEA')).toBeInTheDocument();
    expect(screen.getByText('LAX')).toBeInTheDocument();
    expect(screen.getByText('$299')).toBeInTheDocument();
    expect(screen.getByText('42 seats left')).toBeInTheDocument();
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
