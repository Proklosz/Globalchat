const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors"); // Import the cors middleware

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors()); // Use cors middleware

let database;

async function connectToDatabase() {
  if (!database) {
    const client = await MongoClient.connect("mongodb://localhost:27017", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    database = client.db("admin");
  }

  return database;
}

app.get("/", (req, res) => {
  res.send("Hello, MongoDB!");
});

// API endpoint to fetch data
app.get("/api/items", async (req, res) => {
  const db = await connectToDatabase();
  const items = await db.collection("tester").find({}).toArray();
  res.json(items);
});

// API endpoint to add data
app.post("/api/items", async (req, res) => {
  const db = await connectToDatabase();
  const newItem = req.body; // Assuming you're sending JSON data in the request body
  const result = await db.collection("tester").insertOne(newItem);
  
  // console.log(result.acknowledged);

  if (result.acknowledged === true) {
    res.json(result);
  } else {
    res.status(500).json({ error: "Failed to insert document" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
