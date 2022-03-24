import { FileUploadGuard } from './file_upload.guard';

describe('FileUploadGuard', () => {
  it('should be defined', () => {
    expect(new FileUploadGuard()).toBeDefined();
  });
});
