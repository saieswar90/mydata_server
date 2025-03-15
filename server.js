const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = "mongodb+srv://eswarsai8074:GxlEfEfJ2Fw9g7nj@cluster0.fpvov.mongodb.net/test";
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Crop Schema
const cropSchema = new mongoose.Schema({
    cropName: { type: String, required: true },
    year: { type: Number, required: true },
    tractorRentCost: { type: Number, required: true },
    labourerCost: { type: Number, required: true },
    fertilizerCost: { type: Number, required: true },
    pesticideCost: { type: Number, required: true },
    harvestingCost: { type: Number, required: true },
    amountSold: { type: Number, required: true },
}, { timestamps: true });

const Crop = mongoose.model('Crop', cropSchema);

// Fetch all records (include _id in response)
app.get('/api/crops', async (req, res) => {
    try {
        const crops = await Crop.find().select('_id cropName year tractorRentCost labourerCost fertilizerCost pesticideCost harvestingCost amountSold');
        res.status(200).json(crops);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new record
app.post('/api/crops/add', async (req, res) => {
    try {
        const newCrop = new Crop(req.body);
        await newCrop.save();
        res.status(201).json(newCrop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a record using _id
app.put('/api/crops/edit/:id', async (req, res) => {
    try {
        const updatedCrop = await Crop.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!updatedCrop) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.status(200).json(updatedCrop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a record using _id
app.delete('/api/crops/delete/:id', async (req, res) => {
    try {
        const deletedCrop = await Crop.findByIdAndDelete(req.params.id);
        if (!deletedCrop) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
