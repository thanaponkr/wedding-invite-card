/**
 * Script for index.html (Main RSVP Page)
 * Handles music, countdown, lightbox, voice wishes, and RSVP form submission.
 * This version has been cleaned up and does not contain slip upload logic.
 * The fetch method has been corrected to handle CORS responses properly.
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Global variables for form data ---
    let audioAsBase64 = null;
    let supportedMimeType = '';

    // --- Music Player ---
    const music = document.getElementById('bg-music');
    if (music) {
        music.volume = 0.3;
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

        function startMusicOnFirstInteraction() {
            if (!hasInteracted) {
                hasInteracted = true;
                toggleMusic();
                // Remove listeners after first interaction
                document.body.removeEventListener('click', startMusicOnFirstInteraction);
                document.body.removeEventListener('touchstart', startMusicOnFirstInteraction);
            }
        }
        
        musicToggle.addEventListener('click', toggleMusic);
        document.body.addEventListener('click', startMusicOnFirstInteraction, { once: true });
        document.body.addEventListener('touchstart', startMusicOnFirstInteraction, { once: true });
    }

    // --- Countdown Timer ---
    const countdownElem = document.getElementById('countdown');
    if (countdownElem) {
        const weddingDate = new Date(2025, 6, 28, 9, 9, 0).getTime(); // Month is 0-indexed (6 = July)
        const countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                document.getElementById("countdown").innerHTML = "<h2>ถึงวันสำคัญแล้ว!</h2>";
                return;
            }

            document.getElementById("days").innerText = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
            document.getElementById("hours").innerText = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
            document.getElementById("minutes").innerText = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            document.getElementById("seconds").innerText = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
        }, 1000);
    }

    // --- Lightbox for Gallery and QR Code ---
    const lightbox = document.getElementById('lightbox-modal');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
        const closeLightbox = document.querySelector('.lightbox-close');

        lightboxTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                lightbox.style.display = "block";
                lightboxImg.src = this.src;
            });
        });

        closeLightbox.addEventListener('click', function() {
            lightbox.style.display = "none";
        });

        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                lightbox.style.display = "none";
            }
        });
    }

    // --- RSVP Form Logic ---
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        const submitBtn = document.getElementById('submit-rsvp');
        
        // Show/hide guest count based on attendance
        document.querySelectorAll('input[name="attendance"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                document.getElementById('guest-count-group').style.display = e.target.value === 'Attending' ? 'block' : 'none';
            });
        });

        // Show/hide shipping address based on favor request
        const favorRadios = document.querySelectorAll('input[name="wantsFavor"]');
        favorRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const shippingAddressGroup = document.getElementById('shipping-address-group');
                const shippingAddressInput = document.getElementById('shippingAddress');
                if (this.value === 'Yes') {
                    shippingAddressGroup.style.display = 'block';
                    shippingAddressInput.required = true;
                } else {
                    shippingAddressGroup.style.display = 'none';
                    shippingAddressInput.required = false;
                }
            });
        });

        // --- Voice Recording Logic ---
        const recordBtn = document.getElementById('record-btn');
        if (recordBtn) {
            const recordStatus = document.getElementById('record-status');
            const timerDisplay = document.getElementById('timer');
            const audioPlayback = document.getElementById('audio-playback');
            let mediaRecorder;
            let audioChunks = [];
            let timerInterval;
            
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

                        mediaRecorder.ondataavailable = event => { audioChunks.push(event.data); };
                        mediaRecorder.onstart = () => {
                            startTimer();
                            recordBtn.classList.add('recording');
                            recordBtn.innerHTML = stopIconSVG;
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
                            recordBtn.innerHTML = micIconSVG;
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
        }

        // --- Form Submission ---
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const originalBtnHTML = submitBtn.innerHTML; 
            submitBtn.innerHTML = '<span>กำลังส่ง...</span>';
            submitBtn.disabled = true;

            // !! สำคัญ: ตรวจสอบให้แน่ใจว่า URL นี้เป็นตัวล่าสุดที่คุณได้จากการ Deploy Apps Script !!
            const scriptURL = 'https://script.google.com/macros/s/AKfycbx4L0hyMii3jJmvF1_om-FTQ-JUrUP9_S9jgl4AKt0Wv5gT6TavS6VRkWHzjoYJ8_2S/exec'; 
            
            const formData = new FormData(rsvpForm);
            const data = {};
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }
            data.audioData = audioAsBase64;
            data.mimeType = supportedMimeType;
            // ไม่มี data.slipData ในฟอร์มนี้อีกต่อไป

            fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json()) // รอรับและแปลงการตอบกลับเป็น JSON
            .then(data => {
                console.log('Success:', data);
                if (data.result === 'success') {
                    showToast('ขอบคุณที่ตอบกลับคำเชิญ!', 'success');
                    rsvpForm.reset();
                    // Reset UI elements
                    document.getElementById('guest-count-group').style.display = 'none';
                    document.getElementById('shipping-address-group').style.display = 'none';
                    const audioPlayback = document.getElementById('audio-playback');
                    if(audioPlayback) {
                        audioPlayback.style.display = 'none';
                        audioPlayback.src = '';
                    }
                    const recordBtnIcon = document.getElementById('record-btn');
                    if(recordBtnIcon) recordBtnIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mic"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
                    audioAsBase64 = null;
                } else {
                    throw new Error(data.error || 'Unknown server error');
                }
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
    }

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