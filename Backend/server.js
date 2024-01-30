const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();

// Enable CORS
app.use(cors());

// Support JSON-encoded bodies
app.use(bodyParser.json());

app.post("/predict", (req, res) => {
  const pythonProcess = spawn("python", ["code.py", JSON.stringify(req.body)]);

  let pythonOutput = "";
  pythonProcess.stdout.on("data", (data) => {
    pythonOutput += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).send("Error in Python Script");
    } else {
      res.json({ flight_price: pythonOutput.trim() }); // Trim output for cleaner response
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
