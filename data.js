const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Set up multer for handling file uploads
const upload = multer({ dest: 'data/profiles/' });

// Middleware for serving static files
app.use(express.static('public'));

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Define a route for handling form submissions
app.post('/save-profile', upload.single('profile'), (req, res) => {
    const { name, admission, class: studentClass, connectionId } = req.body;
    const profile = req.file;

    if (!admission || !name || !studentClass || !connectionId || !profile) {
        return res.status(400).send('All fields are required');
    }

    // Rename the profile picture to include the student's admission number
    const profileName = `${admission}${path.extname(profile.originalname)}`;
    const profilePath = path.join(__dirname, 'data', 'profiles', profileName);

    // Move the profile picture to the profiles directory
    fs.renameSync(profile.path, profilePath);

    // Load existing student data or create an empty array
    let students = [];
    const studentsPath = path.join(__dirname, 'data', 'students.json');
    if (fs.existsSync(studentsPath)) {
        const data = fs.readFileSync(studentsPath);
        students = JSON.parse(data);
    }

    // Add new student data
    students.push({
        name,
        admission,
        class: studentClass,
        connectionId,
        profile: profileName
    });

    // Save updated student data
    fs.writeFileSync(studentsPath, JSON.stringify(students, null, 2));

    res.send('Profile saved successfully');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
