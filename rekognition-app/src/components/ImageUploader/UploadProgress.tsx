"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";

interface UploadProgressProps {
  uploading: boolean;
  uploadProgress: number;
  onUpload: () => void;
}

export function UploadProgress({
  uploading,
  uploadProgress,
  onUpload,
}: UploadProgressProps) {
  return uploading ? (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-medium">Uploading...</span>
        <span className="text-white">{uploadProgress}%</span>
      </div>
      <Progress value={uploadProgress} className="h-2 bg-white/20" />
      {uploadProgress === 100 && (
        <div className="flex items-center justify-center mt-4 text-white gap-2">
          <Check className="h-5 w-5 text-green-400" />
          <span>Upload complete!</span>
        </div>
      )}
    </div>
  ) : (
    <Button
      onClick={onUpload}
      className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      Upload & Process Images
    </Button>
  );
}
