import './style.css'

// ========================  SPOTIFY LOGIN FLOW ======================== // 

const loginButton = document.getElementById("login-button")
loginButton.addEventListener("click", () => {
    loginWithSpotify();
});

// Spotify Login Credentials
const clientId = "f639b9751ac0410d82f90ffea1fef2d5";
const redirectUri = "http://127.0.0.1:5173/callback";
const scope = "user-top-read";


// Spotify Login Function
async function loginWithSpotify() {
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





// ========================  SPOTIFY API HELPER FUNCTIONS ======================== // 

// Random String
const generateRandomString = (length) => {
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