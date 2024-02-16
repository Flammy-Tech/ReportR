//////// Update the Db Collection //////////

// router.js

const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const router = express.Router();
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017'; // MongoDB connection URL

// Parse incoming requests with JSON payloads
router.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(url, (err, client) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');
  const db = client.db('your_database_name');
  const collection = db.collection('your_collection_name');

  // Define route to handle POST request for updating MongoDB
  router.post('/update', (req, res) => {
    const newData = req.body; // Assuming your request body contains the data to update

    // Update MongoDB
    collection.updateOne(
      { /* Your update query/filter */ },
      { $set: newData },
      (err, result) => {
        if (err) {
          console.error('Error updating document:', err);
          res.status(500).send('Error updating document');
          return;
        }
        res.status(200).send('Document updated successfully');
      }
    );
  });
});

module.exports = router;



/////////////// Full CRUD //////////////


// router.js

const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const router = express.Router();
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017'; // MongoDB connection URL

// Parse incoming requests with JSON payloads
router.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(url, (err, client) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');
  const db = client.db('your_database_name');
  const collection = db.collection('your_collection_name');

  // CREATE operation: Insert new document
  router.post('/create', (req, res) => {
    const newData = req.body; // Assuming your request body contains the data to insert

    collection.insertOne(newData, (err, result) => {
      if (err) {
        console.error('Error inserting document:', err);
        res.status(500).send('Error inserting document');
        return;
      }
      res.status(200).send('Document inserted successfully');
    });
  });

  // READ operation: Get all documents
  router.get('/read', (req, res) => {
    collection.find({}).toArray((err, result) => {
      if (err) {
        console.error('Error reading documents:', err);
        res.status(500).send('Error reading documents');
        return;
      }
      res.status(200).json(result);
    });
  });

  // UPDATE operation: Update document
  router.put('/update/:id', (req, res) => {
    const id = req.params.id; // Get the document ID from URL parameter
    const newData = req.body; // Assuming your request body contains the updated data

    collection.updateOne(
      { _id: mongodb.ObjectId(id) },
      { $set: newData },
      (err, result) => {
        if (err) {
          console.error('Error updating document:', err);
          res.status(500).send('Error updating document');
          return;
        }
        res.status(200).send('Document updated successfully');
      }
    );
  });

  // DELETE operation: Delete document
  router.delete('/delete/:id', (req, res) => {
    const id = req.params.id; // Get the document ID from URL parameter

    collection.deleteOne({ _id: mongodb.ObjectId(id) }, (err, result) => {
      if (err) {
        console.error('Error deleting document:', err);
        res.status(500).send('Error deleting document');
        return;
      }
      res.status(200).send('Document deleted successfully');
    });
  });
});

module.exports = router;



//////////////////////////////////4 //////////////////////////////////
// Function to retrieve students based on connectionid
async function retrieveStudentsByConnectionId(connectionid) {
  try {
      const db = client.db(dbName);
      const collection = db.collection("students");
      const documents = await collection.find({ connectionid: connectionid }).toArray();
      return documents; // Return the retrieved data
  } catch (err) {
      console.error("Error retrieving students by connectionid:", err);
      throw err;
  }
}


router.route('/')
    .get((req, res) =>{
        console.log(req.ip + "index Page");

        res.render('index');
    })
    .post(async (req, res) =>{
        try {
            const connectionId = req.body.connectionId; // Assuming you're passing connectionId from the frontend

            // Retrieve students based on the connectionId
            const students = await retrieveStudentsByConnectionId(connectionId);
            
            if (students.length > 0) {
                // If students are found with the provided connectionId
                console.log('Students found:', students);
                res.redirect('/admin');
            } else {
                // If no students are found with the provided connectionId
                console.log('No students found with connectionId:', connectionId);
                res.render('index');
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    });
