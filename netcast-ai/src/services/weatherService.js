/**
 * NetCast AI - Real Weather & Rain Attenuation Service
 * Uses Open-Meteo API (Free, No API Key needed)
 * WMO Weather codes: https://open-meteo.com/en/docs#weathervariables
 */

// WMO Weather code to description mapping
const WMO_CODES = {
  0: { label: 'Clear Sky', category: 'clear', severity: 0 },
  1: { label: 'Mainly Clear', category: 'clear', severity: 0 },
  2: { label: 'Partly Cloudy', category: 'cloudy', severity: 1 },
  3: { label: 'Overcast', category: 'cloudy', severity: 1 },
  45: { label: 'Foggy', category: 'fog', severity: 2 },
  48: { label: 'Icy Fog', category: 'fog', severity: 2 },
  51: { label: 'Light Drizzle', category: 'rain', severity: 2 },
  53: { label: 'Moderate Drizzle', category: 'rain', severity: 3 },
  55: { label: 'Dense Drizzle', category: 'rain', severity: 3 },
  61: { label: 'Slight Rain', category: 'rain', severity: 3 },
  63: { label: 'Moderate Rain', category: 'rain', severity: 4 },
  65: { label: 'Heavy Rain', category: 'heavy_rain', severity: 5 },
  71: { label: 'Slight Snowfall', category: 'snow', severity: 3 },
  80: { label: 'Slight Showers', category: 'rain', severity: 3 },
  81: { label: 'Moderate Showers', category: 'rain', severity: 4 },
  82: { label: 'Violent Showers', category: 'heavy_rain', severity: 5 },
  95: { label: 'Thunderstorm', category: 'storm', severity: 5 },
  96: { label: 'Thunderstorm w/ Hail', category: 'storm', severity: 5 },
  99: { label: 'Thunderstorm w/ Heavy Hail', category: 'storm', severity: 5 },
};

/**
 * Rain Fade / Rain Attenuation calculation
 * ITU-R P.838 simplified model
 * Attenuation increases with rainfall rate & frequency
 * @param {number} precipMm - precipitation in mm/hr
 * @param {string} signalType - '4G', '5G', 'WiFi'
 * @returns {object} attenuation data
 */
export function calculateRainAttenuation(precipMm, signalType = 'WiFi') {
  // Frequency-based coefficients (simplified ITU-R P.838)
  const freqCoefficients = {
    '4G':  { k: 0.0101, alpha: 1.276, freq: '1.8 GHz' },
    '5G':  { k: 0.187,  alpha: 1.021, freq: '28 GHz' },
    'WiFi': { k: 0.0751, alpha: 1.099, freq: '5 GHz' },
  };
  
  const coeff = freqCoefficients[signalType] || freqCoefficients['WiFi'];
  const precipRate = Math.max(precipMm, 0.1); // mm/hr
  
  // Specific attenuation γR = k * R^α (dB/km)
  const specificAttenuation = coeff.k * Math.pow(precipRate, coeff.alpha);
  
  // Estimate path length ~2km for local network
  const pathLength = 2;
  const totalAttenuation = specificAttenuation * pathLength;
  
  // Signal degradation percentage
  const degradation = Math.min(Math.round(totalAttenuation * 8), 95);
  
  let severity = 'None';
  let color = '#22c55e';
  let warning = null;
  
  if (totalAttenuation > 2) {
    severity = 'Critical';
    color = '#ef4444';
    warning = `⚠️ Rain Fade Critical: ${totalAttenuation.toFixed(1)} dB/km attenuation on ${coeff.freq}. Disconnect low-priority devices NOW.`;
  } else if (totalAttenuation > 0.5) {
    severity = 'High';
    color = '#f97316';
    warning = `⚡ Rain Attenuation Detected: ${totalAttenuation.toFixed(1)} dB/km on ${coeff.freq}. Reduce device load to prevent congestion.`;
  } else if (totalAttenuation > 0.1) {
    severity = 'Moderate';
    color = '#f59e0b';
    warning = `🌧️ Slight signal degradation (${totalAttenuation.toFixed(2)} dB/km). Monitor closely.`;
  }
  
  return {
    specificAttenuation: specificAttenuation.toFixed(3),
    totalAttenuation: totalAttenuation.toFixed(2),
    degradationPercent: degradation,
    severity,
    color,
    warning,
    freq: coeff.freq,
    signalType,
  };
}

/**
 * Fetch real-time weather using Open-Meteo API (no API key needed)
 * Default: Chennai, India (13.08°N, 80.27°E)
 */
export async function fetchRealTimeWeather(lat = 13.08, lon = 80.27) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weathercode,windspeed_10m,relativehumidity_2m&timezone=Asia%2FKolkata`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API failed');
    const data = await res.json();
    
    const current = data.current;
    const wmoCode = current.weathercode;
    const weatherInfo = WMO_CODES[wmoCode] || { label: 'Unknown', category: 'clear', severity: 0 };
    const precipMm = current.precipitation || 0;
    const attenuation = calculateRainAttenuation(precipMm);
    
    return {
      label: weatherInfo.label,
      category: weatherInfo.category,
      severity: weatherInfo.severity,
      temperature: Math.round(current.temperature_2m),
      precipitation: precipMm,
      windspeed: Math.round(current.windspeed_10m),
      humidity: current.relativehumidity_2m,
      wmoCode,
      attenuation,
      isRaining: ['rain', 'heavy_rain', 'storm'].includes(weatherInfo.category),
      isSevere: weatherInfo.severity >= 4,
      timestamp: new Date().toLocaleTimeString(),
    };
  } catch (err) {
    console.warn('Weather fetch failed, using offline fallback:', err.message);
    // Offline fallback
    return {
      label: 'Clear Sky',
      category: 'clear',
      severity: 0,
      temperature: 32,
      precipitation: 0,
      windspeed: 12,
      humidity: 65,
      isRaining: false,
      isSevere: false,
      attenuation: calculateRainAttenuation(0),
      timestamp: new Date().toLocaleTimeString(),
      offline: true,
    };
  }
}
