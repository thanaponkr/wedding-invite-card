/**
 * Script for gift.html (Gift Page)
 * This version includes logic for preset amount buttons.
 */
document.addEventListener('DOMContentLoaded', function() {
    let slipAsBase64 = null;

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

    // --- Amount Buttons Logic ---
    const amountInput = document.getElementById('amount');
    const amountBtns = document.querySelectorAll('.amount-btn');
    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            amountBtns.forEach(b => b.classList.remove('active'));
            // Add active class to the clicked button
            btn.classList.add('active');
            // Set the input value
            amountInput.value = btn.dataset.amount;
        });
    });
    // If user types in the input, remove active class from buttons
    if(amountInput) {
        amountInput.addEventListener('input', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
        });
    }

    // --- Slip Upload Logic with Resizing ---
    const uploadSlipBtn = document.getElementById('upload-slip-btn');
    const slipInput = document.getElementById('slip-input');
    const slipFilenameDisplay = document.getElementById('slip-filename');
    if (uploadSlipBtn && slipInput && slipFilenameDisplay) {
        uploadSlipBtn.addEventListener('click', () => {
            slipInput.click();
        });
        slipInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;
            slipFilenameDisplay.textContent = `กำลังย่อขนาดไฟล์: ${file.name}`;
            const MAX_WIDTH = 1024;
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
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
    
    // --- Gift Form Submission Logic ---
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
                giftForm.reset();
                slipFilenameDisplay.textContent = '';
                slipAsBase64 = null;
                amountBtns.forEach(b => b.classList.remove('active'));
                setTimeout(() => { window.location.href = 'index.html#gift'; }, 2000);
                
                submitBtn.innerHTML = originalBtnHTML;
                submitBtn.disabled = false;
            });
        });
    }

    // --- Lightbox Logic for QR Code ---
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

        if(closeLightbox) {
            closeLightbox.addEventListener('click', function() {
                lightbox.style.display = "none";
            });
        }
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                lightbox.style.display = "none";
            }
        });
    }
});