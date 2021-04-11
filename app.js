
const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");


const app = express();

var path = require('path')

// process.env.PWD = process.cwd();
// app.use(express.static(path.join(process.env.PWD, 'public')));


app.use(express.static("/public"));
app.use(bodyParser.urlencoded({
	extended: true
}));

// require mailchimp
const mailchimp = require("@mailchimp/mailchimp_marketing");

// set up mailchimp server and API
mailchimp.setConfig({
	apiKey: "7749ada66e84fbef3db24ada11262145-us1",
	server: "us1",
});




//  Checks health of of connection to API. Returns "everythings chimpy" in the CM
async function run() {
	const response = await mailchimp.ping.get();
	console.log(response);
}
run();

// Browser's home route get request
app.get("/", function(req, res) {
	res.sendFile(__dirname + "/signup.html");

});


// HTML form
app.post("/", function(req, res) {

	const listId = "1fb612e81c";
	const firstName = req.body.fName;
	const lastName = req.body.lName;
	const email = req.body.email;

	async function run() {
		const response = await mailchimp.lists.addListMember(listId, {
			email_address: email,
			status: "subscribed",
			merge_fields: {
				FNAME: firstName,
				LNAME: lastName
			}
		});

		console.log(res.statusCode);

		if (res.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		};

		console.log(
			`Successfully created an audience. The audience id is ${response.id}.`
		);
	}
	run();
});


// Redirect from a failed entry back to the home route
app.post("/failure.html", function(req, res) {
	res.redirect("/")
});

// Refresh from a successful entry back to the home route
app.post("/success.html", function(req, res) {
	res.redirect("/");
});

// Confirms server is running
app.listen(process.env.PORT || 3000, function() {
	console.log("server running on port 3000");
});


// API Key:
// 7749ada66e84fbef3db24ada11262145-us1

// Audience ID:
// 1fb612e81c
