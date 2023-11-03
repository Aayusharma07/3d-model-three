const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
const port = 3000;

const filePath = './resources/mockdata.json';

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());
app.use(express.static('public'))

// Endpoint to get the current JSON content
app.get('/api/data', async (req, res) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  } catch (error) {
    console.error(`Error reading JSON file: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to update the JSON content
app.post('/api/data', async (req, res) => {
  const newData = req.body;

  try {
    // Read current data
    const currentData = await fs.readFile(filePath, 'utf8');
    const currentJsonData = JSON.parse(currentData);

    // Merge with new data
    const updatedData = { ...currentJsonData, ...newData };

    // Write updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf8');

    res.json({ success: true, data: updatedData });
  } catch (error) {
    console.error(`Error updating JSON file: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function isTemperatureWithinRange(temperature, min, max) {
  return temperature >= min && temperature <= max;
}

// Endpoint to update the JSON content
app.post('/api/update', async (req, res) => {
  const newData = req.body;
  try {
    const currentData = await fs.readFile(filePath, 'utf8');
    const currentJsonData = JSON.parse(currentData);

    let assetToupdate = currentJsonData.find(asset => asset.AssetId == newData.AssetId);
    assetToupdate.Compartments = assetToupdate.Compartments.map(Compartment => {
      if(Compartment.Name == newData.CompartmentName){
        Compartment[newData.property] = newData.value;
        const newTemprature = newData.value;
        const healthDetail = Compartment.Logistic.HealthDetails.find(healthDetail =>{
          return isTemperatureWithinRange(newTemprature, healthDetail.ExpectedTempratureRange.LowerRange, healthDetail.ExpectedTempratureRange.UpperRange);
        });
        Compartment.Alert.HasAlert = healthDetail.RaiseAlert;
        Compartment.Alert.AlertDescription = healthDetail.State;
      }
      return Compartment;
    });

    // Write updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(currentJsonData, null, 2), 'utf8');

    res.json({ success: true, data: currentJsonData });
  } catch (error) {
    console.error(`Error updating JSON file: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
