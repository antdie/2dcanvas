// export function formattedHours(seconds) {
//     return Math.floor((seconds % (60 * 60 * 24)) / (60 * 60)).toString().padStart(2, '0');
// }

export function formattedMinutes(seconds) {
    return Math.floor((seconds % (60 * 60)) / 60).toString().padStart(2, '0');
}

export function formattedSeconds(seconds) {
    return Math.floor(seconds % 60).toString().padStart(2, '0');
}
