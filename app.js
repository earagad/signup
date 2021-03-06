
const express = require("express");
const app = express();


const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
	extended: true
}));


// require mailchimp
const mailchimp = require("@mailchimp/mailchimp_marketing");

// set up mailchimp server and API
mailchimp.setConfig({
	apiKey: process.env.API_KEY,
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

	const listId = process.env.AUDIENCE_ID;
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
