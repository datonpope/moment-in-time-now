import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4c7323b8fa654bdf8d163acf111248a1',
  appName: 'moment-in-time-now',
  webDir: 'dist',
  server: {
    url: 'https://4c7323b8-fa65-4bdf-8d16-3acf111248a1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false
    }
  }
};

export default config;