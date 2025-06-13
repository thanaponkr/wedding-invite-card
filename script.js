document.addEventListener('DOMContentLoaded', function() {

    // --- Countdown Timer ---
    // TODO: ตั้งค่าวันแต่งงานของคุณ (Year, Month (0-11), Day, Hour, Minute, Second)
    const weddingDate = new Date(2025, 10, 22, 9, 9, 0).getTime();

    const countdownFunction = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        // Calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the elements
        document.getElementById("days").innerText = String(days).padStart(2, '0');
        document.getElementById("hours").innerText = String(hours).padStart(2, '0');
        document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
        document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');

        // If the countdown is over, write some text 
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
            copyBtn.innerText = 'Copied!';
            setTimeout(() => {
                copyBtn.innerText = 'Copy Account Number';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });

    // --- RSVP Form Handling ---
    const rsvpForm = document.getElementById('rsvp-form');
    const submitBtn = document.getElementById('submit-rsvp');
    const toast = document.getElementById('toast');
    
    // Show/hide guest count based on attendance
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
        e.preventDefault(); // Prevent default form submission

        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Submitting...';
        submitBtn.disabled = true;

        // The URL for your Google Apps Script Web App
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxX20hHm-7FwtkH1bQfaI_8PvSSTnA5RO1Bdo586LPkxxNQESlmwg4oIRNG3oGluhN-/exec';
        
        const formData = new FormData(rsvpForm);

        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => {
                console.log('Success!', response);
                showToast('ขอบคุณที่ตอบกลับ lờiเชิญ!', 'success');
                rsvpForm.reset(); // Reset form fields
                guestCountGroup.style.display = 'none';
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
        if(type === 'error') {
            toast.classList.add('error');
        }

        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ 
            toast.className = toast.className.replace('show', ''); 
            toast.classList.remove('error');
        }, 3000);
    }
});
