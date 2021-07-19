const express = require("express");
const path = require("path");
const app = express();
console.log(path.join(__dirname, "public"));

app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
    console.log(`App listening at port 3000`);
});
