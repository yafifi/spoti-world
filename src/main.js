import './style.css'


// ========================  SPOTIFY LOGIN PROCESS ======================== // 

const loginButton = document.getElementById("login-button")
loginButton.addEventListener("click", () => {
    loginWithSpotify();
});

// Spotify Login Credentials
const clientId = "f639b9751ac0410d82f90ffea1fef2d5";
const redirectUri = "http://127.0.0.1:5173/callback";
const scopes = [
  "user-top-read"
]

// Spotify Login Function
function loginWithSpotify() {
  const authUrl = "https://accounts.spotify.com/authorize" +
                  `?client_id=${clientId}` +
                   `&response_type=code` +
                   `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                   `&scope=${encodeURIComponent(scopes.join(" "))}`;

  console.log(authUrl);
  window.location.href = authUrl;
}


// ========================  AQUIRE USER TOKEN ======================== // 

// Save temp code from Login
const code = getCodeFromUrl();
// temporary code
console.log("AUTH CODE:", code); 
// Get token from temp code
if (code) {
  const token = await exchangeCodeForToken(code);
  if (token){
    console.log("SUCCESS TOKEN:", token);
  }
}

// Get Spotify Token
function getCodeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
}

// Exchange temporary code for access token
async function exchangeCodeForToken(code) {
  const codeVerifier = localStorage.getItem("code_verifier");

  const body = new URLSearchParams({
    cliend_id: clientId,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  });

  const data = await response.json();
  console.log("ACCESS TOKEN:", data.access_token);

  return data.access_token;
}
