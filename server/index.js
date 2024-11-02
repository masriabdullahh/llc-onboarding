import express from 'express';
import cors from 'cors';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(express.json());

// SQLite client setup - Use Turso URL in production
const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

// Define the route to handle form submissions
app.post('/submit', async (req, res) => {
    const {
        llcName,
        legalName,
        dateOfBirth,
        nationality,
        phoneNumber,
        address,
        email
    } = req.body;

    try {
        await db.query(`
            INSERT INTO clients (llc_name, legal_name, date_of_birth, nationality, phone_number, address, email)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [llcName, legalName, dateOfBirth, nationality, phoneNumber, address, email]);

        res.status(200).send('Data inserted successfully');
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
