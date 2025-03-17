const express = require('express');
const RueModel = require('../Models/Niveau');


const router = express.Router();

// Get all rue
router.get('/get', async (req, res) => {
    try {
        const rues = await RueModel.find();
        const totalCountRue = await RueModel.countDocuments({});
  
      return res.json(rues);
       
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/check/:rueName", async (req, res) => {
    try {
      const ruename = req.params.name;
      const existingRue = await RueModel.findOne({ name: ruename });
  
      if (existingRue) {
        return res.status(200).json({ exists: true });
      } else {
        return res.status(200).json({ exists: false });
      }
    } catch (error) {
      console.error("Error checking rue:", error);
      return res.status(500).json({ error: "Error checking rue" });
    }
  });

// Get a specific gouvernement by id
router.get('/:id', async (req, res) => {
    try {
        const rues = await RueModel.findById(req.params.id);
        if (rues) {
            res.status(200).json(rues);
        } else {
            res.status(404).json({ message: "Rue not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new gouvernement
router.post('/', async (req, res) => {
    console.log(req.body);
    const rues = new RueModel({
        name: req.body.name,
      });
    
    try {
        const reuss = await rues.save();
        
        return res.json(reuss);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a gouvernement
router.put('/:id', async (req, res) => {
    try {
        const rues = await RueModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (rues) {
            res.status(200).json(rues);
        } else {
            res.status(404).json({ message: "Rue not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a gouvernement
router.delete('/:id', async (req, res) => {
    try {
        const rues = await RueModel.findByIdAndDelete(req.params.id);
        if (rues) {
            res.status(200).json({ message: "Rue deleted" });
        } else {
            res.status(404).json({ message:"Rue not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
