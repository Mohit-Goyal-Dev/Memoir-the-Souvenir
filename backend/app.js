const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts-route");
const userRoutes = require("./routes/user-route");

const app = express();

//DataBase Connection
mongoose.connect("mongodb+srv://mohit:" + process.env.MONGO_ATLAS_PWD + "@cluster0.nie5u.mongodb.net/postsDatabase?retryWrites=true&w=majority").then(() => {
	console.log('Connected to database!');
}).catch((error) => {
	console.log("Mongo Connection Failed!");
	console.log(error);
})

//Parsing req for each api call
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/", express.static(path.join(__dirname, "Memoir")));

//handling Cors for each call so added as the first middleware call without any specific api address
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, PATCH, DELETE, OPTIONS"
	);
	next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/auth", userRoutes);
app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, "Memoir", "index.html"));
});

module.exports = app;
