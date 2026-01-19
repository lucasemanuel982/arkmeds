import fs from "fs/promises";
import path from "path";
import { IReceiptFileWriter } from "../../application/race/IReceiptFileWriter";

export class FileSystemReceiptFileWriter implements IReceiptFileWriter {
  constructor(private readonly basePath: string) { }

  async write(userId: string, dateYyyyMmDd: string, content: string): Promise<void> {
    const dir = path.join(this.basePath, userId);
    await fs.mkdir(dir, { recursive: true });

    const filePath = path.join(dir, `${dateYyyyMmDd}.txt`);
    await fs.writeFile(filePath, content, "utf-8");
  }
}
