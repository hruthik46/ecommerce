import { render, screen } from '@testing-library/react';
import App from './App';
import Ecommerse from './Ecommerse';

test('renders learn react link', () => {
  render(<Ecommerse />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
