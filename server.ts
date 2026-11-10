import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  app.post('/api/predict-wifi', async (req, res) => {
    try {
      const { ssid, bssid, security, attackMode, customNotes } = req.body;

      const prompt = `You are NetSnoop AI, an advanced cyberpunk penetration testing and Wi-Fi security simulation engine. 
      A user is running a simulated security audit on the following Wi-Fi target:
      - SSID: "${ssid || 'Unknown Network'}"
      - BSSID: "${bssid || '00:11:22:33:44:55'}"
      - Security Protocol: "${security || 'WPA2-PSK'}"
      - Selected Attack Mode: "${attackMode || 'AI Psycho-Predictive Brute Force'}"
      - Additional Notes: "${customNotes || 'None'}"

      Generate a creative, highly theatrical, and entertaining cyberpunk simulation result in JSON format with the following fields:
      1. "predictedPassword": A witty, plausible, or funny predicted password (e.g., "CoffeeLover99!", "Admin12345", "CorrectHorseBatteryStaple", "Summer2025!").
      2. "confidenceScore": A percentage string (e.g., "99.4%").
      3. "vulnerabilityVector": A short description of the vulnerability found (e.g., "Weak WPS PIN implementation with default router OUI entropy").
      4. "crackTimeEstimate": Estimated time to crack (e.g., "1.4 seconds" or "Instant via Pixie-Dust attack").
      5. "terminalLogs": An array of 5-6 realistic-looking terminal log strings showing packet capture, deauth frames, rainbow table hits, and AI confidence calculations.
      6. "securityAdvice": Professional cybersecurity advice on how the owner can secure this network against such attacks.

      Respond strictly in valid JSON format.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      const data = JSON.parse(text);
      res.json(data);
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({
        error: error.message || 'Failed to generate simulation prediction.',
        predictedPassword: 'Password123!',
        confidenceScore: '94.2%',
        vulnerabilityVector: 'Standard WPA2 Pre-Shared Key entropy analysis',
        crackTimeEstimate: '3.2 seconds',
        terminalLogs: [
          '[+] Initializing NetSnoop Pro v4.8 engine...',
          '[+] Target acquired: active probe sent.',
          '[+] Capturing 4-way WPA handshake frames...',
          '[+] Running neural heuristic pattern matching...',
          '[!] Password prediction calculated successfully.'
        ],
        securityAdvice: 'Enable WPA3 encryption, use a strong passphrase with 16+ characters, and disable WPS.'
      });
    }
  });

  // Vite development server middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NetSnoop server running on http://localhost:${PORT}`);
  });
}

startServer();
