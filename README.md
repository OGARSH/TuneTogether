# 🎵 TuneTogether

**Listen Together, Anywhere** - A real-time music streaming, synchronization, and party mode web application. TuneTogether lets you and your friends listen to the exact same music at the exact same time, no matter where you are.

![TuneTogether Banner](https://via.placeholder.com/1200x300/0a0e27/00f0ff?text=TuneTogether)

## ✨ Core Features

*   **Google Authentication:** Secure login using Firebase Auth. Personal libraries are synced securely to your Google account.
*   **Real-time Party Mode:** Create rooms, invite friends via a 6-digit code, and listen together. The host controls the playback, and everyone else stays in perfect sync.
*   **Shared Queues:** Any participant in a Party Room can queue up the next song.
*   **Live Chat & Reactions:** Chat with your friends and send live emoji reactions while listening.
*   **Cloud Library System:** Save your favorite tracks to custom playlists. Your library is saved in the cloud and follows you across devices.
*   **Modern Glassmorphism UI:** A sleek, dark-themed responsive design that works flawlessly on desktops, tablets, and phones.

---

## 📂 Project Structure & Architecture

Here is a breakdown of what each critical file does in the TuneTogether codebase:

### 1. `index.html` (The Foundation)
The entry point of the application. It contains the complete HTML structure including:
*   The login screen.
*   The main navigation system (Music, Party, Library tabs).
*   The search interface and results grid.
*   The Party Mode UI (Chat, Participants list, Queue).
*   The bottom Player Bar and volume controls.
*   Modals for playlist creation.

### 2. `styles.css` (The Aesthetics)
Contains all styling, animations, and responsive breakpoints.
*   Implements the "Glassmorphism" design using `backdrop-filter: blur()`.
*   Defines CSS variables (tokens) for easy theming (`--bg`, `--accent`, `--glass`).
*   Contains `@media` queries specifically tailored to make the app look perfect on mobile phones and tablets.

### 3. `app.js` (The Engine)
The core logic file. It handles over 1,500 lines of complex state management and UI interactions. Key responsibilities include:
*   **State Management:** Maintains the `state` object (current track, queue, playlists).
*   **Playback & YouTube API:** Interacts with the hidden YouTube IFrame player to load and play audio in the background.
*   **Party Mode Synchronization:** Handles Firebase Realtime Database connections to sync the host's playback time (`currentTime`) with all guests.
*   **Library Logic:** Handles the creation of playlists, adding tracks, and rendering the UI grid.

### 4. `auth.js` (Security & User Sessions)
A dedicated module for managing Firebase Authentication.
*   Handles Google Sign-In popups.
*   Provides a fallback "Guest Mode" (which restricts access to Cloud Libraries).
*   Manages the global `AUTH.user` object so `app.js` knows who is currently using the app.

### 5. `config.js` (Settings & API Keys)
Stores essential configuration values.
*   Contains the Firebase configuration block (`FIREBASE_CONFIG`).
*   Toggles for using the YouTube API vs Spotify Web API.

### 6. `database.rules.json` / `firebase-rules.json` (Database Security)
These files define who is allowed to read and write data in the Firebase Realtime Database:
*   **Rooms (`/rooms`):** Open to anyone to allow seamless party joining.
*   **Users (`/users`):** Strictly locked down. Users can only read/write to their own specific library path (`$uid === auth.uid`).

---

## 🛠️ Setup & Deployment

### Local Development
To run this project locally, you must use a local web server (opening the HTML file directly in the browser may cause issues with Firebase and APIs).

1. Clone the repository.
2. If using **VS Code**, install the "Live Server" extension and hit "Go Live".
3. Alternatively, using Node.js: `npx http-server -p 8080`.

### GitHub Pages Deployment
This project is configured to automatically deploy to GitHub Pages (or a custom domain like `ogarsh.tech`) whenever code is pushed to the `main` branch.

### Firebase Configuration
If you fork this project, you must supply your own Firebase credentials in `config.js`:
1. Create a Firebase Project.
2. Enable **Authentication** (Google Sign-In).
3. Enable **Realtime Database**.
4. Deploy the rules from `database.rules.json`.

---

## 📱 Mobile Responsiveness

The application includes robust mobile support. On screens smaller than `768px`:
*   The sidebar collapses and navigation moves to the top.
*   The Player Bar removes secondary controls (volume/duration) to prevent overflow.
*   Search bars and modals scale down gracefully to prevent horizontal scrolling.

## 📄 License
This project is open-source. Please review the `LICENSE` file for details.
