{
  "name": "cc-webapp",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "framer-motion": "^5.0.0",
    "lucide-react": "^0.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/jest": "^27.0.0",
    "ts-jest": "^27.0.0"
  }
}

const { render, screen } = require('@testing-library/react');
const Button = require('@/components/ui/Button/Button');

test('renders Button component', () => {
  render(<Button label="Click Me" />);
  const buttonElement = screen.getByText(/Click Me/i);
  expect(buttonElement).toBeInTheDocument();
});