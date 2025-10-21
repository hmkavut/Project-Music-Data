// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { countUsers, getSong2, getListenEvents2  } from "./common.mjs";

function joinEventAndSongs(userID){
  const userData= getListenEvents2(userID);
  const events = Object.values(userData).flat();
  const joined = events.map(e => {
  const song = getSong2(e.song_id);
    return {
      ...e,       
      ...song, 
    };
  });
  joined.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  return joined;
}

window.onload = function () {
  document.querySelector("body").innerText = `There are ${countUsers()} users`;
  console.log(joinEventAndSongs(1));
};