/**
 * config.template.js - Template for API configuration
 * Copy this file to config.js and add your actual API keys
 * Made by OGARSH
 */

const CONFIG = {
    // Spotify API Configuration
    // Get your credentials from: https://developer.spotify.com/dashboard
    // 1. Create a new app
    // 2. Copy Client ID and Client Secret
    // 3. Add http://localhost:8080 as redirect URI for testing
    // 4. Add your GitHub Pages URL as redirect URI for production
    SPOTIFY_CLIENT_ID: '6c31645ffb004ab8b44d06f7b96d1b66',
    SPOTIFY_CLIENT_SECRET: '3618fdc0b4824cfd91a8d425dac32987',
    
    // YouTube API Configuration (Alternative to Spotify)
    // Get your API key from: https://console.cloud.google.com/
    // 1. Create a new project
    // 2. Enable YouTube Data API v3
    // 3. Create credentials (API key)
    // 4. Restrict the key (optional but recommended)
    YOUTUBE_API_KEY: 'AIzaSyDMxdN_KGUatCZiOSzyfe5jhZ-PoG-ECeU',
    
    // Firebase Configuration (Required for Party Mode)
    // Get your config from: https://console.firebase.google.com/
    // 1. Create a new project
    // 2. Add a web app to your project
    // 3. Copy the configuration object
    // 4. Enable Realtime Database
    // 5. Set up security rules appropriately
    FIREBASE_CONFIG: {
        apiKey: "AIzaSyCwoMwW9YhuwmAc1RxlvS2JWH4FnQP5I6w",
        authDomain: "tunetogether-ff455.firebaseapp.com",
        databaseURL: "https://tunetogether-ff455-default-rtdb.firebaseio.com",
        projectId: "tunetogether-ff455",
        storageBucket: "tunetogether-ff455.firebasestorage.app",
        messagingSenderId: "562818134954",
        appId: "1:562818134954:web:658db8221e2415cb75b1d3",
        measurementId: "G-NTM83M6E5P"
    },
    
    // App Settings
    USE_YOUTUBE_API: true, // Set to true to use YouTube API instead of Spotify
    MAX_SEARCH_RESULTS: 20,
    ROOM_CODE_LENGTH: 6,
    
    // Demo Mode
    // If API keys are not configured, the app will use demo tracks
    DEMO_MODE: false
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
