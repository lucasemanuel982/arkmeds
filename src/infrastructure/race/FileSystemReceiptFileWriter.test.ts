import fs from "fs/promises";
import path from "path";
import os from "os";
import { FileSystemReceiptFileWriter } from "./FileSystemReceiptFileWriter";

describe("FileSystemReceiptFileWriter", () => {
  let basePath: string;
  let writer: FileSystemReceiptFileWriter;

  beforeAll(async () => {
    basePath = path.join(os.tmpdir(), `receipt-test-${Date.now()}`);
    await fs.mkdir(basePath, { recursive: true });
    writer = new FileSystemReceiptFileWriter(basePath);
  });

  afterAll(async () => {
    try {
      await fs.rm(basePath, { recursive: true });
    } catch {
      // ignore
    }
  });

  it("cria diretório userId e grava {date}.txt com o conteúdo", async () => {
    await writer.write("user-1", "2025-01-15", '{"price": 100}');

    const fullPath = path.join(basePath, "user-1", "2025-01-15.txt");
    const content = await fs.readFile(fullPath, "utf-8");
    expect(content).toBe('{"price": 100}');
  });

  it("cria diretórios aninhados se userId tiver / (ou usar path normal)", async () => {
    await writer.write("user-2", "2025-01-16", "[]");

    const fullPath = path.join(basePath, "user-2", "2025-01-16.txt");
    const content = await fs.readFile(fullPath, "utf-8");
    expect(content).toBe("[]");
  });
});
