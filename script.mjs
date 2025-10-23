// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import {
  countUsers,
  getSong2,
  getListenEvents2,
  getUserIDs2,
  getQuestions2,
} from "./common.mjs";

function initialSetup() {
  createUserSelection();
}

function createUserSelection() {
  const container = document.getElementById("drop-down");
  const h1 = document.createElement("h1");
  h1.textContent = "Music Data Project";

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
  container.appendChild(h1);
  container.appendChild(userSelectLabel);
  container.appendChild(userSelect);

  userSelect.addEventListener("change", (e) => {
    e.preventDefault();
    const selectedId = e.target.value;
    
    if (selectedId) {
      createTable(selectedId);
    }
  });
}

function createTable(userID) {
  const container = document.getElementById("results");
  container.innerHTML = ""; // clear previous content

  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";

  const userAnswers = answers(userID); // ✅ fixed naming
  const questions = getQuestions2();
  let a = 0;

  questions.forEach((q) => {
    
    const row = document.createElement("tr");

    const questionCell = document.createElement("td");
    questionCell.textContent = q;

    const answerCell = document.createElement("td");
    const firstKey = Object.keys(userAnswers)[a];
    const firstValue = userAnswers[firstKey];
    a++;
    answerCell.textContent =
      typeof firstValue === "object"
        ? JSON.stringify(firstValue)
        : firstValue ?? "No data";

    row.appendChild(questionCell);
    row.appendChild(answerCell);
    table.appendChild(row);
  });

  container.appendChild(table);
}

function joinSongs(userID, bool) {
  const userData = getListenEvents2(userID);
  const events = Object.values(userData).flat();
  const joined = events.map((e) => {
    const song = getSong2(e.song_id);
    return {
      ...e,
      ...song,
    };
  });
  joined.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const filtered = joined.filter((a) => {
    const date = new Date(a.timestamp);
    const day = date.toLocaleString("en-GB", { weekday: "long" }); // e.g. "Friday"
    const hour = date.getHours();

    return (day === "Friday" && hour >= 17) || (day === "Saturday" && hour < 4);
  });

  return bool ? joined : filtered;
}

function mostListenedTo(userID, joined2, param) {
  // You don't actually need to call joinEventAndSongs again if joined2 is already joined data.
  const result = {};
  const count = {};

  joined2.forEach((row) => {
    const key = row[param]; // dynamic property
    if (!result[key]) {
      result[key] = 0;
      count[key] = 0;
    }
    result[key] += row.seconds_since_midnight;
    count[key]++;
  });

  // Convert object to array format like SQL result
  const summary = Object.entries(result).map(([key, totalSeconds]) => ({
    [param]: key, // dynamically set property name
    totalSeconds,
    count: count[key],
  }));

  return summary;
}

function mostConsecutiveSong(listens) {
  if (listens.length === 0) return null;

  let maxSong = listens[0].title;
  let maxCount = 1;

  let currentSong = listens[0].title;
  let currentCount = 1;

  for (let i = 1; i < listens.length; i++) {
    if (listens[i].title === currentSong) {
      currentCount++;
    } else {
      if (currentCount > maxCount) {
        maxCount = currentCount;
        maxSong = currentSong;
      }
      currentSong = listens[i].title;
      currentCount = 1;
    }
  }

  // Check the last streak
  if (currentCount > maxCount) {
    maxCount = currentCount;
    maxSong = currentSong;
  }

  return { song: maxSong, timesInARow: maxCount };
}
function getMostListened(songs, prop) {
  console.log(songs);
  console.log(prop);
  
  const maxItem = songs?.reduce((max, s) => (s[prop] > max[prop] ? s : max));
  if (!maxItem) return null;

  const firstKey = Object.keys(maxItem)[0];
  return maxItem[firstKey];
}

function firstItemDate(listens) {
  if (!Array.isArray(listens) || listens.length === 0) return null;
  return new Date(listens[0].timestamp);
}

function lastItemDate(listens) {
  if (!Array.isArray(listens) || listens.length === 0) return null;
  return new Date(listens[listens.length - 1].timestamp);
}

function answers(userID) {
  const answers = {};
  const song = mostListenedTo(userID, joinSongs(userID, true), "title");
  const artist = mostListenedTo(userID, joinSongs(userID, true), "artist");
  const genre = mostListenedTo(userID, joinSongs(userID, true), "genre");

  const song2 = mostListenedTo(userID, joinSongs(userID, false), "title");
  const artist2 = mostListenedTo(userID, joinSongs(userID, false), "artist");
  const genre2 = mostListenedTo(userID, joinSongs(userID, false), "genre");

  answers.mostListenSongCount = getMostListened(song, "count");
  answers.mostListenSongCountTime = getMostListened(song, "duration_seconds");
  answers.mostListenSongArtistCount = getMostListened(artist, "count");
  answers.mostListenSongArtistTime = getMostListened(
    artist,
    "duration_seconds"
  );
  answers.fridayNightSongCount = getMostListened(song2, "count");
  answers.FridayNightSongTime = getMostListened(song2, "duration_seconds");
  answers.longestStreakSong = mostConsecutiveSong(joinSongs(userID, true));
  answers.everyDaySongs = songsEveryDay(joinSongs(userID, true));
  
  answers.topThreeGenres = genre
  .slice(0, 3)              // take first 3 items
  .map((g) => g.genre)      // extract the 'genre' value
  .join(", ");              // join into single string
 
  

  return answers;
}

function makeJustDateAndSong(listens) {
  return listens.map((item) => {
    const date = new Date(item.timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return {
      day: `${year}-${month}-${day}`,
      id: item.id,
    };
  });
}

function songsEveryDay(listens) {
  const list = makeJustDateAndSong(listens);
  if (!Array.isArray(list) || list.length === 0) return [];

  // 1️⃣ Get all unique days
  const days = [...new Set(list.map((x) => x.day))];

  // 2️⃣ Group song IDs by day
  const dayMap = {}; // { day1: Set(ids), day2: Set(ids), ... }
  days.forEach((day) => {
    dayMap[day] = new Set(list.filter((x) => x.day === day).map((x) => x.id));
  });

  // 3️⃣ Get intersection of all sets
  let commonSongs = [...dayMap[days[0]]]; // start with first day's songs
  for (let i = 1; i < days.length; i++) {
    commonSongs = commonSongs.filter((id) => dayMap[days[i]].has(id));
  }

  return commonSongs;
}




window.onload = function () {
  initialSetup();
  console.log(getUserIDs2().length);
  console.log(getSong2("song-1").length);
  console.log(getListenEvents2(3).length);
  console.log(getQuestions2().length);
};
