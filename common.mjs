import { getUserIDs, getSong, getListenEvents } from "./data.mjs";



export const countUsers = () => getUserIDs().length;
export const getSong2 = (songID) =>  getSong(songID);
export const getListenEvents2 = (userID) => getListenEvents(userID);

