let canvas = document.getElementById('imageCanvas');
let ctx = canvas.getContext('2d');
let uploadedImage = new Image();
let currentEmoticon = '';
let dragging = false;
let draggedElement = null;
let elements = [];  // Store added elements (emoticons, text)

// Function to handle image upload
function uploadImage(event) {
    let reader = new FileReader();
    reader.onload = function(e) {
        uploadedImage.src = e.target.result;
        uploadedImage.onload = () => {
            // Adjust canvas size based on uploaded image, but with limits
            let maxWidth = 500;
            let maxHeight = 500;
            let ratio = Math.min(maxWidth / uploadedImage.width, maxHeight / uploadedImage.height);
            canvas.width = uploadedImage.width * ratio;
            canvas.height = uploadedImage.height * ratio;
            ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
        };
    };
    reader.readAsDataURL(event.target.files[0]);
}

// Function to select emoticon
function selectEmoticon(emoticon) {
    currentEmoticon = emoticon;
    elements.push({
        type: 'emoticon',
        content: emoticon,
        x: 50,
        y: 50,
        fontSize: 50,
    });
    redrawCanvas();
}

// Function to add text
function addText() {
    const text = document.getElementById('userText').value;
    const font = document.getElementById('fontSelect').value;
    const color = document.getElementById('textColor').value;
    
    if (text !== '') {
        elements.push({
            type: 'text',
            content: text,
            x: 50,
            y: canvas.height - 50,
            fontSize: 30,
            font: font,
            color: color,
        });
        redrawCanvas();
    }
}

// Redraw canvas to reflect all elements
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);

    elements.forEach((element) => {
        if (element.type === 'emoticon') {
            ctx.font = `${element.fontSize}px Arial`;
            ctx.fillText(element.content, element.x, element.y);
        } else if (element.type === 'text') {
            ctx.font = `${element.fontSize}px ${element.font}`;
            ctx.fillStyle = element.color;
            ctx.fillText(element.content, element.x, element.y);
        }
    });
}

// Function to detect click for dragging
canvas.addEventListener('mousedown', (event) => {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    dragging = true;
    draggedElement = elements.find(el => 
        mouseX >= el.x && mouseX <= el.x + el.fontSize && 
        mouseY >= el.y - el.fontSize && mouseY <= el.y
    );
});

// Function to move dragged element
canvas.addEventListener('mousemove', (event) => {
    if (!dragging || !draggedElement) return;

    let rect = canvas.getBoundingClientRect();
    draggedElement.x = event.clientX - rect.left;
    draggedElement.y = event.clientY - rect.top;

    redrawCanvas();
});

// End drag
canvas.addEventListener('mouseup', () => {
    dragging = false;
    draggedElement = null;
});

// Function to save image
function saveImage() {
    let link = document.createElement('a');
    link.download = 'love_image.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Event listener for text change
document.getElementById('userText').addEventListener('input', addText);
