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

        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Call immediately to avoid 1-second delay on load
    }

    // --- 2. Music Toggle Functionality ---
    const musicToggleBtn = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');

    if (musicToggleBtn && backgroundMusic) {
        let isPlaying = false; // Initial state

        // Check if music was playing in previous session (optional, using localStorage)
        const musicState = localStorage.getItem('backgroundMusicState');
        if (musicState === 'playing') {
            backgroundMusic.play().then(() => {
                isPlaying = true;
                musicToggleBtn.innerHTML = '<i class="fas fa-pause"></i>'; // Pause icon
            }).catch(error => {
                console.error("Autoplay prevented:", error);
                // Autoplay might be blocked by browser. User has to click to play.
                musicToggleBtn.innerHTML = '<i class="fas fa-music"></i>'; // Music icon
            });
        } else {
            musicToggleBtn.innerHTML = '<i class="fas fa-music"></i>'; // Music icon if not playing
        }

        musicToggleBtn.addEventListener('click', () => {
            if (isPlaying) {
                backgroundMusic.pause();
                musicToggleBtn.innerHTML = '<i class="fas fa-music"></i>'; // Music icon
                localStorage.setItem('backgroundMusicState', 'paused');
            } else {
                backgroundMusic.play().then(() => {
                    musicToggleBtn.innerHTML = '<i class="fas fa-pause"></i>'; // Pause icon
                    localStorage.setItem('backgroundMusicState', 'playing');
                }).catch(error => {
                    console.error("Play prevented by browser:", error);
                    // Inform user if necessary, e.g., show a small message
                });
            }
            isPlaying = !isPlaying;
        });
    }

    // --- 3. Scroll to Schedule Button (Removed as button is removed from HTML) ---
    // The previous code block for 'scrollToScheduleBtn' has been completely removed.
    // This section is commented out to reflect its removal in the HTML.

    // --- 4. Gallery Slider Functionality ---
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    const sliderDotsContainer = document.querySelector('.slider-dots');

    if (sliderWrapper && prevButton && nextButton && sliderDotsContainer) {
        const slides = document.querySelectorAll('.slide');
        let currentIndex = 0;
        let slidesPerView = window.innerWidth <= 768 ? 1 : 3; // 1 slide for mobile, 3 for desktop

        // Function to create dots
        const createDots = () => {
            sliderDotsContainer.innerHTML = ''; // Clear existing dots
            for (let i = 0; i < Math.ceil(slides.length / slidesPerView); i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) {
                    dot.classList.add('active-dot');
                }
                dot.addEventListener('click', () => {
                    currentIndex = i * slidesPerView;
                    updateSlider();
                });
                sliderDotsContainer.appendChild(dot);
            }
        };

        // Function to update dots active state
        const updateDots = () => {
            document.querySelectorAll('.dot').forEach((dot, index) => {
                if (index === Math.floor(currentIndex / slidesPerView)) {
                    dot.classList.add('active-dot');
                } else {
                    dot.classList.remove('active-dot');
                }
            });
        };

        // Function to update slider position
        const updateSlider = () => {
            const slideWidth = slides[0].offsetWidth; // Get current width of a single slide
            sliderWrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            updateDots();
        };

        // Event listeners for prev/next buttons
        prevButton.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - slidesPerView);
            updateSlider();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = Math.min(slides.length - slidesPerView, currentIndex + slidesPerView);
            updateSlider();
        });

        // Update slider on window resize to adjust slidesPerView and position
        window.addEventListener('resize', () => {
            const newSlidesPerView = window.innerWidth <= 768 ? 1 : 3;
            if (newSlidesPerView !== slidesPerView) {
                slidesPerView = newSlidesPerView;
                currentIndex = 0;
                createDots();
            }
            updateSlider();
        });

        // Initial setup
        createDots();
        updateSlider();
    }

    // --- 5. Mobile Navigation Active State on Scroll ---
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    // For guestbook.html, we need to consider links back to index.html sections
    const mainSections = document.querySelectorAll('main > section'); 

    const updateMobileNavActiveState = () => {
        let currentActiveSectionId = ''; // Default to empty

        // If on guestbook.html, highlight the guestbook link
        if (window.location.pathname.endsWith('guestbook.html')) {
            currentActiveSectionId = 'guestbook.html';
        } else {
            // Logic for index.html sections
            mainSections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop - window.innerHeight * 0.3 && window.scrollY < sectionTop + sectionHeight - window.innerHeight * 0.3) {
                    currentActiveSectionId = section.id;
                }
            });
            // Special case for hero section when near the very top of index.html
            if (window.location.pathname.endsWith('index.html') && window.scrollY < 100) {
                 currentActiveSectionId = 'hero-section';
            } else if (window.location.pathname === '/') { // For root path
                if (window.scrollY < 100) {
                    currentActiveSectionId = 'hero-section';
                }
            }
        }


        mobileNavLinks.forEach(link => {
            link.classList.remove('active-nav');
            const href = link.getAttribute('href');
            // Check for direct match or section hash
            if (href === 'guestbook.html' && currentActiveSectionId === 'guestbook.html') {
                link.classList.add('active-nav');
            } else if (href.includes('#') && href.substring(href.indexOf('#') + 1) === currentActiveSectionId) {
                link.classList.add('active-nav');
            }
        });
    };

    window.addEventListener('scroll', updateMobileNavActiveState);
    window.addEventListener('load', updateMobileNavActiveState);
    updateMobileNavActiveState(); // Initial check


    // --- 6. Scroll Indicator functionality (for the hero section's scroll down arrow) ---
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const invitationSection = document.getElementById('invitation-section');
            if (invitationSection) {
                invitationSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- 7. Custom Alert/Modal Functionality (replacement for alert/confirm) ---
    const customAlertOverlay = document.getElementById('custom-alert-overlay');
    const customAlertMessage = document.getElementById('custom-alert-message');
    const customAlertCloseBtn = document.getElementById('custom-alert-close-btn');

    const showAlert = (message) => {
        customAlertMessage.textContent = message;
        customAlertOverlay.classList.remove('hidden');
    };

    if (customAlertCloseBtn) {
        customAlertCloseBtn.addEventListener('click', () => {
            customAlertOverlay.classList.add('hidden');
        });
    }

    // --- 8. Loading Spinner Functionality ---
    const loadingSpinner = document.getElementById('loading-spinner');

    const showLoading = () => {
        loadingSpinner.classList.remove('hidden');
    };

    const hideLoading = () => {
        loadingSpinner.classList.add('hidden');
    };


    // --- 9. RSVP Form Submission (Example using showAlert, showLoading) ---
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpStatus = document.getElementById('rsvpStatus');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            showLoading(); // Show loading spinner

            const guestName = document.getElementById('guestName').value;
            const numGuests = document.getElementById('numGuests').value;
            const message = document.getElementById('message').value;

            // Simulate API call or data processing
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2-second delay

            hideLoading(); // Hide loading spinner

            // In a real application, you would send this data to a server
            // For now, just show a confirmation message
            showAlert(`ขอบคุณค่ะคุณ ${guestName}!\nท่านและคณะ ${numGuests} ท่าน ได้ยืนยันการเข้าร่วมเรียบร้อยแล้วค่ะ`);
            rsvpStatus.textContent = 'ยืนยันการเข้าร่วมสำเร็จ! ขอบคุณค่ะ';
            rsvpStatus.style.color = '#8C6A4F'; // Themed color
            rsvpForm.reset(); // Reset the form after submission
        });
    }

    // --- 10. "รับของขวัญ" Button Functionality ---
    const transferButton = document.querySelector('.transfer-button');
    if (transferButton) {
        transferButton.addEventListener('click', () => {
            // Changed to direct navigation to guestbook.html
            window.location.href = 'guestbook.html';
        });
    }

    // --- 11. Guestbook Form Address Input (Reverted to single text input) ---

    // Removed comprehensive Thai address data and related dropdown logic.
    // The previous code for thaiAddressesFullData, populateDropdown, and associated
    // event listeners (provinceSelect, districtSelect, subDistrictSelect) are removed.

    // --- 12. Guestbook Form Submission (Updated for single address field) ---
    const guestbookForm = document.getElementById('guestbookForm');
    const guestbookStatus = document.getElementById('guestbookStatus');

    if (guestbookForm) {
        guestbookForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            showLoading(); // Show loading spinner

            const receiverName = document.getElementById('receiverName').value;
            const contactNumber = document.getElementById('contactNumber').value;
            const addressText = document.getElementById('addressText').value; // New address field
            const wishMessage = document.getElementById('wishMessage').value;

            // Basic validation for address field
            if (!addressText.trim()) { // Check if address is empty or just whitespace
                hideLoading();
                showAlert('กรุณากรอกที่อยู่ให้ครบถ้วนค่ะ/ครับ');
                return;
            }

            // Simulate sending data to backend (e.g., Google Sheet)
            // In a real application, you would make a fetch() request to your backend endpoint here.
            // Example of a fetch request (requires a backend endpoint configured to receive this data):
            /*
            try {
                const response = await fetch('/your-backend-api-for-guestbook-submission', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        receiverName,
                        contactNumber,
                        addressText, // Use the new address field
                        wishMessage
                    })
                });

                if (response.ok) {
                    showAlert('ขอบคุณสำหรับคำอวยพรค่ะ/ครับ! คำอวยพรของท่านได้ถูกส่งเรียบร้อยแล้ว และจะถูกเก็บเป็นความลับเพื่อบ่าวสาวโดยเฉพาะค่ะ');
                    guestbookStatus.textContent = 'ส่งคำอวยพรสำเร็จ! ขอบคุณค่ะ/ครับ';
                    guestbookStatus.style.color = '#8C6A4F';
                    guestbookForm.reset(); // Reset the form after successful submission
                } else {
                    showAlert('เกิดข้อผิดพลาดในการส่งคำอวยพร กรุณาลองอีกครั้ง');
                    guestbookStatus.textContent = 'เกิดข้อผิดพลาด';
                    guestbookStatus.style.color = 'red';
                }
            } catch (error) {
                console.error('Error submitting guestbook:', error);
                showAlert('เกิดข้อผิดพลาดในการส่งคำอวยพร กรุณาลองอีกครั้ง');
                guestbookStatus.textContent = 'เกิดข้อผิดพลาด';
                guestbookStatus.style.color = 'red';
            }
            */

            // For now, simulate success with a delay and show a confirmation message
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2-second delay

            hideLoading(); // Hide loading spinner

            showAlert('ขอบคุณสำหรับคำอวยพรค่ะ/ครับ! คำอวยพรของท่านได้ถูกส่งเรียบร้อยแล้ว และจะถูกเก็บเป็นความลับเพื่อบ่าวสาวโดยเฉพาะค่ะ');
            guestbookStatus.textContent = 'ส่งคำอวยพรสำเร็จ! ขอบคุณค่ะ/ครับ';
            guestbookStatus.style.color = '#8C6A4F'; // Themed color
            guestbookForm.reset(); // Reset the form after submission
        });
    }
});
