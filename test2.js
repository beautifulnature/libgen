import fs from "fs";
import path from "path";

const cwd = process.cwd();
const fileName = 'data.json';
const newFileName = 'newdata.json';
const filePath = path.join(cwd, fileName);
const newFilePath = path.join(cwd, newFileName);

const data = fs.readFileSync(filePath);

const json = JSON.parse(data);

json.push({ "hello": "world" });



fs.writeFileSync(newFilePath, JSON.stringify(json, null, 2));