
const scrobblerURL = 'https://ws.audioscrobbler.com/2.0/';
const LFapiKey = '946a0b231980d52f90b8a31e15bccb16';
const discogsKey = 'key=eJhCgHcNJQgAdvtQiGfi&secret=AailmhUCMBAkvuggupoBQkncHPNuUbSw';

export function artists(query) {
  return fetch(`https://api.discogs.com/database/search?&q=${query}~&type=artist&per_page=5&page=1&${discogsKey}`)
  // return fetch(`${scrobblerURL}?method=artist.search&api_key=${LFapiKey}&limit=6&format=json&artist=${query}`)
  // return fetch(`http://musicbrainz.org/ws/2/artist/?query=artist:${query}~&fmt=json`)
  // return fetch(`https://itunes.apple.com/search?term=${query}&limit=6`)
  .then(response => response.json())
}

export function songs(query) {
  //return fetch(`https://api.discogs.com/database/search?&track=${query}&type=master&per_page=7&page=1&${discogsKey}`)
  return fetch(`${scrobblerURL}?method=track.search&api_key=${LFapiKey}&limit=30&format=json&track=${query}`)
  .then(response => response.json())
}

export function albums(query) {
  return fetch(`${scrobblerURL}?method=album.search&api_key=${LFapiKey}&limit=9&format=json&album=${query}`)
  .then(response => response.json())
}

export function albumsBy(artist) {
  return fetch(`
    ${scrobblerURL}?method=artist.gettopalbums&api_key=${LFapiKey}&limit=50&format=json&artist=${artist}`).then(
    response => response.json()
  );
};

export function toptracksBy(artist) {
  return fetch(`
    ${scrobblerURL}?method=artist.gettoptracks&autocorrect=1&api_key=${LFapiKey}&limit=50&format=json&artist=${artist}`).then(
    response => response.json()
  );
};

export function albumTracks(artist, album) {
  return fetch(`
    ${scrobblerURL}?method=album.getinfo&api_key=${LFapiKey}&limit=50&format=json&artist=${artist}&album=${album}`).then(
    response => response.json()
  );
};

export function youtubeSearch(query) {
  return fetch(`https://www.googleapis.com/youtube/v3/search?&q=${query}&maxResults=10&part=snippet&key=AIzaSyDlcHPnr5gJr1_pBSvVSRtFudfpIUppfjM`)
  .then(response => response.json())
}
