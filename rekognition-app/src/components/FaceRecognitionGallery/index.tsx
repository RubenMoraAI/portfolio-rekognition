"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { AnalyzedFace } from "@/types";
import { useImageUploaderContext } from "../../context/ImageUploaderContext";

import { GalleryHeader } from "./GalleryHeader";
import { ImageGrid } from "./ImageGrid";
import { LoadingState, NoFilteredResults } from "./EmptyStates";

export function FaceRecognitionGallery() {
  const { processedImages, setProcessedImages } = useImageUploaderContext(); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [allPeople, setAllPeople] = useState<{ id: string; name: string }[]>([]);

  const [editingFace, setEditingFace] = useState<{
    imageId: string;
    faceId: string;
  } | null>(null);
  const [faceName, setFaceName] = useState("");

  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (processedImages.length > 0) {
      setLoading(true);

      const peopleMap = new Map<string, string>();
      processedImages.forEach((img) => {
        if (img.faces) {
          img.faces.forEach((face: AnalyzedFace) => {
            peopleMap.set(
              face.personId || crypto.randomUUID(),
              face.name || "Unknown"
            );
          });
        }
      });

      const uniquePeople = Array.from(peopleMap.entries()).map(
        ([id, name]) => ({ id, name })
      );
      setAllPeople(uniquePeople);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [processedImages]);

  const filteredImages = processedImages.filter((image) => {
    if (searchTerm) {
      const hasMatch = image.faces.some((f) =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (!hasMatch) return false;
    }
    if (selectedPeople.length > 0) {
      const hasSelected = image.faces.some((f) =>
        selectedPeople.includes(f.personId)
      );
      if (!hasSelected) return false;
    }
    return true;
  });

  const handleNameUpdate = (imageId: string, faceId: string) => {
    if (!faceName.trim()) {
      toast.warning("Name required", {
        description: "Please enter a name for this person",
      });
      return;
    }
 
    setProcessedImages(
      processedImages.map((img) => ({
        ...img,
        faces: img.faces.map((face) =>
          face.personId === faceId ? { ...face, name: faceName } : face
        ),
      }))
    );
 
    setAllPeople((prevPeople) =>
      prevPeople.map((person) =>
        person.id === faceId ? { ...person, name: faceName } : person
      )
    );
 
    setEditingFace(null);
    setFaceName("");
  };

  const togglePersonFilter = (personId: string) => {
    setSelectedPeople((prev) =>
      prev.includes(personId)
        ? prev.filter((id) => id !== personId)
        : [...prev, personId]
    );
  };

  const clearFilters = () => setSelectedPeople([]);

  useEffect(() => {
    const closePopup = (e: KeyboardEvent) => {
      if (e.key === "Escape" && editingFace) {
        setEditingFace(null);
        setFaceName("");
      }
    };
    window.addEventListener("keydown", closePopup);
    return () => window.removeEventListener("keydown", closePopup);
  }, [editingFace]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        editingFace &&
        popupRef.current &&
        !popupRef.current.contains(e.target as Node)
      ) {
        setEditingFace(null);
        setFaceName("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingFace, popupRef]);

  if (loading) return <LoadingState />;
  if (processedImages.length === 0) return null;

  return (
    <div>
      <GalleryHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        allPeople={allPeople}
        selectedPeople={selectedPeople}
        togglePersonFilter={togglePersonFilter}
        clearFilters={clearFilters}
      />

      {filteredImages.length === 0 ? (
        <NoFilteredResults />
      ) : (
        <ImageGrid
          images={filteredImages}
          editingFace={editingFace}
          faceName={faceName}
          setFaceName={setFaceName}
          setEditingFace={setEditingFace}
          handleNameUpdate={handleNameUpdate}
        />
      )}
    </div>
  );
}
