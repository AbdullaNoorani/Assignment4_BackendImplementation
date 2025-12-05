const express = require("express");
const path = require("path");
const multer = require("multer");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "public"));
    },
    filename: function(req, file, cb) {
        const rawName = (req.query.name || "").toLowerCase();

        let fileName = "default.jpg";

        ["tom", "jerry", "dog"].forEach(item => {
            if (rawName.includes(item)) {
                fileName = item + ".jpg";
            }
        });

        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

app.get("/api/getImage", (req, res) => {
    const name = (req.query.name || "").toLowerCase();

    let image = "default.jpg";

    if (name.includes("tom")) {
        image = "tom.jpg";
    } else if (name.includes("jerry")) {
        image = "jerry.jpg";
    } else if (name.includes("dog")) {
        image = "dog.jpg";
    }

    res.json({ url: "/" + image });
});

app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        res.status(400).json({ success: false, message: "No file" });
    } else {
        res.json({ success: true, message: "Image uploaded" });
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});