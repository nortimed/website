import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from '../../../src/components/ui/input';

describe('Input', () => {
  it('renders input element', () => {
    const { getByRole } = render(<Input />);
    expect(getByRole('textbox')).toBeInTheDocument();
  });
});