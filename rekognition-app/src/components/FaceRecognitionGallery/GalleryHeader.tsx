import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { PersonFilterPanel } from "./PersonFilterPanel";

interface Props {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  allPeople: { id: string; name: string }[];
  selectedPeople: string[];
  togglePersonFilter: (id: string) => void;
  clearFilters: () => void;
}

export function GalleryHeader({
  allPeople,
  selectedPeople,
  togglePersonFilter,
  clearFilters,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <h2 className="text-2xl font-bold text-white">
        Face Recognition Gallery
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {selectedPeople.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-white/20 text-white"
                >
                  {selectedPeople.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>

          <PersonFilterPanel
            allPeople={allPeople}
            selectedPeople={selectedPeople}
            togglePersonFilter={togglePersonFilter}
            clearFilters={clearFilters}
          />
        </Sheet>
      </div>
    </div>
  );
}
