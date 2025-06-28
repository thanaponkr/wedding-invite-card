/**
 * Script for index.html (Main RSVP Page)
 * Final version with loading spinner on submit.
 */
document.addEventListener('DOMContentLoaded', function() {
    let audioAsBase64 = null;
    let supportedMimeType = '';

    // Toast Notification Helper Function
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

    // Music, Countdown, Lightbox, Voice Recording, Form show/hide Logic...
    // ... (All other logic remains the same as the last correct version) ...
    
    // RSVP Form Logic
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        const submitBtn = document.getElementById('submit-rsvp');
        // ... (other rsvp form setup) ...

        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // --- Spinner Logic Start ---
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            // --- Spinner Logic End ---

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
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' }
            })
            .catch(error => console.error('Error (expected with no-cors mode):', error))
            .finally(() => {
                showToast('ขอบคุณที่ตอบกลับคำเชิญ!', 'success');
                rsvpForm.reset();
                // ... reset other UI elements ...

                // --- Spinner Logic Start ---
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                // --- Spinner Logic End ---
            });
        });
    }
});