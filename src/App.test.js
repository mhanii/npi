import { render } from '@testing-library/react';
import App from './App';

test('renders the canvas', () => {
  const { container } = render(<App />);
  const canvasElement = container.querySelector('canvas');
  expect(canvasElement).toBeInTheDocument();
});