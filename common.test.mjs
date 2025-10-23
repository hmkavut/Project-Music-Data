import assert from "node:assert";
import test from "node:test";
import {
  countUsers,
  getSong2,
  getListenEvents2,
  getUserIDs2,
  getQuestions2,
} from "./common.mjs";

test("User count is correct", () => {
  assert.equal(countUsers(), 4);
});
test("User user", () => {
  assert.equal(getUserIDs2(), 4);
});
test("User count is correct", () => {
  assert.equal(getSong2("song-10").length, 5);
});
test("User count is correct", () => {
  assert.equal(getListenEvents2(3).length, 641);
});
test("User count is correct", () => {
  assert.equal(getQuestions2().length, 9);
});
