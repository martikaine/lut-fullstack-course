import express from "express";
import path from "path";
import url from "url";
//import logger from "./middleware/logger.js";
import members from "./Members.js";
import router from "./routes/api/members.js";
import { engine } from "express-handlebars";

// "Polyfill" for __dirname in es6-style imports
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const app = express();

// app.get("/", (req, res) => {
//   res.send("<h1>Hello world</h1>");
// });

//app.use(logger);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_, res) =>
  res.render("index", {
    title: "Member App",
    members,
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/members", router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
