const fs = require('fs');

// Read the CSV file asynchronously
fs.readFile('200KB.csv', 'utf8', (err, csvData) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Now you can work with the CSV data
    console.log(csvData);
});
