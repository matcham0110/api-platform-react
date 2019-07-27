import axios from "axios";
import JwtDecode from "jwt-decode";
import { LOGIN_API } from "../config";

function authenticate(credentials) {
  return axios
    .post(LOGIN_API, credentials)
    .then(response => response.data.token)
    .then(token => {
      // Stockage dans le localStorage
      window.localStorage.setItem("authToken", token);
      // On préviens axios des header qu'il devra inclure à partir de maintenant
      setAxiosToken(token);
    });
}

// Déconnexion (suppression du token du local storage et de axios)
function logout() {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
}

// met en place le token JWT sur Axios
function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

//voir si on a déja un token et le setup si oui
function setup() {
  const token = window.localStorage.getItem("authToken");
  if (token) {
    const { exp: expiration } = JwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
      console.log("Connexion établie par le localstorage");
    } else {
      console.log("Connexion supprimé token datetime invalide");
      logout();
    }
  } else {
    console.log("Pas de token dans le local storage");
    logout();
  }
}

function isAuthenticated() {
  const token = window.localStorage.getItem("authToken");
  if (token) {
    const { exp: expiration } = JwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
      console.log("Authenticated");
      return true;
    } else {
      console.log("Auth expired");
      return false;
    }
  }
  console.log("No token");
  return false;
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated
};
