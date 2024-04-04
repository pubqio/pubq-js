"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemainingSeconds = void 0;
const getRemainingSeconds = (timestamp) => {
    // Convert the timestamp to milliseconds
    const targetTime = timestamp * 1000;
    // Get the current time in milliseconds
    const currentTime = new Date().getTime();
    // Calculate the difference in milliseconds
    const difference = targetTime - currentTime;
    // Convert the difference to seconds
    const remainingSeconds = Math.floor(difference / 1000);
    return remainingSeconds;
};
exports.getRemainingSeconds = getRemainingSeconds;
