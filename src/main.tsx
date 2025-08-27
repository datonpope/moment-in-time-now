import React from 'react'
import { createRoot } from 'react-dom/client'
import { AnalyticsConsentBanner } from "@/components/AnalyticsConsentBanner";
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <AnalyticsConsentBanner />
  </>
);
