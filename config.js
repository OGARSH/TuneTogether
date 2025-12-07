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
    SPOTIFY_CLIENT_ID: 'YOUR_SPOTIFY_CLIENT_ID',
    SPOTIFY_CLIENT_SECRET: 'YOUR_SPOTIFY_CLIENT_SECRET',
    
    // YouTube API Configuration (Alternative to Spotify)
    // Get your API key from: https://console.cloud.google.com/
    // 1. Create a new project
    // 2. Enable YouTube Data API v3
    // 3. Create credentials (API key)
    // 4. Restrict the key (optional but recommended)
    YOUTUBE_API_KEY: 'YOUR_YOUTUBE_API_KEY',
    
    // Firebase Configuration (Required for Party Mode)
    // Get your config from: https://console.firebase.google.com/
    // 1. Create a new project
    // 2. Add a web app to your project
    // 3. Copy the configuration object
    // 4. Enable Realtime Database
    // 5. Set up security rules appropriately
    FIREBASE_CONFIG: {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        databaseURL: "https://YOUR_PROJECT.firebaseio.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    },
    
    // App Settings
    USE_YOUTUBE_API: false, // Set to true to use YouTube API instead of Spotify
    MAX_SEARCH_RESULTS: 20,
    ROOM_CODE_LENGTH: 6,
    
    // Demo Mode
    // If API keys are not configured, the app will use demo tracks
    DEMO_MODE: true
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
