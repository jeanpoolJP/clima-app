import { useState, useEffect } from 'react';

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  const apiKey = '6f2e21be425c490eff29c8666f2a7a63';

  useEffect(() => {
    // Cargar búsquedas recientes del localStorage al iniciar
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getWeather();
    }
  };

  const getWeather = async () => {
    if (city.trim() === '') return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`
      );
      const data = await response.json();
      
      if (data.cod === 200) {
        setWeather(data);
        
        // Guardar en búsquedas recientes
        const updatedSearches = [city, ...recentSearches.filter(s => s !== city)].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      } else {
        setError('Ciudad no encontrada. Por favor, verifica el nombre.');
      }
    } catch (err) {
      setError('Error al conectar con el servicio meteorológico. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const searchFromHistory = (savedCity) => {
    setCity(savedCity);
    setTimeout(() => {
      getWeather();
    }, 10);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white">
              <h1 className="h4 mb-0 text-center">
                <i className="bi bi-cloud-sun me-2"></i>
                App del Clima
              </h1>
            </div>
            
            <div className="card-body">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Escribe una ciudad..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button 
                  className="btn btn-primary" 
                  onClick={getWeather}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-1"></span>
                  ) : (
                    <i className="bi bi-search me-1"></i>
                  )}
                  Buscar
                </button>
              </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}
              
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <p className="text-muted small mb-1">Búsquedas recientes:</p>
                  <div className="d-flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => searchFromHistory(search)}
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {weather && (
                <div className="weather-result mt-4">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="h3 mb-0">
                          {weather.name}
                          <span className="ms-2 badge bg-info">{weather.sys.country}</span>
                        </h2>
                        <h3 className="h2 mb-0 text-primary">
                          {Math.round(weather.main.temp)}°C
                        </h3>
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6 d-flex align-items-center mb-3">
                          <img 
                            src={getWeatherIcon(weather.weather[0].icon)} 
                            alt={weather.weather[0].description}
                            className="weather-icon me-3"
                            width="70"
                            height="70"
                          />
                          <div>
                            <p className="h5 mb-0 text-capitalize">{weather.weather[0].description}</p>
                            <p className="text-muted mb-0">Sensación: {Math.round(weather.main.feels_like)}°C</p>
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <ul className="list-group list-group-flush bg-transparent">
                            <li className="list-group-item bg-transparent d-flex justify-content-between px-0">
                              <span>
                                <i className="bi bi-droplet-fill text-primary me-2"></i>
                                Humedad:
                              </span>
                              <strong>{weather.main.humidity}%</strong>
                            </li>
                            <li className="list-group-item bg-transparent d-flex justify-content-between px-0">
                              <span>
                                <i className="bi bi-wind text-primary me-2"></i>
                                Viento:
                              </span>
                              <strong>{weather.wind.speed} m/s</strong>
                            </li>
                            <li className="list-group-item bg-transparent d-flex justify-content-between px-0">
                              <span>
                                <i className="bi bi-thermometer-half text-primary me-2"></i>
                                Presión:
                              </span>
                              <strong>{weather.main.pressure} hPa</strong>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="row mt-3">
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-sunrise text-warning me-2 h5 mb-0"></i>
                            <div>
                              <p className="text-muted small mb-0">Amanecer</p>
                              <p className="mb-0">
                                {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-sunset text-danger me-2 h5 mb-0"></i>
                            <div>
                              <p className="text-muted small mb-0">Atardecer</p>
                              <p className="mb-0">
                                {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="card-footer text-center text-muted bg-white">
              <small>Datos proporcionados por OpenWeatherMap</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Para asegurar que Bootstrap y Bootstrap Icons estén disponibles
const AppWithStylesheets = () => {
  useEffect(() => {
    // Cargar Bootstrap CSS
    const bootstrapLink = document.createElement('link');
    bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
    bootstrapLink.rel = 'stylesheet';
    document.head.appendChild(bootstrapLink);

    // Cargar Bootstrap Icons
    const iconsLink = document.createElement('link');
    iconsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css';
    iconsLink.rel = 'stylesheet';
    document.head.appendChild(iconsLink);

    // Cargar Bootstrap JS
    const bootstrapScript = document.createElement('script');
    bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
    document.body.appendChild(bootstrapScript);

    return () => {
      document.head.removeChild(bootstrapLink);
      document.head.removeChild(iconsLink);
      document.body.removeChild(bootstrapScript);
    };
  }, []);

  return <App />;
};

export default AppWithStylesheets;