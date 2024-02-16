var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

// Parse incoming requests with JSON payloads
router.use(bodyParser.json());

// Parse incoming requests with URL-encoded payloads
router.use(bodyParser.urlencoded({ extended: true }));


// Initialize MongoDB Database
const url = "mongodb://localhost:27017";
const dbName = "ReportR";

const client = new MongoClient(url);

// Connect to the database
async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to the database");
    } catch (err) {
        console.error("Error connecting to the database:", err);
        throw err;
    }
}

// Function to retrieve students based on connectionid
async function retrieveStudentsByConnectionId(connectionId) {
    try {
        const db = client.db(dbName);
        const collection = db.collection("students");
        const documents = await collection.find({ connectionId: connectionId }).toArray();
        return documents; // Return the retrieved data
    } catch (err) {
        console.error("Error retrieving students by connectionid:", err);
        throw err;
    }
}



// Setup routes
router.route('/')
    .get(async(req, res) =>{
        const student = {
            name: req.body.passwordId,
        }

        console.log(student)
        console.log(req.ip + 'student Page');
        res.render('student');

    })
    .post((req, res) =>{
        res.render('student')
    }
    );

router.get('/:id', async(req, res) =>{
    try {
        console.log(req.params.id);    
        var student = await retrieveStudentsByConnectionId(req.params.id);
        console.log(student);

        if (student.length > 0) {
            // If student are found with the provided connectionId
            console.log('Student found:', student);
            console.log('Student Name:', student.name);
            res.render('student', { student: student});
            console.log(req.ip + 'student Page');
            console.log("Student found with the provided connectionId");
        } else {
            // If no student are found with the provided connectionId
            console.log('Student Page: No student found with connectionId:', req.params.id);
            // res.redirect('/');
            res.send('Error: No student found with the provided connectionId:' + req.params.id);
        }
        
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
