// script_gift_form.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Alert/Modal Functions (copied from main script.js) ---
    const customAlertOverlay = document.getElementById('custom-alert-overlay');
    const customAlertMessage = document.getElementById('custom-alert-message');
    const customAlertCloseBtn = document.getElementById('custom-alert-close-btn');

    function showAlert(message) {
        customAlertMessage.textContent = message;
        customAlertOverlay.classList.remove('hidden');
    }

    if (customAlertCloseBtn) {
        customAlertCloseBtn.addEventListener('click', () => {
            customAlertOverlay.classList.add('hidden');
        });
    }

    // --- Loading Spinner Functions (copied from main script.js) ---
    const loadingSpinner = document.getElementById('loading-spinner');

    function showLoadingSpinner(message = "กำลังประมวลผล...") {
        const spinnerP = loadingSpinner.querySelector('p');
        if (spinnerP) spinnerP.textContent = message;
        loadingSpinner.classList.remove('hidden');
    }

    function hideLoadingSpinner() {
        loadingSpinner.classList.add('hidden');
    }

    // --- Gift Receipt Form Submission ---
    const giftReceiptForm = document.getElementById('giftReceiptForm');
    const receiptStatus = document.getElementById('receiptStatus');
    const receiptEntries = document.getElementById('receiptEntries');

    // *** IMPORTANT: Change this URL to your Google Apps Script Web App URL for gift receipts ***
    // This URL will likely be different from the main RSVP/Guestbook URL if you want separate sheets.
    // For demonstration, we'll use localStorage, but in a real app, you'd set up a new Apps Script for this.
    const GOOGLE_APPS_SCRIPT_URL_GIFT = 'https://script.google.com/macros/s/YOUR_NEW_GIFT_RECEIPT_WEB_APP_URL_GOES_HERE/exec'; 

    // Function to load existing gift receipt entries (simulated via localStorage)
    function loadGiftReceiptEntries() {
        const storedEntries = JSON.parse(localStorage.getItem('giftReceiptEntries')) || [];
        receiptEntries.innerHTML = ''; // Clear existing
        if (storedEntries.length === 0) {
            receiptEntries.innerHTML = '<p>ยังไม่มีข้อมูลการโอนเงินค่ะ</p>';
        } else {
            storedEntries.forEach(entry => {
                const entryDiv = document.createElement('div');
                entryDiv.classList.add('guestbook-entry'); // Reusing existing style class
                entryDiv.innerHTML = `
                    <p class="entry-name">ชื่อ: ${entry.name || 'ไม่ระบุชื่อ'}</p>
                    <p class="entry-address">ที่อยู่: ${entry.address || 'ไม่ระบุ'}</p>
                    <p class="entry-phone">โทร: ${entry.phone || 'ไม่ระบุ'}</p>
                    ${entry.message ? `<p class="entry-message">ข้อความ: ${entry.message}</p>` : ''}
                `;
                receiptEntries.prepend(entryDiv); // Add to top
            });
        }
    }

    // Handle form submission for gift receipt
    if (giftReceiptForm) {
        giftReceiptForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                type: 'gift_receipt',
                name: document.getElementById('receiptName').value,
                address: document.getElementById('receiptAddress').value,
                phone: document.getElementById('receiptPhone').value,
                message: document.getElementById('receiptMessage').value
            };

            receiptStatus.textContent = 'กำลังส่งข้อมูล...';
            receiptStatus.style.color = '#007bff';
            showLoadingSpinner("กำลังส่งข้อมูล...");

            // Simulate sending data or use Google Apps Script (if URL is set)
            if (GOOGLE_APPS_SCRIPT_URL_GIFT === 'https://script.google.com/macros/s/YOUR_NEW_GIFT_RECEIPT_WEB_APP_URL_GOES_HERE/exec' || !GOOGLE_APPS_SCRIPT_URL_GIFT) {
                // If Apps Script URL is not set, just simulate with localStorage
                setTimeout(() => {
                    hideLoadingSpinner();
                    const storedEntries = JSON.parse(localStorage.getItem('giftReceiptEntries')) || [];
                    storedEntries.push(formData);
                    localStorage.setItem('giftReceiptEntries', JSON.stringify(storedEntries));
                    loadGiftReceiptEntries();
                    showAlert('ขอบคุณสำหรับการแจ้งข้อมูลค่ะ! เราได้รับข้อมูลเรียบร้อยแล้ว');
                    giftReceiptForm.reset();
                    receiptStatus.textContent = ''; // Clear status message
                }, 1500);
            } else {
                // Actual Google Apps Script submission
                try {
                    const response = await fetch(GOOGLE_APPS_SCRIPT_URL_GIFT, {
                        method: 'POST',
                        mode: 'no-cors', // Use 'no-cors'
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    });

                    console.log('Fetch request for gift receipt initiated. Check Google Sheet for updates.');
                    hideLoadingSpinner();
                    showAlert('ขอบคุณสำหรับการแจ้งข้อมูลค่ะ! เราได้รับข้อมูลเรียบร้อยแล้ว');
                    loadGiftReceiptEntries(); // Reload to show new entry (if it fetches from sheet)
                    giftReceiptForm.reset();
                    receiptStatus.textContent = ''; // Clear status message

                } catch (error) {
                    console.error('Error sending gift receipt data:', error);
                    hideLoadingSpinner();
                    showAlert('เกิดข้อผิดพลาดในการส่งข้อมูล โปรดลองอีกครั้ง');
                    receiptStatus.textContent = 'เกิดข้อผิดพลาดในการส่งข้อมูล โปรดลองอีกครั้ง';
                    receiptStatus.style.color = 'red';
                }
            }
        });
    } else {
        console.error('Gift Receipt form element not found! Please check ID "giftReceiptForm" in gift_receipt_form.html.');
    }

    // --- Music Toggle (copied from main script.js) ---
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggleBtn = document.getElementById('musicToggle');

    if (backgroundMusic && musicToggleBtn) {
        backgroundMusic.muted = true;
        backgroundMusic.play()
            .then(() => {
                musicToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            })
            .catch(e => {
                console.log("Autoplay blocked:", e);
                musicToggleBtn.innerHTML = '<i class="fas fa-music"></i>';
            });

        musicToggleBtn.addEventListener('click', () => {
            if (backgroundMusic.paused) {
                backgroundMusic.muted = false;
                backgroundMusic.play().catch(e => console.log("Play failed on click:", e));
            } else {
                if (backgroundMusic.muted) {
                    backgroundMusic.muted = false;
                } else {
                    backgroundMusic.pause();
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

    // --- Mobile Navigation Active State and Smooth Scroll (copied from main script.js) ---
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetHref = this.getAttribute('href');
            const currentPath = window.location.pathname.split('/').pop();

            if (targetHref.includes('.html') && !targetHref.startsWith('#')) {
                // Allow default navigation for different HTML pages
            } else if (targetHref.startsWith('#')) {
                e.preventDefault();
                const targetId = targetHref.substring(1);
                // Special handling for navigating back to index.html sections from this page
                if (currentPath === 'gift_receipt_form.html' && targetHref.startsWith('index.html')) {
                    window.location.href = targetHref; // Redirect to index.html with hash
                } else {
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    const updateMobileNavActiveState = () => {
        const currentPath = window.location.pathname.split('/').pop();
        mobileNavLinks.forEach(link => {
            link.classList.remove('active-nav');
            const href = link.getAttribute('href');

            if (href === currentPath) {
                link.classList.add('active-nav');
                return;
            }

            if (href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (currentPath === 'index.html' || currentPath === '') {
                    if (targetSection) {
                        const rect = targetSection.getBoundingClientRect();
                        const headerHeight = 0;
                        if (rect.top <= headerHeight + 10 && rect.bottom >= headerHeight + 10) {
                            link.classList.add('active-nav');
                        }
                    } else if (targetId === 'hero-section' && window.scrollY < 100) {
                        link.classList.add('active-nav');
                    }
                }
            }
        });
        // Activate the "QR" button on this new page if it's the gift receipt page
        if (currentPath === 'gift_receipt_form.html') {
             mobileNavLinks.forEach(link => {
                // Assuming the QR/Gift button is intended to be active when on this page
                if (link.getAttribute('href') === 'index.html#gift-section') { // Or if you want a specific link for this page
                    link.classList.add('active-nav');
                }
            });
        }
    };

    window.addEventListener('scroll', updateMobileNavActiveState);
    window.addEventListener('load', updateMobileNavActiveState);
    updateMobileNavActiveState(); // Initial check

    // Load entries when this page loads (if applicable)
    loadGiftReceiptEntries(); 
});
