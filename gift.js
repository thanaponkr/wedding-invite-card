document.addEventListener('DOMContentLoaded', function() {
    let slipAsBase64 = null;

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
            closeLightbox.addEventListener('click', () => lightbox.style.display = "none");
        }
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.style.display = "none";
        });
    }

    const copyBtn = document.getElementById('copy-text-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const accountNumber = document.querySelector('.account-number').innerText;
            navigator.clipboard.writeText(accountNumber)
                .then(() => showToast('คัดลอกเลขบัญชีแล้ว!'))
                .catch(() => showToast('เกิดข้อผิดพลาดในการคัดลอก', 'error'));
        });
    }

    // SLIP UPLOAD LOGIC WITH NEW BUTTON AND PREVIEW
    const slipInput = document.getElementById('slip-input');
    const uploadButton = document.getElementById('slip-upload-button');
    const previewContainer = document.querySelector('.slip-preview-container');

    function updateSlipPreview(file) {
        if (!file) {
            previewContainer.innerHTML = '';
            previewContainer.style.display = 'none';
            if (uploadButton) uploadButton.style.display = 'flex';
            return;
        }

        previewContainer.style.display = 'block';
        if (uploadButton) uploadButton.style.display = 'none';
        
        previewContainer.innerHTML = `
            <img src="" class="slip-preview-thumb" alt="ตัวอย่างสลิป">
            <button type="button" class="slip-remove-btn">×</button>
        `;
        const thumbElement = previewContainer.querySelector(".slip-preview-thumb");

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            thumbElement.src = reader.result;
            
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                const MAX_WIDTH = 1024;
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                slipAsBase64 = canvas.toDataURL('image/jpeg', 0.8);
                showToast('แนบสลิปเรียบร้อยแล้ว', 'success');
            };
            img.onerror = () => {
                showToast('ไม่สามารถอ่านไฟล์รูปภาพได้', 'error');
                updateSlipPreview(null);
            };
        };
        
        previewContainer.querySelector(".slip-remove-btn").addEventListener("click", () => {
            slipInput.value = null; 
            slipAsBase64 = null;
            updateSlipPreview(null);
        });
    }

    if (uploadButton) {
        uploadButton.addEventListener('click', () => {
            slipInput.click();
        });
    }
    
    if(slipInput){
        slipInput.addEventListener("change", () => {
            if (slipInput.files.length) {
                updateSlipPreview(slipInput.files[0]);
            }
        });
    }
    
    const giftForm = document.getElementById('gift-form');
    if (giftForm) {
        const submitBtn = document.getElementById('submit-gift');
        giftForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!slipAsBase64) {
                showToast('กรุณาแนบไฟล์สลิป', 'error');
                return;
            }
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            const scriptURL = 'https://script.google.com/macros/s/AKfycbzcZW-opHKQtVhUtJxoLMaX8NUZDtKgE7-_G9tPFSjPTb73oo4fY_mAeHsbtr5-pRTO/exec'; // <-- สำคัญ: ใส่ URL ล่าสุดของคุณที่นี่
            
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
                updateSlipPreview(null);
                slipAsBase64 = null;
                setTimeout(() => { window.location.href = 'index.html#gift'; }, 2000);
                
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            });
        });
    }
});