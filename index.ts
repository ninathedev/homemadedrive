const code = "1b97049b";
const passwordp = "b94f6403";
const passwords = "854a9d84";

const express = require('express');
const serveIndex = require('serve-index')
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: 'application/json' }))

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
    const passwordInput = req.body.password;
    if (passwordInput === passwordp) {
        // public drive editing
        console.log("public drive editing");
    } else if (passwordInput === passwords) {
        // secret drive editing
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