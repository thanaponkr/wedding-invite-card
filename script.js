document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Countdown Timer ---
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        const weddingDate = new Date('July 28, 2025 07:30:00').getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                countdownElement.innerHTML = "<div class='countdown-modern'><span class='value'>งานแต่งงานได้เริ่มต้นขึ้นแล้ว!</span></div>"; // Wedding has started!
                clearInterval(countdownInterval); // Stop countdown
            } else {
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

    // --- 3. Scroll to Schedule Button ---
    const scrollToScheduleBtn = document.getElementById('scrollToSchedule');
    if (scrollToScheduleBtn) {
        scrollToScheduleBtn.addEventListener('click', () => {
            const scheduleSection = document.getElementById('schedule-section');
            if (scheduleSection) {
                scheduleSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- 4. Gallery Slider Functionality ---
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    const sliderDotsContainer = document.querySelector('.slider-dots');

    if (sliderWrapper && prevButton && nextButton && sliderDotsContainer) {
        const slides = document.querySelectorAll('.slide');
        let currentIndex = 0;
        const slidesPerView = window.innerWidth <= 768 ? 1 : 3; // 1 slide for mobile, 3 for desktop

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
            // Re-calculate slidesPerView on resize
            const newSlidesPerView = window.innerWidth <= 768 ? 1 : 3;
            if (newSlidesPerView !== slidesPerView) {
                // If slidesPerView changes, re-create dots and reset index
                slidesPerView = newSlidesPerView; // This needs `let` for slidesPerView
                currentIndex = 0; // Reset index to avoid out-of-bounds issues
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
    const mainSections = document.querySelectorAll('main > section'); // Select all direct child sections of main

    const updateMobileNavActiveState = () => {
        let currentActiveSectionId = 'hero-section'; // Default to home/hero

        mainSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjust sensitivity: when section is about 30% from the top of the viewport
            if (window.scrollY >= sectionTop - window.innerHeight * 0.3 && window.scrollY < sectionTop + sectionHeight - window.innerHeight * 0.3) {
                currentActiveSectionId = section.id;
            }
        });

        mobileNavLinks.forEach(link => {
            link.classList.remove('active-nav');
            const targetId = link.getAttribute('href').substring(1); // Get target section ID from href
            if (targetId === currentActiveSectionId) {
                link.classList.add('active-nav');
            } else if (targetId === 'hero-section' && window.scrollY < 100) {
                // Special case for hero section when near the very top
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

    // --- 10. "โอนเงินแล้ว" Button Functionality ---
    const transferButton = document.querySelector('.transfer-button');
    if (transferButton) {
        transferButton.addEventListener('click', () => {
            showAlert('ขอบคุณสำหรับการร่วมแสดงความยินดีค่ะ! ทางบ่าวสาวได้รับทราบแล้วนะคะ');
        });
    }

    // --- 11. Intersection Observer for Section Animations on Scroll ---
    const sectionsToAnimate = document.querySelectorAll('.section'); // Select all sections with the .section class

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in'); // Add 'fade-in' class when section enters viewport
                observer.unobserve(entry.target); // Stop observing once the animation has triggered
            }
        });
    }, observerOptions);

    // Observe each section
    sectionsToAnimate.forEach(section => {
        sectionObserver.observe(section);
    });

    // Manually trigger fade-in for the hero section on page load
    // The hero section's animation is handled by its own CSS keyframes,
    // but applying `fade-in` ensures consistency if any nested elements
    // rely on `.section.fade-in` for their transitions.
    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
        // The hero section has its own intro animations, so no need for translateY
        // Just ensure it gets the 'fade-in' class if its child elements need it.
        heroSection.classList.add('fade-in');
    }
});
