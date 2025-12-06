# 🎵 TuneTogether

**Listen Together, Anywhere** - A real-time music streaming and party mode web application that lets you enjoy music with friends across distances.

![TuneTogether Banner](https://via.placeholder.com/1200x300/0a0e27/00f0ff?text=TuneTogether)

## ✨ Features

### 🎧 Music Search & Playback
- **Search** for any song by title, artist, or album
- **Integrated APIs**: Spotify Web API and YouTube API support
- **Full playback controls**: Play, pause, skip, volume control
- **Visual feedback**: Album art, track info, and progress bar
- **Audio visualizer**: Animated bars that respond to music

### 🎉 Party Mode (Long Distance Listening)
- **Create or join** shared party rooms
- **Real-time sync**: All participants hear the same track simultaneously
- **Host controls**: Room creator controls playback for everyone
- **Live chat**: Interact with participants in real-time
- **Emoji reactions**: Express yourself with quick emoji responses
- **Unique room codes**: Easy sharing with 6-character codes

### 🎨 User Interface
- **Modern dark theme** with neon accents (cyan, magenta, green)
- **Responsive design**: Works perfectly on desktop, tablet, and mobile
- **Smooth animations**: Elegant transitions for all interactions
- **Audio visualizer**: Dynamic bars that dance to the music

### 📚 Playlist Management
- **Create playlists**: Organize your favorite tracks
- **Local storage**: Playlists saved in your browser
- **Quick access**: Play entire playlists with one click

## 🚀 Live Demo

Visit the live application: **[https://ogarsh.tech/TuneTogether/](https://ogarsh.tech/TuneTogether/)**

## 📋 Prerequisites

Before you begin, you'll need:

1. **GitHub Account** - To host on GitHub Pages
2. **Spotify Developer Account** - For music API access (free)
3. **Firebase Account** - For party mode synchronization (free)
4. **Code Editor** - VS Code, Sublime Text, etc.

## 🛠️ Setup Instructions

### 1. Clone or Download This Repository

```bash
git clone https://github.com/YOUR_USERNAME/TuneTogether.git
cd TuneTogether
```

Or download the ZIP and extract it.

### 2. Configure Spotify API

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click **"Create App"**
3. Fill in the details:
   - **App Name**: TuneTogether
   - **App Description**: Music streaming with party mode
   - **Redirect URI**: `http://localhost:8080` (for testing)
4. Click **"Create"**
5. Copy your **Client ID** and **Client Secret**
6. Open `config.js` and replace:
   ```javascript
   SPOTIFY_CLIENT_ID: 'YOUR_SPOTIFY_CLIENT_ID',
   SPOTIFY_CLIENT_SECRET: 'YOUR_SPOTIFY_CLIENT_SECRET',
   ```

### 3. Configure Firebase (for Party Mode)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Name it **"TuneTogether"** and follow the setup
4. In your project, click **"Web"** icon (</>) to add a web app
5. Copy the Firebase configuration object
6. Open `config.js` and replace the `FIREBASE_CONFIG` section:
   ```javascript
   FIREBASE_CONFIG: {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT.firebaseapp.com",
       databaseURL: "https://YOUR_PROJECT.firebaseio.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT.appspot.com",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
   }
   ```
7. Enable **Realtime Database** in Firebase Console:
   - Go to **Build > Realtime Database**
   - Click **"Create Database"**
   - Choose **"Start in test mode"** (for development)

### 4. Test Locally

#### Option A: Using Python (Recommended)
```bash
# Python 3
python -m http.server 8080

# Or Python 2
python -m SimpleHTTPServer 8080
```

#### Option B: Using Node.js
```bash
npx http-server -p 8080
```

#### Option C: Using VS Code
1. Install **Live Server** extension
2. Right-click `index.html`
3. Select **"Open with Live Server"**

Visit `http://localhost:8080` in your browser.

### 5. Deploy to GitHub Pages

1. **Create a new repository** on GitHub named `TuneTogether`

2. **Initialize git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: TuneTogether music app"
   ```

3. **Add remote and push**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/TuneTogether.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**:
   - Go to repository **Settings > Pages**
   - Under **Source**, select **"main"** branch
   - Click **Save**
   - Your site will be live at: `https://ogarsh.tech/TuneTogether/`

5. **Update API Settings**:
   - Add `https://ogarsh.tech/TuneTogether/` to Spotify App Redirect URIs
   - Add `ogarsh.tech` to Firebase authorized domains

## 📖 Usage Guide

### Playing Music

1. **Search** for a song in the search bar
2. Click on any result to **play** it
3. Use the **player controls** at the bottom:
   - ⏮️ Previous track
   - ⏯️ Play/Pause
   - ⏭️ Next track
   - 🔊 Volume control
   - Progress bar to seek

### Creating a Party Room

1. Click **"Party Mode"** in the navigation
2. Click **"Create Room"**
3. Share the **6-character room code** with friends
4. As host, your playback controls affect all participants
5. Chat and react with emojis in real-time

### Joining a Party Room

1. Get the room code from your friend
2. Click **"Party Mode"**
3. Enter the code and click **"Join Room"**
4. Listen in sync and chat together!

### Managing Playlists

1. Click **"Playlists"** in the navigation
2. Click **"+ New Playlist"**
3. Name your playlist
4. Search for songs and add them (right-click on results)
5. Click a playlist to play all songs

## 🔧 Configuration Options

Edit `config.js` to customize:

```javascript
// Use YouTube API instead of Spotify
USE_YOUTUBE_API: false, // Set to true for YouTube

// Maximum search results
MAX_SEARCH_RESULTS: 20,

// Room code length (default: 6)
ROOM_CODE_LENGTH: 6
```

## 🎨 Customization

### Changing Colors

Edit `styles.css` and modify CSS variables:

```css
:root {
    --neon-primary: #00f0ff;    /* Cyan */
    --neon-secondary: #ff00ff;  /* Magenta */
    --neon-accent: #00ff88;     /* Green */
}
```

### Adding Custom Themes

Create theme presets in `styles.css`:

```css
[data-theme="purple"] {
    --neon-primary: #9d00ff;
    --neon-secondary: #ff00d4;
}
```

## 📱 Mobile Support

TuneTogether is fully responsive and mobile-friendly:
- Touch-optimized controls
- Responsive layout adapts to all screen sizes
- Mobile gesture support for volume and progress

## 🔒 Privacy & Security

- **No user data collection**: All data stored locally
- **Browser storage only**: Playlists saved in localStorage
- **Secure connections**: All API calls use HTTPS
- **Firebase security rules**: Configure appropriately for production

## 🐛 Troubleshooting

### Music won't play
- Check if Spotify credentials are configured correctly
- Ensure preview URLs are available (not all tracks have them)
- Check browser console for API errors

### Party mode not syncing
- Verify Firebase configuration in `config.js`
- Check Firebase Realtime Database rules
- Ensure both users are online

### Search not working
- Verify API credentials
- Check internet connection
- Review browser console for errors

### Deployment issues
- Ensure all files are committed to git
- Check GitHub Pages settings
- Wait 5-10 minutes after enabling Pages

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Spotify** for the Web API
- **Firebase** for real-time database
- **Font Awesome** for icons (if used)
- **Google Fonts** (Poppins)

## 📞 Support

If you encounter issues or have questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review existing [GitHub Issues](#)
3. Create a new issue with details

## 🌟 Star This Repo

If you like TuneTogether, please ⭐ star this repository!

---

**Built with ❤️ for music lovers everywhere**

*Listen together, stay connected* 🎵
