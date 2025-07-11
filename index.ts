const code = "1b97049b";
const passwordp = "b94f6403";
const passwords = "854a9d84";

const express = require('express');
const serveIndex = require('serve-index');
const bodyParser = require('body-parser')
const app = express();
const port = 3000;

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.urlencoded({ extended: false, limit: '100000mb' }));   
app.use(bodyParser.json({limit: '100000mb'}))

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

app.get('/gag', (req: any, res: any) => {
    res.sendFile(__dirname + '/gag.html');
});

app.get('/api/gag', (req: any, res: any) => {
    // get request to api.joshlei.com/v2/growagarden/stock
    
    const url = 'https://api.joshlei.com/v2/growagarden/stock';
    const https = require('https');

    let result = {seed_stock: [], gear_stock: [], egg_stock: [], eventshop_stock: []};

    https.get(url, (response: any) => {
        let data = '';
        response.on('data', (chunk: any) => {
            data += chunk;
        });
        response.on('end', () => {
            const json = JSON.parse(data);
            const seedStock = json.seed_stock.map((item: any) => ({
                item_id: item.item_id,
                quantity: item.quantity
            }));
            result.seed_stock = seedStock;

            //gear stock, its just the same thing
            const gearStock = json.gear_stock.map((item: any) => ({
                item_id: item.item_id,
                quantity: item.quantity
            }));
            result.gear_stock = gearStock;

            // egg stock, but dont include the amount
            const eggStock = json.egg_stock.map((item: any) => ({
                item_id: item.item_id
            }));
            result.egg_stock = eggStock;

            // eventshop_stock
            const eventShopStock = json.eventshop_stock.map((item: any) => ({
                item_id: item.item_id,
                quantity: item.quantity
            }));
            result.eventshop_stock = eventShopStock;

            res.json(result);
        });
    }).on('error', (error: any) => {
        console.error('Error fetching seed stock:', error);
        res.status(500).send('Internal Server Error');
    });


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

app.post('/edit/upload', urlencodedParser, (req: any, res: any) => {
    console.log(req.body);
    if (!req.body || !req.files) {
        console.log("bro wth");
        res.status(400).send('Bad Request: Missing fields');
        return;
    }
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