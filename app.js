const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const res = require("express/lib/response");
const { json } = require("express/lib/response");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityName;

  const apiKey = "API_KEY";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?appid=" +
    apiKey +
    "&q=" +
    query +
    "&units=metric";

  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      if (weatherData.cod == "200") {
        const temp = weatherData.main.temp;
        const weatherDesc = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageURL =
          "https://openweathermap.org/img/wn/" + icon + "@2x.png";

        res.write("<p> Weather is currently " + weatherDesc + "<p>");
        res.write(
          "<h1>The temperature in " +
            query +
            " is " +
            temp +
            " degrees Celcius</h1>"
        );
        res.write("<img src=" + imageURL + ">");

        res.send();
      }
      else{
          res.send('invalid city');
      }
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});

app.use(function (err, req, res, next) {
  res.status(500).json({
    error: err.message,
  });
});
