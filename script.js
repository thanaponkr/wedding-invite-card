document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Countdown Timer ---
    const countdownElement = document.getElementById('countdown');
    // ตรวจสอบว่ามี countdownElement ในหน้านี้หรือไม่
    if (countdownElement) {
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
                // โครงสร้างนี้รองรับการจัดวางแบบตัวเลขอยู่บน หน่วยอยู๋ล่างได้ด้วย CSS
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
    }


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
    const rsvpStatus = document.getElementById('rsvpStatus'); // This element will no longer display the success message directly
    const guestbookForm = document.getElementById('guestbookForm'); // Keep reference for guestbook.html
    const guestbookStatus = document.getElementById('guestbookStatus'); // Keep reference for guestbook.html
    const guestbookEntries = document.getElementById('guestbookEntries'); // Keep reference for guestbook.html

    // *** สำคัญมาก! เปลี่ยน URL นี้เป็น Web App URL ที่คุณคัดลอกมาจาก Google Apps Script ในขั้นตอน 3.3.6 ***
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxX20hHm-7FwtkH1bQfaI_8PvSSTnA5RO1Bdo586LPkxxNQESlmwg4oIRNG3oGluhN-/exec'; // <<< แก้ไขตรงนี้เท่านั้น!

    // --- Custom Alert/Modal Functions (Moved here for accessibility) ---
    const customAlertOverlay = document.getElementById('custom-alert-overlay');
    const customAlertMessage = document.getElementById('custom-alert-message');
    const customAlertCloseBtn = document.getElementById('custom-alert-close-btn');

    function showAlert(message) {
        customAlertMessage.textContent = message;
        customAlertOverlay.classList.remove('hidden');
        // Automatically hide the alert after 3 seconds
        setTimeout(() => {
            customAlertOverlay.classList.add('hidden');
        }, 3000); // Pop-up will disappear after 3 seconds
    }

    // This event listener will be removed as the showAlert now handles auto-hide
    if (customAlertCloseBtn) {
        customAlertCloseBtn.addEventListener('click', () => {
            customAlertOverlay.classList.add('hidden');
        });
    }

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


    // Function to handle form submission for both RSVP and Guestbook
    const handleFormSubmission = async (event, formType) => {
        event.preventDefault(); // Prevent default form submission (page reload)

        let formData = {};
        let statusElement; // This is now primarily for displaying "กำลังส่งข้อมูล..."
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
            successMessage = 'ขอบคุณสำหรับการตอบรับ เราได้รับข้อมูลของคุณแล้ว!'; // Message for Pop-up
            errorMessage = 'เกิดข้อผิดพลาดในการส่งข้อมูล RSVP โปรดลองอีกครั้ง';
        } else if (formType === 'guestbook') {
            // Note: This part handles the guestbook form on guestbook.html
            formData = {
                type: 'guestbook', // This 'type' field tells Apps Script which sheet to use
                name: document.getElementById('guestbookName').value,
                message: document.getElementById('guestbookMessage').value
            };
            statusElement = guestbookStatus;
            successMessage = 'ขอบคุณสำหรับคำอวยพรค่ะ! ข้อความของคุณถูกบันทึกแล้ว';
            errorMessage = 'เกิดข้อผิดพลาดในการส่งคำอวยพร โปรดลองอีกครั้ง';
        } else {
            console.error('Unknown form type:', formType);
            return;
        }

        // Check if Apps Script URL is set
        if (GOOGLE_APPS_SCRIPT_URL === 'YOUR_WEB_APP_URL_GOES_HERE' || !GOOGLE_APPS_SCRIPT_URL) {
            // If URL is not set, use custom alert to inform user
            showAlert('โปรดตั้งค่า GOOGLE_APPS_SCRIPT_URL ใน script.js ก่อน!');
            console.error('GOOGLE_APPS_SCRIPT_URL is not set or is still the placeholder.');
            return;
        }

        statusElement.textContent = 'กำลังส่งข้อมูล...'; // Show loading message
        statusElement.style.color = '#007bff';
        showLoadingSpinner("กำลังส่งข้อมูล..."); // Show spinner
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
            hideLoadingSpinner(); // Hide spinner on success
            showAlert(successMessage); // Show success message in pop-up

            // Reset the form
            if (formType === 'rsvp') {
                rsvpForm.reset();
                statusElement.textContent = ''; // Clear the text message under the RSVP button
            } else if (formType === 'guestbook') {
                if (guestbookForm) {
                    guestbookForm.reset();
                    // For guestbook, we should also display the new entry
                    const newEntry = document.createElement('div');
                    newEntry.classList.add('guestbook-entry');
                    newEntry.innerHTML = `
                        <p class="entry-name">${formData.name || 'ไม่ระบุชื่อ'}</p>
                        <p class="entry-message">${formData.message || ''}</p>
                    `;
                    if (guestbookEntries) {
                        guestbookEntries.prepend(newEntry);
                    }
                }
                statusElement.textContent = ''; // Clear the text message under the Guestbook button
            }

        } catch (error) {
            console.error(`Error sending ${formType} data:`, error);
            hideLoadingSpinner(); // Hide spinner on error
            showAlert(errorMessage); // Show error message in pop-up
            statusElement.textContent = 'เกิดข้อผิดพลาดในการส่งข้อมูล โปรดลองอีกครั้ง'; // Still show text message for error
            statusElement.style.color = 'red';
        }
    };

    // Attach event listeners to forms
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (event) => handleFormSubmission(event, 'rsvp'));
    } else {
        console.error('RSVP form element not found! Please check ID "rsvpForm" in index.html.');
    }

    // Guestbook form is on guestbook.html, so this listener will only activate on that page
    if (guestbookForm && window.location.pathname.endsWith('guestbook.html')) {
        // Function to load existing guestbook entries (simulated via localStorage for demonstration)
        function loadGuestbookEntries() {
            const storedEntries = JSON.parse(localStorage.getItem('guestbookEntries')) || [];
            if (guestbookEntries) {
                guestbookEntries.innerHTML = ''; // Clear existing
                storedEntries.forEach(entry => {
                    const entryDiv = document.createElement('div');
                    entryDiv.classList.add('guestbook-entry');
                    entryDiv.innerHTML = `
                        <p class="entry-name">${entry.name || 'ไม่ระบุชื่อ'}</p>
                        <p class="entry-message">${entry.message || ''}</p>
                    `;
                    guestbookEntries.prepend(entryDiv); // Add to top
                });
            }
        }
        loadGuestbookEntries(); // Load entries on guestbook.html load

        guestbookForm.addEventListener('submit', (event) => handleFormSubmission(event, 'guestbook'));
    } else if (window.location.pathname.endsWith('guestbook.html')) {
        console.error('Guestbook form elements not found on guestbook.html! Check IDs "guestbookForm", "guestbookName", "guestbookMessage".');
    }


    // --- 4. Gallery Slider ---
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    const sliderDotsContainer = document.querySelector('.slider-dots');
    let currentSlideIndex = 0; // Tracks the index of the first visible slide
    let autoplayInterval; // Variable to hold the autoplay interval ID
    let startX = 0;
    let endX = 0;
    const swipeThreshold = 50; // Minimum distance for a swipe

    // ตรวจสอบว่ามี sliderWrapper ในหน้านี้หรือไม่ ก่อนจะสร้าง dots และเพิ่ม event listeners ของ slider
    if (sliderWrapper) {

        // Function to determine how many slides are visible at once
        const getSlidesPerView = () => {
            // Adjust this breakpoint as needed for your design
            return window.innerWidth <= 768 ? 1 : 3;
        };

        let slidesPerView = getSlidesPerView();
        let totalDots;

        // Function to update the slider and dots based on current view settings
        const updateSliderDisplay = () => {
            slidesPerView = getSlidesPerView(); // Re-evaluate slidesPerView on resize
            
            // Clear existing dots
            sliderDotsContainer.innerHTML = '';

            // Re-calculate totalDots based on slidesPerView
            if (slidesPerView === 1) {
                totalDots = slides.length; // 1 dot per image on mobile
            } else {
                totalDots = Math.ceil(slides.length / slidesPerView); // 1 dot per group of images on desktop
            }

            // Re-create dots
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.dataset.index = i; // Store the group/slide index
                dot.addEventListener('click', () => {
                    stopAutoplay();
                    // If on desktop, click on dot 'i' moves to slide 'i * slidesPerView'
                    // If on mobile, click on dot 'i' moves to slide 'i'
                    showSlide(slidesPerView === 1 ? i : i * slidesPerView);
                    startAutoplay();
                });
                sliderDotsContainer.appendChild(dot);
            }

            // Ensure currentSlideIndex is valid for the new slidesPerView and slides length
            const maxVisibleIndex = slides.length - slidesPerView;
            if (currentSlideIndex > maxVisibleIndex) {
                currentSlideIndex = maxVisibleIndex >= 0 ? maxVisibleIndex : 0;
            }
            if (currentSlideIndex % slidesPerView !== 0 && slidesPerView === 3) {
                 // Snap to the start of the current group if it's desktop view
                currentSlideIndex = Math.floor(currentSlideIndex / slidesPerView) * slidesPerView;
            }
            
            showSlide(currentSlideIndex); // Update slider position
        };

        const showSlide = (newIndex) => {
            const maxVisibleIndex = slides.length - slidesPerView;

            if (newIndex > maxVisibleIndex) {
                currentSlideIndex = 0; // Loop back to start
            } else if (newIndex < 0) {
                currentSlideIndex = maxVisibleIndex; // Loop back to end
            } else {
                currentSlideIndex = newIndex;
            }
            
            // Calculate translateX based on currentSlideIndex and current slidesPerView
            sliderWrapper.style.transform = `translateX(-${currentSlideIndex * (100 / slidesPerView)}%)`;

            // Update active dot
            const dots = document.querySelectorAll('.slider-dots .dot');
            dots.forEach((dot, idx) => {
                dot.classList.remove('active-dot');
                if (slidesPerView === 1) {
                    if (idx === currentSlideIndex) {
                        dot.classList.add('active-dot');
                    }
                } else { // Desktop view (slidesPerView === 3)
                    // Activate dot if its group start index matches currentSlideIndex
                    if (idx * slidesPerView === currentSlideIndex) {
                        dot.classList.add('active-dot');
                    }
                }
            });
        };

        const nextSlide = () => {
            const nextIndex = currentSlideIndex + slidesPerView;
            showSlide(nextIndex);
        };

        const prevSlide = () => {
            const prevIndex = currentSlideIndex - slidesPerView;
            showSlide(prevIndex);
        };

        // Autoplay functionality
        const startAutoplay = () => {
            stopAutoplay(); // Clear any existing interval
            autoplayInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
        };

        const stopAutoplay = () => {
            clearInterval(autoplayInterval);
        };

        // Handle touch events for swipe
        sliderWrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopAutoplay(); // Pause autoplay during manual swipe
        });

        sliderWrapper.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        });

        sliderWrapper.addEventListener('touchend', () => {
            if (startX - endX > swipeThreshold) { // Swiped left
                nextSlide();
            } else if (endX - startX > swipeThreshold) { // Swiped right
                prevSlide();
            }
            startAutoplay(); // Resume autoplay after swipe
            startX = 0; // Reset
            endX = 0;   // Reset
        });


        // Start autoplay when the page loads
        startAutoplay();

        // Pause autoplay on hover (desktop)
        sliderWrapper.addEventListener('mouseenter', stopAutoplay);
        sliderWrapper.addEventListener('mouseleave', startAutoplay);
        prevButton.addEventListener('mouseenter', stopAutoplay);
        prevButton.addEventListener('mouseleave', startAutoplay);
        nextButton.addEventListener('mouseenter', stopAutoplay);
        nextButton.addEventListener('mouseleave', startAutoplay);
        // Dots hover listener is handled by the dot creation loop now


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
        
        // Initial setup and update on window resize
        window.addEventListener('resize', updateSliderDisplay);
        updateSliderDisplay(); // Initial display setup
    }


    // --- 5. Fade-in Section on Scroll ---
    const sectionsFadeIn = document.querySelectorAll('.section');

    const fadeInOnScroll = () => {
        sectionsFadeIn.forEach(section => {
            // ตรวจสอบว่า section มีค่า opacity และ transform ที่จะ fade-in ได้
            // หรือถ้า section คือ guestbook-section ใน guestbook.html ให้มี opacity 1 ทันที
            if (section.id === 'guestbook-section' && window.location.pathname.endsWith('guestbook.html')) {
                section.classList.add('fade-in'); // เพิ่มคลาสเพื่อให้ display ได้ทันที
                // ไม่ต้องทำการคำนวณ sectionTop สำหรับหน้านี้ เพราะต้องการให้แสดงทันที
            } else {
                const sectionTop = section.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;

                if (sectionTop < windowHeight * 0.85) {
                    section.classList.add('fade-in');
                } else {
                    // section.classList.remove('fade-in'); // Optional: uncomment if you want fade-out when scrolling back up
                }
            }
        });
    };

    // เรียกใช้ fadeInOnScroll ทันทีเมื่อโหลดหน้า เพื่อให้ส่วนแรกๆ ที่ควรจะแสดงผลปรากฏ
    // และเพิ่ม listener สำหรับการ scroll
    window.addEventListener('scroll', fadeInOnScroll);
    fadeInOnScroll();


    // --- 6. Background Music Toggle ---
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggleBtn = document.getElementById('musicToggle');

    if (backgroundMusic && musicToggleBtn) { // ตรวจสอบว่ามี element เหล่านี้ในหน้า
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
    }


    // --- Mobile Navigation Smooth Scroll ---
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetHref = this.getAttribute('href');
            const currentPath = window.location.pathname.split('/').pop();

            // Check if the link is to a different page or to a section on the same page
            if (targetHref.includes('.html') && !targetHref.startsWith('#')) {
                // If it's a link to a different HTML page, allow default navigation
                // We don't preventDefault here, so the browser handles the page load
            } else if (targetHref.startsWith('#')) {
                // If it's an anchor link on the current page or from another page back to index.html with an anchor
                e.preventDefault(); // Prevent default hash scroll behavior

                const targetId = targetHref.substring(1);
                // If linking to a section on index.html from guestbook.html, navigate first
                if (currentPath === 'guestbook.html' && !targetHref.startsWith('guestbook.html') && targetHref !== '#hero-section') {
                    window.location.href = `index.html${targetHref}`;
                } else {
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop,
                            behavior: 'smooth'
                        });
                    } else if (targetId === 'hero-section' && (currentPath === 'index.html' || currentPath === '')) {
                        // Special case for Home link on index.html to go to top
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    // Handle active state for mobile nav links
    const updateMobileNavActiveState = () => {
        const currentPath = window.location.pathname.split('/').pop();
        mobileNavLinks.forEach(link => {
            link.classList.remove('active-nav');
            const href = link.getAttribute('href');

            // Handle direct page links (e.g., guestbook.html)
            if (href === currentPath) {
                link.classList.add('active-nav');
                return; // Skip further checks for this link
            }

            // Handle anchor links (e.g., #hero-section)
            if (href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                // If on index.html and the section is visible, activate the link
                if (currentPath === 'index.html' || currentPath === '') {
                    if (targetSection) {
                        const rect = targetSection.getBoundingClientRect();
                        const headerHeight = 0; // Adjust if you have a fixed header
                        if (rect.top <= headerHeight + 10 && rect.bottom >= headerHeight + 10) {
                            // Check if the top of the section is near the viewport top
                            link.classList.add('active-nav');
                        }
                    } else if (targetId === 'hero-section' && window.scrollY < 100) { // For hero section, check if scrolled to top
                        link.classList.add('active-nav');
                    }
                }
            }
        });
    };

    // Initial call and on scroll/load for active state
    window.addEventListener('scroll', updateMobileNavActiveState);
    window.addEventListener('load', updateMobileNavActiveState);
    updateMobileNavActiveState(); // Initial check


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

    // Handle "โอนเงินแล้ว" button click: NOW LINKS TO GUESTBOOK.HTML
    const transferButton = document.querySelector('.transfer-button');
    if (transferButton) {
        transferButton.addEventListener('click', () => {
            window.location.href = 'guestbook.html'; // ลิงก์ไปยัง guestbook.html โดยตรง
        });
    }
});
