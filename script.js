document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Countdown Timer ---
    const countdownElement = document.getElementById('countdown');
    // ตั้งค่าวันแต่งงาน (เปลี่ยนเป็นวันที่แท้จริงของคุณ: ปี, เดือน(0-11), วัน, ชั่วโมง, นาที, วินาที)
    // ตัวอย่าง: วันจันทร์ที่ 28 กรกฏาคม 2568 เวลา 07:30:00 (งานเช้า)
    const weddingDate = new Date('July 28, 2025 07:30:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            countdownElement.innerHTML = "งานแต่งงานได้เริ่มต้นขึ้นแล้ว!"; // Wedding has started!
            clearInterval(countdownInterval); // Stop countdown
        } else {
            // คำนวณเป็น วัน ชั่วโมง นาที วินาที
            const days = Math.floor(distance / (1000 * 60 * 60 * 24)); // คำนวณจำนวนวันทั้งหมด
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // สร้าง HTML สำหรับการแสดงผลแบบใหม่ ให้เป็นภาษาไทย
            countdownElement.innerHTML = `
                <div><span class="value">${days}</span><span class="label">วัน</span></div>
                <div><span class="value">${hours}</span><span class="label">ชั่วโมง</span></div>
                <div><span class="value">${minutes}</span><span class="label">นาที</span></div>
                <div><span class="value">${seconds}</span><span class="label">วินาที</span></div>
            `;
        }
    };

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // เรียกใช้ครั้งแรกทันทีเพื่อให้แสดงผลเลย

    // --- 2. Scroll to Schedule Button ---
    const scrollToScheduleBtn = document.getElementById('scrollToSchedule');
    const scheduleSection = document.getElementById('schedule-section');

    if (scrollToScheduleBtn && scheduleSection) {
        scrollToScheduleBtn.addEventListener('click', () => {
            scheduleSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- 3. RSVP & Guestbook Form Submission (เชื่อมต่อกับ Google Apps Script) ---
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpStatus = document.getElementById('rsvpStatus');
    const guestbookForm = document.getElementById('guestbookForm');
    const guestbookStatus = document.getElementById('guestbookStatus');
    const guestbookEntries = document.getElementById('guestbookEntries');

    // *** สำคัญมาก! เปลี่ยน URL นี้เป็น Web App URL ที่คุณคัดลอกมาจาก Google Apps Script ในขั้นตอน 3.3.6 ***
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxX20hHm-7FwtkH1bQfaI_8PvSSTnA5RO1Bdo586LPkxxNQESlmwg4oIRNG3oGluhN-/exec'; // <<< แก้ไขตรงนี้เท่านั้น!

    // Function to handle form submission for both RSVP and Guestbook
    const handleFormSubmission = async (event, formType) => {
        event.preventDefault(); // Prevent default form submission (page reload)

        let formData = {};
        let statusElement;
        let successMessage = '';
        let errorMessage = '';

        if (formType === 'rsvp') {
            formData = {
                type: 'rsvp', // This 'type' field tells Apps Script which sheet to use
                name: document.getElementById('guestName').value,
                numGuests: document.getElementById('numGuests').value,
                message: document.getElementById('message').value
            };
            statusElement = rsvpStatus;
            successMessage = 'ขอบคุณสำหรับการตอบรับ เราได้รับข้อมูลของคุณแล้ว!'; // Thank you for your RSVP. We have received your information!
            errorMessage = 'เกิดข้อผิดพลาดในการส่งข้อมูล RSVP โปรดลองอีกครั้ง'; // Error sending RSVP data. Please try again.
        } else if (formType === 'guestbook') {
            formData = {
                type: 'guestbook', // This 'type' field tells Apps Script which sheet to use
                name: document.getElementById('guestbookName').value,
                message: document.getElementById('guestbookMessage').value
            };
            statusElement = guestbookStatus;
            successMessage = 'ขอบคุณสำหรับคำอวยพรค่ะ! ข้อความของคุณถูกบันทึกแล้ว'; // Thank you for your well wishes! Your message has been saved.
            errorMessage = 'เกิดข้อผิดพลาดในการส่งคำอวยพร โปรดลองอีกครั้ง'; // Error sending well wishes. Please try again.
        } else {
            console.error('Unknown form type:', formType);
            return;
        }

        // Check if Apps Script URL is set
        if (GOOGLE_APPS_SCRIPT_URL === 'YOUR_WEB_APP_URL_GOES_HERE' || !GOOGLE_APPS_SCRIPT_URL) {
            statusElement.textContent = 'โปรดตั้งค่า GOOGLE_APPS_SCRIPT_URL ใน script.js ก่อน!'; // Please set GOOGLE_APPS_SCRIPT_URL in script.js first!
            statusElement.style.color = 'red';
            console.error('GOOGLE_APPS_SCRIPT_URL is not set or is still the placeholder.');
            return;
        }

        statusElement.textContent = 'กำลังส่งข้อมูล...'; // Sending data...
        statusElement.style.color = '#007bff';
        console.log(`Sending ${formType} data to:`, GOOGLE_APPS_SCRIPT_URL, formData);

        try {
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Use 'no-cors' for Google Apps Script to prevent CORS issues
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log(`Fetch request for ${formType} initiated. Check Google Sheet for updates.`);

            // Update UI based on success (since no-cors prevents reading actual response)
            statusElement.textContent = successMessage;
            statusElement.style.color = '#28a745';

            // For Guestbook, also display the new entry on the page
            if (formType === 'guestbook') {
                const newEntry = document.createElement('div');
                newEntry.classList.add('guestbook-entry');
                newEntry.innerHTML = `
                    <p class="entry-name">${formData.name}</p>
                    <p class="entry-message">${formData.message}</p>
                `;
                guestbookEntries.prepend(newEntry); // Add to top
            }

            // Reset the form
            if (formType === 'rsvp') {
                rsvpForm.reset();
            } else if (formType === 'guestbook') {
                guestbookForm.reset();
            }

        } catch (error) {
            console.error(`Error sending ${formType} data:`, error);
            statusElement.textContent = errorMessage;
            statusElement.style.color = 'red';
        }
    };

    // Attach event listeners to forms
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (event) => handleFormSubmission(event, 'rsvp'));
    } else {
        console.error('RSVP form element not found! Please check ID "rsvpForm" in index.html.');
    }

    if (guestbookForm) {
        guestbookForm.addEventListener('submit', (event) => handleFormSubmission(event, 'guestbook'));
    } else {
        console.error('Guestbook form element not found! Please check ID "guestbookForm" in index.html.');
    }


    // --- 4. Gallery Slider ---
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    const sliderDotsContainer = document.querySelector('.slider-dots');
    let currentSlideIndex = 0;
    let autoplayInterval; // Variable to hold the autoplay interval ID

    // Create dots based on the number of slides
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active-dot');
        dot.addEventListener('click', () => showSlide(index)); // Corrected to showSlide
        sliderDotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot'); // Get dots after creation

    const showSlide = (index) => {
        if (index >= slides.length) {
            currentSlideIndex = 0;
        } else if (index < 0) {
            currentSlideIndex = slides.length - 1;
        } else {
            currentSlideIndex = index;
        }
        sliderWrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

        // Update active dot
        dots.forEach(dot => dot.classList.remove('active-dot'));
        if (dots[currentSlideIndex]) {
            dots[currentSlideIndex].classList.add('active-dot');
        }
    };

    const nextSlide = () => {
        showSlide(currentSlideIndex + 1);
    };

    const prevSlide = () => {
        showSlide(currentSlideIndex - 1);
    };

    // Autoplay functionality
    const startAutoplay = () => {
        autoplayInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
    };

    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
    };

    // Start autoplay when the page loads
    startAutoplay();

    // Pause autoplay on hover (optional)
    sliderWrapper.addEventListener('mouseenter', stopAutoplay);
    sliderWrapper.addEventListener('mouseleave', startAutoplay);
    prevButton.addEventListener('mouseenter', stopAutoplay);
    prevButton.addEventListener('mouseleave', startAutoplay);
    nextButton.addEventListener('mouseenter', stopAutoplay);
    nextButton.addEventListener('mouseleave', startAutoplay);
    dots.forEach(dot => {
        dot.addEventListener('mouseenter', stopAutoplay);
        dot.addEventListener('mouseleave', startAutoplay);
    });


    // Add event listeners for navigation buttons
    prevButton.addEventListener('click', () => {
        stopAutoplay(); // Stop autoplay on manual interaction
        prevSlide();
        startAutoplay(); // Resume autoplay after a brief moment
    });

    nextButton.addEventListener('click', () => {
        stopAutoplay(); // Stop autoplay on manual interaction
        nextSlide();
        startAutoplay(); // Resume autoplay after a brief moment
    });

    // Initial display
    showSlide(currentSlideIndex);


    // --- 5. Fade-in Section on Scroll ---
    const sections = document.querySelectorAll('.section');

    const fadeInOnScroll = () => {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight * 0.85) {
                section.classList.add('fade-in');
            } else {
                // section.classList.remove('fade-in'); // Optional: uncomment if you want fade-out when scrolling back up
            }
        });
    };

    window.addEventListener('scroll', fadeInOnScroll);
    fadeInOnScroll();


    // --- 6. Background Music Toggle ---
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggleBtn = document.getElementById('musicToggle');

    backgroundMusic.muted = true; // Start muted to comply with autoplay policies
    backgroundMusic.play()
        .then(() => {
            musicToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Show muted icon if autoplayed
            console.log("Autoplayed muted successfully.");
        })
        .catch(e => {
            console.log("Autoplay blocked:", e);
            musicToggleBtn.innerHTML = '<i class="fas fa-music"></i>'; // Show music icon if autoplay failed
        });

    musicToggleBtn.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.muted = false; // Unmute before playing
            backgroundMusic.play().catch(e => console.log("Play failed on click:", e));
        } else {
            if (backgroundMusic.muted) {
                backgroundMusic.muted = false; // Unmute
            } else {
                backgroundMusic.pause(); // Pause
            }
        }
    });

    backgroundMusic.onplay = () => {
        if (backgroundMusic.muted) {
            musicToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            musicToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    };
    backgroundMusic.onpause = () => {
        musicToggleBtn.innerHTML = '<i class="fas fa-music"></i>';
    };
    backgroundMusic.onvolumechange = () => {
        if (backgroundMusic.muted) {
            musicToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (!backgroundMusic.paused) {
            musicToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            musicToggleBtn.innerHTML = '<i class="fas fa-music"></i>';
        }
    };

    // --- Mobile Navigation Smooth Scroll ---
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);

            // ถ้าเป็นลิงก์ Home (ซึ่งชี้ไปที่ #hero-section) ให้เลื่อนไปบนสุดของหน้า
            if (targetId === 'hero-section') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                // สำหรับลิงก์อื่นๆ ให้เลื่อนไปยังส่วนที่เกี่ยวข้อง
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Scroll indicator functionality (for the hero section's scroll down arrow)
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const invitationSection = document.getElementById('invitation-section'); // ใช้ ID ของส่วนเชิญชวนหลัก
            if (invitationSection) {
                invitationSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
