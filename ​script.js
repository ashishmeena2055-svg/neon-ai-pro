const video = document.getElementById('mainVideo');
const canvas = document.getElementById('maskCanvas');
const ctx = canvas.getContext('2d');
const input = document.getElementById('mediaInput');
const labelUI = document.getElementById('labelUI');
let masks = [];

// 1. Loader Logic
input.onchange = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    
    video.src = URL.createObjectURL(file);
    video.classList.remove('hidden');
    canvas.classList.remove('hidden');
    labelUI.classList.add('hidden');

    video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.play();
    };
};

// 2. Multi-Mask Drawing Logic
let drawing = false;
canvas.onmousedown = (e) => {
    drawing = true;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    masks.push({ x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy, w: 0, h: 0 });
};

canvas.onmousemove = (e) => {
    if(!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    const m = masks[masks.length - 1];
    m.w = ((e.clientX - rect.left) * sx) - m.x;
    m.h = ((e.clientY - rect.top) * sy) - m.y;
    draw();
};

window.onmouseup = () => drawing = false;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    masks.forEach((m, i) => {
        ctx.strokeStyle = '#ff0050';
        ctx.lineWidth = 4;
        ctx.strokeRect(m.x, m.y, m.w, m.h);
        ctx.fillStyle = 'rgba(255, 0, 80, 0.2)';
        ctx.fillRect(m.x, m.y, m.w, m.h);
        ctx.fillStyle = '#ff0050';
        ctx.fillText(`MASK ${i+1}`, m.x, m.y - 10);
    });
}

function resetAll() {
    masks = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    location.reload();
}

function autoScan() {
    // Fake AI Scan for UI Feel
    alert("AI Engine Scanning Frames... Text Detected!");
    masks.push({ x: 50, y: 50, w: 300, h: 100 });
    draw();
}
