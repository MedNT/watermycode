const fs = require('fs');
const path = require('path');
const AudioContext = require('web-audio-api').AudioContext;

const context = new AudioContext();

function playSound(sound) {
    const soundPath = path.join(__dirname, '..', 'sounds', `${sound}.mp3`);

    fs.readFile(soundPath, (err, data) => {
        if (err) throw err;

        context.decodeAudioData(data, (buffer) => {
            const source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(context.destination);
            source.start(0);
        }, (error) => {
            console.error("Error decoding audio data:", error);
        });
    });
}

module.exports = { playSound };