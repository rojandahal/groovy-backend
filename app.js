const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const errorHandler = require("./errors/api-error-handler");

// Initializing environment vairables
require("dotenv").config();

const app = express();

//Body parser
// Use of cors
const corsOptions = {
  origin: true,
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
  headers: "content-type",
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());

// Cookies parser
app.use(cookieParser());

//Connecting database
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
	useCreateIndex: true,
  dbName: process.env.MONGO_DB_NAME,
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASSWORD,
});
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Mongoose connection successfully!");
});

//Routes files
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");

//Adding routes middleware
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

//Error handler
app.use(errorHandler);

//Environment variable
const port = process.env.PORT || 5000;

//Connecting to server
const server = app.listen(port, () => {
  console.log("Created server at port: " + port);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`.red);
  // Close server and Exit process
  server.close(() => process.exit(1));
});
