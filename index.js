const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads/';
const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

const upload = multer({dest: UPLOAD_DIR});

app.use(function (req, res, next) {
    // Change the Access-Control-Allow-Origin to point to your demo/test URL
    res.setHeader('Access-Control-Allow-Origin', ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/api', function (req, res) {
    res.end('File upload server. Send a POST request to this endpoint to upload file(s).');
});

app.get('/', function (req, res) {
    res.end('File upload server. Endpoint: /api/');
});


app.post('/api', upload.array('files'), function (req, res) {
    if (req.files === undefined || req.files.length === 0) {
        res.status(400).json({ error: 'Files are required' });
    }

    // Delete uploaded files to save storage
    req.files.forEach(file => {
        try {
            fs.unlinkSync(file.path);
        } catch {
            console.log(`Deleting ${file.path} failed.`);
        }
    });

    res.status(201).json({
        files: req.files.map(file => {
            const {destination, filename, path, fieldname, ...result} = file;
            return result;
        })
    });
});

app.listen(PORT, function () {
    console.log('CORS_ORIGIN ' + ORIGIN);
    console.log('Working on port ' + PORT);
});
