export type MediaValidationRule = {
  maxSize: number;
  allowedMimes: AllowedMimes[] | string[];
};

export enum MediaStorageOption {
  DRIVE = 'drive',
}

export type MediaRuleOptions = {
  storage: MediaStorageOption;
  path: string;
};

export enum AllowedMimes {
  // Image Mimes
  GIF = 'image/gif',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  SVG = 'image/svg+xml',
  WEBP = 'image/webp',
  PDF = 'application/pdf',
  //Docs mimes
  MICROSOFT_DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  MICROSOFT_DOC = 'application/msword',
  MICROSOFT_PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  MICROSOFT_PPT = 'application/vnd.ms-powerpoint',
  CSV = 'text/csv',
}
