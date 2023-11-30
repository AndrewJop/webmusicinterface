document.addEventListener('DOMContentLoaded', function() {
    const playlist = document.getElementById('playlist');
    const audio = document.getElementById('audio');
    const musicFiles = [
        // Add paths to your music files
        'Men I Trust - Show Me How (Kitsch Edit).mp3',
        'Duskus - Moss.mp3',
        // Add more music files as needed
    ];

    const songNames = [
        'Men I Trust - Show Me How (Kitsch Edit)',
        'Duskus - Moss',
        // Add more song titles corresponding to the musicFiles array
    ];

    // Create playlist
    musicFiles.forEach(function(file, index) {
        const listItem = document.createElement('li');
        listItem.textContent = `${songNames[index]}`;
        listItem.addEventListener('click', function() {
            audio.src = file;
            audio.play();
        });
        playlist.appendChild(listItem);
    });

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const canvas = document.getElementById('visualizer');
    const canvasCtx = canvas.getContext('2d');

    const source = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    function draw() {
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        const barWidth = (WIDTH / bufferLength) * 2.5;

        for (let i = 0; i < bufferLength; i++) {
            const hue = (i / bufferLength) * 360; // Adjust hue range for colors
            const normalizedValue = dataArray[i] / 255; // Normalize data

            canvasCtx.fillStyle = `hsl(${hue}, 100%, ${normalizedValue * 100}%)`;
            canvasCtx.fillRect(i * barWidth, HEIGHT - (normalizedValue * HEIGHT), barWidth, normalizedValue * HEIGHT);
        }
    }

    audio.addEventListener('play', function() {
        draw();
    });
});
