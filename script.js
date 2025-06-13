// script.js

// --- Countdown Timer ---
const weddingDate = new Date('2025-07-28T00:00:00'); // July 28, 2025
const countdownElements = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
};

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate.getTime() - now;

    if (distance < 0) {
        clearInterval(countdownInterval);
        for (const key in countdownElements) {
            countdownElements[key].innerHTML = '0';
        }
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElements.days.innerHTML = days;
    countdownElements.hours.innerHTML = hours;
    countdownElements.minutes.innerHTML = minutes;
    countdownElements.seconds.innerHTML = seconds;
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call to display countdown immediately


// --- Smooth Scrolling for Navigation ---
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Update active state in nav bar
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.remove('active');
        });
        // A more robust way to set active state based on current scroll position
        // This is simplified for inline onclick. For a more precise solution,
        // use Intersection Observer for navigation highlighting as well.
        const activeButton = document.querySelector(`.nav-button[onclick*="${id}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
}
window.scrollToSection = scrollToSection; // Make it globally accessible for inline onclick


// --- Calendar Event Download (ICS) ---
document.getElementById('addToCalendarBtn').addEventListener('click', function() {
    const title = 'งานแต่งงานของเมย์และเต้ย';
    const description = 'ขอเชิญร่วมเป็นเกียรติในวันวิวาห์ของเมย์และเต้ย';
    const location = 'อาปาเก้ การ์เด้น';
    const start = '20250728T090000'; // YYYYMMDDTHHMMSS (e.g., 9:00 AM)
    const end = '20250728T140000';   // YYYYMMDDTHHMMSS (e.g., 2:00 PM)

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MayAndToeyWedding//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${new Date().getTime()}@weddinginvite.com
DTSTAMP:${new Date().toISOString().replace(/[-:]|\.\d{3}/g, '')}Z
DTSTART:${start}
DTEND:${end}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding_invite_may_toey.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showPopup('แจ้งเตือนถูกเพิ่มไปยังปฏิทินแล้วค่ะ/ครับ!', 3000);
});

// --- Gallery Logic ---
// โปรดเปลี่ยนพาธรูปภาพในแกลเลอรี่ให้เป็นรูปภาพจริงของคุณ
const galleryImages = [
    "./images/gallery-photo-1.jpg", // ตัวอย่าง: รูปภาพคู่บ่าวสาว 1 (อ้างอิงจาก ss04.jpg)
    "./images/gallery-photo-2.jpg", // ตัวอย่าง: รูปภาพคู่บ่าวสาว 2 (อ้างอิงจาก ss06.jpg)
    "./images/gallery-photo-3.jpg", // ตัวอย่าง: รูปภาพคู่บ่าวสาว 3 (อ้างอิงจาก ss05.jpg หรือรูปอื่น)
    "./images/gallery-photo-4.jpg", // ตัวอย่าง: รูปภาพคู่บ่าวสาว 4
    "./images/gallery-photo-5.jpg", // ตัวอย่าง: รูปภาพคู่บ่าวสาว 5
    "./images/gallery-photo-6.jpg", // ตัวอย่าง: รูปภาพคู่บ่าวสาว 6
];
let currentGalleryIndex = 0;
const galleryImage = document.getElementById('galleryImage');
const prevImageBtn = document.getElementById('prevImageBtn');
const nextImageBtn = document.getElementById('nextImageBtn');
const galleryDotsContainer = document.getElementById('galleryDots');

function updateGallery() {
    galleryImage.src = galleryImages[currentGalleryIndex];
    updateGalleryDots();
}

function updateGalleryDots() {
    galleryDotsContainer.innerHTML = ''; // Clear existing dots
    galleryImages.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('rounded-full', 'bg-light-grey', 'transition-all', 'duration-300'); // Use custom light-grey
        if (index === currentGalleryIndex) {
            dot.classList.add('w-3', 'h-3', 'bg-gold-accent'); // Active dot color (using custom gold-accent)
        } else {
            dot.classList.add('w-2', 'h-2', 'hover:bg-gold-light'); // Inactive dot color
        }
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => {
            currentGalleryIndex = index;
            updateGallery();
        });
        galleryDotsContainer.appendChild(dot);
    });
}

prevImageBtn.addEventListener('click', () => {
    currentGalleryIndex = (currentGalleryIndex === 0) ? galleryImages.length - 1 : currentGalleryIndex - 1;
    updateGallery();
});

nextImageBtn.addEventListener('click', () => {
    currentGalleryIndex = (currentGalleryIndex === galleryImages.length - 1) ? 0 : currentGalleryIndex + 1;
    updateGallery();
});

// Touch swipe for gallery
let touchStartX = 0;
galleryImage.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});
galleryImage.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    if (deltaX > 50) { // Swipe right
        currentGalleryIndex = (currentGalleryIndex === 0) ? galleryImages.length - 1 : currentGalleryIndex - 1;
        updateGallery();
    } else if (deltaX < -50) { // Swipe left
        currentGalleryIndex = (currentGalleryIndex === galleryImages.length - 1) ? 0 : currentGalleryIndex + 1;
        updateGallery();
    }
});

updateGallery(); // Initialize gallery


// --- Google App Script Submission (RSVP & Gift) ---
const appScriptUrl = "https://script.google.com/macros/s/AKfycbxX20hHm-7FwtkH1bQfaI_8PvSSTnA5RO1Bdo586LPxXxNQESlmwg4oIRNG3oGluhN-/exec"; // URL จากคุณ

async function submitForm(formData, formType) {
    try {
        const payload = {
            type: formType,
            ...formData,
            timestamp: new Date().toISOString()
        };

        const response = await fetch(appScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            redirect: 'follow',
            mode: 'no-cors' // Use 'no-cors' to avoid CORS issues in the browser
        });

        // Since using 'no-cors', the response will be opaque. We can't read the response.
        // Assume success and show popup.
        showPopup('ขอบคุณค่ะ/ครับ ข้อมูลของคุณถูกส่งแล้ว!');

        // Clear form
        if (formType === 'rsvp') {
            document.getElementById('rsvpForm').reset();
            document.getElementById('guestsField').classList.add('hidden'); // Hide guest count field
        } else if (formType === 'gift') {
            document.getElementById('giftForm').reset();
        }

    } catch (error) {
        console.error("Error submitting form:", error);
        showPopup('ขออภัยค่ะ/ครับ เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองอีกครั้ง');
    }
}

// --- RSVP Form Logic ---
const rsvpForm = document.getElementById('rsvpForm');
const attendingSelect = document.getElementById('attending');
const guestsField = document.getElementById('guestsField');

attendingSelect.addEventListener('change', function() {
    if (this.value === 'สะดวกมา') {
        guestsField.classList.remove('hidden');
    } else {
        guestsField.classList.add('hidden');
    }
});

rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        name: document.getElementById('rsvpName').value,
        attending: attendingSelect.value,
        guests: attendingSelect.value === 'สะดวกมา' ? document.getElementById('guests').value : 0,
        message: document.getElementById('message').value
    };
    submitForm(formData, 'rsvp');
});

// --- Gift Form Logic ---
const giftForm = document.getElementById('giftForm');
giftForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        amount: document.getElementById('giftAmount').value,
        date: document.getElementById('giftDate').value,
        time: document.getElementById('giftTime').value,
        address: document.getElementById('giftAddress').value
    };
    submitForm(formData, 'gift');
});

// --- Popup Message Logic ---
const popupOverlay = document.getElementById('popupOverlay');
const popupMessageElem = document.getElementById('popupMessage');
const popupCloseBtn = document.getElementById('popupCloseBtn');
const popupConfirmBtn = document.getElementById('popupConfirmBtn');
let popupTimeout;

function showPopup(message, duration = 3000) {
    popupMessageElem.textContent = message;
    popupOverlay.classList.remove('hidden');
    clearTimeout(popupTimeout); // Clear any existing timeout
    popupTimeout = setTimeout(() => {
        hidePopup();
    }, duration);
}

function hidePopup() {
    popupOverlay.classList.add('hidden');
}

popupCloseBtn.addEventListener('click', hidePopup);
popupConfirmBtn.addEventListener('click', hidePopup);


// --- Copy to Clipboard Function ---
document.getElementById('copyAccountBtn').addEventListener('click', function() {
    const accountNumber = document.getElementById('accountNumber').textContent;
    const textarea = document.createElement('textarea');
    textarea.value = accountNumber;
    textarea.style.position = 'fixed';
    textarea.style.opacity = 0;
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'คัดลอกสำเร็จ!' : 'คัดลอกไม่สำเร็จ';
        showPopup(msg, 3000);
    } catch (err) {
        console.error('Failed to copy text', err);
        showPopup('คัดลอกไม่สำเร็จ', 3000);
    }
    document.body.removeChild(textarea);
});

// --- Intersection Observer for Fade-in Sections ---
const fadeSections = document.querySelectorAll('.fade-in-section');

const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.1 // 10% of the section is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Stop observing once visible
        }
    });
}, observerOptions);

fadeSections.forEach(section => {
    observer.observe(section);
});

// Initial check for sections already in view on load
window.addEventListener('load', () => {
    fadeSections.forEach(section => {
        if (section.getBoundingClientRect().top < window.innerHeight) {
            section.classList.add('is-visible');
        }
    });
});

// --- Background Music Logic ---
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggleBtn = document.getElementById('musicToggleBtn');
let isPlaying = false; // Track music state

// Check if music was playing from previous session (optional, for persistent state)
// let savedMusicState = localStorage.getItem('backgroundMusicPlaying');
// if (savedMusicState === 'true') {
//     backgroundMusic.play().catch(e => console.error("Auto-play blocked:", e));
//     isPlaying = true;
//     musicToggleBtn.classList.add('playing');
// }

musicToggleBtn.addEventListener('click', () => {
    if (isPlaying) {
        backgroundMusic.pause();
        musicToggleBtn.classList.remove('playing');
        showPopup('ปิดเพลง', 1500);
    } else {
        // Attempt to play, catch potential auto-play policy errors
        backgroundMusic.play().then(() => {
            musicToggleBtn.classList.add('playing');
            showPopup('เปิดเพลง', 1500);
        }).catch(e => {
            console.error("Failed to play music:", e);
            showPopup('ไม่สามารถเล่นเพลงได้ (เบราว์เซอร์บล็อกอัตโนมัติ)', 3000);
        });
    }
    isPlaying = !isPlaying;
    // Save state (optional)
    // localStorage.setItem('backgroundMusicPlaying', isPlaying);
});

// Play music automatically once user interacts with the page (e.g., clicks anywhere)
// This is a common workaround for browser auto-play policies.
document.body.addEventListener('click', function playMusicOnFirstInteraction() {
    if (!isPlaying) { // Only try to play if it's not already playing
        backgroundMusic.play().then(() => {
            isPlaying = true;
            musicToggleBtn.classList.add('playing');
            showPopup('เปิดเพลง', 1500);
            // Remove listener after first successful play to avoid redundant calls
            document.body.removeEventListener('click', playMusicOnFirstInteraction);
        }).catch(e => {
            console.warn("Auto-play blocked, waiting for user interaction:", e);
            // Keep the button available for manual play if auto-play fails
        });
    }
}, { once: true }); // Ensure this listener only triggers once
