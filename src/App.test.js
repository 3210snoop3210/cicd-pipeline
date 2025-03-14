import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';  // 'react-dom/client' is the new import path in React 18

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.createRoot(div).render(<App />);
});
