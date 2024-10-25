import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";

export async function getInfoFile(file, res) {
  const { filename, size, path } = file;
  let numPages = 0;
  const fileBuffer = fs.readFileSync(path);
  try {
    const data = await pdfParse(fileBuffer);
    numPages = data.numpages;
    let first = filename.indexOf("-", filename.indexOf("-") + 1) + 1;
    let end = filename.lastIndexOf(".");
    const fileName = filename.substring(first, end);
    return { 
        fileName: fileName,
        fileSize: size,
        fileType: filename.substring(end + 1).toUpperCase(),
        numPages: numPages, 
    };
  } catch (error) {
    return res.status(500).json({ message: "Error reading PDF" });
  }
};

export async function getInfoFileByURL(url) {
  const filepath = path.join(__dirname, url);

  if (fs.existsSync(filepath)) {
    try {
      const dataBuffer = fs.readFileSync(filepath);
      const { numpages } = await pdfParse(dataBuffer);

      let first = url.indexOf("-", url.indexOf("-") + 1) + 1;
      let end = url.lastIndexOf(".");
      const fileName = url.substring(first, end);
      
      return {
        fileName: fileName,
        fileSize: fs.statSync(filepath).size,
        fileType: url.substring(end + 1).toUpperCase(),
        numPages: numpages, 
      }
    } catch (error) {
      new Error("Error parsing PDF");
      console.log(error);
      return {};
    }
  } else {
    new Error("Not Found file PDF");
    return {};
  }
}