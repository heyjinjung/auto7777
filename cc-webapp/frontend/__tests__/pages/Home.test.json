{
  "name": "cc-webapp",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.0.0",
    "framer-motion": "^5.0.0",
    "lucide-react": "^0.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/jest": "^27.0.0",
    "ts-jest": "^27.0.0",
    "jest": "^27.0.0"
  }
}

const { render, screen } = require('@testing-library/react');
const Home = require('../../app/page').default;

test('renders home page', () => {
  render(<Home />);
  const linkElement = screen.getByText(/welcome to the home page/i);
  expect(linkElement).toBeInTheDocument();
});