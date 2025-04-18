export interface ProcessedImage {
  id: string;
  url: string; 
  faces: AnalyzedFace[];
  originalFile?: File;  
}

export type FileItem = {
  originalFile?: File;
};

export type AnalyzedFace = {
  boundingBox?: {
    Left: number;
    Top: number;
    Width: number;
    Height: number;
  };
  personId: string;
  confidence?: number;
  name: string;
  match?: {
    similarity?: number;
    faceId?: string;
  };
};

export type AnalyzedImageResponse = {
  url: string;
  faces: AnalyzedFace[];
};