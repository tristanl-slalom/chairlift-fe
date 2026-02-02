import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ColorPicker from './ColorPicker';

describe('ColorPicker', () => {
  it('renders with label', () => {
    const mockOnChange = vi.fn();
    render(<ColorPicker value="#FF5733" onChange={mockOnChange} label="Test Color" />);

    expect(screen.getByText('Test Color')).toBeInTheDocument();
  });

  it('displays the current color value', () => {
    const mockOnChange = vi.fn();
    render(<ColorPicker value="#FF5733" onChange={mockOnChange} />);

    const input = screen.getByDisplayValue('#FF5733');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when hex input is modified', () => {
    const mockOnChange = vi.fn();
    render(<ColorPicker value="#FF5733" onChange={mockOnChange} />);

    const input = screen.getByDisplayValue('#FF5733');
    fireEvent.change(input, { target: { value: '#00FF00' } });

    expect(mockOnChange).toHaveBeenCalledWith('#00FF00');
  });

  it('accepts lowercase hex values', () => {
    const mockOnChange = vi.fn();
    render(<ColorPicker value="#ff5733" onChange={mockOnChange} />);

    const input = screen.getByDisplayValue('#ff5733');
    fireEvent.change(input, { target: { value: '#aabbcc' } });

    expect(mockOnChange).toHaveBeenCalledWith('#aabbcc');
  });

  it('shows color preview button with correct background', () => {
    const mockOnChange = vi.fn();
    render(<ColorPicker value="#FF5733" onChange={mockOnChange} />);

    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ backgroundColor: '#FF5733' });
  });

  it('has a button to open color picker', () => {
    const mockOnChange = vi.fn();
    render(<ColorPicker value="#FF5733" onChange={mockOnChange} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Button should trigger popover (tested in integration)
    fireEvent.click(button);
  });
});
