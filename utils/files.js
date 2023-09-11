const { rejects } = require('assert');
const fs = require('fs');
const path = require('path');

const fileName = path.join(__dirname,'../data.json');

async function readJson() {
    if(!fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, "[]");
    }

    return new Promise((resolve, reject) => {
        fs.readFile(fileName, "utf8", (err, data) => {
            if (err) reject(err);
            if (data) {
                resolve(JSON.parse(data));
            }
            resolve({});
        })
    })
}

async function writeJson(data) {
    if(!fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, "[]");
    }

    return new Promise ((resolve, reject) => {
        fs.writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
            if (err) reject(err);
            resolve();
        })
    })
}

module.exports = {
    readJson, writeJson
}