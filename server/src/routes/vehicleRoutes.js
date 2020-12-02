const vehicleController = require("../controllers/vehicleController");
const express = require("express");
const router = express.Router();


router.put("/updateVehicle/:id", async (req, res) => {
    await vehicleController.updateVehicle(req, res);
  });
  
router.post("/registerVehicle", async (req, res) => {
    await vehicleController.addVehicle(req, res);
  });
  
router.delete("/removeVehicle/:id", async (req, res) => {
    await vehicleController.removeVehicle(req, res);
  });
  

module.exports = router