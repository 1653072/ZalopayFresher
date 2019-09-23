export function setJwtToStorage(jwt) {
  localStorage.setItem("jwt", jwt);
}

export function getJwtFromStorage() {
  var data = localStorage.getItem("jwt");
  return data;
}

export function clearStorage() {
  localStorage.clear();
}

export function isAuthenticated() {
  var jwt = getJwtFromStorage();
  return jwt != "" && jwt != null;
}
