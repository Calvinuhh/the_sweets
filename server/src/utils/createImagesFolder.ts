import fs from "fs";
import path from "path";

export default function createImagesFolder() {
  const folderPath = path.join(__dirname, "../images");

  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
}
