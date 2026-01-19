import './style.css';

type Route = '/' | '/zippopotomus' | '/open-street-map';

class GeoQueryEngine {
  private currentRoute: Route = '/';

  constructor() {
    this.init();
  }

  private init(): void {
    // Handle initial route
    this.handleRoute();
    
    // Listen for browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });
  }

  private handleRoute(): void {
    const path = window.location.pathname;
    
    switch (path) {
      case '/zippopotomus':
        this.currentRoute = '/zippopotomus';
        this.renderZippopotomus();
        break;
      case '/open-street-map':
        this.currentRoute = '/open-street-map';
        this.renderOpenStreetMap();
        break;
      default:
        this.currentRoute = '/';
        this.renderHome();
        break;
    }
  }

  private renderHome(): void {
    const app = document.querySelector<HTMLDivElement>('#app')!;
    
    app.innerHTML = `
      <div class="container">
        <h1>Geo Query Engine</h1>
        <div class="service-selection">
          <h2>Select a Service</h2>
          <div class="button-group">
            <button id="zippopotomus-btn" class="service-btn">
              Zippopotomus
            </button>
            <button id="openstreetmap-btn" class="service-btn">
              OpenStreetMap
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachHomeEventListeners();
  }

  private renderZippopotomus(): void {
    const app = document.querySelector<HTMLDivElement>('#app')!;
    
    app.innerHTML = `
      <div class="container">
        <h1>Zippopotomus</h1>
        <div class="service-content">
          <p class="description">Query postal codes and zip codes from over 60 countries.</p>
          
          <form id="zippopotomus-form" class="query-form">
            <div class="form-group">
              <label for="country-code">Country Code</label>
              <input 
                type="text" 
                id="country-code" 
                name="country-code" 
                placeholder="e.g., US, DE, FR" 
                required
                maxlength="2"
                pattern="[A-Za-z]{2}"
                title="Two-letter country code (e.g., US, DE, FR)"
              />
              <small>Two-letter country code (e.g., US, DE, FR, GB)</small>
            </div>
            
            <div class="form-group">
              <label for="postal-code">Postal Code</label>
              <input 
                type="text" 
                id="postal-code" 
                name="postal-code" 
                placeholder="e.g., 90210" 
                required
              />
              <small>Enter the postal/zip code to look up</small>
            </div>
            
            <button type="submit" class="query-btn">Query</button>
          </form>
          
          <div id="loading" class="loading" style="display: none;">
            <p>Loading...</p>
          </div>
          
          <div id="error" class="error" style="display: none;"></div>
          
          <div id="results" class="results" style="display: none;"></div>
          
          <button id="back-btn" class="back-btn">← Back to Home</button>
        </div>
      </div>
    `;

    this.attachBackButtonListener();
    this.attachZippopotomusFormListener();
  }

  private renderOpenStreetMap(): void {
    const app = document.querySelector<HTMLDivElement>('#app')!;
    
    app.innerHTML = `
      <div class="container">
        <h1>OpenStreetMap</h1>
        <div class="service-content">
          <p>Welcome to the OpenStreetMap service page.</p>
          <button id="back-btn" class="back-btn">← Back to Home</button>
        </div>
      </div>
    `;

    this.attachBackButtonListener();
  }

  private attachHomeEventListeners(): void {
    const zippopotomusBtn = document.getElementById('zippopotomus-btn')!;
    const openstreetmapBtn = document.getElementById('openstreetmap-btn')!;

    zippopotomusBtn.addEventListener('click', () => {
      window.history.pushState({}, '', '/zippopotomus');
      this.handleRoute();
    });

    openstreetmapBtn.addEventListener('click', () => {
      window.history.pushState({}, '', '/open-street-map');
      this.handleRoute();
    });
  }

  private attachBackButtonListener(): void {
    const backBtn = document.getElementById('back-btn')!;
    backBtn.addEventListener('click', () => {
      window.history.pushState({}, '', '/');
      this.handleRoute();
    });
  }

  private attachZippopotomusFormListener(): void {
    const form = document.getElementById('zippopotomus-form') as HTMLFormElement;
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const countryCode = (document.getElementById('country-code') as HTMLInputElement).value.trim().toUpperCase();
      const postalCode = (document.getElementById('postal-code') as HTMLInputElement).value.trim();
      
      if (!countryCode || !postalCode) {
        return;
      }
      
      await this.queryZippopotomus(countryCode, postalCode);
    });
  }

  private async queryZippopotomus(countryCode: string, postalCode: string): Promise<void> {
    const loading = document.getElementById('loading')!;
    const error = document.getElementById('error')!;
    const results = document.getElementById('results')!;
    
    // Hide previous results and show loading
    loading.style.display = 'block';
    error.style.display = 'none';
    results.style.display = 'none';
    
    try {
      const url = `https://api.zippopotam.us/${countryCode}/${postalCode}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Hide loading and show results
      loading.style.display = 'none';
      this.displayZippopotomusResults(data);
      results.style.display = 'block';
      
    } catch (err) {
      loading.style.display = 'none';
      error.style.display = 'block';
      error.innerHTML = `
        <p class="error-message">
          <strong>Error:</strong> ${err instanceof Error ? err.message : 'Failed to fetch data. Please check the country code and postal code.'}
        </p>
      `;
    }
  }

  private displayZippopotomusResults(data: any): void {
    const results = document.getElementById('results')!;
    
    const places = data.places || [];
    const placesHtml = places.map((place: any) => `
      <div class="place-card">
        <h3>${place['place name'] || 'N/A'}</h3>
        <div class="place-details">
          ${place.state ? `<p><strong>State:</strong> ${place.state}${place['state abbreviation'] ? ` (${place['state abbreviation']})` : ''}</p>` : ''}
          ${place.latitude ? `<p><strong>Latitude:</strong> ${place.latitude}</p>` : ''}
          ${place.longitude ? `<p><strong>Longitude:</strong> ${place.longitude}</p>` : ''}
        </div>
      </div>
    `).join('');
    
    results.innerHTML = `
      <div class="results-header">
        <h2>Results</h2>
      </div>
      <div class="results-summary">
        <p><strong>Postal Code:</strong> ${data['post code'] || 'N/A'}</p>
        <p><strong>Country:</strong> ${data.country || 'N/A'} ${data['country abbreviation'] ? `(${data['country abbreviation']})` : ''}</p>
      </div>
      ${places.length > 0 ? `
        <div class="places-section">
          <h3>Places (${places.length})</h3>
          <div class="places-grid">
            ${placesHtml}
          </div>
        </div>
      ` : '<p>No places found for this postal code.</p>'}
    `;
  }
}

// Initialize the app
new GeoQueryEngine();
