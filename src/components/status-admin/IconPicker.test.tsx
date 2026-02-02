import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import IconPicker from './IconPicker';

describe('IconPicker', () => {
  it('renders with label', () => {
    const mockOnChange = vi.fn();
    render(<IconPicker value="📋" onChange={mockOnChange} label="Test Icon" />);

    expect(screen.getByText('Test Icon')).toBeInTheDocument();
  });

  it('displays the current icon in the button', () => {
    const mockOnChange = vi.fn();
    render(<IconPicker value="📋" onChange={mockOnChange} />);

    expect(screen.getByText('📋')).toBeInTheDocument();
  });

  it('displays placeholder when no icon is selected', () => {
    const mockOnChange = vi.fn();
    render(<IconPicker value="" onChange={mockOnChange} />);

    expect(screen.getByText('➕')).toBeInTheDocument();
  });

  it('has a button to open emoji picker', () => {
    const mockOnChange = vi.fn();
    render(<IconPicker value="📋" onChange={mockOnChange} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Button should trigger picker (tested in integration)
    fireEvent.click(button);
  });
});
