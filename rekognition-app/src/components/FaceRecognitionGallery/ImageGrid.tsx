import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { ProcessedImage } from "@/types";
import { SmartImage } from "@/components/SmartImage";
interface Props {
  images: ProcessedImage[];
  editingFace: { imageId: string; faceId: string } | null;
  faceName: string;
  setFaceName: (val: string) => void;
  setEditingFace: (val: { imageId: string; faceId: string } | null) => void;
  handleNameUpdate: (imageId: string, faceId: string) => void;
}

export function ImageGrid({
  images,
  editingFace,
  faceName,
  setFaceName,
  setEditingFace,
  handleNameUpdate,
}: Props) {
  const popupRef = useRef<HTMLDivElement>(null);

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {images.map((image, index) => (
        <div
          key={index}
          className="break-inside-avoid bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 shadow-xl hover:shadow-2xl transition-shadow duration-300"
        >
          <div className="relative">
         
            <SmartImage
              src={image.url}
              alt="Uploaded image"
              width={400}
              height={400}
              className="w-full h-auto"
            />
            {Array.isArray(image.faces) && image.faces.map((face) => (
              <div
                key={face.personId}
                className={cn(
                  "absolute rounded-full border-2 cursor-pointer transition-all",
                  editingFace?.faceId === face.personId
                    ? "border-pink-500 shadow-[0_0_0_4px_rgba(236,72,153,0.3)]"
                    : "border-white shadow-[0_0_0_2px_rgba(0,0,0,0.3)]"
                )}
                style={{
                  left: `${
                    face.boundingBox?.Left ? face.boundingBox.Left * 100 : 0
                  }%`,
                  top: `${
                    face.boundingBox?.Top ? face.boundingBox.Top * 100 : 0
                  }%`,
                  width: `${
                    face.boundingBox?.Width ? face.boundingBox.Width * 100 : 0
                  }%`,
                  height: `${
                    face.boundingBox?.Height ? face.boundingBox.Height * 100 : 0
                  }%`,
                }}
                onClick={() => {
                  setEditingFace({ imageId: image.id, faceId: face.personId });
                  setFaceName(face.name);
                }}
              >
                {editingFace?.faceId === face.personId && (
                  <div
                    ref={popupRef}
                    className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-lg p-2 w-48 z-10 flex gap-2"
                  >
                    <Input
                      value={faceName || ""}
                      onChange={(e) => setFaceName(e.target.value)}
                      className="h-8 text-sm text-white bg-white/10 border-white/20"
                      placeholder="Enter name"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      className="h-8 px-2 bg-pink-600 hover:bg-pink-700"
                      onClick={() => handleNameUpdate(image.id, face.personId)}
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div> 
          
          <div className="p-4">
            <p className="text-white/80 text-sm mb-2">
              {(image.originalFile?.name ?? "").length > 40
                ? `...${image.originalFile?.name.slice(-40)}`
                : image.originalFile?.name ?? "Unnamed"}
            </p>

            {(Array.isArray(image.faces) && image.faces.length > 0) ? (
              <div className="flex flex-wrap gap-2">
                {image.faces.map((face) => (
                  <Badge
                    key={face.personId}
                    variant="outline"
                    className="bg-white/10 text-white border-white/20 flex items-center gap-1"
                  >
                    <User className="h-3 w-3" />
                    {face.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-sm">No faces detected</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
