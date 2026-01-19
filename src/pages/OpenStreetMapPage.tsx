
interface OpenStreetMapPageProps {
  onBack: () => void;
}

export function OpenStreetMapPage({ onBack }: OpenStreetMapPageProps) {
  return (
    <div className="container">
      <h1>OpenStreetMap</h1>
      <div className="service-content">
        <p>Welcome to the OpenStreetMap service page.</p>
        <button className="back-btn" onClick={onBack}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
