document.addEventListener('DOMContentLoaded', function() {
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

    // --- RSVP Form and Voice Recording ---
    const rsvpForm = document.getElementById('rsvp-form');
    const submitBtn = document.getElementById('submit-rsvp');
    const toast = document.getElementById('toast');
    
    // Voice recording elements
    const recordBtn = document.getElementById('record-btn');
    const recordStatus = document.getElementById('record-status');
    const timerDisplay = document.getElementById('timer');
    const audioPlayback = document.getElementById('audio-playback');
    let mediaRecorder;
    let audioChunks = [];
    let audioAsBase64 = null;
    let timerInterval;

    // Show/hide guest count
    document.querySelectorAll('input[name="attendance"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('guest-count-group').style.display = e.target.value === 'Attending' ? 'block' : 'none';
        });
    });

    // Handle recording button click
    recordBtn.addEventListener('click', async () => {
        if (mediaRecorder && mediaRecorder.state === "recording") {
            // Stop recording
            mediaRecorder.stop();
        } else {
            // Start recording
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = []; // Reset chunks
                audioAsBase64 = null; // Reset previous recording

                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstart = () => {
                    startTimer();
                    recordBtn.classList.add('recording');
                    recordBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg><span>หยุดบันทึก</span>';
                    recordStatus.style.display = 'flex';
                    audioPlayback.style.display = 'none';
                };

                mediaRecorder.onstop = () => {
                    // --- จุดที่แก้ไข ---
                    // ไม่ต้องระบุ type ให้เบราว์เซอร์จัดการเองเพื่อความเข้ากันได้สูงสุด
                    const audioBlob = new Blob(audioChunks); 
                    
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = () => {
                        audioAsBase64 = reader.result;
                        audioPlayback.src = URL.createObjectURL(audioBlob);
                        audioPlayback.style.display = 'block';
                    };
                    
                    stream.getTracks().forEach(track => track.stop()); // Stop mic access
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
            if (seconds >= 30) { // จำกัดเวลาอัดเสียง 30 วินาที
                mediaRecorder.stop();
                return;
            }
            const min = String(Math.floor(seconds / 60)).padStart(2, '0');
            const sec = String(seconds % 60).padStart(2, '0');
            timerDisplay.textContent = `${min}:${sec}`;
        }, 1000);
    }

    // Handle form submission
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'กำลังส่ง...';
        submitBtn.disabled = true;

        // !!! IMPORTANT !!!
        // PASTE YOUR NEW WEB APP URL FROM GOOGLE APPS SCRIPT HERE
        const scriptURL = '!!!วาง_WEB_APP_URL_ใหม่ของคุณที่นี่!!!'; 
        
        const formData = new FormData(rsvpForm);
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        data.audioData = audioAsBase64;

        fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            }
        })
        .then(res => res.json())
        .then(response => {
            if (response.result === 'success') {
                showToast('ขอบคุณที่ตอบกลับคำเชิญ!', 'success');
                rsvpForm.reset();
                document.getElementById('guest-count-group').style.display = 'none';
                audioPlayback.style.display = 'none';
                recordBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg><span>บันทึกเสียง</span>';
                audioAsBase64 = null;
            } else {
                throw new Error(response.error || 'Unknown error from script');
            }
        })
        .catch(error => {
            console.error('Error!', error.message);
            showToast('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง', 'error');
        })
        .finally(() => {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        });
    });

    // Function to show toast notification
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
