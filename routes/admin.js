var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const fs = require('fs');
const csvParser = require('csv-parser');
const multer = require('multer');


// Initialize MongoDB Database
var url = "mongodb://localhost:27017";
var dbName = "ReportR";

var client = new MongoClient(url);

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

// Function to retrieve students
async function retrieveStudents() {
    try {
        var db = client.db(dbName);
        var collection = db.collection("students");
        var documents = await collection.find({}).toArray();
        return documents; // Return the retrieved data
    } catch (err) {
        console.error("Error retrieving students:", err);
        throw err;
    }
}

// Function to insert a document into a collection
async function insertDocument(collectionName, document) {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.insertOne(document);
        console.log(`Added document with _id: ${result.insertedId}`);
    } catch (error) {
        console.error('Error adding document:', error);
        throw error;
    }
}

// Function to update a document inside a collection
async function updateDocument(collectionName, filter, update) {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.updateOne(filter, { $set: update });
        console.log(`Updated ${result.modifiedCount} document`);
        return result.modifiedCount; // Return the number of modified documents
    } catch (error) {
        console.error('Error updating document:', error);
        throw error;
    }
}

// Function to read CSV file and return parsed data
async function readCSVFile(filename) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filename)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

// Function to write CSV data to a file
async function writeCSVToFile(filename, data) {
    try {
        // Write data to a CSV file using the specified filename
        fs.writeFileSync(filename + '.csv', data);
        console.log('CSV file created successfully');
    } catch (error) {
        console.error('Error writing CSV file:', error);
        throw error;
    }
}


// Middleware to parse incoming request bodies
router.use(bodyParser.urlencoded({ extended: true }));



// --File Uploads

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/') // Files will be stored in the 'uploads' directory
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // Use the original file name
    }
  })
  
  const upload = multer({ storage: storage });
  

// Setup routes
router.route('/')
    .get(async (req, res) => {
        await connectToDatabase();
        var students = await retrieveStudents();

        console.log(req.ip + "admin page");

        // Read the CSV file and parse its contents
        const studentsFromCSV = await readCSVFile('bio.csv');
        console.log(studentsFromCSV);

        res.render('admin',{students, results:studentsFromCSV}); 
    })
    .post(async (req, res) => {
        try {
            await connectToDatabase();
            var students = await retrieveStudents();
            const studentsFromCSV = await readCSVFile('bio.csv');

            
            const student = {
                name: req.body.name,
                connectionId: req.body.connectionId,
                _id: req.body.admission,
                class: req.body.class,
                profile: req.body.profile, // This should be the file path or storage reference
            };            
            // Insert the student into the collection
            await insertDocument('students', student);

            // Write to CSV file
            // await writeCSVToFile('bio.csv', students);
            console.log(req.ip + "admin page");

            
            res.status(200).render('admin', {students, results:studentsFromCSV});
            
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });
// Define a structure to hold activity details
let activityDetails = {};

router.route('/update')
    .post(async (req, res) => {
        try {
            await connectToDatabase();

            const activityName = req.body.activityName;
            const activityDescription = req.body.activityDescription;

            // Create an activity object
            const activityObject = {
                activityName: activityName,
                activityDescription: activityDescription
            };

            // Check if activityName exists in the structure
            if (activityDetails.hasOwnProperty(activityName)) {
                // Add the new activity object to the existing array
                activityDetails[activityName].push(activityObject);
            } else {
                // Create a new array with the activity object
                activityDetails[activityName] = [activityObject];
            }

            // Update the document in the collection
            const result = await client.db(dbName).collection('students').updateOne(
                { _id: req.body._id.toString() }, // Assuming _id is present in the form
                { $set: { activityDetails: activityDetails } } // Update the activity details in the document
            );

            if (result.modifiedCount > 0) {
                res.status(200);
            } else {
                res.status(404).send("Document not found or not updated");
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });



module.exports = router;
