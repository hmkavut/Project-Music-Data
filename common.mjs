import { getUserIDs, getSong, getListenEvents, getQuestions } from "./data.mjs";


export const countUsers = () => getUserIDs().length;
export const getUserIDs2 = () => getUserIDs();
export const getSong2 = (songID) =>  getSong(songID);
export const getListenEvents2 = (userID) => getListenEvents(userID);
export const getQuestions2 = () => getQuestions();

