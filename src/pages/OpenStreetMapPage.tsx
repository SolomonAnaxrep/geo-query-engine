import React, { useState } from 'react';
import { NominatimSearchResult, NominatimReverseResult } from '../types';

interface OpenStreetMapPageProps {
  onBack: () => void;
}

type SearchMode = 'search' | 'reverse' | 'lookup';

export function OpenStreetMapPage({ onBack }: OpenStreetMapPageProps) {
  const [searchMode, setSearchMode] = useState<SearchMode>('search');
  
  // Search mode fields
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [county, setCounty] = useState('');
  const [city, setCity] = useState('');
  const [town, setTown] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');
  const [postalcode, setPostalcode] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [limit, setLimit] = useState('10');
  const [countrycodes, setCountrycodes] = useState('');
  const [layer, setLayer] = useState('');
  const [featureType, setFeatureType] = useState('');
  const [viewboxMinLon, setViewboxMinLon] = useState('');
  const [viewboxMinLat, setViewboxMinLat] = useState('');
  const [viewboxMaxLon, setViewboxMaxLon] = useState('');
  const [viewboxMaxLat, setViewboxMaxLat] = useState('');
  const [bounded, setBounded] = useState(false);
  const [addressdetails, setAddressdetails] = useState(true);
  const [extratags, setExtratags] = useState(true);
  const [namedetails, setNamedetails] = useState(false);
  const [acceptLanguage, setAcceptLanguage] = useState('');
  const [email, setEmail] = useState('');
  
  // Reverse mode fields
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [zoom, setZoom] = useState('18');
  const [reverseAddressdetails, setReverseAddressdetails] = useState(true);
  const [reverseAcceptLanguage, setReverseAcceptLanguage] = useState('');
  const [reverseEmail, setReverseEmail] = useState('');
  
  // Lookup mode fields
  const [osmIds, setOsmIds] = useState('');
  const [lookupAddressdetails, setLookupAddressdetails] = useState(true);
  const [lookupAcceptLanguage, setLookupAcceptLanguage] = useState('');
  const [lookupEmail, setLookupEmail] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<NominatimSearchResult[] | null>(null);
  const [reverseResult, setReverseResult] = useState<NominatimReverseResult | null>(null);
  const [lookupResults, setLookupResults] = useState<NominatimSearchResult[] | null>(null);

  const clearAllFields = () => {
    // Clear search mode fields
    setQuery('');
    setCountry('');
    setState('');
    setCounty('');
    setCity('');
    setTown('');
    setVillage('');
    setHamlet('');
    setPostalcode('');
    setStreet('');
    setHouseNumber('');
    setCountrycodes('');
    setLayer('');
    setFeatureType('');
    setViewboxMinLon('');
    setViewboxMinLat('');
    setViewboxMaxLon('');
    setViewboxMaxLat('');
    setBounded(false);
    setAddressdetails(true);
    setAcceptLanguage('');
    setEmail('');
    
    // Clear reverse mode fields
    setLat('');
    setLon('');
    setZoom('18');
    setReverseAddressdetails(true);
    setReverseAcceptLanguage('');
    setReverseEmail('');
    
    // Clear lookup mode fields
    setOsmIds('');
    setLookupAddressdetails(true);
    setLookupAcceptLanguage('');
    setLookupEmail('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    setSearchResults(null);
    setReverseResult(null);
    setLookupResults(null);
    
    try {
      let url: string;
      const params = new URLSearchParams();
      
      if (searchMode === 'search') {
        // Search endpoint
        const hasFreeFormQuery = query.trim().length > 0;
        
        if (hasFreeFormQuery) {
          // Free-form query: ONLY send 'q', no structured fields
          params.append('q', query.trim());
        } else {
          // Structured search: ONLY send structured fields, no 'q'
          if (country.trim()) params.append('country', country.trim());
          if (state.trim()) params.append('state', state.trim());
          if (county.trim()) params.append('county', county.trim());
          if (city.trim()) params.append('city', city.trim());
          if (town.trim()) params.append('town', town.trim());
          if (village.trim()) params.append('village', village.trim());
          if (hamlet.trim()) params.append('hamlet', hamlet.trim());
          if (postalcode.trim()) params.append('postalcode', postalcode.trim());
          if (street.trim()) params.append('street', street.trim());
          if (houseNumber.trim()) params.append('house_number', houseNumber.trim());
        }
        
        // Filters and options
        if (countrycodes.trim()) params.append('countrycodes', countrycodes.trim());
        if (layer.trim()) params.append('layer', layer.trim());
        if (featureType.trim()) params.append('featureType', featureType.trim());
        
        // Viewbox (bounding box)
        if (viewboxMinLon.trim() && viewboxMinLat.trim() && viewboxMaxLon.trim() && viewboxMaxLat.trim()) {
          params.append('viewbox', `${viewboxMinLon},${viewboxMinLat},${viewboxMaxLon},${viewboxMaxLat}`);
          if (bounded) params.append('bounded', '1');
        }
        
        params.append('format', 'jsonv2');
        if (addressdetails) params.append('addressdetails', '1');
        if (extratags) params.append('extratags', '1');
        if (namedetails) params.append('namedetails', '1');
        params.append('limit', limit.trim() || '10');
        
        if (acceptLanguage.trim()) params.append('accept-language', acceptLanguage.trim());
        if (email.trim()) params.append('email', email.trim());
        
        url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
      } else if (searchMode === 'reverse') {
        // Reverse endpoint
        if (!lat.trim() || !lon.trim()) {
          setError('Latitude and longitude are required for reverse geocoding.');
          setLoading(false);
          return;
        }
        
        params.append('lat', lat.trim());
        params.append('lon', lon.trim());
        params.append('zoom', zoom.trim() || '18');
        params.append('format', 'jsonv2');
        if (reverseAddressdetails) params.append('addressdetails', '1');
        if (reverseAcceptLanguage.trim()) params.append('accept-language', reverseAcceptLanguage.trim());
        if (reverseEmail.trim()) params.append('email', reverseEmail.trim());
        
        url = `https://nominatim.openstreetmap.org/reverse?${params.toString()}`;
      } else {
        // Lookup endpoint
        if (!osmIds.trim()) {
          setError('OSM IDs are required for lookup.');
          setLoading(false);
          return;
        }
        
        params.append('osm_ids', osmIds.trim());
        params.append('format', 'jsonv2');
        if (lookupAddressdetails) params.append('addressdetails', '1');
        if (lookupAcceptLanguage.trim()) params.append('accept-language', lookupAcceptLanguage.trim());
        if (lookupEmail.trim()) params.append('email', lookupEmail.trim());
        
        url = `https://nominatim.openstreetmap.org/lookup?${params.toString()}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'GeoQueryEngine/1.0 (https://github.com/SolomonAnaxrep/geo-query-engine)'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (searchMode === 'reverse') {
        setReverseResult(data);
      } else if (searchMode === 'lookup') {
        setLookupResults(Array.isArray(data) ? data : [data]);
      } else {
        setSearchResults(Array.isArray(data) ? data : [data]);
      }
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to fetch data. Please check your input values.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderSearchForm = () => {
    if (searchMode === 'search') {
      return (
        <>
          <div className="form-group">
            <label htmlFor="query">Free-form Query (optional)</label>
            <input
              type="text"
              id="query"
              name="query"
              placeholder="e.g., Boston, Massachusetts"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <small>Enter a free-form address or leave empty to use structured fields below</small>
          </div>
          
          <h3 style={{ marginTop: '20px', marginBottom: '15px', color: '#555', fontSize: '1.2em' }}>Structured Address Fields</h3>
          
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              placeholder="e.g., USA, Germany"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <small>Country name or code</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="state">State/Province</label>
            <input
              type="text"
              id="state"
              name="state"
              placeholder="e.g., Massachusetts, CA"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <small>State or province name</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="county">County</label>
            <input
              type="text"
              id="county"
              name="county"
              placeholder="e.g., Suffolk County"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
            />
            <small>County name</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="e.g., Boston"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <small>City name</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="town">Town</label>
            <input
              type="text"
              id="town"
              name="town"
              placeholder="e.g., Cambridge"
              value={town}
              onChange={(e) => setTown(e.target.value)}
            />
            <small>Town name (smaller than city)</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="village">Village</label>
            <input
              type="text"
              id="village"
              name="village"
              placeholder="e.g., Concord"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
            />
            <small>Village name</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="hamlet">Hamlet</label>
            <input
              type="text"
              id="hamlet"
              name="hamlet"
              placeholder="e.g., Smallville"
              value={hamlet}
              onChange={(e) => setHamlet(e.target.value)}
            />
            <small>Hamlet name (smallest settlement)</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="postalcode">Postal Code</label>
            <input
              type="text"
              id="postalcode"
              name="postalcode"
              placeholder="e.g., 02134"
              value={postalcode}
              onChange={(e) => setPostalcode(e.target.value)}
            />
            <small>Postal or zip code</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="street">Street</label>
            <input
              type="text"
              id="street"
              name="street"
              placeholder="e.g., Main Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
            <small>Street name</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="houseNumber">House Number</label>
            <input
              type="text"
              id="houseNumber"
              name="houseNumber"
              placeholder="e.g., 123"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
            />
            <small>House or building number</small>
          </div>
          
          <h3 style={{ marginTop: '20px', marginBottom: '15px', color: '#555', fontSize: '1.2em' }}>Filters & Options</h3>
          
          <div className="form-group">
            <label htmlFor="countrycodes">Country Codes</label>
            <input
              type="text"
              id="countrycodes"
              name="countrycodes"
              placeholder="e.g., us,de,fr (ISO 3166-1 alpha-2)"
              value={countrycodes}
              onChange={(e) => setCountrycodes(e.target.value)}
            />
            <small>Comma-separated ISO country codes to restrict search</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="layer">Layer</label>
            <input
              type="text"
              id="layer"
              name="layer"
              placeholder="e.g., address,poi,natural"
              value={layer}
              onChange={(e) => setLayer(e.target.value)}
            />
            <small>Restrict by layer types (address, poi, natural, etc.)</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="featureType">Feature Type</label>
            <input
              type="text"
              id="featureType"
              name="featureType"
              placeholder="e.g., country,state,city,settlement"
              value={featureType}
              onChange={(e) => setFeatureType(e.target.value)}
            />
            <small>Restrict by feature type (country, state, city, settlement)</small>
          </div>
          
          <h3 style={{ marginTop: '20px', marginBottom: '15px', color: '#555', fontSize: '1.2em' }}>Bounding Box (Viewbox)</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label htmlFor="viewboxMinLon">Min Longitude</label>
              <input
                type="number"
                id="viewboxMinLon"
                name="viewboxMinLon"
                placeholder="e.g., -71.2"
                step="any"
                value={viewboxMinLon}
                onChange={(e) => setViewboxMinLon(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="viewboxMinLat">Min Latitude</label>
              <input
                type="number"
                id="viewboxMinLat"
                name="viewboxMinLat"
                placeholder="e.g., 42.3"
                step="any"
                value={viewboxMinLat}
                onChange={(e) => setViewboxMinLat(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="viewboxMaxLon">Max Longitude</label>
              <input
                type="number"
                id="viewboxMaxLon"
                name="viewboxMaxLon"
                placeholder="e.g., -71.0"
                step="any"
                value={viewboxMaxLon}
                onChange={(e) => setViewboxMaxLon(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="viewboxMaxLat">Max Latitude</label>
              <input
                type="number"
                id="viewboxMaxLat"
                name="viewboxMaxLat"
                placeholder="e.g., 42.4"
                step="any"
                value={viewboxMaxLat}
                onChange={(e) => setViewboxMaxLat(e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={bounded}
                onChange={(e) => setBounded(e.target.checked)}
              />
              <span>Bounded (restrict results to viewbox)</span>
            </label>
          </div>
          
          <h3 style={{ marginTop: '20px', marginBottom: '15px', color: '#555', fontSize: '1.2em' }}>Output Options</h3>
          
          <div className="form-group">
            <label htmlFor="limit">Result Limit</label>
            <input
              type="number"
              id="limit"
              name="limit"
              placeholder="10"
              min="1"
              max="50"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
            <small>Maximum number of results (1-50)</small>
          </div>
          
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={addressdetails}
                onChange={(e) => setAddressdetails(e.target.checked)}
              />
              <span>Address Details (include address breakdown: street, city, postcode, etc.)</span>
            </label>
          </div>
          
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={extratags}
                onChange={(e) => setExtratags(e.target.checked)}
              />
              <span>Extra Tags (include additional metadata)</span>
            </label>
          </div>
          
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={namedetails}
                onChange={(e) => setNamedetails(e.target.checked)}
              />
              <span>Name Details (include alternative names)</span>
            </label>
          </div>
          
          <div className="form-group">
            <label htmlFor="acceptLanguage">Accept Language</label>
            <input
              type="text"
              id="acceptLanguage"
              name="acceptLanguage"
              placeholder="e.g., en,de,fr"
              value={acceptLanguage}
              onChange={(e) => setAcceptLanguage(e.target.value)}
            />
            <small>Preferred language codes (comma-separated)</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email (for usage policy)</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <small>Your email address (required for high-volume usage)</small>
          </div>
        </>
      );
    } else if (searchMode === 'reverse') {
      return (
        <>
          <div className="form-group">
            <label htmlFor="lat">Latitude</label>
            <input
              type="number"
              id="lat"
              name="lat"
              placeholder="e.g., 42.3601"
              step="any"
              required
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            <small>Latitude coordinate (required)</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="lon">Longitude</label>
            <input
              type="number"
              id="lon"
              name="lon"
              placeholder="e.g., -71.0589"
              step="any"
              required
              value={lon}
              onChange={(e) => setLon(e.target.value)}
            />
            <small>Longitude coordinate (required)</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="zoom">Zoom Level</label>
            <input
              type="number"
              id="zoom"
              name="zoom"
              placeholder="18"
              min="0"
              max="18"
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
            />
            <small>Zoom level (0-18, affects detail level)</small>
          </div>
          
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={reverseAddressdetails}
                onChange={(e) => setReverseAddressdetails(e.target.checked)}
              />
              <span>Address Details (include address breakdown: street, city, postcode, etc.)</span>
            </label>
          </div>
          
          <div className="form-group">
            <label htmlFor="reverseAcceptLanguage">Accept Language</label>
            <input
              type="text"
              id="reverseAcceptLanguage"
              name="reverseAcceptLanguage"
              placeholder="e.g., en,de,fr"
              value={reverseAcceptLanguage}
              onChange={(e) => setReverseAcceptLanguage(e.target.value)}
            />
            <small>Preferred language codes (comma-separated)</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="reverseEmail">Email (for usage policy)</label>
            <input
              type="email"
              id="reverseEmail"
              name="reverseEmail"
              placeholder="your@email.com"
              value={reverseEmail}
              onChange={(e) => setReverseEmail(e.target.value)}
            />
            <small>Your email address (required for high-volume usage)</small>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="form-group">
            <label htmlFor="osmIds">OSM IDs</label>
            <input
              type="text"
              id="osmIds"
              name="osmIds"
              placeholder="e.g., R146656,W1043938038,N240109189"
              required
              value={osmIds}
              onChange={(e) => setOsmIds(e.target.value)}
            />
            <small>Comma-separated OSM IDs with type prefix (R=relation, W=way, N=node)</small>
          </div>
          
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={lookupAddressdetails}
                onChange={(e) => setLookupAddressdetails(e.target.checked)}
              />
              <span>Address Details (include address breakdown: street, city, postcode, etc.)</span>
            </label>
          </div>
          
          <div className="form-group">
            <label htmlFor="lookupAcceptLanguage">Accept Language</label>
            <input
              type="text"
              id="lookupAcceptLanguage"
              name="lookupAcceptLanguage"
              placeholder="e.g., en,de,fr"
              value={lookupAcceptLanguage}
              onChange={(e) => setLookupAcceptLanguage(e.target.value)}
            />
            <small>Preferred language codes (comma-separated)</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="lookupEmail">Email (for usage policy)</label>
            <input
              type="email"
              id="lookupEmail"
              name="lookupEmail"
              placeholder="your@email.com"
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
            />
            <small>Your email address (required for high-volume usage)</small>
          </div>
        </>
      );
    }
  };

  const renderResults = () => {
    if (searchMode === 'reverse' && reverseResult) {
      return (
        <div className="results">
          <div className="results-header">
            <h2>Reverse Geocoding Result</h2>
          </div>
          <div className="results-summary">
            <p><strong>Display Name:</strong> {reverseResult.display_name}</p>
            <p><strong>Coordinates:</strong> {reverseResult.lat}, {reverseResult.lon}</p>
            <p><strong>OSM Type:</strong> {reverseResult.osm_type}</p>
            <p><strong>OSM ID:</strong> {reverseResult.osm_id}</p>
          </div>
          {reverseResult.address && (
            <div className="places-section">
              <h3>Address Details</h3>
              <div className="places-grid">
                <div className="place-card">
                  {Object.entries(reverseResult.address).map(([key, value]) => 
                    value ? (
                      <p key={key}>
                        <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {value}
                      </p>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else if (searchMode === 'lookup' && lookupResults) {
      return (
        <div className="results">
          <div className="results-header">
            <h2>Lookup Results ({lookupResults.length})</h2>
          </div>
          <div className="places-section">
            <div className="places-grid">
              {lookupResults.map((result, index) => (
                <div key={index} className="place-card">
                  <h3>{result.display_name || 'N/A'}</h3>
                  <div className="place-details">
                    <p><strong>Coordinates:</strong> {result.lat}, {result.lon}</p>
                    <p><strong>OSM Type:</strong> {result.osm_type}</p>
                    <p><strong>OSM ID:</strong> {result.osm_id}</p>
                    {result.address && Object.entries(result.address).map(([key, value]) => 
                      value ? (
                        <p key={key}>
                          <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {value}
                        </p>
                      ) : null
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else if (searchMode === 'search' && searchResults) {
      return (
        <div className="results">
          <div className="results-header">
            <h2>Search Results ({searchResults.length})</h2>
          </div>
          <div className="places-section">
            <div className="places-grid">
              {searchResults.map((result, index) => {
                // Prioritize neighborhood/suburb fields for display
                const addressEntries = result.address ? Object.entries(result.address) : [];
                const neighborhoodFields = ['neighbourhood', 'suburb', 'city_district', 'district', 'borough'];
                const prioritizedFields = [
                  ...addressEntries.filter(([key]) => neighborhoodFields.includes(key)),
                  ...addressEntries.filter(([key]) => !neighborhoodFields.includes(key))
                ];
                
                return (
                  <div key={index} className="place-card">
                    <h3>{result.display_name || 'N/A'}</h3>
                    <div className="place-details">
                      <p><strong>Coordinates:</strong> {result.lat}, {result.lon}</p>
                      <p><strong>OSM Type:</strong> {result.osm_type}</p>
                      <p><strong>OSM ID:</strong> {result.osm_id}</p>
                      {result.class && <p><strong>Class:</strong> {result.class}</p>}
                      {result.type && <p><strong>Type:</strong> {result.type}</p>}
                      {result.importance && <p><strong>Importance:</strong> {result.importance.toFixed(4)}</p>}
                      {prioritizedFields.length > 0 ? (
                        prioritizedFields.map(([key, value]) => 
                          value ? (
                            <p key={key} style={neighborhoodFields.includes(key) ? { color: '#667eea', fontWeight: '600' } : {}}>
                              <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {value}
                            </p>
                          ) : null
                        )
                      ) : (
                        <p style={{ color: '#999', fontStyle: 'italic' }}>No address details available</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container">
      <h1>OpenStreetMap</h1>
      <div className="service-content">
        <p className="description">Search and geocode locations using OpenStreetMap's Nominatim service.</p>
        
        <div className="search-mode-toggle">
          <button
            type="button"
            className={`mode-btn ${searchMode === 'search' ? 'active' : ''}`}
            onClick={() => {
              setSearchMode('search');
              clearAllFields();
              setError(null);
              setSearchResults(null);
              setReverseResult(null);
              setLookupResults(null);
            }}
          >
            Search
          </button>
          <button
            type="button"
            className={`mode-btn ${searchMode === 'reverse' ? 'active' : ''}`}
            onClick={() => {
              setSearchMode('reverse');
              clearAllFields();
              setError(null);
              setSearchResults(null);
              setReverseResult(null);
              setLookupResults(null);
            }}
          >
            Reverse Geocode
          </button>
          <button
            type="button"
            className={`mode-btn ${searchMode === 'lookup' ? 'active' : ''}`}
            onClick={() => {
              setSearchMode('lookup');
              clearAllFields();
              setError(null);
              setSearchResults(null);
              setReverseResult(null);
              setLookupResults(null);
            }}
          >
            Lookup
          </button>
        </div>
        
        <form className="query-form" onSubmit={handleSubmit}>
          {renderSearchForm()}
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
        
        {renderResults()}
        
        <div className="attribution" style={{ marginTop: '30px', fontSize: '0.85em', color: '#666', textAlign: 'center' }}>
          <p>Data © OpenStreetMap contributors, ODbL</p>
        </div>
        
        <button className="back-btn" onClick={onBack}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
