import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

const existFile = async (path) => {
  try {
    await fs.promises.access(path);
    return true;
  } catch (error) {
    return false;
  }
};
export const getJSONFromFile = async (path) => {
  if (!(await existFile(path))) {
    return [];
  }
  let content;
  try {
    content = await fs.promises.readFile(path, "utf-8");
  } catch (error) {
    throw new Error(`The file ${path} couldn't be read.`);
  }
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`The file ${path} isn't in valid JSON format.`);
  }
};

export const saveJSONToFile = async (path, data) => {
  const content = JSON.stringify(data, null, "\t");
  //console.log(content);
  try {
    await fs.promises.writeFile(path, content, "utf-8");
    return "Product Added";
  } catch (error) {
    throw new Error(`The file ${path} couldn't be written.`);
  }
};
