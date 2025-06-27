/**
 * Script for gift.html (Gift & Slip Submission Page)
 * Handles slip resizing, form validation, and submission via fetch.
 * The fetch method is corrected to handle CORS responses properly.
 */
document.addEventListener('DOMContentLoaded', function() {

    let slipAsBase64 = null; // Variable to store the resized slip image data

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

    // --- Copy Button Logic ---
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const accountNumber = document.querySelector('.account-number').innerText;
            navigator.clipboard.writeText(accountNumber)
                .then(() => showToast('คัดลอกเลขบัญชีแล้ว!'))
                .catch(() => showToast('เกิดข้อผิดพลาดในการคัดลอก', 'error'));
        });
    }

    // --- SLIP UPLOAD LOGIC WITH IMAGE RESIZING ---
    const uploadSlipBtn = document.getElementById('upload-slip-btn');
    const slipInput = document.getElementById('slip-input');
    const slipFilenameDisplay = document.getElementById('slip-filename');

    if (uploadSlipBtn && slipInput && slipFilenameDisplay) {
        uploadSlipBtn.addEventListener('click', () => {
            slipInput.click(); // Trigger the hidden file input
        });

        slipInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;

            slipFilenameDisplay.textContent = `กำลังย่อขนาดไฟล์: ${file.name}`;

            // Image Resizing Logic
            const MAX_WIDTH = 1024; // Max width for the resized image
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;
                    
                    // Calculate new dimensions while maintaining aspect ratio
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert the resized image to a Base64 string (JPEG format at 80% quality)
                    slipAsBase64 = canvas.toDataURL('image/jpeg', 0.8);
                    
                    slipFilenameDisplay.textContent = `แนบไฟล์: ${file.name} (ย่อขนาดแล้ว)`;
                    showToast('แนบไฟล์สลิปเรียบร้อยแล้ว', 'success');
                };
                 img.onerror = () => {
                    showToast('ไม่สามารถอ่านไฟล์รูปภาพได้', 'error');
                    slipFilenameDisplay.textContent = '';
                };
            };
            
            reader.readAsDataURL(file);
        });
    }

    // --- Gift Form Submission ---
    const giftForm = document.getElementById('gift-form');
    if (giftForm) {
        const submitBtn = document.getElementById('submit-gift');

        giftForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!slipAsBase64) {
                showToast('กรุณาแนบไฟล์สลิป', 'error');
                return;
            }

            const originalBtnHTML = submitBtn.innerHTML; 
            submitBtn.innerHTML = '<span>กำลังส่ง...</span>';
            submitBtn.disabled = true;

            // !! สำคัญ: ตรวจสอบให้แน่ใจว่า URL นี้เป็นตัวล่าสุดที่คุณได้จากการ Deploy Apps Script !!
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwR3iak2aB2irb2SckEZt_8P0iSrm3w6uzJhkQLEAEweY-UvC4qQ8GC6liqAKyzM44V/exec'; 
            
            const formData = new FormData(giftForm);
            const data = {};
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }
            data.slipData = slipAsBase64;
            data.formType = 'gift'; // Identifier for the backend

            fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
                // No more 'mode: no-cors'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok, status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.result === 'success') {
                    showToast('ส่งข้อมูลของขวัญสำเร็จ ขอบคุณครับ/ค่ะ!', 'success');
                    giftForm.reset();
                    slipFilenameDisplay.textContent = '';
                    slipAsBase64 = null;
                    // Redirect back to the main page after 2 seconds
                    setTimeout(() => {
                        window.location.href = 'index.html#gift';
                    }, 2000);
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
});