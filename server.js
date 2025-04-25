import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import fs from 'fs';

// Load Firebase service account
const serviceAccount = JSON.parse(fs.readFileSync('./mudra-tist-firebase-adminsdk-fbsvc-ff34e1bd9f.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

// 📝 POST: Add a new registration
app.post('/register', async (req, res) => {
  const { name, year, department, contact, event } = req.body;

  try {
    await db.collection('registrations').add({ name, year, department, contact, event });
    res.status(200).send("✅ Registration stored successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Failed to store registration");
  }
});

// 📋 GET: Fetch all registrations
app.get('/registrations', async (req, res) => {
  try {
    const snapshot = await db.collection('registrations').get();
    const registrations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Failed to fetch registrations");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
