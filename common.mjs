import { getUserIDs, getSong, getListenEvents } from "./data.mjs";


export const countUsers = () => getUserIDs().length;
export const getUserIDs2 = () => getUserIDs();
export const getSong2 = (songID) =>  getSong(songID);
export const getListenEvents2 = (userID) => getListenEvents(userID);

