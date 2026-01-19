import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import { Route } from './types';
import { HomePage } from './pages/HomePage';
import { ZippopotomusPage } from './pages/ZippopotomusPage';
import { OpenStreetMapPage } from './pages/OpenStreetMapPage';

function App() {
  const [route, setRoute] = useState<Route>('/');

  useEffect(() => {
    // Handle initial route
    const path = window.location.pathname as Route;
    setRoute(path === '/zippopotomus' || path === '/open-street-map' ? path : '/');

    // Listen for browser back/forward buttons
    const handlePopState = () => {
      const path = window.location.pathname as Route;
      setRoute(path === '/zippopotomus' || path === '/open-street-map' ? path : '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (newRoute: Route) => {
    window.history.pushState({}, '', newRoute);
    setRoute(newRoute);
  };

  switch (route) {
    case '/zippopotomus':
      return <ZippopotomusPage onBack={() => navigate('/')} />;
    case '/open-street-map':
      return <OpenStreetMapPage onBack={() => navigate('/')} />;
    default:
      return <HomePage onNavigate={navigate} />;
  }
}

// Initialize the app
const container = document.getElementById('app')!;
const root = createRoot(container);
root.render(<App />);
