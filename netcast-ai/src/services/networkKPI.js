/**
 * NetCast AI - Network KPI Monitoring Service
 * Tracks: RTT (Latency), Packet Drop Rate, Jitter, Uptime, Bandwidth
 * Simulates ICMP ping behavior in browser context
 */

// KPI History Store (in-memory ring buffer, 60 samples)
const KPI_HISTORY_SIZE = 60;
let kpiHistory = [];
let uptimeStart = Date.now();
let dropCount = 0;
let totalPings = 0;

/**
 * Simulate ICMP-style ping using fetch timing
 * Real browsers cannot send raw ICMP, so we use HTTP RTT as proxy
 */
export async function measureRTT(targetIp = '8.8.8.8') {
  const start = performance.now();
  try {
    // Ping a reliable endpoint to measure RTT
    await fetch(`https://dns.google/resolve?name=netcastai.test&type=A&t=${Date.now()}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    const rtt = Math.round(performance.now() - start);
    totalPings++;
    return { rtt, success: true };
  } catch {
    totalPings++;
    dropCount++;
    return { rtt: null, success: false };
  }
}

/**
 * Calculate Packet Drop Rate
 */
export function getPacketDropRate() {
  if (totalPings === 0) return 0;
  return parseFloat(((dropCount / totalPings) * 100).toFixed(2));
}

/**
 * Calculate Jitter from last N RTT samples (RFC 3550)
 * Jitter = avg |RTT[i] - RTT[i-1]| over N samples
 */
export function calculateJitter(rttSamples) {
  if (rttSamples.length < 2) return 0;
  let jitterSum = 0;
  for (let i = 1; i < rttSamples.length; i++) {
    jitterSum += Math.abs(rttSamples[i] - rttSamples[i - 1]);
  }
  return parseFloat((jitterSum / (rttSamples.length - 1)).toFixed(2));
}

/**
 * Get formatted uptime
 */
export function getUptime() {
  const elapsed = Date.now() - uptimeStart;
  const h = Math.floor(elapsed / 3600000);
  const m = Math.floor((elapsed % 3600000) / 60000);
  const s = Math.floor((elapsed % 60000) / 1000);
  return { hours: h, minutes: m, seconds: s, formatted: `${h}h ${m}m ${s}s` };
}

/**
 * Classify network health from KPIs
 * Based on ITU-T Y.1541 QoS thresholds
 */
export function classifyNetworkHealth(rtt, jitter, packetDropRate) {
  // ITU-T Y.1541 thresholds
  if (rtt < 100 && jitter < 50 && packetDropRate < 0.1) {
    return { label: 'Excellent', color: '#22c55e', score: 95, class: 0 };
  } else if (rtt < 200 && jitter < 100 && packetDropRate < 1) {
    return { label: 'Good', color: '#84cc16', score: 75, class: 1 };
  } else if (rtt < 400 && jitter < 150 && packetDropRate < 3) {
    return { label: 'Fair', color: '#f59e0b', score: 50, class: 2 };
  } else if (rtt < 1000 && packetDropRate < 10) {
    return { label: 'Poor', color: '#f97316', score: 25, class: 3 };
  } else {
    return { label: 'Critical', color: '#ef4444', score: 5, class: 4 };
  }
}

/**
 * Add KPI sample to history
 */
export function addKPISample(rtt, jitter, packetDrop) {
  const sample = {
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    rtt: rtt || 0,
    jitter: jitter || 0,
    packetDrop: packetDrop || 0,
  };
  kpiHistory.push(sample);
  if (kpiHistory.length > KPI_HISTORY_SIZE) kpiHistory.shift();
  return kpiHistory;
}

export function getKPIHistory() {
  return [...kpiHistory];
}

export function resetKPICounters() {
  dropCount = 0;
  totalPings = 0;
  uptimeStart = Date.now();
  kpiHistory = [];
}
