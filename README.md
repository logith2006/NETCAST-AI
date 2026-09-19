# 🌐 NetCast AI  - Predictive Network Intelligence

🚀 **Live Demo:**(https://inquisitive-marzipan-70256d.netlify.app/welcome)

## 📑 Abstract
NetCast AI is an advanced, AI-driven telecom network monitoring framework designed to proactively forecast network congestion and mitigate latency spikes. Engineered with a robust MERN-stack architecture and cross-platform compatibility, the system continuously aggregates real-time telemetry data—including packet loss, jitter, and bandwidth absorption—to provide enterprise-grade network visibility and intelligent diagnostic resolutions.

## ❓ WHY NETCAST-AI?
* **Proactive Congestion Forecasting:** Anticipates network bottlenecks and high-latency events using AI-driven telemetry analysis before they impact end-users.
* **Deep Packet Diagnostics:** Simulates OSI Layer 3/4 packet inspections (TCP/UDP) to instantly isolate retransmission drops and jitter without requiring external hardware.
* **Intelligent Load Balancing Metrics:** Cross-analyzes connected device loads and environmental constraints to calculate dynamic risk scores and provide actionable routing recommendations.

## ⚙️ Core Architecture & Features
* **Real-Time Telemetry Engine:** Asynchronous tracking of Round Trip Time (RTT) and ICMP behaviors to map network stability.
* **AI Prediction Algorithm:** Evaluates active device count against bandwidth capacity to generate a real-time 'Risk Score' (Healthy, Degraded, Critical).
* **Cross-Platform Scalability:** Built as a Progressive Web Application (PWA) with Electron (Desktop) and Capacitor (Android) wrappers for unified deployment.
* **Automated Data Logging:** Backend Node.js worker threads chronologically log network health states into MongoDB for historical analysis.

## 🛠️ Technology Stack
* **Frontend:** React.js, Vite, Tailwind CSS, Recharts, Framer Motion
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Deployment & Wrappers:** Vercel (Web), Electron (Windows), Capacitor (Android)

## 🚀 Getting Started (Local Development)

### Prerequisites
* Node.js (v18+)
* MongoDB (Local or Atlas)

### Installation
1. **Clone the repository:**
cd netcast-node-backend
npm install
npm start
cd ../netcast-ai
npm install
npm run dev
   ```bash
   git clone https://github.com/logith2006/NETCAST-AI.git
