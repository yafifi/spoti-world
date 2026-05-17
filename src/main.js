import './style.css'

//console.log("JS running successfully");

const loginButton = document.getElementById("login-button")
const token = getAccessTokenFromUrl();

// Events
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

// Handle Redirect Token
function getAccessTokenFromUrl() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get("access_token");
}

if (token) {
  console.log("Access Token: ", token);
  //document.body.innerHTML = "<h2>Logged in successfully</h2>";
} else {
  console.log("No Token Found");
}