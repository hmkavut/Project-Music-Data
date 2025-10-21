// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { countUsers, getSong2, getListenEvents2, getUserIDs2  } from "./common.mjs";
//const joined = [];

function initialSetup(){
   const container = document.createElement("div");
// --- Build page structure ---
const h1 = document.createElement("h1");
h1.textContent = "Spaced Repetition Tracker";
// Accessible user selector
const userSelectLabel = document.createElement("label");
userSelectLabel.textContent = "Select User: ";
userSelectLabel.setAttribute("for", "userSelect");

const userSelect = document.createElement("select");
userSelect.id = "userSelect";
userSelect.innerHTML = `
  <option value="">-- Choose a user --</option>
  ${getUserIDs2()
    .map((id) => `<option value="${id}">User ${id}</option>`)
    .join("")}
`;
  // Append everything to the container
  container.appendChild(h1);
  container.appendChild(userSelectLabel);
  container.appendChild(userSelect);

  // Add container to the body
  document.body.appendChild(container);

  // Add a listener to handle selection
  userSelect.addEventListener("change", (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      console.log(joinEventAndSongs(Number(selectedId)));
    }
  });
  }


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

function joinFridaysSongs(userID){
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
  const filtered = joined.filter(a => {
  const date = new Date(a.timestamp);
  const day = date.toLocaleString("en-GB", { weekday: "long" }); // e.g. "Friday"
  const hour = date.getHours();

  return (day === "Friday" && hour >= 17) || (day === "Saturday" && hour < 4);
});

  return filtered;
}

function mostOftenListenedToSong(userID, joined2){

  const joined = joinEventAndSongs(userID);
  const result = {};
  // Group by artist and sum seconds_since_midnight
  joined2.forEach((row) => {
    const title = row.title;
    if (!result[title]) {
      result[title] = 0;
    }
    result[title] += row.seconds_since_midnight;
  });

  // Convert object to array format like SQL result
  const summary = Object.entries(result).map(([title, totalSeconds]) => ({
    title,
    totalSeconds,
  }));

  return summary;

}

function mostOftenListenedToArtist(userID, joined2){

  const joined = joinEventAndSongs(userID);
  const result = {};
  // Group by artist and sum seconds_since_midnight
  joined2.forEach((row) => {
    const artist = row.artist;
    if (!result[artist]) {
      result[artist] = 0;
    }
    result[artist] += row.seconds_since_midnight;
  });

  // Convert object to array format like SQL result
  const summary = Object.entries(result).map(([artist, totalSeconds]) => ({
    artist,
    totalSeconds,
  }));

  return summary;

}

function mostOftenListenedToGenre(userID, joined2){

  const joined = joinEventAndSongs(userID);
  const result = {};
  // Group by artist and sum seconds_since_midnight
  joined2.forEach((row) => {
    const genre = row.genre;
    if (!result[genre]) {
      result[genre] = 0;
    }
    result[genre] += row.seconds_since_midnight;
  });

  // Convert object to array format like SQL result
  const summary = Object.entries(result).map(([genre, totalSeconds]) => ({
    genre,
    totalSeconds,
  }));

  return summary;

}


function mostCountedListenedToSong(userID, joined2){

  const joined = joinEventAndSongs(userID);
  const result = {};
  // Group by artist and sum seconds_since_midnight
  joined2.forEach((row) => {
    const title = row.title;
    if (!result[title]) {
      result[title] = 0;
    }
    result[title] ++;
  });

  // Convert object to array format like SQL result
  const summary = Object.entries(result).map(([title, totalSeconds]) => ({
    title,
    totalSeconds,
  }));

  return summary;

}

function mostCountedListenedToArtist(userID, joined2){

  const joined = joinEventAndSongs(userID);
  const result = {};
  // Group by artist and sum seconds_since_midnight
  joined2.forEach((row) => {
    const artist = row.artist;
    if (!result[artist]) {
      result[artist] = 0;
    }
    result[artist] ++;
  });

  // Convert object to array format like SQL result
  const summary = Object.entries(result).map(([artist, totalSeconds]) => ({
    artist,
    totalSeconds,
  }));

  return summary;

}

function mostCountedListenedToGenre(userID, joined2){

  const joined = joinEventAndSongs(userID);
  const result = {};
  // Group by artist and sum seconds_since_midnight
  joined2.forEach((row) => {
    const genre = row.genre;
    if (!result[genre]) {
      result[genre] = 0;
    }
    result[genre] ++;
  });

  // Convert object to array format like SQL result
  const summary = Object.entries(result).map(([genre, totalSeconds]) => ({
    genre,
    totalSeconds,
  }));

  return summary;

}

window.onload = function () {
  initialSetup();
  document.querySelector("body").innerText = `There are ${countUsers()} users`;
  const allList = joinEventAndSongs(1);
  const allFriday = joinFridaysSongs(1);
  console.log(joinEventAndSongs(1));
  console.log(joinFridaysSongs(1));
  console.log(mostOftenListenedToSong(1, allList));
  console.log(mostOftenListenedToArtist(1, allList));
  console.log(mostOftenListenedToGenre(1, allList));
  
  console.log(mostOftenListenedToSong(1, allFriday));
  console.log(mostOftenListenedToArtist(1, allFriday));
  console.log(mostOftenListenedToGenre(1, allFriday));

  console.log(mostCountedListenedToSong(1, allList));
  console.log(mostCountedListenedToArtist(1, allList));
  console.log(mostCountedListenedToGenre(1, allList));

  console.log(mostCountedListenedToSong(1, allFriday));
  console.log(mostCountedListenedToArtist(1, allFriday));
  console.log(mostCountedListenedToGenre(1, allFriday));
};