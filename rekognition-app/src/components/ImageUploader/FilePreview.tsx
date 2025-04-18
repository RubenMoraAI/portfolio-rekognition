"use client"

import Image from "next/image"
import { X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button" 
import { FileItem } from "@/types"
interface FilePreviewProps {
  files: FileItem[]
  uploading: boolean
  onRemove: (index: number) => void
  onReset: () => void
}

export function FilePreview({ files, uploading, onRemove, onReset }: FilePreviewProps) {
  if (files.length === 0) return null

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-semibold">Selected Images ({files.length}/10)</h3>
        {!uploading && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Clear All
          </Button>
        )}
      </div> 
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {files.map((file, index) => (
          <div
            key={`${file.originalFile?.name ?? 'unknown'}-${index}`}
            className="relative group bg-black/20 backdrop-blur-sm rounded-lg p-2 border border-white/10"
          >
            <div className="aspect-square rounded-md overflow-hidden bg-black/30 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-white/50" />
              </div>
              <Image
                width={100}
                height={100}
                src={file.originalFile ? URL.createObjectURL(file.originalFile) : ''}
                alt={file.originalFile?.name ?? 'Unnamed'}
                className="h-full w-full object-cover"
              />
            </div> 
            <p className="text-xs text-white/80 mt-1 truncate">{(file.originalFile?.name ?? '').length > 40 ? `...${file.originalFile?.name.slice(-40)}` : file.originalFile?.name ?? 'Unnamed'}</p>
            {!uploading && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(index)
                }}
                className="absolute -top-2 -right-2 bg-indigo-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
