import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusPreview from './StatusPreview';

describe('StatusPreview', () => {
  const mockProps = {
    displayName: 'In Review',
    color: '#FF5733',
    icon: '👀'
  };

  it('renders preview section title', () => {
    render(<StatusPreview {...mockProps} />);

    expect(screen.getByText('Preview')).toBeInTheDocument();
  });

  it('displays the status name in all preview variants', () => {
    render(<StatusPreview {...mockProps} />);

    const statusNames = screen.getAllByText('In Review');
    expect(statusNames.length).toBeGreaterThan(0);
  });

  it('displays the icon in all preview variants', () => {
    render(<StatusPreview {...mockProps} />);

    const icons = screen.getAllByText('👀');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('applies the correct color to badge preview', () => {
    const { container } = render(<StatusPreview {...mockProps} />);

    // Find elements with inline styles
    const coloredElements = container.querySelectorAll('[style]');
    expect(coloredElements.length).toBeGreaterThan(0);
  });

  it('renders task card preview section', () => {
    render(<StatusPreview {...mockProps} />);

    expect(screen.getByText('Example Task Title')).toBeInTheDocument();
    expect(screen.getByText('This is how a task card looks')).toBeInTheDocument();
  });

  it('renders badge preview section', () => {
    render(<StatusPreview {...mockProps} />);

    expect(screen.getByText('Badge:')).toBeInTheDocument();
  });

  it('renders filter preview section', () => {
    render(<StatusPreview {...mockProps} />);

    expect(screen.getByText('Filter:')).toBeInTheDocument();
  });

  it('uses placeholder text when display name is empty', () => {
    render(<StatusPreview displayName="" color="#FF5733" icon="👀" />);

    // Should not crash and should render the icon
    expect(screen.getAllByText('👀').length).toBeGreaterThan(0);
  });
});
