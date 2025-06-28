/**
 * Script for index.html (Main RSVP Page)
 * This version includes conditional display logic for the wedding favor section.
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Global variables for form data ---
    let audioAsBase64 = null;
    let supportedMimeType = '';

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

    // --- Music Player Logic ---
    const music = document.getElementById('bg-music');
    if (music) {
        music.volume = 0.3;
        const musicToggle = document.getElementById('music-toggle');
        const playIcon = musicToggle.querySelector('.icon-play');
        const pauseIcon = musicToggle.querySelector('.icon-pause');
        let hasInteracted = false;

        const toggleMusic = () => {
            if (music.paused) {
                music.play().catch(e => console.error("Audio play failed:", e));
                musicToggle.classList.add('playing');
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                music.pause();
                musicToggle.classList.remove('playing');
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        };

        const startMusicOnFirstInteraction = () => {
            if (!hasInteracted) {
                hasInteracted = true;
                toggleMusic();
                document.body.removeEventListener('click', startMusicOnFirstInteraction);
                document.body.removeEventListener('touchstart', startMusicOnFirstInteraction);
            }
        };
        
        musicToggle.addEventListener('click', toggleMusic);
        document.body.addEventListener('click', startMusicOnFirstInteraction, { once: true });
        document.body.addEventListener('touchstart', startMusicOnFirstInteraction, { once: true });
    }

    // --- Countdown Timer Logic ---
    const countdownElem = document.getElementById('countdown');
    if (countdownElem) {
        const weddingDate = new Date(2025, 6, 28, 9, 9, 0).getTime();
        const countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                document.getElementById("countdown").innerHTML = "<h2>ถึงวันสำคัญแล้ว!</h2>";
                return;
            }
            const daysElem = document.getElementById("days");
            const hoursElem = document.getElementById("hours");
            const minutesElem = document.getElementById("minutes");
            const secondsElem = document.getElementById("seconds");

            if(daysElem) daysElem.innerText = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
            if(hoursElem) hoursElem.innerText = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
            if(minutesElem) minutesElem.innerText = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            if(secondsElem) secondsElem.innerText = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
        }, 1000);
    }

    // --- Lightbox Logic ---
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

    // --- Voice Recording Logic ---
    const recordBtn = document.getElementById('record-btn');
    if (recordBtn) {
        // ... (โค้ดส่วนนี้เหมือนเดิมทุกประการ)
    }

    // --- RSVP Form Logic ---
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        const submitBtn = document.getElementById('submit-rsvp');
        const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
        const guestCountGroup = document.getElementById('guest-count-group');
        const favorSection = document.getElementById('favor-section'); // <-- ตัวแปรใหม่
        const favorRadios = document.querySelectorAll('input[name="wantsFavor"]');
        const shippingAddressGroup = document.getElementById('shipping-address-group');

        // --- ส่วนที่แก้ไข: การซ่อน/แสดงผลแบบมีเงื่อนไข ---
        attendanceRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'Attending') {
                    guestCountGroup.style.display = 'block';
                    favorSection.classList.remove('show'); // ซ่อนส่วนของที่ระลึก
                } else if (e.target.value === 'Not Attending') {
                    guestCountGroup.style.display = 'none';
                    favorSection.classList.add('show'); // แสดงส่วนของที่ระลึก
                }
            });
        });

        favorRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'Yes') {
                    shippingAddressGroup.style.display = 'block';
                    document.getElementById('shippingAddress').required = true;
                } else {
                    shippingAddressGroup.style.display = 'none';
                    document.getElementById('shippingAddress').required = false;
                }
            });
        });
        
        // --- Form Submission Logic (เหมือนเดิม) ---
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // ... (โค้ดส่วนนี้เหมือนเดิมทุกประการ)
        });
    }
});