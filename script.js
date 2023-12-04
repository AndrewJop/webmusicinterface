document.addEventListener('DOMContentLoaded', function() {
    const playlist = document.getElementById('playlist');
    const audio = document.getElementById('audio');
    const musicFiles = [
        // Add paths to your music files
        'music/Ikson - Last Summer.mp3',
        'music/Sara Skinner - Lost Sky Dreams pt. II.mp3',
        'music/Chris Linton - Lost Sky Fearless pt.II.mp3',
        'music/Robin Hustin & TobiMorrow - Light It Up feat. Jex Future Bounce.mp3',
        'music/Syn Cole - Feel Good.mp3',
        'music/intouch - Baby Sweet Garage House.mp3',
        'music/Julius Dreisig - Zeus x Crona.mp3'
        // Add more music files as needed
    ];

    const songNames = [
        'Ikson - Last Summer',
        'Sara Skinner - Lost Sky Dreams pt. II',
        'Chris Linton - Lost Sky Fearless pt.II',
        'Robin Hustin & TobiMorrow - Light It Up feat. Jex Future Bounce',
        'Syn Cole - Feel Good',
        'intouch - Baby Sweet Garage House',
        'Julius Dreisig - Zeus x Crona'
        // Add more song titles corresponding to the musicFiles array
    ];

    function createPlaylistItem(name, file, index) {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${name}`;
        listItem.addEventListener('click', function() {
            const index = songNames.indexOf(name);
            if (index !== -1) {
                audio.src = musicFiles[index];
                audio.play();
            }
        });
        playlist.appendChild(listItem);
    }

    function addSongButtonFunctionality() {
        const addSongButton = document.getElementById('addSongButton');
        addSongButton.addEventListener('click', function() {
            const songName = prompt('Enter the song name:');
            if (songName) {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'audio/mp3';
                fileInput.addEventListener('change', function(event) {
                    const file = event.target.files[0];
                    const url = URL.createObjectURL(file);
                    musicFiles.push(url);
                    songNames.push(songName);
                    createPlaylistItem(songName, url, musicFiles.length - 1);
                });
                fileInput.click();
            }
        });
    }

    function addDeleteSongFunctionality() {
        const deleteSongButton = document.getElementById('deleteSongButton');
        deleteSongButton.addEventListener('click', function() {
            const songIndex = prompt('Enter the index of the song to delete:');
            if (songIndex !== null) {
                const index = parseInt(songIndex, 10);
                if (!isNaN(index) && index >= 1 && index <= musicFiles.length) {
                    const child = playlist.children[index - 1];
                    playlist.removeChild(child);
                    musicFiles.splice(index - 1, 1);
                    songNames.splice(index - 1, 1);
                    updateIndexes();
                } else {
                    alert('Invalid index');
                }
            }
        });
    }

    function updateIndexes() {
        const playlistItems = playlist.querySelectorAll('li');
        playlistItems.forEach((item, index) => {
            item.textContent = `${index + 1}. ${songNames[index]}`;
        });
    }

    // Create initial playlist
    for (let i = 0; i < musicFiles.length; i++) {
        createPlaylistItem(songNames[i], musicFiles[i], i);
    }

    addSongButtonFunctionality();
    addDeleteSongFunctionality();

    let audioContext;

    audio.addEventListener('play', function() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
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

            draw();
        }
    });
});
