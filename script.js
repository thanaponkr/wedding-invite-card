document.addEventListener('DOMContentLoaded', function() {
    // --------------------------------------------------------
    // Music Toggle
    // --------------------------------------------------------
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    let isPlaying = false; // Initial state

    // Check if music was playing in previous session (using localStorage)
    if (localStorage.getItem('musicPlaying') === 'true') {
        backgroundMusic.play().then(() => {
            isPlaying = true;
            musicToggle.querySelector('i').classList.remove('fa-volume-mute');
            musicToggle.querySelector('i').classList.add('fa-music');
        }).catch(error => {
            console.warn("Autoplay was prevented:", error);
            // Autoplay blocked, keep mute icon or handle accordingly
            musicToggle.querySelector('i').classList.remove('fa-music');
            musicToggle.querySelector('i').classList.add('fa-volume-mute');
            isPlaying = false;
        });
    } else {
        // If not explicitly playing, ensure mute icon is shown initially
        musicToggle.querySelector('i').classList.remove('fa-music');
        musicToggle.querySelector('i').classList.add('fa-volume-mute');
    }

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            backgroundMusic.pause();
            musicToggle.querySelector('i').classList.remove('fa-music');
            musicToggle.querySelector('i').classList.add('fa-volume-mute');
            localStorage.setItem('musicPlaying', 'false');
        } else {
            backgroundMusic.play().then(() => {
                musicToggle.querySelector('i').classList.remove('fa-volume-mute');
                musicToggle.querySelector('i').classList.add('fa-music');
                localStorage.setItem('musicPlaying', 'true');
            }).catch(error => {
                console.warn("Failed to play music on click:", error);
                // Handle cases where play() might still fail (e.g., user interaction not strong enough)
                // Keep mute icon or provide feedback
            });
        }
        isPlaying = !isPlaying;
    });

    // --------------------------------------------------------
    // Countdown Timer
    // --------------------------------------------------------
    const countdownElement = document.getElementById('countdown');
    // ตั้งค่าวันและเวลาแต่งงานที่นี่ (ปี-เดือน-วันTชั่วโมง:นาที:วินาที)
    const weddingDate = new Date('2025-07-28T07:30:00'); 

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            if(countdownElement) { // Check if element exists before updating
                countdownElement.innerHTML = "<h3>งานแต่งงานได้เริ่มต้นขึ้นแล้ว!</h3>";
            }
            clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if(countdownElement) { // Check if element exists before updating
            countdownElement.innerHTML = `
                <div class="countdown-item"><span>${days}</span>วัน</div>
                <div class="countdown-item"><span>${hours}</span>ชั่วโมง</div>
                <div class="countdown-item"><span>${minutes}</span>นาที</div>
                <div class="countdown-item"><span>${seconds}</span>วินาที</div>
            `;
        }
    }
    // Only set up countdown if the element exists on the page
    if (countdownElement) {
        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Initial call to display countdown immediately
    }


    // --------------------------------------------------------
    // Smooth scrolling for navigation links & Active Nav Link
    // --------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Update active nav link for internal links
                document.querySelectorAll('.mobile-nav-link').forEach(link => {
                    link.classList.remove('active-nav');
                });
                // Find the direct link in the nav bar
                const currentNavLink = document.querySelector(`.mobile-nav-link[href="${targetId}"]`);
                if (currentNavLink) {
                    currentNavLink.classList.add('active-nav');
                }
            }
        });
    });

    // Intersection Observer for active nav link on scroll (for sections with IDs)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.mobile-nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ensure only one active-nav is present
                navLinks.forEach(link => {
                    link.classList.remove('active-nav');
                });
                // Find and activate the corresponding nav link
                const targetNavLink = document.querySelector(`.mobile-nav-link[href*="#${entry.target.id}"]`);
                if (targetNavLink) {
                    targetNavLink.classList.add('active-nav');
                }
            }
        });
    }, { 
        rootMargin: '0px 0px -70% 0px', // Adjust this to make it active earlier or later
        threshold: 0.1 // How much of the section needs to be visible
    }); 

    sections.forEach(section => {
        observer.observe(section);
    });

    // Handle initial active state for guestbook.html's nav link
    const currentPath = window.location.pathname.split('/').pop();
    if (currentPath === 'guestbook.html') {
        navLinks.forEach(link => {
            link.classList.remove('active-nav');
        });
        const guestbookNavLink = document.querySelector('.mobile-nav-link[href="guestbook.html"]');
        if (guestbookNavLink) {
            guestbookNavLink.classList.add('active-nav');
        }
    }


    // --------------------------------------------------------
    // Custom Alert/Modal (shared between RSVP and Guestbook)
    // --------------------------------------------------------
    const customAlertOverlay = document.getElementById('custom-alert-overlay');
    const customAlertMessage = document.getElementById('custom-alert-message');
    const customAlertCloseBtn = document.getElementById('custom-alert-close-btn');
    const loadingSpinner = document.getElementById('loading-spinner');

    function showAlert(message) {
        if (customAlertMessage && customAlertOverlay) {
            customAlertMessage.textContent = message;
            customAlertOverlay.classList.remove('hidden');
        }
    }

    function hideAlert() {
        if (customAlertOverlay) {
            customAlertOverlay.classList.add('hidden');
        }
    }

    if (customAlertCloseBtn) {
        customAlertCloseBtn.addEventListener('click', hideAlert);
    }
    if (customAlertOverlay) {
        customAlertOverlay.addEventListener('click', (e) => {
            if (e.target === customAlertOverlay) {
                hideAlert();
            }
        });
    }

    function showLoading() {
        if (loadingSpinner) {
            loadingSpinner.classList.remove('hidden');
        }
    }

    function hideLoading() {
        if (loadingSpinner) {
            loadingSpinner.classList.add('hidden');
        }
    }

    // --------------------------------------------------------
    // RSVP Form Submission (index.html)
    // --------------------------------------------------------
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            showLoading();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Simulate API call (replace with actual backend submission)
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2-second delay

            hideLoading();
            showAlert('ขอบคุณสำหรับการตอบรับค่ะ/ครับ! เราได้รับข้อมูลของคุณแล้ว');
            this.reset(); // Clear the form
        });
    }

    // --------------------------------------------------------
    // Guestbook Form Submission (guestbook.html)
    // --------------------------------------------------------
    const guestbookForm = document.getElementById('guestbook-form');
    if (guestbookForm) {
        guestbookForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            showLoading();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Simulate API call (replace with actual backend submission)
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2-second delay

            hideLoading();
            showAlert('ขอบคุณสำหรับการแจ้งข้อมูลค่ะ/ครับ! บ่าวสาวจะจัดส่งของขวัญให้เร็วที่สุดค่ะ/ครับ');
            this.reset(); // Clear the form
        });
    }

    // --------------------------------------------------------
    // Gallery Manual Slide (Original, no auto-slide yet)
    // --------------------------------------------------------
    const sliderWrapper = document.querySelector('.slider-wrapper');
    if (sliderWrapper) { 
        const slides = document.querySelectorAll('.slider-wrapper .slide');
        const totalSlides = slides.length;
        let currentSlide = 0;

        function showSlide(index) {
            if (index >= totalSlides) {
                currentSlide = 0; 
            } else if (index < 0) {
                currentSlide = totalSlides - 1; 
            } else {
                currentSlide = index;
            }
            const offset = -currentSlide * 100;
            sliderWrapper.style.transform = `translateX(${offset}%)`;
            updateDots();
        }

        const prevButton = document.querySelector('.prev-slide');
        const nextButton = document.querySelector('.next-slide');

        if (prevButton) {
            prevButton.addEventListener('click', () => showSlide(currentSlide - 1));
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => showSlide(currentSlide + 1));
        }

        const sliderDotsContainer = document.querySelector('.slider-dots');
        if (sliderDotsContainer) {
            sliderDotsContainer.innerHTML = ''; 
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.addEventListener('click', () => showSlide(i));
                sliderDotsContainer.appendChild(dot);
            }
        }

        function updateDots() {
            if (sliderDotsContainer) {
                document.querySelectorAll('.slider-dots .dot').forEach((dot, index) => {
                    if (index === currentSlide) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        }

        // Initialize first slide and dots
        showSlide(0);
    }
}); // End of DOMContentLoaded