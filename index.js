const express = require("express");
const app = express();
const path = require("path");


const port = 5000;

// In nodejs we are use the keywords require rather than import.
const mongoDB = require("./db");
// mongoDB();
const cors = require('cors');  
app.use(cors());
app.use((req, res, next) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

app.use("/api", require("./Routes/CreateUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/OrderData"));


app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
