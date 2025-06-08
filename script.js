document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Countdown Timer ---
    const countdownElement = document.getElementById('countdown');
    // ตั้งค่าวันแต่งงาน (เปลี่ยนเป็นวันที่แท้จริงของคุณ: ปี, เดือน(0-11), วัน, ชั่วโมง, นาที, วินาที)
<<<<<<< HEAD
    // ตัวอย่าง: วันจันทร์ที่ 28 กรกฏาคม 2568 เวลา 07:30:00 (งานเช้า)
=======
<<<<<<< HEAD
    // ตัวอย่าง: วันจันทร์ที่ 28 กรกฏาคม 2568 เวลา 07:30:00 (งานเช้า)
=======
>>>>>>> 46ab40849f731955a2cf3c4669969e31f58685b2
>>>>>>> 3c0aded4b0a07023a20d0fbacb87c32b0758cf50
    const weddingDate = new Date('July 28, 2025 07:30:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 3c0aded4b0a07023a20d0fbacb87c32b0758cf50
            countdownElement.innerHTML = "งานแต่งงานได้เริ่มต้นขึ้นแล้ว!"; // Wedding has started!
            clearInterval(countdownInterval); // Stop countdown
        } else {
            // คำนวณเป็น วัน ชั่วโมง นาที วินาที โดยไม่รวม weeks
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
<<<<<<< HEAD
=======
=======
            countdownElement.innerHTML = "งานแต่งงานได้เริ่มต้นขึ้นแล้ว!";
            clearInterval(countdownInterval);
>>>>>>> 46ab40849f731955a2cf3c4669969e31f58685b2
>>>>>>> 3c0aded4b0a07023a20d0fbacb87c32b0758cf50
        } else {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

<<<<<<< HEAD
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
=======
            document.getElementById('days').innerText = String(days).padStart(2, '0');
            document.getElementById('hours').innerText = String(hours).padStart(2, '0');
            document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
            document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
>>>>>>> 46ab40849f731955a2cf3c4669969e31f58685b2
        }
    };

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // เรียกใช้ครั้งแรกทันที


    // --- 2. Scroll to Section for Mobile Nav Bar ---
    // เลือกปุ่มทั้งหมดใน Mobile Nav Bar
    const navItems = document.querySelectorAll('.mobile-nav-bar .nav-item');

    // --- 2. Scroll to Section for Mobile Nav Bar ---
const navItems = document.querySelectorAll('.mobile-nav-bar .nav-item');

navItems.forEach(item => {
    item.addEventListener('click', function(event) {
        const targetHref = this.getAttribute('href'); // ได้ #home, gift.html ฯลฯ

        // ตรวจสอบว่าลิงก์นั้นเป็นลิงก์ภายในหน้า (#...) หรือไม่
        if (targetHref.startsWith('#')) {
            event.preventDefault(); // ป้องกันการกระทำ default เฉพาะถ้าเป็นลิงก์ภายในหน้า

            const targetSection = document.querySelector(targetHref);
            if (targetSection) {
                // เลื่อนไปยังส่วนนั้นอย่างนุ่มนวล
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
        // ถ้าไม่ใช่ลิงก์ภายในหน้า (เช่น 'gift.html') ก็ไม่ต้อง preventDefault
        // เบราว์เซอร์จะทำงานตามปกติคือเปลี่ยนไปหน้าใหม่
    });
});

    // Optional: เพิ่ม class 'active' ให้กับปุ่มที่อยู่บนหน้าจอ
    // (ซับซ้อนขึ้นเล็กน้อย ถ้าต้องการให้แถบนำทางรู้ว่าอยู่ส่วนไหนของหน้า)
    // const sections = document.querySelectorAll('section[id], header[id]'); // เลือกทุก section ที่มี ID
    // window.addEventListener('scroll', () => {
    //     let current = '';
    //     sections.forEach(section => {
    //         const sectionTop = section.offsetTop;
    //         const sectionHeight = section.clientHeight;
    //         if (pageYOffset >= sectionTop - sectionHeight / 3) { // ปรับค่า /3 เพื่อให้ active เร็วขึ้น
    //             current = section.getAttribute('id');
    //         }
    //     });

    //     navItems.forEach(item => {
    //         item.classList.remove('active');
    //         if (item.getAttribute('href').includes(current)) {
    //             item.classList.add('active');
    //         }
    //     });
    // });


    // --- 3. Gallery Slider ---
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.dots-container');
    let currentIndex = 0;
    let slides = []; // จะเก็บ element ของรูปภาพ

    // Function to initialize slider and dots
    const initializeSlider = () => {
        slides = Array.from(sliderWrapper.children); // แปลง HTMLCollection เป็น Array
        createDots();
        showSlide(currentIndex);
    };

    const createDots = () => {
        dotsContainer.innerHTML = ''; // เคลียร์ dots เก่า
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.index = index;
            dot.addEventListener('click', () => showSlide(index));
            dotsContainer.appendChild(dot);
        });
    };

    const showSlide = (index) => {
        // วนกลับไปสไลด์แรกหรือสุดท้ายถ้า index เกิน
        if (index >= slides.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = slides.length - 1;
        } else {
            currentIndex = index;
        }

        const offset = -currentIndex * 100;
        sliderWrapper.style.transform = `translateX(${offset}%)`;

        // อัปเดต active dot
        document.querySelectorAll('.dot').forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));

    initializeSlider(); // เรียกใช้งานเมื่อโหลด DOM เสร็จ


    // --- 4. RSVP Form Submission (เชื่อมกับ Google Apps Script) ---
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpStatus = document.getElementById('rsvpStatus');
    const numGuestsField = document.getElementById('numGuestsField');
    const attendingStatus = document.getElementById('attendingStatus');

    // Show/hide numGuestsField based on attendingStatus
    attendingStatus.addEventListener('change', () => {
        if (attendingStatus.value === 'yes') {
            numGuestsField.style.display = 'block';
        } else {
            numGuestsField.style.display = 'none';
        }
    });

    rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        rsvpStatus.textContent = 'กำลังส่งข้อมูล...';
        rsvpStatus.style.color = '#FFA500'; // Orange

        const formData = new FormData(rsvpForm);
        const data = Object.fromEntries(formData.entries());

        // ตรวจสอบสถานะการเข้าร่วมเพื่อกำหนดจำนวนผู้เข้าร่วมเริ่มต้น
        if (data.attendingStatus === 'no') {
            data.numGuests = 0; // ถ้าไม่เข้าร่วม ให้จำนวนผู้เข้าร่วมเป็น 0
        } else if (data.attendingStatus === 'yes' && !data.numGuests) {
            data.numGuests = 1; // ถ้าเข้าร่วมแต่ไม่ได้ระบุ ให้เป็น 1
        }

        // URL ของ Google Apps Script ที่ Deploy แล้ว
        // **สำคัญ: ต้องเปลี่ยน URL นี้ให้เป็นของคุณ**
        const appsScriptURL = 'https://script.google.com/macros/s/AKfycbxX20hHm-7FwtkH1bQfaI_8PvSSTnA5RO1Bdo586LPkxxNQESlmwg4oIRNG3oGluhN-/exec';

        try {
            const response = await fetch(appsScriptURL, {
                method: 'POST',
                mode: 'no-cors', // หรือ 'cors' ถ้า Apps Script อนุญาต
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(data).toString(),
            });

            // เนื่องจากการใช้ 'no-cors' จะไม่สามารถตรวจสอบ response ได้โดยตรง
            // คุณจะต้องตรวจสอบที่ Google Sheet ว่าข้อมูลเข้าหรือไม่
            // สมมติว่าการส่งสำเร็จหลังจาก fetch โดยไม่มี error
            rsvpStatus.textContent = 'ขอบคุณสำหรับการยืนยันค่ะ!';
            rsvpStatus.style.color = '#28a745'; // Green
            rsvpForm.reset();
            numGuestsField.style.display = 'none'; // ซ่อนหลังจากส่งสำเร็จ

        } catch (error) {
            console.error('Error submitting RSVP:', error);
            rsvpStatus.textContent = 'เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองอีกครั้งค่ะ';
            rsvpStatus.style.color = '#dc3545'; // Red
        }
    });

    // --- 5. Guestbook Form Submission (เชื่อมกับ Google Apps Script) ---
    const guestbookForm = document.getElementById('guestbookForm');
    const guestbookStatus = document.getElementById('guestbookStatus');
    const guestbookEntriesContainer = document.getElementById('guestbookEntries');

    // Function to add a new guestbook entry to the display
    const addGuestbookEntryToDisplay = (name, message) => {
        const newEntry = document.createElement('div');
        newEntry.classList.add('guestbook-entry');
        newEntry.innerHTML = `
            <p class="entry-name">${name}</p>
            <p class="entry-message">${message}</p>
        `;
        guestbookEntriesContainer.prepend(newEntry); // เพิ่มไว้ด้านบนสุด
    };

    guestbookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        guestbookStatus.textContent = 'กำลังส่งคำอวยพร...';
        guestbookStatus.style.color = '#FFA500';

        const formData = new FormData(guestbookForm);
        const data = Object.fromEntries(formData.entries());

        // URL ของ Google Apps Script สำหรับสมุดอวยพร
        // **สำคัญ: ต้องเปลี่ยน URL นี้ให้เป็นของคุณ**
        const appsScriptGuestbookURL = 'https://script.google.com/macros/s/AKfycbxX20hHm-7FwtkH1bQfaI_8PvSSTnA5RO1Bdo586LPkxxNQESlmwg4oIRNG3oGluhN-/exec';

        try {
            const response = await fetch(appsScriptGuestbookURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(data).toString(),
            });

            guestbookStatus.textContent = 'ขอบคุณสำหรับคำอวยพรค่ะ!';
            guestbookStatus.style.color = '#28a745';
            addGuestbookEntryToDisplay(data.guestbookName, data.guestbookMessage); // เพิ่มลงในหน้าจอทันที
            guestbookForm.reset();

        } catch (error) {
            console.error('Error submitting Guestbook:', error);
            guestbookStatus.textContent = 'เกิดข้อผิดพลาดในการส่งคำอวยพร กรุณาลองอีกครั้งค่ะ';
            guestbookStatus.style.color = '#dc3545';
        }
    });


    // --- 6. Background Music Toggle ---
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggleBtn = document.getElementById('musicToggleBtn');

    // ลองเล่นเพลงอัตโนมัติ (อาจถูกบล็อกโดยเบราว์เซอร์)
    backgroundMusic.volume = 0.5; // ตั้งค่าเริ่มต้นเสียง 50%
    backgroundMusic.play()
        .then(() => {
            console.log("Autoplayed muted successfully.");
            // ถ้าเล่นอัตโนมัติได้ ให้แสดงปุ่มปิดเสียง
            musicToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        })
        .catch(e => {
            console.log("Autoplay blocked:", e);
            // ถ้าถูกบล็อก ให้แสดงปุ่มเล่นเพลง
            musicToggleBtn.innerHTML = '<i class="fas fa-music"></i>';
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
        } else { // paused and not muted (e.g. was playing, then paused)
            musicToggleBtn.innerHTML = '<i class="fas fa-music"></i>';
        }
    };

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 3c0aded4b0a07023a20d0fbacb87c32b0758cf50
    // --- Mobile Navigation Smooth Scroll ---
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
<<<<<<< HEAD

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
=======
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
>>>>>>> 3c0aded4b0a07023a20d0fbacb87c32b0758cf50
            }
        });
    });
});
=======
    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const invitationSection = document.getElementById('invitation');
            if (invitationSection) {
                invitationSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

});
>>>>>>> 46ab40849f731955a2cf3c4669969e31f58685b2
