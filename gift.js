document.addEventListener('DOMContentLoaded', function() {
    
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

    // --- Copy Button ---
    const copyBtn = document.getElementById('copy-btn');
    if(copyBtn) {
        copyBtn.addEventListener('click', () => {
            const accountNumber = document.querySelector('.account-number').innerText;
            navigator.clipboard.writeText(accountNumber)
                .then(() => showToast('คัดลอกเลขบัญชีแล้ว!'))
                .catch(() => showToast('เกิดข้อผิดพลาด', 'error'));
        });
    }

    // --- SLIP UPLOAD LOGIC WITH IMAGE RESIZING ---
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
            };
            reader.readAsDataURL(file);
        });
    }

    // --- Form Submission ---
    const giftForm = document.getElementById('gift-form');
    const submitBtn = document.getElementById('submit-gift');

    if(giftForm) {
        giftForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!slipAsBase64) {
                showToast('กรุณาแนบไฟล์สลิป', 'error');
                return;
            }

            const originalBtnHTML = submitBtn.innerHTML; 
            submitBtn.innerHTML = '<span>กำลังส่ง...</span>';
            submitBtn.disabled = true;

            const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_URL'; // <-- เราจะต้องใส่ URL ใหม่ตรงนี้
            
            const formData = new FormData(giftForm);
            const data = {};
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }
            data.slipData = slipAsBase64;
            data.formType = 'gift'; // ระบุประเภทของฟอร์มที่ส่ง

            fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify(data),
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(() => {
                showToast('ส่งข้อมูลของขวัญสำเร็จ ขอบคุณครับ/ค่ะ!', 'success');
                giftForm.reset();
                slipFilenameDisplay.textContent = '';
                slipAsBase64 = null;
                // หลังจากส่งสำเร็จ อาจจะพาผู้ใช้กลับไปหน้าแรก
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
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