
import { render, screen } from '@testing-library/react';
import Contact from './Contact';

describe('Contact', () => {
  it('renders the contact page', () => {
    render(<Contact />);
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });
});
