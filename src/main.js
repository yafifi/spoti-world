import './style.css'

// ========================  SPOTIFY API HELPER FUNCTIONS ======================== // 

// Random String
function generateRandomString (length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// Code Challenge Help Functions
const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function getTokenFromStorage() {
  return localStorage.getItem("access_token");
}


// ========================  SPOTIFY LOGIN FLOW ======================== // 

// Spotify Login Credentials
const clientId = "f639b9751ac0410d82f90ffea1fef2d5";
const redirectUri = "http://127.0.0.1:5173/callback";
const scope = "user-top-read";


// Spotify Login Function
async function loginWithSpotify() {

  // DEBUG
  localStorage.removeItem("access_token");
  localStorage.removeItem("code_verifier");

  const authUrl = new URL("https://accounts.spotify.com/authorize");

  // generate and store verifier
  const codeVerifier = generateRandomString(128);
  localStorage.setItem("code_verifier", codeVerifier);

  // generate code challenge
  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed);

  const params =  {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  }
  
  // redirect to spotify
  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
}

// ========================  AQUIRE USER TOKEN ======================== // 

// Handle Callback
  // retrive temp code from URL
  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get('code');

  // if successful, get user token
  if (code) {
  (async () => {
    const token = await getToken(code);
    if (token) {
      console.log("SUCCESS TOKEN:", token);
    }
  })();
}


// Exchange temporary code for access token
async function getToken(code) {
  const codeVerifier = localStorage.getItem("code_verifier");

  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  }

  const body = await fetch(url, payload);
  const response = await body.json();
  const token = response.access_token;

  console.log("TOKEN RESPONSE:", response);
  console.log("STATUS:", body.status);

  localStorage.setItem('access_token', response.access_token);

  if (token){
      console.log("SUCCESS TOKEN:", token);
  }

  return token;
}

// ========================  GET TOP TRACKS ======================== //

const analyzeTopTracksButton = document.getElementById("analyzeTopTracks-button")

analyzeTopTracksButton.addEventListener("click", async () => {
    const token = getTokenFromStorage();
    const tracks = await getTopTracks(token);
    renderTracks(tracks);
    showResultsTopTracksPage();
});

async function getTopTracks(token) {
  if (!token) {
    console.error("No token available");
    return [];
  }

  const response = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?limit=20",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  
  const data = await response.json();
  console.log("TOP TRACKS:", data);
  return data.items;
}

function renderTracks(tracks) {
  const container = document.getElementById("tracks-container");
  container.innerHTML = "";

  tracks.forEach(track => {
    const div = document.createElement("div");

    const artistNames = track.artists
    .map(artist => artist.name)
    .join(" - ");

    div.innerHTML = `
    <p><strong>${track.name}</strong></p>
    <p>${artistNames}</p>
    <hr/>
    `;

    container.appendChild(div);
  });
}


// ========================  UI FUNCTIONS ======================== // 
const loginPage = document.getElementById("login-page");
const analysisPage = document.getElementById("analysis-page");
const resultsTopTracksPage = document.getElementById("resultsTopTracks-page");

const loginButton = document.getElementById("login-button")
const backToAnalysisButton = document.getElementById("back-to-analysis-button");

const token = getTokenFromStorage();

document.addEventListener("DOMContentLoaded", () => {
  loginButton.addEventListener("click", () => {
      loginWithSpotify();
  }); 
  
  backToAnalysisButton.addEventListener("click", () => {
    showAnalysisPage();
  });

  document.getElementById("back-to-analysis-button").addEventListener("click", () => {
    showAnalysisPage();
  });

  initApp();
});

function initApp() {
  if (token && window.location.pathname !== "/callback") {
    showLoginPage();
  } else {
    showAnalysisPage();
  }
}

function showAnalysisPage() {
  loginPage.style.display = "none";
  analysisPage.style.display = "block";
  resultsTopTracksPage.style.display = "none";
}

function showLoginPage() {
  loginPage.style.display = "block";
  analysisPage.style.display = "none";
  resultsTopTracksPage.style.display = "none";
}

function showResultsTopTracksPage() {
  loginPage.style.display = "none";
  analysisPage.style.display = "none";
  resultsTopTracksPage.style.display = "block";
}



