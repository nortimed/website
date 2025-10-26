import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from '../../src/components/ContactForm';

describe('ContactForm', () => {
  it('renders the contact form', () => {
    render(<ContactForm />);
  // Query the form by tag name instead of role
  expect(document.querySelector('form')).toBeInTheDocument();
  });
});