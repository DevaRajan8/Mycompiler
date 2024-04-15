const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const compiler = require("compilex");

const options = { stats: true };
compiler.init(options);

app.use(bodyParser.json());
app.use("/codemirror-5.65.16", express.static("C:/Users/rdeva/Downloads/code blocks/CodeHub/codemirror-5.65.16"));

app.get("/", function (req, res) {
    res.sendFile("C:/Users/rdeva/Downloads/code blocks/CodeHub/trial.html");
});

app.post("/compile", function (req, res) {
    try {
        const code = req.body.code;
        const input = req.body.input;
        const lang = req.body.lang;

        if (!code || !lang) {
            throw new Error("Code and language are required.");
        }

        let envData = { OS: "windows" };

        if (lang === "cpp") {
            if (!input) {
                envData.cmd = "g++";
                envData.options = { timeout: 10000 };
                compiler.compileCPP(envData, code, function (data) {
                    res.send(data);
                });
            } else {
                envData.cmd = "g++";
                envData.options = { timeout: 10000 };
                compiler.compileCPPWithInput(envData, code, input, function (data) {
                    res.send(data);
                });
            }
        } else if (lang === "java") {
            if (!input) {
                compiler.compileJava(envData, code, function (data) {
                    res.send(data);
                });
            } else {
                compiler.compileJavaWithInput(envData, code, input, function (data) {
                    res.send(data);
                });
            }
        } else if (lang === "python") {
            if (!input) {
                compiler.compilePython(envData, code, function (data) {
                    res.send(data);
                });
            } else {
                compiler.compilePythonWithInput(envData, code, input, function (data) {
                    res.send(data);
                });
            }
        } else {
            throw new Error("Unsupported language.");
        }
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
