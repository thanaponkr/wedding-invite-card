// Wait for the initial HTML document to be completely loaded and parsed
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
    
    // [MODIFIED] Store SVG icons in variables
    const micIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mic"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
    const stopIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`;


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
                    recordBtn.innerHTML = stopIconSVG; // Use stop icon
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
                    recordBtn.innerHTML = micIconSVG; // Use mic icon
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

    // === โค้ดที่เพิ่มเข้ามาใหม่สำหรับจัดการไฟล์สลิป ===
    let slipAsBase64 = null; 
    const uploadSlipBtn = document.getElementById('upload-slip-btn');
    const slipInput = document.getElementById('slip-input');
    const slipFilenameDisplay = document.getElementById('slip-filename');

    if (uploadSlipBtn) {
        uploadSlipBtn.addEventListener('click', () => {
            slipInput.click();
        });

        slipInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;

            slipFilenameDisplay.textContent = `ไฟล์: ${file.name}`;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                slipAsBase64 = reader.result;
                showToast('แนบไฟล์สลิปเรียบร้อยแล้ว', 'success');
            };
            reader.onerror = () => {
                showToast('ไม่สามารถอ่านไฟล์ได้', 'error');
                slipAsBase64 = null;
                slipFilenameDisplay.textContent = '';
            };
        });
    }
    // === จบส่วนที่เพิ่มเข้ามา ===

    // --- Form Submission ---
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const originalBtnHTML = submitBtn.innerHTML; 
        submitBtn.innerHTML = '<span>กำลังส่ง...</span>';
        submitBtn.disabled = true;

        // !!! URL ที่อัปเดตแล้ว !!!
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwv3OaRu56_f6sQ9dIRXmtk81uZBLC3E77q6ITDq7h5s_fwlaVg00K49FcEjviZBeFO/exec'; 
        
        const formData = new FormData(rsvpForm);
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        data.audioData = audioAsBase64;
        data.mimeType = supportedMimeType;
        data.slipData = slipAsBase64; // << เพิ่มข้อมูลสลิป

        fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(data),
            mode: 'no-cors', // สำคัญ: ใช้ no-cors สำหรับ Google Apps Script เพื่อลดข้อผิดพลาด CORS
            headers: { 'Content-Type': 'application/json' }
        })
        .then(() => {
            showToast('ขอบคุณที่ตอบกลับคำเชิญ!', 'success');
            rsvpForm.reset();
            document.getElementById('guest-count-group').style.display = 'none';
            document.getElementById('shipping-address-group').style.display = 'none';
            audioPlayback.style.display = 'none';
            audioPlayback.src = '';
            recordBtn.innerHTML = micIconSVG;
            audioAsBase64 = null;
            
            // รีเซ็ตข้อมูลสลิป
            slipAsBase64 = null;
            if(slipFilenameDisplay) slipFilenameDisplay.textContent = '';

        })
        .catch(error => {
            console.error('Fetch Error!', error);
            showToast('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง', 'error');
        })
        .finally(() => {
            submitBtn.innerHTML = originalBtnHTML; 
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