/**
 * TuneTogether - Main Application JavaScript
 * Handles music search, playback, party mode, and playlists
 * Made by OGARSH
 */

// ==================== STATE MANAGEMENT ====================
let state = {
    currentTrack: null,
    isPlaying: false,
    queue: [],
    currentIndex: 0,
    playlists: [],
    volume: 70,
    spotifyToken: null,
    partyRoom: null,
    isHost: false,
    participants: [],
    firebase: null,
    roomRef: null,
    youtubePlayer: null,
    playerType: 'audio' // 'audio' or 'youtube'
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// YouTube IFrame API ready callback
window.onYouTubeIframeAPIReady = function() {
    if (CONFIG.USE_YOUTUBE_API) {
        initYouTubePlayer();
    }
};

function initializeApp() {
    // Load saved data
    loadPlaylists();
    
    // Setup event listeners
    setupNavigationListeners();
    setupSearchListeners();
    setupPlayerListeners();
    setupPartyModeListeners();
    setupPlaylistListeners();
    
    // Initialize Spotify or YouTube API
    if (CONFIG.USE_YOUTUBE_API) {
        console.log('🎥 YouTube API mode enabled');
        // YouTube player will be initialized by onYouTubeIframeAPIReady
    } else if (!CONFIG.USE_YOUTUBE_API) {
        initializeSpotify();
    }
    
    // Initialize Firebase for party mode
    initializeFirebase();
    
    console.log('🎵 TuneTogether initialized!');
}

function initYouTubePlayer() {
    state.youtubePlayer = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'enablejsapi': 1,
            'origin': window.location.origin
        },
        events: {
            'onReady': onYouTubePlayerReady,
            'onStateChange': onYouTubePlayerStateChange
        }
    });
}

function onYouTubePlayerReady(event) {
    console.log('✅ YouTube player ready');
    state.youtubePlayer.setVolume(state.volume);
    
    // Update progress for YouTube videos
    setInterval(() => {
        if (state.playerType === 'youtube' && state.youtubePlayer && state.isPlaying) {
            const currentTime = state.youtubePlayer.getCurrentTime();
            const duration = state.youtubePlayer.getDuration();
            if (duration > 0) {
                const percent = (currentTime / duration) * 100;
                const progressFill = document.getElementById('progress-fill');
                const progressInput = document.getElementById('progress-input');
                const currentTimeEl = document.getElementById('current-time');
                const durationEl = document.getElementById('duration');
                
                progressFill.style.width = `${percent}%`;
                progressInput.value = percent;
                currentTimeEl.textContent = formatTime(currentTime);
                durationEl.textContent = formatTime(duration);
            }
        }
    }, 1000);
}

function onYouTubePlayerStateChange(event) {
    // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
    if (event.data === YT.PlayerState.PLAYING) {
        state.isPlaying = true;
        updatePlayButton();
        startVisualizer();
    } else if (event.data === YT.PlayerState.PAUSED) {
        state.isPlaying = false;
        updatePlayButton();
        stopVisualizer();
    } else if (event.data === YT.PlayerState.ENDED) {
        playNext();
    }
}

// ==================== NAVIGATION ====================
function setupNavigationListeners() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetView = btn.dataset.view;
            
            // Update active states
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            views.forEach(v => v.classList.remove('active'));
            document.getElementById(`${targetView}-view`).classList.add('active');
        });
    });
}

// ==================== SPOTIFY API ====================
async function initializeSpotify() {
    // Check if credentials are configured
    if (CONFIG.SPOTIFY_CLIENT_ID === 'YOUR_SPOTIFY_CLIENT_ID') {
        console.warn('⚠️ Spotify API credentials not configured. Using demo mode.');
        return;
    }
    
    try {
        // Get access token
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(CONFIG.SPOTIFY_CLIENT_ID + ':' + CONFIG.SPOTIFY_CLIENT_SECRET)
            },
            body: 'grant_type=client_credentials'
        });
        
        if (!response.ok) {
            throw new Error(`Spotify auth failed: ${response.status}`);
        }
        
        const data = await response.json();
        state.spotifyToken = data.access_token;
        console.log('✅ Spotify API initialized');
    } catch (error) {
        console.error('❌ Failed to initialize Spotify:', error);
        console.log('🎵 Using demo mode instead');
    }
}

async function searchSpotify(query) {
    console.log('🎯 searchSpotify called with query:', query);
    console.log('🎯 CONFIG.USE_YOUTUBE_API:', CONFIG.USE_YOUTUBE_API);
    
    // Use YouTube if enabled
    if (CONFIG.USE_YOUTUBE_API) {
        console.log('🎯 Calling searchYouTube...');
        return searchYouTube(query);
    }
    
    // Always use demo mode for Spotify (requires server-side implementation)
    console.log('🎵 Searching in demo mode:', query);
    return getDemoResults(query);
    
    /* Spotify API search (requires server-side proxy to avoid CORS)
    if (!state.spotifyToken) {
        return getDemoResults(query);
    }
    
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${CONFIG.MAX_SEARCH_RESULTS}`,
            {
                headers: {
                    'Authorization': `Bearer ${state.spotifyToken}`
                }
            }
        );
        
        const data = await response.json();
        return data.tracks.items.map(track => ({
            id: track.id,
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            album: track.album.name,
            albumArt: track.album.images[0]?.url || 'https://via.placeholder.com/300',
            duration: track.duration_ms,
            previewUrl: track.preview_url,
            uri: track.uri
        }));
    } catch (error) {
        console.error('Search error:', error);
        return getDemoResults(query);
    }
    */
}

// ==================== YOUTUBE API ====================
async function searchYouTube(query) {
    console.log('🔥 searchYouTube CALLED!');
    console.log('🔥 Query:', query);
    console.log('🔥 API Key exists:', !!CONFIG.YOUTUBE_API_KEY);
    console.log('🔥 API Key value:', CONFIG.YOUTUBE_API_KEY);
    
    if (!CONFIG.YOUTUBE_API_KEY || CONFIG.YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY') {
        console.warn('⚠️ YouTube API key not configured. Using demo mode.');
        alert('YouTube API key not configured!');
        return getDemoResults(query);
    }
    
    try {
        console.log('🎥 Searching YouTube for:', query);
        console.log('🔑 Using API key:', CONFIG.YOUTUBE_API_KEY.substring(0, 10) + '...');
        
        // Enhanced search query for better music results
        const searchQuery = query.trim();
        const musicQuery = searchQuery.includes('song') || searchQuery.includes('music') || searchQuery.includes('audio') 
            ? searchQuery 
            : `${searchQuery} official audio`;
        
        console.log('🎵 Final search query:', musicQuery);
        
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(musicQuery)}&type=video&videoCategoryId=10&maxResults=${CONFIG.MAX_SEARCH_RESULTS}&key=${CONFIG.YOUTUBE_API_KEY}&order=relevance`;
        console.log('🌐 Fetching:', searchUrl.replace(CONFIG.YOUTUBE_API_KEY, 'API_KEY_HIDDEN'));
        
        const response = await fetch(searchUrl);
        
        console.log('📡 Response status:', response.status, response.statusText);
        console.log('📡 Response headers:', response.headers);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ YouTube API error response:', errorData);
            throw new Error(`YouTube API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ YouTube API response:', data);
        
        if (!data.items || data.items.length === 0) {
            console.log('⚠️ No YouTube results found, showing demo tracks');
            return getDemoResults(query);
        }
        
        // Get video details for duration
        const videoIds = data.items.map(item => item.id.videoId).filter(id => id).join(',');
        if (!videoIds) {
            return getDemoResults(query);
        }
        
        const detailsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${CONFIG.YOUTUBE_API_KEY}`
        );
        
        const detailsData = await detailsResponse.json();
        
        if (!detailsData.items) {
            return getDemoResults(query);
        }
        
        const results = detailsData.items.map(video => {
            // Parse ISO 8601 duration (e.g., PT4M13S)
            const duration = parseYouTubeDuration(video.contentDetails.duration);
            
            // Clean up title - remove common suffixes
            let cleanTitle = video.snippet.title
                .replace(/\(Official .*?\)/gi, '')
                .replace(/\[Official .*?\]/gi, '')
                .replace(/- Official .*/gi, '')
                .replace(/\(.*?Video\)/gi, '')
                .replace(/\[.*?Video\]/gi, '')
                .trim();
            
            // Extract artist from channel name (remove common suffixes)
            let artist = video.snippet.channelTitle
                .replace(/VEVO$/i, '')
                .replace(/Official$/i, '')
                .replace(/Music$/i, '')
                .trim();
            
            return {
                id: video.id,
                title: cleanTitle || video.snippet.title,
                artist: artist || video.snippet.channelTitle,
                album: 'YouTube Music',
                albumArt: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
                duration: duration,
                previewUrl: `https://www.youtube.com/watch?v=${video.id}`,
                uri: `youtube:video:${video.id}`,
                youtubeId: video.id
            };
        });
        
        console.log(`✅ Found ${results.length} YouTube results`);
        return results;
        
    } catch (error) {
        console.error('❌ YouTube search failed:', error);
        console.error('Error details:', error.message, error.stack);
        alert('YouTube API Error: ' + error.message + '\n\nCheck console (F12) for details. Using demo mode.');
        console.log('🎵 Falling back to demo mode');
        return getDemoResults(query);
    }
}

function parseYouTubeDuration(duration) {
    // Parse ISO 8601 duration format (PT1H2M10S -> milliseconds)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 180000; // Default 3 minutes
    
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

// Demo results for testing without API
function getDemoResults(query) {
    const demoTracks = [
        // Pop/Dance
        {
            id: 'demo1',
            title: 'Dancing Queen',
            artist: 'Pop Stars',
            album: 'Party Hits',
            albumArt: 'https://via.placeholder.com/300/ff1493/ffffff?text=Dancing+Queen',
            duration: 230000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            uri: 'demo:track:1'
        },
        {
            id: 'demo2',
            title: 'Blinding Lights',
            artist: 'Night Riders',
            album: 'After Hours',
            albumArt: 'https://via.placeholder.com/300/1a1f3a/ff00ff?text=Blinding+Lights',
            duration: 200000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            uri: 'demo:track:2'
        },
        {
            id: 'demo3',
            title: 'Levitating',
            artist: 'Future Pop',
            album: 'Disco Dreams',
            albumArt: 'https://via.placeholder.com/300/9370db/ffffff?text=Levitating',
            duration: 203000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
            uri: 'demo:track:3'
        },
        // Electronic/EDM
        {
            id: 'demo4',
            title: 'Electric Dreams',
            artist: 'Neon Lights',
            album: 'Synthwave Collection',
            albumArt: 'https://via.placeholder.com/300/0a0e27/00f0ff?text=Electric+Dreams',
            duration: 240000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
            uri: 'demo:track:4'
        },
        {
            id: 'demo5',
            title: 'Titanium',
            artist: 'EDM Masters',
            album: 'Festival Anthems',
            albumArt: 'https://via.placeholder.com/300/00bfff/ffffff?text=Titanium',
            duration: 245000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
            uri: 'demo:track:5'
        },
        {
            id: 'demo6',
            title: 'Midnight City',
            artist: 'Future Funk',
            album: 'Retro Vibes',
            albumArt: 'https://via.placeholder.com/300/1a1f3a/ff00ff?text=Midnight+City',
            duration: 195000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
            uri: 'demo:track:6'
        },
        // Rock/Alternative
        {
            id: 'demo7',
            title: 'Thunder Road',
            artist: 'Rock Legends',
            album: 'Highway Songs',
            albumArt: 'https://via.placeholder.com/300/4a2f1a/ff6600?text=Thunder+Road',
            duration: 265000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
            uri: 'demo:track:7'
        },
        {
            id: 'demo8',
            title: 'Wonderwall',
            artist: 'Indie Rock',
            album: 'Morning Glory',
            albumArt: 'https://via.placeholder.com/300/8b4513/ffffff?text=Wonderwall',
            duration: 258000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
            uri: 'demo:track:8'
        },
        {
            id: 'demo9',
            title: 'Bohemian Rhapsody',
            artist: 'Classic Rock',
            album: 'Opera Night',
            albumArt: 'https://via.placeholder.com/300/2f4f4f/ffffff?text=Bohemian+Rhapsody',
            duration: 354000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
            uri: 'demo:track:9'
        },
        // Hip-Hop/Rap
        {
            id: 'demo10',
            title: 'Lose Yourself',
            artist: 'Urban Beats',
            album: '8 Mile Soundtrack',
            albumArt: 'https://via.placeholder.com/300/000000/ff0000?text=Lose+Yourself',
            duration: 326000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
            uri: 'demo:track:10'
        },
        {
            id: 'demo11',
            title: 'Sicko Mode',
            artist: 'Trap Stars',
            album: 'Astroworld',
            albumArt: 'https://via.placeholder.com/300/8b008b/ffff00?text=Sicko+Mode',
            duration: 312000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
            uri: 'demo:track:11'
        },
        {
            id: 'demo12',
            title: 'HUMBLE',
            artist: 'West Coast',
            album: 'DAMN',
            albumArt: 'https://via.placeholder.com/300/ff0000/000000?text=HUMBLE',
            duration: 177000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
            uri: 'demo:track:12'
        },
        // R&B/Soul
        {
            id: 'demo13',
            title: 'Superstition',
            artist: 'Soul Legends',
            album: 'Talking Book',
            albumArt: 'https://via.placeholder.com/300/8b4513/ffd700?text=Superstition',
            duration: 245000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
            uri: 'demo:track:13'
        },
        {
            id: 'demo14',
            title: 'Redbone',
            artist: 'Childish Vibes',
            album: 'Awaken My Love',
            albumArt: 'https://via.placeholder.com/300/ff4500/000000?text=Redbone',
            duration: 327000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
            uri: 'demo:track:14'
        },
        // Chill/Ambient
        {
            id: 'demo15',
            title: 'Ocean Waves',
            artist: 'Ambient Sounds',
            album: 'Nature Collection',
            albumArt: 'https://via.placeholder.com/300/1a3f5a/0088ff?text=Ocean+Waves',
            duration: 180000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
            uri: 'demo:track:15'
        },
        {
            id: 'demo16',
            title: 'Summer Breeze',
            artist: 'Chill Vibes',
            album: 'Relaxation Station',
            albumArt: 'https://via.placeholder.com/300/3a4f2a/88ff00?text=Summer+Breeze',
            duration: 220000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
            uri: 'demo:track:16'
        },
        {
            id: 'demo17',
            title: 'Starlight',
            artist: 'Dream Pop',
            album: 'Cosmic Journey',
            albumArt: 'https://via.placeholder.com/300/1a2f5a/00ccff?text=Starlight',
            duration: 245000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            uri: 'demo:track:17'
        },
        // Jazz/Blues
        {
            id: 'demo18',
            title: 'Take Five',
            artist: 'Jazz Quartet',
            album: 'Time Out',
            albumArt: 'https://via.placeholder.com/300/2f4f4f/ffd700?text=Take+Five',
            duration: 324000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            uri: 'demo:track:18'
        },
        {
            id: 'demo19',
            title: 'Feeling Good',
            artist: 'Nina Style',
            album: 'I Put A Spell',
            albumArt: 'https://via.placeholder.com/300/800080/ffffff?text=Feeling+Good',
            duration: 178000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
            uri: 'demo:track:19'
        },
        // Country/Folk
        {
            id: 'demo20',
            title: 'Take Me Home',
            artist: 'Country Roads',
            album: 'Poems Prayers',
            albumArt: 'https://via.placeholder.com/300/8b4513/ffffff?text=Take+Me+Home',
            duration: 193000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
            uri: 'demo:track:20'
        },
        {
            id: 'demo21',
            title: 'Wagon Wheel',
            artist: 'Folk Collective',
            album: 'Old Crow',
            albumArt: 'https://via.placeholder.com/300/d2691e/ffffff?text=Wagon+Wheel',
            duration: 190000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
            uri: 'demo:track:21'
        },
        // Latin/Reggaeton
        {
            id: 'demo22',
            title: 'Despacito',
            artist: 'Latin Kings',
            album: 'Vida',
            albumArt: 'https://via.placeholder.com/300/ff6347/ffffff?text=Despacito',
            duration: 229000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
            uri: 'demo:track:22'
        },
        {
            id: 'demo23',
            title: 'Mi Gente',
            artist: 'J Vibes',
            album: 'Energía',
            albumArt: 'https://via.placeholder.com/300/ff1493/ffff00?text=Mi+Gente',
            duration: 189000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
            uri: 'demo:track:23'
        },
        // K-Pop
        {
            id: 'demo24',
            title: 'Dynamite',
            artist: 'BTS Style',
            album: 'BE',
            albumArt: 'https://via.placeholder.com/300/ff69b4/ffffff?text=Dynamite',
            duration: 199000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
            uri: 'demo:track:24'
        },
        {
            id: 'demo25',
            title: 'Kill This Love',
            artist: 'Girl Power',
            album: 'Kill This Love',
            albumArt: 'https://via.placeholder.com/300/ff1493/000000?text=Kill+This+Love',
            duration: 191000,
            previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
            uri: 'demo:track:25'
        }
    ];
    
    // Filter based on query (search in title, artist, or album)
    if (query && query.trim()) {
        const searchTerm = query.toLowerCase().trim();
        const filtered = demoTracks.filter(track => 
            track.title.toLowerCase().includes(searchTerm) ||
            track.artist.toLowerCase().includes(searchTerm) ||
            track.album.toLowerCase().includes(searchTerm)
        );
        
        console.log(`Search for "${query}" found ${filtered.length} results`);
        
        // Return filtered results, or empty array if no matches
        return filtered;
    }
    
    // Return all tracks if no query
    return demoTracks;
}

// ==================== SEARCH ====================
function setupSearchListeners() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

async function performSearch() {
    console.log('🎬 performSearch STARTED');
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    console.log('🎬 Search query:', query);
    
    if (!query) {
        alert('Please enter a search term');
        return;
    }
    
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '<div class="results-placeholder"><div class="placeholder-icon">🔍</div><p>Searching YouTube for "' + query + '"...</p></div>';
    
    try {
        console.log('🎬 Calling searchSpotify...');
        const results = await searchSpotify(query);
        console.log('🎬 Got results:', results);
        console.log('🎬 Results length:', results ? results.length : 0);
        
        if (!results || results.length === 0) {
            resultsContainer.innerHTML = '<div class="results-placeholder"><div class="placeholder-icon">😔</div><p>No results found for "' + query + '"<br><small>Try different keywords</small></p></div>';
            return;
        }
        
        console.log('🎬 Displaying results...');
        displaySearchResults(results);
    } catch (error) {
        console.error('❌ Search failed:', error);
        resultsContainer.innerHTML = '<div class="results-placeholder"><div class="placeholder-icon">❌</div><p>Search failed: ' + error.message + '<br><small>Please check your API key or try again</small></p></div>';
    }
}

function displaySearchResults(results) {
    console.log('🎨 displaySearchResults called with', results.length, 'results');
    const resultsContainer = document.getElementById('search-results');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="results-placeholder"><div class="placeholder-icon">🔍</div><p>No results found</p></div>';
        return;
    }
    
    console.log('🎨 First result:', results[0]);
    
    resultsContainer.innerHTML = results.map((track, index) => `
        <div class="result-item" data-index="${index}" data-track='${JSON.stringify(track)}'>
            <img src="${track.albumArt}" alt="${track.title}" class="result-album-art" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%2250%22 font-size=%2250%22>🎵</text></svg>'">
            <div class="result-info">
                <div class="result-title">${track.title}</div>
                <div class="result-artist">${track.artist}</div>
            </div>
            <div class="result-duration">${formatDuration(track.duration)}</div>
        </div>
    `).join('');
    
    console.log('🎨 Results HTML generated');
    
    // Add click listeners to results
    document.querySelectorAll('.result-item').forEach(item => {
        item.addEventListener('click', () => {
            const track = JSON.parse(item.dataset.track);
            console.log('🎵 Track clicked:', track.title);
            playTrack(track);
        });
    });
    
    // Store results in queue
    state.queue = results;
    console.log('🎨 Results displayed successfully');
}

// ==================== MUSIC PLAYER ====================
function setupPlayerListeners() {
    const audio = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressInput = document.getElementById('progress-input');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeBtn = document.getElementById('volume-btn');
    
    // Play/Pause
    playBtn.addEventListener('click', togglePlayPause);
    
    // Previous/Next
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    
    // Progress bar
    progressInput.addEventListener('input', (e) => {
        if (state.playerType === 'youtube' && state.youtubePlayer) {
            const duration = state.youtubePlayer.getDuration();
            const time = (e.target.value / 100) * duration;
            state.youtubePlayer.seekTo(time, true);
        } else {
            const time = (e.target.value / 100) * audio.duration;
            audio.currentTime = time;
        }
    });
    
    // Volume
    volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value;
        audio.volume = volume / 100;
        state.volume = volume;
        if (state.youtubePlayer) {
            state.youtubePlayer.setVolume(volume);
        }
    });
    
    volumeBtn.addEventListener('click', () => {
        if (audio.volume > 0) {
            audio.volume = 0;
            volumeSlider.value = 0;
            if (state.youtubePlayer) {
                state.youtubePlayer.setVolume(0);
            }
        } else {
            audio.volume = state.volume / 100;
            volumeSlider.value = state.volume;
            if (state.youtubePlayer) {
                state.youtubePlayer.setVolume(state.volume);
            }
        }
    });
    
    // Audio events
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', playNext);
    audio.addEventListener('play', () => {
        state.isPlaying = true;
        updatePlayButton();
        startVisualizer();
    });
    audio.addEventListener('pause', () => {
        state.isPlaying = false;
        updatePlayButton();
        stopVisualizer();
    });
    
    // Set initial volume
    audio.volume = state.volume / 100;
}

function playTrack(track) {
    const audio = document.getElementById('audio-player');
    
    state.currentTrack = track;
    state.isPlaying = true;
    
    // Update UI
    document.getElementById('album-art').src = track.albumArt;
    document.getElementById('track-title').textContent = track.title;
    document.getElementById('track-artist').textContent = track.artist;
    
    // Show player
    document.getElementById('player').style.display = 'block';
    
    // Play based on track type
    if (track.youtubeId && state.youtubePlayer) {
        // YouTube track
        state.playerType = 'youtube';
        audio.pause();
        audio.src = '';
        state.youtubePlayer.loadVideoById(track.youtubeId);
        state.youtubePlayer.playVideo();
        startVisualizer();
        console.log('▶️ Playing YouTube video:', track.title);
    } else if (track.previewUrl && !track.previewUrl.includes('youtube.com')) {
        // Audio track (demo or Spotify preview)
        state.playerType = 'audio';
        if (state.youtubePlayer) {
            state.youtubePlayer.pauseVideo();
        }
        audio.src = track.previewUrl;
        audio.play();
        startVisualizer();
        console.log('▶️ Playing audio track:', track.title);
    } else {
        console.error('❌ No valid source for track:', track);
        alert('This track cannot be played. YouTube videos are audio-only.');
        return;
    }
    
    updatePlayButton();
    
    // Sync with party room if active
    if (state.partyRoom && state.isHost) {
        syncPartyPlayback();
    }
}

function togglePlayPause() {
    if (state.playerType === 'youtube' && state.youtubePlayer) {
        const playerState = state.youtubePlayer.getPlayerState();
        if (playerState === YT.PlayerState.PLAYING) {
            state.youtubePlayer.pauseVideo();
        } else {
            state.youtubePlayer.playVideo();
        }
    } else {
        const audio = document.getElementById('audio-player');
        if (state.isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    }
    
    // Sync with party mode
    if (state.partyRoom && state.isHost) {
        setTimeout(() => syncPartyPlayback(), 100);
    }
}

function playPrevious() {
    if (state.queue.length === 0) return;
    
    state.currentIndex = (state.currentIndex - 1 + state.queue.length) % state.queue.length;
    playTrack(state.queue[state.currentIndex]);
    
    // Sync with party mode
    if (state.partyRoom && state.isHost) {
        syncPartyPlayback();
    }
}

function playNext() {
    if (state.queue.length === 0) return;
    
    state.currentIndex = (state.currentIndex + 1) % state.queue.length;
    playTrack(state.queue[state.currentIndex]);
    
    // Sync with party mode
    if (state.partyRoom && state.isHost) {
        syncPartyPlayback();
    }
}

function updateProgress() {
    const audio = document.getElementById('audio-player');
    const progressFill = document.getElementById('progress-fill');
    const progressInput = document.getElementById('progress-input');
    const currentTime = document.getElementById('current-time');
    const duration = document.getElementById('duration');
    
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percent}%`;
        progressInput.value = percent;
        
        currentTime.textContent = formatTime(audio.currentTime);
        duration.textContent = formatTime(audio.duration);
    }
}

function updatePlayButton() {
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    
    if (state.isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
}

// ==================== VISUALIZER ====================
let visualizerInterval = null;

function startVisualizer() {
    const bars = document.querySelectorAll('.visualizer-bar');
    
    visualizerInterval = setInterval(() => {
        bars.forEach(bar => {
            const height = Math.random() * 60 + 20;
            bar.style.height = `${height}px`;
        });
    }, 100);
}

function stopVisualizer() {
    if (visualizerInterval) {
        clearInterval(visualizerInterval);
        visualizerInterval = null;
    }
    
    const bars = document.querySelectorAll('.visualizer-bar');
    bars.forEach(bar => {
        bar.style.height = '20px';
    });
}

// ==================== PARTY MODE ====================
let partyModeInterval = null;

function initializeFirebase() {
    // Check if Firebase is configured
    if (CONFIG.FIREBASE_CONFIG.apiKey === 'YOUR_FIREBASE_API_KEY') {
        console.warn('⚠️ Firebase not configured. Party mode will use local simulation mode.');
        console.log('💡 Party Mode is running in LOCAL mode - perfect for testing!');
        console.log('💡 For real-time sync across devices, configure Firebase in config.js');
        return;
    }
    
    // Initialize Firebase (requires Firebase SDK to be loaded)
    try {
        if (typeof firebase !== 'undefined') {
            firebase.initializeApp(CONFIG.FIREBASE_CONFIG);
            state.firebase = firebase.database();
            console.log('✅ Firebase initialized - Party Mode ready for multi-device sync!');
        }
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        console.log('💡 Falling back to local simulation mode');
    }
}

function setupPartyModeListeners() {
    const createRoomBtn = document.getElementById('create-room-btn');
    const joinRoomBtn = document.getElementById('join-room-btn');
    const leaveRoomBtn = document.getElementById('leave-room-btn');
    const copyCodeBtn = document.getElementById('copy-code-btn');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const chatInput = document.getElementById('chat-input');
    const emojiButtons = document.querySelectorAll('.emoji-btn');
    
    createRoomBtn.addEventListener('click', createPartyRoom);
    joinRoomBtn.addEventListener('click', joinPartyRoom);
    leaveRoomBtn.addEventListener('click', leavePartyRoom);
    copyCodeBtn.addEventListener('click', copyRoomCode);
    
    sendMessageBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    emojiButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sendEmojiReaction(btn.dataset.emoji);
        });
    });
}

function createPartyRoom() {
    console.log('🎉 Creating party room...');
    const roomCode = generateRoomCode();
    state.partyRoom = roomCode;
    state.isHost = true;
    
    const userName = prompt('Enter your name:', 'Host') || 'Host';
    state.participants = [{ id: 'host_' + Date.now(), name: userName, isHost: true }];
    
    // Show party room UI
    document.getElementById('room-section').style.display = 'none';
    document.getElementById('party-room').style.display = 'block';
    document.getElementById('room-code').textContent = roomCode;
    
    updateParticipantsList();
    
    // Create room in Firebase or local storage
    if (state.firebase) {
        state.roomRef = state.firebase.ref(`rooms/${roomCode}`);
        state.roomRef.set({
            host: userName,
            created: Date.now(),
            currentTrack: state.currentTrack,
            isPlaying: state.isPlaying,
            currentTime: 0,
            participants: state.participants,
            lastUpdate: Date.now()
        });
        
        // Listen for changes
        state.roomRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data && !state.isHost) {
                handleRoomUpdate(data);
            }
        });
        
        console.log('✅ Firebase room created:', roomCode);
    } else {
        // Local storage simulation
        const roomData = {
            host: userName,
            created: Date.now(),
            currentTrack: state.currentTrack,
            isPlaying: state.isPlaying,
            currentTime: 0,
            participants: state.participants,
            lastUpdate: Date.now()
        };
        localStorage.setItem(`party_room_${roomCode}`, JSON.stringify(roomData));
        
        // Start polling for changes (simulates real-time sync)
        startLocalSync();
        console.log('✅ Local party room created:', roomCode);
    }
    
    addChatMessage('System', `🎉 Party room created! Code: ${roomCode}`);
    addChatMessage('System', '💡 Share this code with friends to sync music together!');
}

function joinPartyRoom() {
    console.log('🚪 Joining party room...');
    const roomCodeInput = document.getElementById('room-code-input');
    const roomCode = roomCodeInput.value.trim().toUpperCase();
    
    if (!roomCode) {
        alert('Please enter a room code');
        return;
    }
    
    // Check if room exists
    const roomExists = state.firebase ? true : localStorage.getItem(`party_room_${roomCode}`);
    
    if (!roomExists && !state.firebase) {
        alert('❌ Room not found. Please check the code and try again.');
        return;
    }
    
    const userName = prompt('Enter your name:', 'Guest') || 'Guest';
    const participantId = 'user_' + Date.now();
    
    state.partyRoom = roomCode;
    state.isHost = false;
    
    // Show party room UI
    document.getElementById('room-section').style.display = 'none';
    document.getElementById('party-room').style.display = 'block';
    document.getElementById('room-code').textContent = roomCode;
    
    // Join room in Firebase or local storage
    if (state.firebase) {
        state.roomRef = state.firebase.ref(`rooms/${roomCode}`);
        state.roomRef.once('value', (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                state.participants = [...(data.participants || []), { id: participantId, name: userName, isHost: false }];
                state.roomRef.update({ 
                    participants: state.participants,
                    lastUpdate: Date.now()
                });
                
                // Sync current track
                if (data.currentTrack) {
                    playTrack(data.currentTrack);
                    if (!data.isPlaying) {
                        togglePlayPause();
                    }
                }
                
                updateParticipantsList();
                
                // Listen for changes
                state.roomRef.on('value', (snapshot) => {
                    const roomData = snapshot.val();
                    if (roomData) {
                        handleRoomUpdate(roomData);
                    }
                });
                
                addChatMessage('System', `✅ ${userName} joined the party!`);
                console.log('✅ Joined Firebase room:', roomCode);
            } else {
                alert('Room not found. Please check the code.');
                leavePartyRoom();
            }
        });
    } else {
        // Local storage mode
        const roomData = JSON.parse(localStorage.getItem(`party_room_${roomCode}`));
        if (roomData) {
            state.participants = [...(roomData.participants || []), { id: participantId, name: userName, isHost: false }];
            roomData.participants = state.participants;
            roomData.lastUpdate = Date.now();
            localStorage.setItem(`party_room_${roomCode}`, JSON.stringify(roomData));
            
            // Sync current track
            if (roomData.currentTrack) {
                playTrack(roomData.currentTrack);
                if (!roomData.isPlaying) {
                    togglePlayPause();
                }
            }
            
            updateParticipantsList();
            startLocalSync();
            
            addChatMessage('System', `✅ ${userName} joined the party!`);
            console.log('✅ Joined local room:', roomCode);
        }
    }
}

function leavePartyRoom() {
    console.log('👋 Leaving party room...');
    
    if (state.roomRef) {
        state.roomRef.off();
    }
    
    // Stop local sync
    if (partyModeInterval) {
        clearInterval(partyModeInterval);
        partyModeInterval = null;
    }
    
    state.partyRoom = null;
    state.isHost = false;
    state.participants = [];
    
    document.getElementById('room-section').style.display = 'block';
    document.getElementById('party-room').style.display = 'none';
    document.getElementById('room-code-input').value = '';
    document.getElementById('chat-messages').innerHTML = '';
    
    console.log('✅ Left party room');
}

function copyRoomCode() {
    const roomCode = document.getElementById('room-code').textContent;
    navigator.clipboard.writeText(roomCode).then(() => {
        alert('Room code copied to clipboard!');
    });
}

function updateParticipantsList() {
    const participantsList = document.getElementById('participants-list');
    const participantCount = document.getElementById('participant-count');
    
    participantCount.textContent = state.participants.length;
    
    participantsList.innerHTML = state.participants.map(p => `
        <div class="participant-item">
            <div class="participant-avatar">${p.name.charAt(0)}</div>
            <div class="participant-name">${p.name}</div>
            ${p.isHost ? '<span class="host-badge">Host</span>' : ''}
        </div>
    `).join('');
}

function sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    addChatMessage('You', message);
    chatInput.value = '';
    
    // Sync with Firebase
    if (state.roomRef) {
        state.roomRef.child('messages').push({
            sender: 'You',
            message: message,
            timestamp: Date.now()
        });
    }
}

function sendEmojiReaction(emoji) {
    addChatMessage('You', `<span class="message-emoji">${emoji}</span>`, true);
    
    // Sync with Firebase
    if (state.roomRef) {
        state.roomRef.child('messages').push({
            sender: 'You',
            message: emoji,
            isEmoji: true,
            timestamp: Date.now()
        });
    }
}

function addChatMessage(sender, message, isEmoji = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageEl = document.createElement('div');
    messageEl.className = 'chat-message';
    
    messageEl.innerHTML = `
        <div class="message-sender">${sender}</div>
        <div class="message-content${isEmoji ? ' message-emoji' : ''}">${message}</div>
    `;
    
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function syncPartyPlayback() {
    if (!state.partyRoom) return;
    
    const roomData = {
        currentTrack: state.currentTrack,
        isPlaying: state.isPlaying,
        currentTime: state.currentTrack ? (document.getElementById('audio-player').currentTime || 0) : 0,
        lastUpdate: Date.now(),
        participants: state.participants
    };
    
    if (state.roomRef && state.isHost) {
        // Firebase sync
        state.roomRef.update(roomData);
    } else if (state.isHost) {
        // Local storage sync
        const existingData = JSON.parse(localStorage.getItem(`party_room_${state.partyRoom}`) || '{}');
        localStorage.setItem(`party_room_${state.partyRoom}`, JSON.stringify({
            ...existingData,
            ...roomData
        }));
    }
}

// Local sync polling (for testing without Firebase)
function startLocalSync() {
    if (partyModeInterval) {
        clearInterval(partyModeInterval);
    }
    
    partyModeInterval = setInterval(() => {
        if (!state.partyRoom) {
            clearInterval(partyModeInterval);
            return;
        }
        
        const roomData = JSON.parse(localStorage.getItem(`party_room_${state.partyRoom}`) || '{}');
        
        if (state.isHost) {
            // Host: push current state
            syncPartyPlayback();
        } else {
            // Guest: pull and sync from host
            if (roomData.lastUpdate) {
                handleRoomUpdate(roomData);
            }
        }
    }, 1000); // Sync every second
}

function handleRoomUpdate(data) {
    // Update participants
    if (data.participants) {
        state.participants = data.participants;
        updateParticipantsList();
    }
    
    // Sync playback if not host
    if (!state.isHost && data.currentTrack) {
        const audio = document.getElementById('audio-player');
        const ytPlayer = state.youtubePlayer;
        
        // Check if track changed
        if (!state.currentTrack || state.currentTrack.id !== data.currentTrack.id) {
            console.log('🎵 Syncing track:', data.currentTrack.title);
            playTrack(data.currentTrack);
        }
        
        // Sync play/pause state
        if (data.isPlaying !== state.isPlaying) {
            console.log('⏯️ Syncing play state:', data.isPlaying);
            
            if (state.playerType === 'youtube' && ytPlayer) {
                if (data.isPlaying) {
                    ytPlayer.playVideo();
                } else {
                    ytPlayer.pauseVideo();
                }
            } else {
                if (data.isPlaying) {
                    audio.play().catch(e => console.log('Auto-play prevented:', e));
                } else {
                    audio.pause();
                }
            }
            state.isPlaying = data.isPlaying;
            updatePlayButton();
        }
        
        // Sync seek position (within 2 second tolerance)
        if (data.currentTime && Math.abs(audio.currentTime - data.currentTime) > 2) {
            console.log('⏩ Syncing position:', data.currentTime);
            if (state.playerType === 'youtube' && ytPlayer) {
                ytPlayer.seekTo(data.currentTime, true);
            } else {
                audio.currentTime = data.currentTime;
            }
        }
    }
}

function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < CONFIG.ROOM_CODE_LENGTH; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// ==================== PLAYLISTS ====================
function setupPlaylistListeners() {
    const createPlaylistBtn = document.getElementById('create-playlist-btn');
    const savePlaylistBtn = document.getElementById('save-playlist-btn');
    const modalClose = document.getElementById('modal-close');
    const modal = document.getElementById('playlist-modal');
    
    createPlaylistBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });
    
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    savePlaylistBtn.addEventListener('click', createPlaylist);
}

function loadPlaylists() {
    const saved = localStorage.getItem('tunetogether_playlists');
    if (saved) {
        state.playlists = JSON.parse(saved);
        displayPlaylists();
    }
}

function createPlaylist() {
    const nameInput = document.getElementById('playlist-name-input');
    const name = nameInput.value.trim();
    
    if (!name) {
        alert('Please enter a playlist name');
        return;
    }
    
    const playlist = {
        id: Date.now(),
        name: name,
        tracks: [],
        created: new Date().toISOString()
    };
    
    state.playlists.push(playlist);
    savePlaylists();
    displayPlaylists();
    
    document.getElementById('playlist-modal').classList.remove('active');
    nameInput.value = '';
}

function savePlaylists() {
    localStorage.setItem('tunetogether_playlists', JSON.stringify(state.playlists));
}

function displayPlaylists() {
    const playlistsGrid = document.getElementById('playlists-grid');
    
    if (state.playlists.length === 0) {
        playlistsGrid.innerHTML = '<div class="playlist-placeholder"><div class="placeholder-icon">🎵</div><p>No playlists yet. Create your first one!</p></div>';
        return;
    }
    
    playlistsGrid.innerHTML = state.playlists.map(playlist => `
        <div class="playlist-card" data-id="${playlist.id}">
            <div class="playlist-cover">🎵</div>
            <div class="playlist-name">${playlist.name}</div>
            <div class="playlist-count">${playlist.tracks.length} songs</div>
        </div>
    `).join('');
    
    // Add click listeners
    document.querySelectorAll('.playlist-card').forEach(card => {
        card.addEventListener('click', () => {
            const playlistId = parseInt(card.dataset.id);
            openPlaylist(playlistId);
        });
    });
}

function openPlaylist(playlistId) {
    const playlist = state.playlists.find(p => p.id === playlistId);
    if (playlist) {
        state.queue = playlist.tracks;
        if (playlist.tracks.length > 0) {
            playTrack(playlist.tracks[0]);
        }
        
        // Switch to music view
        document.querySelector('[data-view="music"]').click();
    }
}

// ==================== UTILITY FUNCTIONS ====================
function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ==================== SERVICE WORKER (for PWA support) ====================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('✅ Service Worker registered'))
            .catch(err => console.log('❌ Service Worker registration failed'));
    });
}
