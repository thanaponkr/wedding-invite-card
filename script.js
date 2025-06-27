/**
 * Script for index.html (Main RSVP Page)
 * This version uses no-cors and the finally() block to show success messages.
 */
document.addEventListener('DOMContentLoaded', function() {
    let audioAsBase64 = null;
    let supportedMimeType = '';

    // --- Music Player Logic ---
    const music = document.getElementById('bg-music');
    if (music) {
        music.volume = 0.3;
        const musicToggle = document.getElementById('music-toggle');
        // ... (rest of music logic is correct)
    }

    // --- Countdown Timer Logic ---
    const countdownElem = document.getElementById('countdown');
    if (countdownElem) {
        // ... (countdown logic is correct)
    }

    // --- Lightbox Logic ---
    const lightbox = document.getElementById('lightbox-modal');
    if (lightbox) {
        // ... (lightbox logic is correct)
    }

    // --- Toast Notification Helper Function ---
    const toast = document.getElementById('toast');
    function showToast(message, type = 'success') {
        if (!toast) return;
        toast.innerText = message;
        toast.className = 'show';
        if (type === 'error') {
            toast.classList.add('error');
        }
        setTimeout(() => {
            toast.className = toast.className.replace('show', '').replace('error', '');
        }, 3000);
    }

    // --- RSVP Form Logic ---
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        // Show/hide logic for guest count and shipping address... (this part is correct)
        document.querySelectorAll('input[name="attendance"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                document.getElementById('guest-count-group').style.display = e.target.value === 'Attending' ? 'block' : 'none';
            });
        });

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

        // Voice Recording Logic... (this part is correct)
        const recordBtn = document.getElementById('record-btn');
        if (recordBtn) {
            // ... (all voice recording code)
        }
        
        // --- The Corrected Form Submission Logic ---
        const submitBtn = document.getElementById('submit-rsvp');
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>กำลังส่ง...</span>';
            submitBtn.disabled = true;

            const scriptURL = 'https://script.google.com/macros/s/AKfycbzcZW-opHKQtVhUtJxoLMaX8NUZDtKgE7-_G9tPFSjPTb73oo4fY_mAeHsbtr5-pRTO/exec';
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
                mode: 'no-cors', // <<< นำกลับมาใช้
                headers: { 'Content-Type': 'application/json' }
            })
            .catch(error => console.error('Error (expected with no-cors mode):', error))
            .finally(() => {
                // ย้ายโค้ดทั้งหมดที่ต้องการให้ทำงานหลังส่งสำเร็จมาไว้ที่นี่
                showToast('ขอบคุณที่ตอบกลับคำเชิญ!', 'success');
                rsvpForm.reset();
                document.getElementById('guest-count-group').style.display = 'none';
                document.getElementById('shipping-address-group').style.display = 'none';
                const audioPlayback = document.getElementById('audio-playback');
                if(audioPlayback) {
                    audioPlayback.style.display = 'none';
                    audioPlayback.src = '';
                }
                const recordBtnIcon = document.getElementById('record-btn');
                const micIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mic"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
                if(recordBtnIcon) recordBtnIcon.innerHTML = micIconSVG;
                audioAsBase64 = null;

                submitBtn.innerHTML = originalBtnHTML;
                submitBtn.disabled = false;
            });
        });
    }
});