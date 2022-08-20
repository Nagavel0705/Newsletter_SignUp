const express = require("express");
const app = express();
const https = require("node:https");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req,res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.emailAddress;
    console.log(firstName, lastName, email);

    const data = {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us17.api.mailchimp.com/3.0/lists/832563aa4d/members";
    const options = {
        method: "POST",
        protocol: "https:",
        auth: "Nezz:f9f405031e54ec5bd2bb4a9a3f520081-us17" // syntax for auth = [username:password]
    }
    
    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
        if(response.statusCode === 200)
            res.sendFile(__dirname +"/success.html");
        else
            res.sendFile(__dirname +"/failure.html")
    })

    request.write(jsonData);
    request.end();
})

app.post("/success", function(req,res){
    res.redirect("/");
})

app.post("/failure", function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(req, res){
    console.log("Listening on port 3000");
});

// API Key: f9f405031e54ec5bd2bb4a9a3f520081-us17
// Audience ID: 832563aa4d
// Endpoint: https://us17.api.mailchimp.com/3.0/
// Website URL: https://young-journey-89697.herokuapp.com/