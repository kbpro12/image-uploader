const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// 1. Serve files from the 'public' folder (this fixes your error)
app.use(express.static('public'));

// 2. Serve the 'uploads' folder so images are viewable via URL
app.use('/uploads', express.static('uploads'));

// 3. Configure where uploaded images go
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// 4. The Home Route (Backup fix for "Cannot GET /")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5. The Upload Logic
app.post('/upload', upload.single('myImage'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

app.listen(3000, () => console.log('🚀 Server ready at http://localhost:3000'));