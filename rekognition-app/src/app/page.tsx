"use client";
 
import { ImageUploader } from "@/components/ImageUploader";
import { FaceRecognitionGallery } from "@/components/FaceRecognitionGallery";
import AppHeader from "@/components/AppHeader";
import { useImageUploaderContext } from "@/context/ImageUploaderContext";

export default function Home() {
  const {
    uploadedImages,
    resetUploadedImages, 
  } = useImageUploaderContext();

  const showUploader = uploadedImages.length === 0;

  const handleReset = () => {
    resetUploadedImages();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <AppHeader />

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border-2 border-white/20">
          {showUploader && <ImageUploader  />}

          {!showUploader   && (
            <div className="mb-6 flex flex-wrap gap-3 justify-start">
              <button
                onClick={handleReset}
                className="bg-pink-600/70 hover:bg-pink-600/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Reset Everything
              </button>
            </div>
          )}

          <FaceRecognitionGallery />
        </div>
      </div> 
    </main>
  );
}
