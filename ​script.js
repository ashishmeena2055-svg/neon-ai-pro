const player = document.getElementById('mainPlayer');
const canvas = document.getElementById('aiCanvas');
const ctx = canvas.getContext('2d');
const upload = document.getElementById('mediaUpload');
const uploadUI = document.getElementById('upload-ui');
let masks = [];

// 1. File Loader
upload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if(!file) return;

    const url = URL.createObjectURL(file);
    player.src = url;
    
    player.onloadedmetadata = () => {
        player.classList.remove('hidden');
        canvas.classList.remove('hidden');
        uploadUI.classList.add('hidden');
        
        canvas.width = player.videoWidth;
        canvas.height = player.videoHeight;
        drawInitialMasks();
    };
});

// 2. Multi-Text Manual Selection Logic (Advanced)
let isDrawing = false;
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    masks.push({
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
        w: 0, h: 0, id: Date.now()
    });
});

canvas.addEventListener('mousemove', (e) => {
    if(!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const lastMask = masks[masks.length - 1];
    lastMask.w = ((e.clientX - rect.left) * scaleX) - lastMask.x;
    lastMask.h = ((e.clientY - rect.top) * scaleY) - lastMask.y;
    renderAll();
});

window.addEventListener('mouseup', () => isDrawing = false);

// 3. AI Renderer Visualization
function renderAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    masks.forEach(m => {
        // Neon Box Style
        ctx.strokeStyle = '#ff0050';
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 5]);
        ctx.strokeRect(m.x, m.y, m.w, m.h);
        
        // Processing Glow
        ctx.fillStyle = 'rgba(255, 0, 80, 0.15)';
        ctx.fillRect(m.x, m.y, m.w, m.h);
        
        // Label
        ctx.setLineDash([]);
        ctx.fillStyle = '#ff0050';
        ctx.font = 'bold 14px Poppins';
        ctx.fillText(`AI-MASK [${masks.indexOf(m) + 1}]`, m.x, m.y - 10);
    });
}

function clearMasks() {
    masks = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 4. Background Processor (FFmpeg Simulation)
async function autoDetectText() {
    // Isme Tesseract logic ya frame scanning add hota hai
    console.log("Scanning for text overlays...");
    // Demo detect coordinate
    masks.push({x: 100, y: 100, w: 400, h: 80});
    renderAll();
}
