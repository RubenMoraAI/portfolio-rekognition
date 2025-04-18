"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";
import { FileItem, AnalyzedImageResponse, ProcessedImage } from "@/types";

interface ImageUploaderContextProps {
  files: FileItem[];
  uploading: boolean;
  uploadProgress: number;
  processedImages: ProcessedImage[];
  uploadedImages: ProcessedImage[];
  handleDrop: (accepted: File[]) => void;
  handleRemove: (index: number) => void;
  handleUpload: () => Promise<void>;
  onReset: () => void;
  setUploadedImages: (images: ProcessedImage[]) => void;
  resetUploadedImages: () => void;
  setProcessedImages: React.Dispatch<React.SetStateAction<ProcessedImage[]>>;
}

const ImageUploaderContext = createContext<
  ImageUploaderContextProps | undefined
>(undefined);

export function ImageUploaderProvider({
  children,
  existingFiles,
}: {
  children: React.ReactNode;
  existingFiles?: ProcessedImage[];
}) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [uploadedImages, setUploadedImages] = useState<ProcessedImage[]>([]);

  useEffect(() => {}, [processedImages]);
  useEffect(() => {}, [files]);
  useEffect(() => {
    if ((existingFiles ?? []).length > 0) {
      setFiles(
        (existingFiles ?? []).map((file) => ({
          url: file.url || "",
          faces: file.faces || [],
          originalFile: undefined,
          personId: "",
        }))
      );
      setProcessedImages(existingFiles ?? []);
    }
  }, [existingFiles]);

  const handleDrop = useCallback(
    (accepted: File[]) => {
      const remaining = 10 - files.length;
      const toAdd = accepted.slice(0, remaining);
      if (toAdd.length < accepted.length) {
        toast.warning("Maximum files reached", {
          description: `Only added ${toAdd.length} files. Max is 10.`,
        });
      }
      setFiles((prev) => [
        ...prev,
        ...toAdd.map((file) => ({
          url: "",
          faces: [],
          originalFile: file,
          personId: "",
        })),
      ]);
    },
    [files]
  );

  const handleRemove = (index: number) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  const validateFiles = () => {
    if (files.length === 0) {
      toast.warning("No files selected", {
        description: "Please select at least one image",
      });
      return false;
    }
    return true;
  };

  const uploadFile = (
    file: FileItem,
    onProgress?: (percent: number) => void
  ): Promise<AnalyzedImageResponse> => {
    return new Promise((resolve, reject) => {
      if (!file.originalFile) return reject(new Error("File is undefined"));

      const formData = new FormData();
      formData.append("images", file.originalFile);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload", true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const { data } = JSON.parse(xhr.responseText);
            resolve(data[0]);
          } catch (err) {
            reject(err);
          }
        } else {
          reject(new Error(`Failed to analyze ${file.originalFile!.name}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(formData);
    });
  };

  const handleUpload = async () => {
    if (!validateFiles()) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const ProcessedImages = await Promise.all(
        files.map(async (file) => {
          const analyzed = await uploadFile(file, (percent) => {
            setUploadProgress(percent);
          });
          return {
            id: file.originalFile?.name || "unknown-" + Math.random(),
            url: analyzed.url,
            faces: analyzed.faces,
            originalFile: file.originalFile,
          };
        })
      );

      setUploadProgress(100);
      toast("Upload complete", {
        description: `Successfully uploaded and analyzed ${files.length} images.`,
      });

      setProcessedImages(ProcessedImages);
      setUploadedImages(ProcessedImages);
    } catch {
      toast.warning("Operation failed", {
        description: "There was an error processing your images.",
      });
    } finally {
      setUploading(false);
    }
  };

  const onReset = () => {
    setFiles([]);
    setUploadProgress(0);
    setUploading(false);
    setProcessedImages([]);
    resetUploadedImages();
  };

  const resetUploadedImages = () => {
    setUploadedImages([]);
    setProcessedImages([]);
    setFiles([]);
  };

  return (
    <ImageUploaderContext.Provider
      value={{
        files,
        uploading,
        uploadProgress,
        processedImages,
        uploadedImages,
        handleDrop,
        handleRemove,
        handleUpload,
        onReset,
        setUploadedImages,
        resetUploadedImages,
        setProcessedImages,
      }}
    >
      {children}
    </ImageUploaderContext.Provider>
  );
}

export function useImageUploaderContext() {
  const context = useContext(ImageUploaderContext);
  if (!context) {
    throw new Error(
      "useImageUploaderContext must be used within an ImageUploaderProvider"
    );
  }
  return context;
}
