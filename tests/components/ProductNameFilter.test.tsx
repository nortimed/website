import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductNameFilter from '../../src/components/ProductNameFilter';

describe('ProductNameFilter', () => {
  it('renders the input', () => {
    render(<ProductNameFilter value="" onChange={() => {}} placeholder="Search" />);
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });
});