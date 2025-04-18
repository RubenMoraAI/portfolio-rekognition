"use client";

import { DropzoneArea } from "./DropzoneArea";
import { FilePreview } from "./FilePreview";
import { UploadProgress } from "./UploadProgress"; 
import {   useImageUploaderContext } from "../../context/ImageUploaderContext";

export function ImageUploader() {
  const {
    files,
    uploading,
    uploadProgress,
    handleDrop,
    handleRemove,
    handleUpload,
    onReset,
  } = useImageUploaderContext();

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">Upload Images</h2>

      <DropzoneArea
        filesCount={files.length}
        onDrop={handleDrop}
        disabled={files.length >= 10}
      />

      <FilePreview
        files={files}
        onRemove={handleRemove}
        uploading={uploading}
        onReset={onReset}
      />

      <UploadProgress
        uploading={uploading}
        uploadProgress={uploadProgress}
        onUpload={handleUpload}
      />
    </div>
  );
}
