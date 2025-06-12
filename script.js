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

    // Intersection Observer for active nav link on scroll (for sections with IDs) and fade-in animation
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.mobile-nav-link');

    const observerOptions = {
        rootMargin: '0px 0px -70% 0px', // Adjust this to make it active earlier or later
        threshold: 0.1 // How much of the section needs to be visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // For fade-in animation
                entry.target.classList.add('visible');

                // For active nav link
                navLinks.forEach(link => {
                    link.classList.remove('active-nav');
                });
                const targetNavLink = document.querySelector(`.mobile-nav-link[href*="#${entry.target.id}"]`);
                if (targetNavLink) {
                    targetNavLink.classList.add('active-nav');
                }
            } else {
                // Optional: remove visible class if you want animation to replay on scroll up
                // entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
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

    // Initialize Confetti
    const jsConfetti = new JSConfetti();

    function showAlert(message, showConfetti = false) {
        if (customAlertMessage && customAlertOverlay) {
            customAlertMessage.textContent = message;
            customAlertOverlay.classList.remove('hidden');
            if (showConfetti) {
                jsConfetti.addConfetti({
                    emojis: ['🎉', '💖', '💍', '✨'],
                    emojiSize: 30,
                    confettiNumber: 100
                });
            }
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
            showAlert('ขอบคุณสำหรับการตอบรับค่ะ/ครับ! เราได้รับข้อมูลของคุณแล้ว', true); // Show confetti
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
            showAlert('ขอบคุณสำหรับการแจ้งข้อมูลค่ะ/ครับ! บ่าวสาวจะจัดส่งของขวัญให้เร็วที่สุดค่ะ/ครับ', true); // Show confetti
            this.reset(); // Clear the form
        });
    }

    // --------------------------------------------------------
    // Gallery Auto & Manual Slide with Lazy Loading
    // --------------------------------------------------------
    const sliderWrapper = document.querySelector('.slider-wrapper');
    if (sliderWrapper) {
        const slides = document.querySelectorAll('.slider-wrapper .slide');
        const lazyLoadImages = document.querySelectorAll('.slider-wrapper .slide img.lazy-load');
        const totalSlides = slides.length;
        let currentSlide = 0;
        let autoSlideInterval;
        const autoSlideDelay = 5000; // 5 seconds

        function loadSlideImage(imgElement) {
            if (imgElement && imgElement.dataset.src) {
                imgElement.src = imgElement.dataset.src;
                imgElement.removeAttribute('data-src'); // Remove data-src once loaded
                imgElement.classList.remove('lazy-load'); // Remove lazy-load class
            }
        }

        function preloadSurroundingImages(index) {
            // Load current, next, and previous slide images
            loadSlideImage(lazyLoadImages[index]);
            if (index + 1 < totalSlides) loadSlideImage(lazyLoadImages[index + 1]);
            if (index - 1 >= 0) loadSlideImage(lazyLoadImages[index - 1]);
            // Also load the last slide if current is first for wrap around
            if (index === 0 && totalSlides > 1) loadSlideImage(lazyLoadImages[totalSlides - 1]);
            // Also load the first slide if current is last for wrap around
            if (index === totalSlides - 1 && totalSlides > 1) loadSlideImage(lazyLoadImages[0]);
        }

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
            preloadSurroundingImages(currentSlide); // Lazy load images
        }

        function startAutoSlide() {
            stopAutoSlide(); // Clear any existing interval
            autoSlideInterval = setInterval(() => {
                showSlide(currentSlide + 1);
            }, autoSlideDelay);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        const prevButton = document.querySelector('.prev-slide');
        const nextButton = document.querySelector('.next-slide');

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                stopAutoSlide(); // Stop auto-slide on manual interaction
                showSlide(currentSlide - 1);
                startAutoSlide(); // Restart auto-slide after a delay
            });
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                stopAutoSlide(); // Stop auto-slide on manual interaction
                showSlide(currentSlide + 1);
                startAutoSlide(); // Restart auto-slide after a delay
            });
        }

        const sliderDotsContainer = document.querySelector('.slider-dots');
        if (sliderDotsContainer) {
            sliderDotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    stopAutoSlide(); // Stop auto-slide on manual interaction
                    showSlide(i);
                    startAutoSlide(); // Restart auto-slide after a delay
                });
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

        // Initialize first slide and dots, and start auto-slide
        showSlide(0);
        startAutoSlide();

        // Optional: Pause auto-slide when mouse is over the slider
        sliderWrapper.parentNode.addEventListener('mouseenter', stopAutoSlide);
        sliderWrapper.parentNode.addEventListener('mouseleave', startAutoSlide);
    }

    // --------------------------------------------------------
    // Copy to Clipboard for Bank Account
    // --------------------------------------------------------
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            showAlert('คัดลอกเลขบัญชีสำเร็จ!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            showAlert('ไม่สามารถคัดลอกเลขบัญชีได้ กรุณาลองใหม่');
        });
    };

    // --------------------------------------------------------
    // Share Website Link
    // --------------------------------------------------------
    window.copyWebsiteLink = function() {
        const websiteUrl = window.location.origin + window.location.pathname; // Get current URL
        navigator.clipboard.writeText(websiteUrl).then(() => {
            const copyStatus = document.getElementById('copy-status');
            if (copyStatus) {
                copyStatus.textContent = 'คัดลอกลิงก์สำเร็จ!';
                setTimeout(() => {
                    copyStatus.textContent = '';
                }, 3000); // Clear message after 3 seconds
            }
        }).catch(err => {
            console.error('Failed to copy link: ', err);
            const copyStatus = document.getElementById('copy-status');
            if (copyStatus) {
                copyStatus.textContent = 'ไม่สามารถคัดลอกลิงก์ได้ กรุณาลองใหม่';
            }
        });
    };

    // Note: Actual LINE/Facebook share URLs might need dynamic population
    // For LINE, you might need an API or a more complex URL. This is a basic example.
    // For Facebook, it typically scrapes the URL, so just passing the URL is often enough.

}); // End of DOMContentLoaded