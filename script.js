document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Get the target section ID from the href
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }

            // Update active class for mobile nav (handled by scroll listener now)
            // Removed direct class manipulation here to avoid conflict with IntersectionObserver
        });
    });

    // Intersection Observer for fade-in effect on sections and mobile nav active state
    const sections = document.querySelectorAll('.section');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.3 // Adjust threshold as needed for when the section is considered "active"
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');

                // Update active class for mobile navigation
                const targetId = entry.target.id;
                mobileNavLinks.forEach(link => {
                    link.classList.remove('active-nav');
                    // Check if the link's href matches the intersecting section's ID
                    if (link.getAttribute('href') === `#${targetId}`) {
                        link.classList.add('active-nav');
                    }
                });

            } else {
                // Optionally remove fade-in if scrolling away (can be removed if not desired)
                // entry.target.classList.remove('fade-in');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Initial check for active state on load for hero section or if already scrolled
    const updateMobileNavActiveStateOnLoad = () => {
        let foundActive = false;
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // If section is mostly in viewport (e.g., top is within 50% of viewport height)
            if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
                mobileNavLinks.forEach(link => {
                    link.classList.remove('active-nav');
                    if (link.getAttribute('href') === `#${section.id}`) {
                        link.classList.add('active-nav');
                        foundActive = true;
                    }
                });
            }
        });
        // If no section is predominantly in view, default to home or hero
        if (!foundActive) {
            mobileNavLinks.forEach(link => {
                if (link.getAttribute('href') === '#hero-section') {
                    link.classList.add('active-nav');
                }
            });
        }
    };

    window.addEventListener('load', updateMobileNavActiveStateOnLoad);
    window.addEventListener('scroll', updateMobileNavActiveStateOnLoad); // Re-evaluate on scroll


    // Scroll indicator for hero section
    const scrollIndicator = document.querySelector('.scroll-indicator'); // Use querySelector as there's only one
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', (e) => {
            e.preventDefault();
            // Assuming the first section after hero is "invitation-section"
            const invitationSection = document.getElementById('invitation-section');
            if (invitationSection) {
                invitationSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }

    // Countdown Timer (if countdown element exists)
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        // Set your wedding date (Year, Month(0-11), Day, Hour, Minute, Second)
        // Example: Monday, July 28, 2025 at 07:30:00 (morning ceremony)
        const weddingDate = new Date('July 28, 2025 07:30:00').getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                countdownElement.innerHTML = "<p>งานแต่งงานได้เริ่มต้นขึ้นแล้ว!</p>"; // Wedding has started!
                clearInterval(countdownInterval); // Stop countdown
            } else {
                // Calculate days, hours, minutes, seconds
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Display the result in the corresponding elements
                const formatTime = (time) => String(time).padStart(2, '0');

                // Clear previous content if any, then append new
                countdownElement.innerHTML = '';
                countdownElement.innerHTML += `<div><span class="value">${formatTime(days)}</span><span class="label">วัน</span></div>`;
                countdownElement.innerHTML += `<div><span class="value">${formatTime(hours)}</span><span class="label">ชั่วโมง</span></div>`;
                countdownElement.innerHTML += `<div><span class="value">${formatTime(minutes)}</span><span class="label">นาที</span></div>`;
                countdownElement.innerHTML += `<div><span class="value">${formatTime(seconds)}</span><span class="label">วินาที</span></div>`;
            }
        };

        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Initial call to display immediately
    }


    // Music Toggle (Assuming audio/wedding-song.mp3.mp3 is correct path)
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    let musicPlaying = false;

    // Try to play music on user interaction (first click/scroll)
    const initiateMusic = () => {
        if (!musicPlaying) {
            backgroundMusic.play().then(() => {
                musicPlaying = true;
                musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(e => {
                console.log("Autoplay prevented or no sound file:", e);
                musicToggle.innerHTML = '<i class="fas fa-play"></i>';
            });
        }
        document.removeEventListener('click', initiateMusic);
        document.removeEventListener('scroll', initiateMusic);
    };

    document.addEventListener('click', initiateMusic);
    document.addEventListener('scroll', initiateMusic);

    musicToggle.addEventListener('click', () => {
        if (musicPlaying) {
            backgroundMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            backgroundMusic.play();
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        }
        musicPlaying = !musicPlaying;
    });


    // --- Custom Alert/Modal Functions ---
    const customAlertOverlay = document.getElementById('custom-alert-overlay');
    const customAlertMessage = document.getElementById('custom-alert-message');
    const customAlertCloseBtn = document.getElementById('custom-alert-close-btn');

    function showAlert(message) {
        customAlertMessage.textContent = message;
        customAlertOverlay.classList.remove('hidden');
    }

    customAlertCloseBtn.addEventListener('click', () => {
        customAlertOverlay.classList.add('hidden');
    });

    // --- Loading Spinner Functions ---
    const loadingSpinner = document.getElementById('loading-spinner');

    function showLoadingSpinner(message = "กำลังประมวลผล...") {
        const spinnerP = loadingSpinner.querySelector('p');
        if (spinnerP) spinnerP.textContent = message;
        loadingSpinner.classList.remove('hidden');
    }

    function hideLoadingSpinner() {
        loadingSpinner.classList.add('hidden');
    }


    // 7. RSVP Form Submission
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpStatus = document.getElementById('rsvpStatus');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const guestName = document.getElementById('guestName').value;
            const numGuests = document.getElementById('numGuests').value;
            const message = document.getElementById('message').value;

            showLoadingSpinner("กำลังส่งข้อมูล...");
            // Simulate network request
            setTimeout(() => {
                hideLoadingSpinner();
                const statusMessage = `ขอบคุณ คุณ${guestName} สำหรับการยืนยันการเข้าร่วม ${numGuests} ท่านค่ะ!`;
                showAlert(statusMessage);
                rsvpForm.reset();
            }, 1500);
        });
    }


    // Guestbook related (originally in guestbook.html, now integrated)
    // Assuming you want to keep the guestbook form on index.html
    const guestbookForm = document.getElementById('guestbookForm'); // Check if this ID exists in the new index.html
    const guestbookName = document.getElementById('guestbookName');
    const guestbookMessage = document.getElementById('guestbookMessage');
    const guestbookEntries = document.getElementById('guestbook-entries'); // This element was in guestbook.html

    // Function to load existing guestbook entries (simulated)
    // In a real app, this would fetch from a database
    function loadGuestbookEntries() {
        const storedEntries = JSON.parse(localStorage.getItem('guestbookEntries')) || [];
        guestbookEntries.innerHTML = ''; // Clear existing
        storedEntries.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('guestbook-entry');
            entryDiv.innerHTML = `
                <p class="entry-name">${entry.name}</p>
                <p class="entry-message">${entry.message}</p>
            `;
            guestbookEntries.prepend(entryDiv); // Add to top
        });
    }

    // If the guestbook form exists on this page
    if (guestbookForm && guestbookName && guestbookMessage && guestbookEntries) {
        loadGuestbookEntries(); // Load entries on page load

        guestbookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = guestbookName.value;
            const message = guestbookMessage.value;

            showLoadingSpinner("กำลังส่งคำอวยพร...");
            setTimeout(() => { // Simulate saving
                hideLoadingSpinner();
                const newEntry = { name, message };
                const storedEntries = JSON.parse(localStorage.getItem('guestbookEntries')) || [];
                storedEntries.push(newEntry);
                localStorage.setItem('guestbookEntries', JSON.stringify(storedEntries));
                loadGuestbookEntries(); // Reload to show new entry
                showAlert(`ขอบคุณ คุณ${name} สำหรับคำอวยพรค่ะ!`);
                guestbookForm.reset();
            }, 1000);
        });

        // Gemini API integration for generating wish
        const generateWishBtn = document.getElementById('generate-wish-btn');
        if (generateWishBtn) {
            generateWishBtn.addEventListener('click', async () => {
                showLoadingSpinner("กำลังสร้างคำอวยพร...");
                try {
                    let chatHistory = [];
                    const prompt = "Generate a heartfelt wedding wish message for a newly married couple, keeping it concise (max 3-4 lines) and warm. The message should be in Thai. Make it sound natural and include blessings for their future.";
                    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

                    const payload = { contents: chatHistory };
                    const apiKey = ""; // Canvas will provide this at runtime
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const result = await response.json();
                    console.log('Gemini API Response:', result);

                    if (result.candidates && result.candidates.length > 0 &&
                        result.candidates[0].content && result.candidates[0].content.parts &&
                        result.candidates[0].content.parts.length > 0) {
                        const generatedText = result.candidates[0].content.parts[0].text;
                        guestbookMessage.value = generatedText; // Populate textarea
                        showAlert("สร้างคำอวยพรสำเร็จแล้ว!");
                    } else {
                        showAlert("ไม่สามารถสร้างคำอวยพรได้ กรุณาลองอีกครั้งค่ะ");
                        console.error("Unexpected Gemini API response structure:", result);
                    }
                } catch (error) {
                    console.error("Error calling Gemini API:", error);
                    showAlert("เกิดข้อผิดพลาดในการสร้างคำอวยพร กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตแล้วลองใหม่ค่ะ");
                } finally {
                    hideLoadingSpinner();
                }
            });
        }
    }


    // Gallery Slider
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    const sliderDots = document.querySelector('.slider-dots');

    if (sliderWrapper && slides.length > 0) {
        let currentIndex = 0;
        let slideWidth = slides[0].clientWidth; // Initial width

        // Function to update slide width and position
        const updateSliderDimensions = () => {
            slideWidth = slides[0].clientWidth;
            sliderWrapper.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
        };

        // Create dots
        sliderDots.innerHTML = ''; // Clear existing dots if any
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active-dot');
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
            });
            sliderDots.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot'); // Re-query dots after creating them

        const updateSlider = () => {
            updateSliderDimensions(); // Recalculate and apply transform
            dots.forEach((dot, i) => {
                dot.classList.toggle('active-dot', i === currentIndex);
            });
        };

        // Add event listeners for navigation buttons
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                updateSlider();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                updateSlider();
            });
        }

        // Handle window resize to adjust slide width
        window.addEventListener('resize', updateSliderDimensions);

        // Initial update
        updateSlider();
    }

    // Handle "โอนเงินแล้ว" button click: NOW SHOWS ALERT THEN LINKS TO GUESTBOOK.HTML
    const transferButton = document.querySelector('.transfer-button');
    if (transferButton) {
        transferButton.addEventListener('click', () => {
            // 1. Show the pop-up message first
            showAlert("ขอบคุณนะคะ/ครับ พวกเราซาบซึ้งใจมากจริงๆ รอรับของขวัญจากเมย์และเต้ยนะคะ/ครับ");

            // 2. After a short delay, navigate to guestbook.html
            // This delay allows the user to read the pop-up message before the page changes.
            setTimeout(() => {
                window.location.href = 'guestbook.html';
            }, 2000); // Navigate after 2 seconds (adjust as needed)
        });
    }

}); // DOMContentLoaded end
