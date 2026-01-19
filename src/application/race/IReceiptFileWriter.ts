export interface IReceiptFileWriter {
  write(userId: string, dateYyyyMmDd: string, content: string): Promise<void>;
}
