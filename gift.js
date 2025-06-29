/**
 * Script for gift.html (Gift Page)
 * This version corrects the ID for the copy button functionality.
 */
document.addEventListener('DOMContentLoaded', function() {
    let slipAsBase64 = null;

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

    // Lightbox Logic for QR Code
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

    // === ส่วนที่แก้ไข: เปลี่ยน ID เป็น copy-text-btn ===
    const copyBtn = document.getElementById('copy-text-btn'); 
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const accountNumber = document.querySelector('.account-number').innerText;
            navigator.clipboard.writeText(accountNumber)
                .then(() => showToast('คัดลอกเลขบัญชีแล้ว!'))
                .catch(() => showToast('เกิดข้อผิดพลาดในการคัดลอก', 'error'));
        });
    }
    // === จบส่วนที่แก้ไข ===

    // Amount Buttons Logic
    const amountInput = document.getElementById('amount');
    const amountBtns = document.querySelectorAll('.amount-btn');
    if (amountInput && amountBtns.length > 0) {
        amountBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                amountBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                amountInput.value = btn.dataset.amount;
            });
        });
        amountInput.addEventListener('input', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
        });
    }

    // Slip Upload Logic with Resizing
    const slipInput = document.getElementById('slip-input');
    const dropZoneElement = document.querySelector(".drop-zone");
    const previewContainer = document.querySelector(".drop-zone__preview-container");
    if (slipInput && dropZoneElement && previewContainer) {
        const updatePreview = (file) => {
            if (!file) {
                previewContainer.style.display = "none";
                dropZoneElement.style.display = "flex";
                return;
            }
            previewContainer.style.display = "block";
            dropZoneElement.style.display = "none";
            previewContainer.innerHTML = `<img src="" class="drop-zone__thumb"><div class="drop-zone__filename">${file.name}</div><button type="button" class="drop-zone__remove-btn">×</button>`;
            const thumbElement = previewContainer.querySelector(".drop-zone__thumb");
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
                    showToast('แนบไฟล์และย่อขนาดสำเร็จ', 'success');
                };
            };
            previewContainer.querySelector(".drop-zone__remove-btn").addEventListener("click", () => {
                slipInput.value = null;
                slipAsBase64 = null;
                updatePreview(null);
            });
        };
        dropZoneElement.addEventListener("dragover", e => {
            e.preventDefault();
            dropZoneElement.classList.add("is-dragover");
        });
        ["dragleave", "dragend"].forEach(type => {
            dropZoneElement.addEventListener(type, e => dropZoneElement.classList.remove("is-dragover"));
        });
        dropZoneElement.addEventListener("drop", e => {
            e.preventDefault();
            if (e.dataTransfer.files.length) {
                slipInput.files = e.dataTransfer.files;
                updatePreview(e.dataTransfer.files[0]);
            }
            dropZoneElement.classList.remove("is-dragover");
        });
        slipInput.addEventListener("change", e => {
            if (slipInput.files.length) {
                updatePreview(slipInput.files[0]);
            }
        });
    }
    
    // Gift Form Submission Logic
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
            const scriptURL = 'YOUR_APPS_SCRIPT_URL_HERE'; // <-- สำคัญ: ใส่ URL ล่าสุดของคุณที่นี่
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
                if(previewContainer) previewContainer.style.display = "none";
                if(dropZoneElement) dropZoneElement.style.display = "flex";
                slipAsBase64 = null;
                if(amountBtns) amountBtns.forEach(b => b.classList.remove('active'));
                setTimeout(() => { window.location.href = 'index.html#gift'; }, 2000);
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            });
        });
    }
});