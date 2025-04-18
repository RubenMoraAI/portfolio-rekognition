"use client"

import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"

interface DropzoneProps {
  filesCount: number
  onDrop: (files: File[]) => void
  disabled?: boolean
}

export function DropzoneArea({ filesCount, onDrop, disabled }: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 10,
    maxSize: 10485760,
    disabled,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-4 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all transform hover:scale-[1.01] ${
        isDragActive
          ? "border-white bg-white/20"
          : disabled
            ? "border-white/30 bg-white/5 cursor-not-allowed"
            : "border-white/50 hover:border-white/80"
      }`}
    >
      <input {...getInputProps()} multiple />
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
          <Upload className="h-8 w-8 text-white" />
        </div>
        <div>
          {disabled ? (
            <p className="text-white/70 font-medium text-lg">Maximum number of images reached (10)</p>
          ) : (
            <>
              <p className="text-white font-medium text-lg">
                {isDragActive ? "Drop the images here..." : "Drag & drop multiple images here, or click to select"}
              </p>
              <p className="text-white/70 text-sm mt-1">
                Upload up to {10 - filesCount} more images (max 10MB each)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
