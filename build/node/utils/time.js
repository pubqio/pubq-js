"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemainingSeconds = void 0;
var getRemainingSeconds = function (timestamp) {
    // Convert the timestamp to milliseconds
    var targetTime = timestamp * 1000;
    // Get the current time in milliseconds
    var currentTime = new Date().getTime();
    // Calculate the difference in milliseconds
    var difference = targetTime - currentTime;
    // Convert the difference to seconds
    var remainingSeconds = Math.floor(difference / 1000);
    return remainingSeconds;
};
exports.getRemainingSeconds = getRemainingSeconds;
