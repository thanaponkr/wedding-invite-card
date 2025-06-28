/**
 * Script for gift.html (Gift Page)
 * Final version with loading spinner on submit.
 */
document.addEventListener('DOMContentLoaded', function() {
    let slipAsBase64 = null;
    // ... (other setup logic for toast, copy, amount buttons, slip upload, etc. is correct) ...

    const giftForm = document.getElementById('gift-form');
    if (giftForm) {
        const submitBtn = document.getElementById('submit-gift');
        
        giftForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!slipAsBase64) {
                showToast('กรุณาแนบไฟล์สลิป', 'error');
                return;
            }
            
            // --- Spinner Logic Start ---
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            // --- Spinner Logic End ---

const scriptURL = 'https://script.google.com/macros/s/AKfycbzcZW-opHKQtVhUtJxoLMaX8NUZDtKgE7-_G9tPFSjPTb73oo4fY_mAeHsbtr5-pRTO/exec';

            const formData = new FormData(giftForm);
            const data = {};
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }
            data.slipData = slipAsBase64;
            data.formType = 'gift';

            fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify(data),
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' }
            })
            .catch(error => console.error('Error (expected with no-cors mode):', error))
            .finally(() => {
                showToast('ส่งข้อมูลของขวัญสำเร็จ ขอบคุณครับ/ค่ะ!', 'success');
                // ... reset other UI elements ...
                setTimeout(() => { window.location.href = 'index.html#gift'; }, 2000);
                
                // --- Spinner Logic Start ---
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                // --- Spinner Logic End ---
            });
        });
    }
});