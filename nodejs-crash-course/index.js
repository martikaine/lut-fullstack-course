const http = require("http");
const path = require("path");
const fs = require("fs").promises;

const server = http.createServer(async (req, res) => {
  const filePath = path.join(
    __dirname,
    "public",
    req.url === "/" ? "index.html" : req.url
  );
  const contentType = detectContentType(filePath);

  try {
    const fileData = await fs.readFile(filePath);
    respondSuccess(fileData, contentType, res);
  } catch (err) {
    console.log(err.code);
    if (err.code === "ENOENT") {
      await respondNotFound(res);
    } else {
      respondInternalServerError(err, res);
    }
  }
});

function detectContentType(filePath) {
  const extName = path.extname(filePath);

  let contentType = "text/html";
  switch (extName) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
  }

  return contentType;
}

function respondSuccess(fileData, contentType, response) {
  response.writeHead(200, { "Content-Type": contentType });
  response.end(fileData, "utf8");
}

async function respondNotFound(response) {
  try {
    const errorPagePath = path.join(__dirname, "public", "404.html");
    const errorPageContent = await fs.readFile(errorPagePath);
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(errorPageContent, "utf8");
  } catch (err) {
    respondInternalServerError(err, response);
  }
}

function respondInternalServerError(error, response) {
  response.writeHead(500);
  response.end(`Internal Server Error: ${error.code}`);
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
