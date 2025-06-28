document.addEventListener('DOMContentLoaded', function() {
    let slipAsBase64 = null;

    // --- Toast Notification Helper Function ---
    const toast = document.getElementById('toast');
    function showToast(message, type = 'success') {
        if (!toast) return;
        toast.innerText = message;
        toast.className = 'show';
        if (type === 'error') {
            toast.classList.add('error');
        }
        setTimeout(() => {
            toast.className = toast.className.replace('show', '').replace('error', '');
        }, 3000);
    }

    // --- Lightbox, Copy Button, Amount Logic ---
    // (โค้ดส่วนนี้เหมือนเดิม)

    // === SLIP UPLOAD LOGIC WITH DRAG & DROP AND PREVIEW ===
    const slipInput = document.getElementById('slip-input');
    const dropZoneElement = document.querySelector(".drop-zone");
    const previewContainer = document.querySelector(".drop-zone__preview-container");

    function updatePreview(file) {
        if (!file) {
            previewContainer.style.display = "none";
            dropZoneElement.style.display = "flex";
            return;
        }

        previewContainer.style.display = "block";
        dropZoneElement.style.display = "none";
        previewContainer.innerHTML = `
            <img src="" class="drop-zone__thumb">
            <div class="drop-zone__filename">${file.name}</div>
            <button type="button" class="drop-zone__remove-btn">×</button>
        `;
        const thumbElement = previewContainer.querySelector(".drop-zone__thumb");

        // Show thumbnail and resize logic
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            thumbElement.src = reader.result; // Show original image in preview
            
            // Resize logic for sending
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                const MAX_WIDTH = 1024;
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                slipAsBase64 = canvas.toDataURL('image/jpeg', 0.8);
                showToast('แนบไฟล์และย่อขนาดสำเร็จ', 'success');
            };
        };
        
        previewContainer.querySelector(".drop-zone__remove-btn").addEventListener("click", () => {
            slipInput.value = null; // Clear the file input
            slipAsBase64 = null;
            updatePreview(null);
        });
    }

    if (dropZoneElement) {
        dropZoneElement.addEventListener("dragover", e => {
            e.preventDefault();
            dropZoneElement.classList.add("is-dragover");
        });
        ["dragleave", "dragend"].forEach(type => {
            dropZoneElement.addEventListener(type, e => {
                dropZoneElement.classList.remove("is-dragover");
            });
        });
        dropZoneElement.addEventListener("drop", e => {
            e.preventDefault();
            if (e.dataTransfer.files.length) {
                slipInput.files = e.dataTransfer.files;
                updatePreview(e.dataTransfer.files[0]);
            }
            dropZoneElement.classList.remove("is-dragover");
        });
    }

    if(slipInput){
        slipInput.addEventListener("change", e => {
            if (slipInput.files.length) {
                updatePreview(slipInput.files[0]);
            }
        });
    }

    // === FORM SUBMISSION LOGIC (เหมือนเดิม) ===
    const giftForm = document.getElementById('gift-form');
    // ... โค้ดส่วนที่เหลือเหมือนเดิม ...
});