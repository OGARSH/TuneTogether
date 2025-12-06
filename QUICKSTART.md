# TuneTogether - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Quick Demo (No Setup Required)
1. Open `index.html` in your browser
2. The app works with demo tracks immediately!
3. Try searching, playing music, and creating a party room

### Option 2: Full Setup with APIs

#### Prerequisites
- Text editor (VS Code, Notepad++, etc.)
- Web browser (Chrome, Firefox, Edge)
- GitHub account (for deployment)

#### Step-by-Step

1. **Configure API Keys**
   ```bash
   # Copy the template
   cp config.template.js config.js
   
   # Edit config.js with your API keys
   ```

2. **Get Spotify Credentials** (5 minutes)
   - Visit: https://developer.spotify.com/dashboard
   - Create an app
   - Copy Client ID & Secret to `config.js`

3. **Get Firebase Config** (5 minutes)
   - Visit: https://console.firebase.google.com/
   - Create a project
   - Enable Realtime Database
   - Copy config to `config.js`

4. **Test Locally**
   ```bash
   # Using Python
   python -m http.server 8080
   
   # Or using npx
   npx http-server -p 8080
   ```
   
   Open: http://localhost:8080

5. **Deploy to GitHub Pages**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/TuneTogether.git
   git push -u origin main
   ```
   
   Enable GitHub Pages in Settings → Pages

## 🎵 Features Overview

### Music Player
- Search any song
- Full playback controls
- Beautiful visualizer
- Volume control

### Party Mode
- Create or join rooms
- Real-time sync
- Live chat
- Emoji reactions
- Share via room code

### Playlists
- Create custom playlists
- Save locally
- Quick playback

## 📱 Mobile Friendly
Works perfectly on all devices!

## 🆘 Need Help?
1. Check `setup.html` for detailed instructions
2. Read `README.md` for full documentation
3. Open an issue on GitHub

## 🌟 Pro Tips
- Use demo mode to test without APIs
- Share room codes via WhatsApp/Discord
- Create playlists for different moods
- Customize colors in `styles.css`

**Enjoy your music together! 🎉**
