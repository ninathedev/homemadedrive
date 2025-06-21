const code = "1b97049b";
const passwordp = "b94f6403";
const passwords = "854a9d84";

const express = require('express');
const serveIndex = require('serve-index')
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: 'application/json' }))
//use multer for file uploads
const fs = require('fs');

app.get('/', (req: any, res: any) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/edit', (req: any, res: any) => {
    res.sendFile(__dirname + '/edit.html')
});
app.get('/edit/upload', (req: any, res: any) => {
    res.sendFile(__dirname + '/upload/index.html')
});
app.get('/edit/rename', (req: any, res: any) => {
    res.sendFile(__dirname + '/rename/index.html')
});

app.post('/code', (req: any, res: any) => {
    const codeInput = req.headers.asks;
    console.log(codeInput)
    if (codeInput === code) {
        const data = {
            code: "e7ee3e9bacd5a2c5f2b8ecf00d3a48215f5601122a6dc3890e9817893ed2978940344e1fc74aad21b1c443469914c42d67eca0b2d11fcd40225c79be59814e2d"
        }
        res.send(data);
    } else {
        res.status(403).send('Forbidden');
    }
});

app.post('/edit/upload', (req: any, res: any) => {
    /*
    the code from the html file:
    function uploadb() {
                // upload file
                var password = document.getElementById("password").value;
                var name = document.getElementById("name").value;
                var path = document.getElementById("path").value;
                var files = document.getElementById("file").files;

                if (!password || !name || !path || files.length === 0) {
                    alert("Please fill in all fields.");
                    return;
                }

                var formData = new FormData();
                formData.append("password", password);
                formData.append("name", name);
                formData.append("path", path);
                for (var i = 0; i < files.length; i++) {
                    formData.append("file", files[i]);
                }

                fetch("/upload", {
                    method: "POST",
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    alert("Upload successful!");
                })
                .catch(error => {
                    console.error(error);
                    alert("Upload failed.");
                });
            }
            function folderb() {
                // make folder
                var namef = document.getElementById("namef").value;
                var pathf = document.getElementById("pathf").value;

                if (!namef || !pathf) {
                    alert("Please fill in all fields.");
                    return;
                }

                fetch("/folder", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name: namef, path: pathf })
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    alert("Folder created successfully!");
                })
                .catch(error => {
                    console.error(error);
                    alert("Failed to create folder.");
                });
            }
            function renameb() {
                // rename file or folder
                var pathr = document.getElementById("pathr").value;
                var newname = document.getElementById("newname").value;

                if (!pathr || !newname) {
                    alert("Please fill in all fields.");
                    return;
                }

                fetch("/rename", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ path: pathr, newName: newname })
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    alert("Rename successful!");
                })
                .catch(error => {
                    console.error(error);
                    alert("Rename failed.");
                });
            }
    */
    const passwordInput = req.body.password;
    if (passwordInput === passwordp) {
        //file upload to public drive
        console.log("file upload to public drive");
        const name = req.body.name;
        const path = req.body.path;
        const files = req.files;
        if (!name || !path || !files) {
            res.status(400).send('Bad Request: Missing fields');
            return;
        }
        // Here you would handle the file upload logic, e.g., saving files to the specified path
        // heres the actual code:
        const pathToSave = `files/${path}`;
        if (!fs.exists) {
            fs.mkdirSync(pathToSave, { recursive: true });
        }
        files.forEach((file: any) => {
            const tempPath = file.path;
            const targetPath = `${pathToSave}/${file.originalname}`;
            fs.renameSync(tempPath, targetPath);
        });

        res.status(200);
    } else if (passwordInput === passwords) {
        // secret drive editing

        const name = req.body.name;
        const path = req.body.path;
        const files = req.files;
        if (!name || !path || !files) {
            res.status(400).send('Bad Request: Missing fields');
            return;
        }
        // Here you would handle the file upload logic, e.g., saving files to the specified path
        const pathToSave = `secretfiles/${path}`;
        if (!fs.exists) {
            fs.mkdirSync(pathToSave, { recursive: true });
        }
        files.forEach((file: any) => {
            const tempPath = file.path;
            const targetPath = `${pathToSave}/${file.originalname}`;
            fs.renameSync(tempPath, targetPath);
        });
        res.status(200);
        console.log("secret drive editing");
    } else {
        res.status(403).send('Forbidden');
        console.log(passwordInput)
        console.log("forbidden");
    }

});
app.use('/files', express.static('files'), serveIndex('files', {'icons': true, 'view': 'details'}))
app.use('/e7ee3e9bacd5a2c5f2b8ecf00d3a48215f5601122a6dc3890e9817893ed2978940344e1fc74aad21b1c443469914c42d67eca0b2d11fcd40225c79be59814e2d', express.static('secretfiles'), serveIndex('secretfiles', {'icons': true, 'view': 'details'}))
//app.post('/')

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});