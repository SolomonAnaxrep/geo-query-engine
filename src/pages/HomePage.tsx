import { Route } from '../types';

interface HomePageProps {
  onNavigate: (route: Route) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="container">
      <h1>Geo Query Engine</h1>
      <div className="service-selection">
        <h2>Select a Service</h2>
        <div className="button-group">
          <button
            className="service-btn"
            onClick={() => onNavigate('/zippopotomus')}
          >
            Zippopotomus
          </button>
          <button
            className="service-btn"
            onClick={() => onNavigate('/open-street-map')}
          >
            OpenStreetMap
          </button>
        </div>
      </div>
    </div>
  );
}
