// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Storage {
  export interface MultipartFile {
    file: NodeJS.ReadableStream;
    fieldname: string;
    filename: string;
    encoding: string;
    mimetype: string;
    exttype: string;
  }
}
