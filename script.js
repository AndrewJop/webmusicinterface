document.addEventListener('DOMContentLoaded', function() {
    const playlist = document.getElementById('playlist');
    const audio = document.getElementById('audio');
    const musicFiles = [
        // Add paths to your music files
        '/music/Ikson - Last Summer.mp3',
        '/music/Sara Skinner - Lost Sky Dreams pt. II.mp3',
        '/music/Chris Linton - Lost Sky Fearless pt.II.mp3',
        '/music/Robin Hustin & TobiMorrow - Light It Up feat. Jex Future Bounce.mp3',
        '/music/Syn Cole - Feel Good.mp3',
        '/music/intouch - Baby Sweet Garage House.mp3',
        '/music/Julius Dreisig - Zeus x Crona.mp3'
        // Add more music files as needed
    ];

    const songNames = [
        'Ikson - Last Summer.mp3',
        'Sara Skinner - Lost Sky Dreams pt. II.mp3',
        'Chris Linton - Lost Sky Fearless pt.II.mp3',
        'Robin Hustin & TobiMorrow - Light It Up feat. Jex Future Bounce.mp3',
        'Syn Cole - Feel Good.mp3',
        'intouch - Baby Sweet Garage House.mp3',
        'Julius Dreisig - Zeus x Crona.mp3'
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
