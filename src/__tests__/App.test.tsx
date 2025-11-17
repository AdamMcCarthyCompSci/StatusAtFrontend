import { render } from '@testing-library/react';

import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Since the app uses React Query and routing, 
    // we just test that it renders without throwing
    expect(document.body).toBeInTheDocument();
  });
});
