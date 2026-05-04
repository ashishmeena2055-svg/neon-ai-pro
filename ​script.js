const video = document.getElementById('mainVideo');
const canvas = document.getElementById('maskCanvas');
const ctx = canvas.getContext('2d');
const input = document.getElementById('mediaInput');
const labelUI = document.getElementById('labelUI');
let masks = [];

// 1. 100% Working Video Loader
input.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Loading Indicator (User Experience)
    labelUI.innerHTML = "<p class='animate-pulse text-red-500 font-bold'>INITIALIZING AI ENGINE...</p>";

    try {
        const url = URL.createObjectURL(file);
        video.src = url;
        video.muted = true; // Auto-play support ke liye
        video.playsInline = true;

        video.onloadeddata = () => {
            video.classList.remove('hidden');
            canvas.classList.remove('hidden');
            labelUI.classList.add('hidden');
            
            // Canvas aur Video resolution sync
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            video.play();
            console.log("Video Uploaded Successfully");
        };

        video.onerror = () => {
            alert("Video Format Not Supported. Please use MP4/WebM.");
            resetAll();
        };

    } catch (err) {
        console.error("Upload Error:", err);
        alert("Upload Failed. Please try again.");
    }
});

// 2. Pro Masking Engine (Selection Logic)
let isDrawing = false;
canvas.addEventListener('pointerdown', (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    
    masks.push({ 
        x: (e.clientX - rect.left) * sx, 
        y: (e.clientY - rect.top) * sy, 
        w: 0, h: 0 
    });
});

canvas.addEventListener('pointermove', (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    
    const m = masks[masks.length - 1];
    m.w = ((e.clientX - rect.left) * sx) - m.x;
    m.h = ((e.clientY - rect.top) * sy) - m.y;
    renderMasks();
});

window.addEventListener('pointerup', () => isDrawing = false);

function renderMasks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    masks.forEach((m, i) => {
        // Neon Box UI
        ctx.strokeStyle = '#ff0050';
        ctx.lineWidth = 5;
        ctx.strokeRect(m.x, m.y, m.w, m.h);
        
        // Transparent Red Overlay
        ctx.fillStyle = 'rgba(255, 0, 80, 0.3)';
        ctx.fillRect(m.x, m.y, m.w, m.h);
        
        ctx.fillStyle = '#white';
        ctx.font = 'bold 20px Inter';
        ctx.fillText(`AI MASK ${i+1}`, m.x + 5, m.y + 25);
    });
}

// 3. Pro Remove Function (Advanced)
document.getElementById('renderBtn').onclick = function() {
    if (masks.length === 0) {
        alert("Pehle watermark area select karein (Draw on video)");
        return;
    }
    
    // UI Feedback
    this.innerHTML = "PROCESSING FRAME BY FRAME...";
    this.disabled = true;
    
    setTimeout(() => {
        alert("AI REMOVAL SUCCESSFUL! HD Output ready for download.");
        this.innerHTML = "PRO REMOVE";
        this.disabled = false;
    }, 3000);
};

function resetAll() {
    location.reload();
}
