document.addEventListener('DOMContentLoaded', function() {
    
    // --- Music Player ---
    const music = document.getElementById('bg-music');
    music.volume = 0.3; // Set volume to 30%
    const musicToggle = document.getElementById('music-toggle');
    const playIcon = musicToggle.querySelector('.icon-play');
    const pauseIcon = musicToggle.querySelector('.icon-pause');
    let hasInteracted = false;

    function toggleMusic() {
        if (music.paused) {
            music.play().catch(e => console.error("Audio play failed:", e));
            musicToggle.classList.add('playing');
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            music.pause();
            musicToggle.classList.remove('playing');
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }

    // Play music on first user interaction
    function startMusicOnFirstInteraction() {
        if (!hasInteracted) {
            hasInteracted = true;
            toggleMusic();
            document.body.removeEventListener('click', startMusicOnFirstInteraction);
            document.body.removeEventListener('touchstart', startMusicOnFirstInteraction);
        }
    }
    
    musicToggle.addEventListener('click', toggleMusic);
    document.body.addEventListener('click', startMusicOnFirstInteraction, { once: true });
    document.body.addEventListener('touchstart', startMusicOnFirstInteraction, { once: true });


    // --- Countdown Timer ---
    const weddingDate = new Date(2025, 6, 28, 9, 9, 0).getTime();
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById("countdown").innerHTML = "<h2>The Wedding Day is Here!</h2>";
            return;
        }
        document.getElementById("days").innerText = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
        document.getElementById("hours").innerText = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        document.getElementById("minutes").innerText = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        document.getElementById("seconds").innerText = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
    }, 1000);

    // --- Copy Button ---
    document.getElementById('copy-btn').addEventListener('click', () => {
        const accountNumber = document.querySelector('.account-number').innerText;
        navigator.clipboard.writeText(accountNumber).then(() => showToast('คัดลอกเลขบัญชีแล้ว!'), () => showToast('เกิดข้อผิดพลาด', 'error'));
    });
    
    // --- Lightbox for Gallery and QR Code ---
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    const closeLightbox = document.querySelector('.lightbox-close');

    lightboxTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            lightbox.style.display = "block";
            lightboxImg.src = trigger.src;
        });
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = "none";
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
        }
    });

    // --- RSVP Form Logic ---
    const rsvpForm = document.getElementById('rsvp-form');
    const submitBtn = document.getElementById('submit-rsvp');
    
    // Show/hide guest count
    document.querySelectorAll('input[name="attendance"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('guest-count-group').style.display = e.target.value === 'Attending' ? 'block' : 'none';
        });
    });

    // Show/hide shipping address
    const favorRadios = document.querySelectorAll('input[name="wantsFavor"]');
    const shippingAddressGroup = document.getElementById('shipping-address-group');
    favorRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'Yes') {
                shippingAddressGroup.style.display = 'block';
                document.getElementById('shippingAddress').required = true;
            } else {
                shippingAddressGroup.style.display = 'none';
                document.getElementById('shippingAddress').required = false;
            }
        });
    });

    // --- Voice Recording Logic ---
    const recordBtn = document.getElementById('record-btn');
    const recordStatus = document.getElementById('record-status');
    const timerDisplay = document.getElementById('timer');
    const audioPlayback = document.getElementById('audio-playback');
    let mediaRecorder;
    let audioChunks = [];
    let audioAsBase64 = null;
    let timerInterval;
    let supportedMimeType = '';

    recordBtn.addEventListener('click', async () => {
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mimeTypes = ['audio/mp4', 'audio/webm', 'audio/aac', 'audio/ogg'];
                supportedMimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || '';
                
                mediaRecorder = new MediaRecorder(stream, { mimeType: supportedMimeType });
                audioChunks = [];
                audioAsBase64 = null;

                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstart = () => {
                    startTimer();
                    recordBtn.classList.add('recording');
                    recordBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg><span>หยุดบันทึก</span>';
                    recordStatus.style.display = 'flex';
                    audioPlayback.style.display = 'none';
                    audioPlayback.src = '';
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: supportedMimeType });
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = () => {
                        audioAsBase64 = reader.result;
                        audioPlayback.src = URL.createObjectURL(audioBlob);
                        audioPlayback.style.display = 'block';
                    };
                    
                    stream.getTracks().forEach(track => track.stop());
                    clearInterval(timerInterval);
                    recordBtn.classList.remove('recording');
                    recordBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg><span>บันทึกอีกครั้ง</span>';
                    recordStatus.style.display = 'none';
                };

                mediaRecorder.start();

            } catch (err) {
                console.error("Error accessing microphone:", err);
                showToast('ไม่สามารถเข้าถึงไมโครโฟนได้', 'error');
            }
        }
    });
    
    function startTimer() {
        let seconds = 0;
        timerDisplay.textContent = "00:00";
        timerInterval = setInterval(() => {
            seconds++;
            if (seconds >= 30) {
                if(mediaRecorder && mediaRecorder.state === "recording") mediaRecorder.stop();
                return;
            }
            const min = String(Math.floor(seconds / 60)).padStart(2, '0');
            const sec = String(seconds % 60).padStart(2, '0');
            timerDisplay.textContent = `${min}:${sec}`;
        }, 1000);
    }

    // --- Form Submission ---
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'กำลังส่ง...';
        submitBtn.disabled = true;

        const scriptURL = 'https://script.google.com/macros/s/AKfycbzllDZtsBJQ1lAZhxu-3LHOYOU-bK0lxLHajDs1GcBoZNokuS3K2KczMqd2-MC5pw/exec'; 
        
        const formData = new FormData(rsvpForm);
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        data.audioData = audioAsBase64;
        data.mimeType = supportedMimeType;

        fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(data),
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(() => {
            showToast('ขอบคุณที่ตอบกลับคำเชิญ!', 'success');
            rsvpForm.reset();
            document.getElementById('guest-count-group').style.display = 'none';
            document.getElementById('shipping-address-group').style.display = 'none';
            audioPlayback.style.display = 'none';
            audioPlayback.src = '';
            recordBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg><span>บันทึกเสียง</span>';
            audioAsBase64 = null;
        })
        .catch(error => {
            console.error('Fetch Error!', error);
            showToast('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง', 'error');
        })
        .finally(() => {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        });
    });

    // --- Toast Notification ---
    const toast = document.getElementById('toast');
    function showToast(message, type = 'success') {
        toast.innerText = message;
        toast.className = 'show';
        if (type === 'error') {
            toast.classList.add('error');
        }
        setTimeout(() => {
            toast.className = toast.className.replace('show', '').replace('error', '');
        }, 3000);
    }
});