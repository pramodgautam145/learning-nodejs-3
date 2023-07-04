const express = require('express');
const indexRouter = require("./routes/index");
const path = require("path");
const app = express();
const port = 3000
// set up view engine
app.set("views", path.join(__dirname,"views"));
app.set("view engine","pug");
//route
app.use("/", indexRouter);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})