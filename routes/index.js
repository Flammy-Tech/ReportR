// Import required modules
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

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

// Parse incoming requests with JSON payloads
router.use(bodyParser.json());

// Parse incoming requests with URL-encoded payloads
router.use(bodyParser.urlencoded({ extended: true }));

// Setup routes
router.route('/')
    .get((req, res) =>{
        console.log(req.ip + "index Page");

        res.render('index');
    })
    .post(async (req, res) =>{
        try {
            const pass = {
                password: req.body.passwordId,
            }

            console.log('pass', pass);
            console.log(pass.password);

            if (pass.password === "admin123") {
                res.redirect('/admin');
                console.log("Password Matched");
            } else {
                // Retrieve students based on the connectionId
                const students = await retrieveStudentsByConnectionId(req.body.passwordId);
            
                if (students.length > 0) {
                    // If students are found with the provided connectionId
                    console.log('Students found:', students);
                    console.log('connectionId:', students.connectionId);
                    res.redirect('/student' + `/${req.body.passwordId}`);
                    // res.render('index');
                    console.log("Student found");
                } else {
                    // If no students are found with the provided connectionId
                    console.log('No students found with connectionId:', req.body.passwordId);
                    res.render('index');
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    });

module.exports = router;
