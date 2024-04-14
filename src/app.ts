import express from "express";
import { engine } from "express-handlebars";

const app = express();
const port = 3000;

// Set Handlebars as the template engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
// Set the directory for template files
app.set("views", "./templates");

// Define a route to render the template
app.get("/", (req, res) => {
  // Render the 'index.handlebars' template, passing data to it
  res.render("index", { layout: false, title: "LiteRank Book Store" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
