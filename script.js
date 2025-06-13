document.addEventListener('DOMContentLoaded', function() {

    // --- Countdown Timer ---
    // หมายเหตุ: เดือนใน JavaScript เริ่มจาก 0 (มกราคม) ดังนั้น กรกฎาคม คือเดือนที่ 6
    const weddingDate = new Date(2025, 6, 28, 9, 9, 0).getTime();

    const countdownFunction = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = String(days).padStart(2, '0');
        document.getElementById("hours").innerText = String(hours).padStart(2, '0');
        document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
        document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');

        if (distance < 0) {
            clearInterval(countdownFunction);
            document.getElementById("countdown").innerHTML = "<h2>The Wedding Day is Here!</h2>";
        }
    }, 1000);

    // --- Copy Gift Account Number ---
    const copyBtn = document.getElementById('copy-btn');
    const giftAccount = document.querySelector('.account-number');
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(giftAccount.innerText).then(() => {
            copyBtn.innerText = 'คัดลอกแล้ว!';
            setTimeout(() => {
                copyBtn.innerText = 'คัดลอกเลขบัญชี';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showToast('ไม่สามารถคัดลอกได้', 'error');
        });
    });

    // --- RSVP Form Handling ---
    const rsvpForm = document.getElementById('rsvp-form');
    const submitBtn = document.getElementById('submit-rsvp');
    const toast = document.getElementById('toast');
    
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const guestCountGroup = document.getElementById('guest-count-group');
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'Attending') {
                guestCountGroup.style.display = 'block';
            } else {
                guestCountGroup.style.display = 'none';
            }
        });
    });

    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault(); 

        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'กำลังส่ง...';
        submitBtn.disabled = true;

        // อัปเดตเป็น URL ใหม่ของคุณแล้ว
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwvoqj7g4-8Lr68w-EI-XlBiKGbT0zyr5VdMVFFitrSdlWv6HNyjsDg9jG1cKNId5XL/exec';
        
        const formData = new FormData(rsvpForm);

        fetch(scriptURL, { 
            method: 'POST', 
            body: formData,
            mode: 'no-cors' 
        })
        .then(response => {
            console.log('Success! (Opaque response)');
            showToast('ขอบคุณที่ตอบกลับคำเชิญ!', 'success');
            rsvpForm.reset(); 
            guestCountGroup.style.display = 'none';
        })
        .catch(error => {
            console.error('Error!', error.message);
            showToast('เกิดข้อผิดพลาด กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต', 'error');
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
        if(type === 'error') {
            toast.classList.add('error');
        }

        setTimeout(function(){ 
            toast.className = toast.className.replace('show', ''); 
            toast.classList.remove('error');
        }, 3000);
    }
});
