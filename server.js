// move app.listen to a separate file so that we can use supertest

const app = require("./app") // import app

app.listen(3000, function () {
    console.log("Server starting on port 3000")
  })