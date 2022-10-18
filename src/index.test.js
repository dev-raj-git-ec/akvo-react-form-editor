import { render, screen } from '@testing-library/react';
import WebformEditor from '.';
import '@testing-library/jest-dom';

describe('App', () => {
  test('test if element exists', () => {
    render(<WebformEditor initialValue={{}} />);
    const expectedText = screen.getByText(/Form Name/i);
    expect(expectedText).toBeInTheDocument();
  });
});
