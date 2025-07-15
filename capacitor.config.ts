import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4c7323b8fa654bdf8d163acf111248a1',
  appName: 'moment-in-time-now',
  webDir: 'dist',
  server: {
    url: 'https://authenticmoments.app',
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