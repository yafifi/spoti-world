# 🎶 spoti-world 🗺️
Spoti-World analyzes your most recent Spotify listening data and shares your top tracks and artists with you.

### Features:
- Spotify Login
- Fetch Top Artists
- Fetch Top Tracks
- Display Results

### Spotify Developer Setup
To run this app you must have a Spotify Developer account.

1. Create an app at:
https://developer.spotify.com/dashboard

2. Add a Redirect URI:
http://127.0.0.1:5173/callback

3. Copy your Client ID and replace it in:
src/main.js (line 77)

### Running the Project Locally
1. Clone Repo
2. Install Dependencies with npm 
3. Start Dev Server
4. Open App in Local Browser

### Future Features
The goal is for Spoti-World to really analyze where in the world the music you listen to comes from. However due to the timeline of this assignment and the need for additional data layers, I have kept the current imlementation as an MVP version.

Additonal Fetures:
- Country-level analysis of top artists (requires additional datasets)
- Interactive world map visualization of listening habits
- Language clustering of top tracks
- User profiles with saved listening insights over time



