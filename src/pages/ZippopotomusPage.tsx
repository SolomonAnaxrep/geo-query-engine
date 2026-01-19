import React, { useState } from 'react';
import { ZippopotamusResponse } from '../types';

interface ZippopotomusPageProps {
  onBack: () => void;
}

export function ZippopotomusPage({ onBack }: ZippopotomusPageProps) {
  const [countryCode, setCountryCode] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ZippopotamusResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const country = countryCode.trim().toUpperCase();
    const postal = postalCode.trim();
    
    if (!country || !postal) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const url = `https://api.zippopotam.us/${country}/${postal}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to fetch data. Please check the country code and postal code.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Zippopotomus</h1>
      <div className="service-content">
        <p className="description">Query postal codes and zip codes from over 60 countries.</p>
        
        <form id="zippopotomus-form" className="query-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="country-code">Country Code</label>
            <input
              type="text"
              id="country-code"
              name="country-code"
              placeholder="e.g., US, DE, FR"
              required
              maxLength={2}
              pattern="[A-Za-z]{2}"
              title="Two-letter country code (e.g., US, DE, FR)"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            />
            <small>Two-letter country code (e.g., US, DE, FR, GB)</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="postal-code">Postal Code</label>
            <input
              type="text"
              id="postal-code"
              name="postal-code"
              placeholder="e.g., 90210"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <small>Enter the postal/zip code to look up</small>
          </div>
          
          <button type="submit" className="query-btn">Query</button>
        </form>
        
        {loading && (
          <div className="loading">
            <p>Loading...</p>
          </div>
        )}
        
        {error && (
          <div className="error">
            <p className="error-message">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
        
        {results && (
          <div className="results">
            <div className="results-header">
              <h2>Results</h2>
            </div>
            <div className="results-summary">
              <p><strong>Postal Code:</strong> {results['post code'] || 'N/A'}</p>
              <p>
                <strong>Country:</strong> {results.country || 'N/A'}{' '}
                {results['country abbreviation'] && `(${results['country abbreviation']})`}
              </p>
            </div>
            {results.places && results.places.length > 0 ? (
              <div className="places-section">
                <h3>Places ({results.places.length})</h3>
                <div className="places-grid">
                  {results.places.map((place, index) => (
                    <div key={index} className="place-card">
                      <h3>{place['place name'] || 'N/A'}</h3>
                      <div className="place-details">
                        {place.state && (
                          <p>
                            <strong>State:</strong> {place.state}
                            {place['state abbreviation'] && ` (${place['state abbreviation']})`}
                          </p>
                        )}
                        {place.latitude && (
                          <p><strong>Latitude:</strong> {place.latitude}</p>
                        )}
                        {place.longitude && (
                          <p><strong>Longitude:</strong> {place.longitude}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No places found for this postal code.</p>
            )}
          </div>
        )}
        
        <button className="back-btn" onClick={onBack}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
