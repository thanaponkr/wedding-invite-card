document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Countdown Timer ---
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        // ตั้งค่าวันแต่งงาน (เปลี่ยนเป็นวันที่แท้จริงของคุณ: ปี, เดือน(0-11), วัน, ชั่วโมง, นาที, วินาที)
        const weddingDate = new Date('July 28, 2025 07:30:00').getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                countdownElement.innerHTML = "<div class='countdown-modern'><span class='value'>งานแต่งงานได้เริ่มต้นขึ้นแล้ว!</span></div>"; // Wedding has started!
                clearInterval(countdownInterval); // Stop countdown
            } else {
                // คำนวณเป็น วัน ชั่วโมง นาที วินาที
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                countdownElement.innerHTML = `
                    <div class="countdown-modern">
                        <span class="value">${days}</span>
                        <span class="label">วัน</span>
                    </div>
                    <div class="countdown-modern">
                        <span class="value">${hours}</span>
                        <span class="label">ชั่วโมง</span>
                    </div>
                    <div class="countdown-modern">
                        <span class="value">${minutes}</span>
                        <span class="label">นาที</span>
                    </div>
                    <div class="countdown-modern">
                        <span class="value">${seconds}</span>
                        <span class="label">วินาที</span>
                    </div>
                `;
            }
        };

        const countdownInterval = setInterval(updateCountdown, 1000); // Update every 1 second
        updateCountdown(); // Call once immediately to display without delay
    }


    // --- 2. Music Toggle ---
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggleButton = document.getElementById('musicToggle');

    // Check localStorage for music preference or set default to playing
    let isMusicPlaying = localStorage.getItem('isMusicPlaying') === 'true';

    // Set initial state based on preference
    if (isMusicPlaying) {
        backgroundMusic.play();
        musicToggleButton.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        backgroundMusic.pause();
        musicToggleButton.innerHTML = '<i class="fas fa-music"></i>';
    }

    musicToggleButton.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicToggleButton.innerHTML = '<i class="fas fa-pause"></i>';
            isMusicPlaying = true;
        } else {
            backgroundMusic.pause();
            musicToggleButton.innerHTML = '<i class="fas fa-music"></i>';
            isMusicPlaying = false;
        }
        localStorage.setItem('isMusicPlaying', isMusicPlaying); // Save preference
    });

    // Autoplay on user interaction (to bypass browser autoplay policies)
    // This attempts to play music when user first clicks anywhere on the page
    document.body.addEventListener('click', () => {
        if (isMusicPlaying && backgroundMusic.paused) {
            backgroundMusic.play().catch(e => console.log("Autoplay prevented:", e));
        }
    }, { once: true }); // Run this listener only once


    // --- 3. Custom Alert/Modal ---
    const customAlertOverlay = document.getElementById('custom-alert-overlay');
    const customAlertBox = document.getElementById('custom-alert-box');
    const customAlertMessage = document.getElementById('custom-alert-message');
    const customAlertCloseBtn = document.getElementById('custom-alert-close-btn');

    window.showAlert = (message) => {
        customAlertMessage.textContent = message;
        customAlertOverlay.classList.remove('hidden');
        // Add a slight delay to ensure CSS transition plays
        setTimeout(() => {
            customAlertBox.style.transform = 'translateY(0)';
            customAlertBox.style.opacity = '1';
        }, 10);
    };

    customAlertCloseBtn.addEventListener('click', () => {
        customAlertBox.style.transform = 'translateY(-20px)';
        customAlertBox.style.opacity = '0';
        setTimeout(() => {
            customAlertOverlay.classList.add('hidden');
        }, 300); // Match CSS transition duration
    });


    // --- 4. Loading Spinner ---
    const loadingSpinner = document.getElementById('loading-spinner');

    window.showLoading = () => {
        loadingSpinner.classList.remove('hidden');
    };

    window.hideLoading = () => {
        loadingSpinner.classList.add('hidden');
    };


    // --- 5. RSVP Form Submission ---
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpStatus = document.getElementById('rsvp-status');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            showLoading(); // Show loading spinner

            const name = document.getElementById('rsvp-name').value;
            const attendance = document.getElementById('rsvp-attendance').value; // ค่าจาก Dropdown "ท่านสะดวกมาร่วมงาน"
            const guests = document.getElementById('rsvp-guests').value;         // ค่าจาก Dropdown "จำนวนผู้ร่วมงาน"
            const message = document.getElementById('rsvp-message').value;

            // Basic client-side validation
            if (name.trim() === '') {
                 showAlert('กรุณากรอกชื่อ-นามสกุลค่ะ/ครับ');
                 hideLoading();
                 return;
            }
            if (attendance === '') {
                showAlert('กรุณาเลือกความสะดวกในการมาร่วมงานค่ะ/ครับ');
                hideLoading();
                return;
            }
            // ตรวจสอบ Dropdown จำนวนผู้ร่วมงาน
            if (guests === '') {
                showAlert('กรุณาเลือกจำนวนผู้ร่วมงานค่ะ/ครับ');
                hideLoading();
                return;
            }


            // --- Google Apps Script Web App URL for RSVP submission ---
            // Replace with your actual Google Apps Script Web App URL
            // const GOOGLE_APPS_SCRIPT_URL_RSVP = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_FOR_RSVP';

            const formData = {
                name: name,
                attendance: attendance,
                guests: guests, // ส่งค่าจาก dropdown
                message: message
            };

            /*
            // Uncomment the following block to enable actual submission to Google Sheet
            try {
                const response = await fetch(GOOGLE_APPS_SCRIPT_URL_RSVP, {
                    method: 'POST',
                    mode: 'no-cors', // Required for Google Apps Script
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                // Note: Due to 'no-cors' mode, response.ok will always be false
                // and response.json() will cause an error.
                // We rely on the script executing on the server side.
                // A successful fetch implies the request was sent.

                hideLoading(); // Hide loading spinner

                showAlert('ส่งคำตอบรับสำเร็จ! ขอบคุณสำหรับข้อมูลค่ะ/ครับ');
                rsvpStatus.textContent = 'ส่งคำตอบรับสำเร็จ! ขอบคุณค่ะ/ครับ';
                rsvpStatus.style.color = '#8C6A4F'; // Themed color
                rsvpForm.reset(); // Reset the form after successful submission
            } catch (error) {
                console.error('Error submitting RSVP:', error);
                hideLoading(); // Hide loading spinner
                showAlert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองอีกครั้ง');
                rsvpStatus.textContent = 'เกิดข้อผิดพลาด';
                rsvpStatus.style.color = 'red';
            }
            */

            // For now, simulate success with a delay and show a confirmation message
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2-second delay

            hideLoading(); // Hide loading spinner

            showAlert('ส่งคำตอบรับสำเร็จ! ขอบคุณสำหรับข้อมูลค่ะ/ครับ');
            rsvpStatus.textContent = 'ส่งคำตอบรับสำเร็จ! ขอบคุณค่ะ/ครับ';
            rsvpStatus.style.color = '#8C6A4F'; // Themed color
            rsvpForm.reset(); // Reset the form after successful submission
        });
    }


    // --- 6. Gallery Slider ---
    const sliderContainer = document.querySelector('.slider-container');
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    const sliderDotsContainer = document.querySelector('.slider-dots');

    let currentIndex = 0;
    const numSlides = slides.length;
    let slidesPerView = 3; // Default for larger screens

    const updateSlidesPerView = () => {
        if (window.innerWidth <= 768) {
            slidesPerView = 1;
            // Show navigation buttons only on mobile
            if (prevButton && nextButton) {
                prevButton.style.display = 'flex';
                nextButton.style.display = 'flex';
            }
        } else {
            slidesPerView = 3;
            // Hide navigation buttons on desktop
            if (prevButton && nextButton) {
                prevButton.style.display = 'none';
                nextButton.style.display = 'none';
            }
        }
        // Recalculate index to prevent showing incomplete slides on resize
        currentIndex = Math.floor(currentIndex / slidesPerView) * slidesPerView;
        if (currentIndex > numSlides - slidesPerView) {
            currentIndex = numSlides - slidesPerView;
        }
        if (currentIndex < 0) {
            currentIndex = 0;
        }
        updateSlider();
        createDots(); // Re-create dots on resize to reflect correct number
    };

    const updateSlider = () => {
        const slideWidth = sliderContainer.clientWidth / slidesPerView;
        slides.forEach(slide => {
            slide.style.width = slideWidth + 'px';
        });
        sliderWrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateDots();
    };

    const createDots = () => {
        if (!sliderDotsContainer) return; // Exit if dots container not found
        sliderDotsContainer.innerHTML = '';
        const numDots = Math.ceil(numSlides / slidesPerView);
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                currentIndex = i * slidesPerView;
                updateSlider();
            });
            sliderDotsContainer.appendChild(dot);
        }
        updateDots();
    };

    const updateDots = () => {
        if (!sliderDotsContainer) return; // Exit if dots container not found
        const dots = sliderDotsContainer.querySelectorAll('.dot');
        const activeDotIndex = Math.floor(currentIndex / slidesPerView);
        dots.forEach((dot, index) => {
            if (index === activeDotIndex) {
                dot.classList.add('active-dot');
            } else {
                dot.classList.remove('active-dot');
            }
        });
    };

    const nextSlide = () => {
        if (currentIndex < numSlides - slidesPerView) {
            currentIndex += slidesPerView;
        } else {
            currentIndex = 0; // Loop back to start
        }
        updateSlider();
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            currentIndex -= slidesPerView;
        } else {
            currentIndex = numSlides - slidesPerView; // Loop to end
            // Ensure the last set of slides is fully visible if it's less than slidesPerView
            if (numSlides % slidesPerView !== 0) {
                currentIndex = Math.floor(numSlides / slidesPerView) * slidesPerView;
            }
        }
        updateSlider();
    };


    if (sliderContainer) {
        // Initial setup
        updateSlidesPerView();
        window.addEventListener('resize', updateSlidesPerView);

        if (prevButton) prevButton.addEventListener('click', prevSlide);
        if (nextButton) nextButton.addEventListener('click', nextSlide);

        // Auto-slide functionality (optional)
        // setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }


    // --- 7. Mobile Navigation Bar Active State ---
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const updateActiveNavLink = () => {
        const sections = document.querySelectorAll('section[id]');
        const currentScrollPos = window.scrollY + window.innerHeight / 2; // Mid-point of the viewport

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            // Handle special cases for hero and rsvp link
            let targetId = sectionId;
            if (sectionId === 'hero-section' && currentScrollPos < sectionHeight / 2) {
                targetId = 'hero-section';
            } else if (sectionId === 'rsvp-section' && section.contains(document.getElementById('rsvp-form'))) {
                // Ensure RSVP button becomes active when RSVP section is in view
                // This will use the section's ID as the target, which the mobile nav links reference
            }

            if (currentScrollPos >= sectionTop && currentScrollPos < sectionTop + sectionHeight) {
                mobileNavLinks.forEach(link => {
                    link.classList.remove('active-nav');
                    // Check if the link's href matches the current section ID (including # prefix)
                    if (link.getAttribute('href') === `#${targetId}`) {
                        link.classList.add('active-nav');
                    }
                });
            }
        });
        // Special handling for the 'Gift' link, which previously was 'Guestbook'
        // If the current section is 'gift-section', ensure the 'Gift' nav link is active
        const giftSection = document.getElementById('gift-section');
        if (giftSection) {
            const giftSectionTop = giftSection.offsetTop;
            const giftSectionHeight = giftSection.offsetHeight;
            if (currentScrollPos >= giftSectionTop && currentScrollPos < giftSectionTop + giftSectionHeight) {
                 mobileNavLinks.forEach(link => {
                    link.classList.remove('active-nav');
                    if (link.getAttribute('href') === '#gift-section') {
                        link.classList.add('active-nav');
                    }
                });
            }
        }
    };

    // Initial check and update on scroll
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);


    // --- Guestbook Form Submission (on guestbook.html) ---
    const guestbookForm = document.getElementById('guestbook-form');
    const guestbookStatus = document.getElementById('guestbook-status');

    if (guestbookForm) { // Only run if guestbook form exists on the page
        guestbookForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading();

            const name = document.getElementById('guestbook-name').value;
            const address = document.getElementById('guestbook-address').value; // ดึงค่าจากช่องที่อยู่
            const phone = document.getElementById('guestbook-phone').value;     // ดึงค่าจากช่องเบอร์โทรศัพท์

            if (name.trim() === '') {
                showAlert('กรุณากรอกชื่อ-นามสกุลค่ะ/ครับ');
                hideLoading();
                return;
            }
            if (address.trim() === '') {
                showAlert('กรุณากรอกที่อยู่สำหรับจัดส่งของขวัญค่ะ/ครับ'); // ตรวจสอบที่อยู่
                hideLoading();
                return;
            }
            if (phone.trim() === '') {
                showAlert('กรุณากรอกเบอร์โทรศัพท์สำหรับติดต่อค่ะ/ครับ'); // ตรวจสอบเบอร์โทร
                hideLoading();
                return;
            }

            // --- Google Apps Script Web App URL for Guestbook submission ---
            // Replace with your actual Google Apps Script Web App URL
            // const GOOGLE_APPS_SCRIPT_URL_GUESTBOOK = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_FOR_GUESTBOOK';

            const formData = {
                name: name,
                address: address, // เพิ่ม address ใน formData
                phone: phone      // เพิ่ม phone ใน formData
            };

            /*
            // Uncomment this block if you want to send data to Google Sheet
            try {
                const response = await fetch(GOOGLE_APPS_SCRIPT_URL_GUESTBOOK, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                hideLoading();

                if (response.ok || response.type === 'opaque') { // 'opaque' is expected for no-cors
                    showAlert('ขอบคุณสำหรับข้อมูลค่ะ/ครับ! บ่าวสาวจะจัดส่งของขวัญไปให้ตามที่อยู่ที่ระบุนะคะ/ครับ'); // เปลี่ยนข้อความ
                    guestbookStatus.textContent = 'ส่งข้อมูลสำเร็จ! ขอบคุณค่ะ/ครับ'; // เปลี่ยนข้อความ
                    guestbookStatus.style.color = '#8C6A4F';
                    guestbookForm.reset(); // Reset the form after successful submission
                } else {
                    showAlert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองอีกครั้ง'); // เปลี่ยนข้อความ
                    guestbookStatus.textContent = 'เกิดข้อผิดพลาด';
                    guestbookStatus.style.color = 'red';
                }
            } catch (error) {
                console.error('Error submitting guestbook:', error);
                showAlert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองอีกครั้ง'); // เปลี่ยนข้อความ
                guestbookStatus.textContent = 'เกิดข้อผิดพลาด';
                guestbookStatus.style.color = 'red';
            }
            */

            // For now, simulate success with a delay and show a confirmation message
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2-second delay

            hideLoading(); // Hide loading spinner

            showAlert('ขอบคุณสำหรับข้อมูลค่ะ/ครับ! บ่าวสาวจะจัดส่งของขวัญไปให้ตามที่อยู่ที่ระบุนะคะ/ครับ'); // เปลี่ยนข้อความ
            guestbookStatus.textContent = 'ส่งข้อมูลสำเร็จ! ขอบคุณค่ะ/ครับ'; // เปลี่ยนข้อความ
            guestbookStatus.style.color = '#8C6A4F'; // Themed color
            guestbookForm.reset(); // Reset the form after submission
        });
    }

}); // DOMContentLoaded end