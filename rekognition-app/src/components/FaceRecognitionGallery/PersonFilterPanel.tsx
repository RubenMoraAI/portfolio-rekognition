import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { User } from "lucide-react";

interface Props {
  allPeople: { id: string; name: string }[];
  selectedPeople: string[];
  togglePersonFilter: (id: string) => void;
  clearFilters: () => void;
}

export function PersonFilterPanel({
  allPeople,
  selectedPeople,
  togglePersonFilter,
  clearFilters,
}: Props) {
  return (
    <SheetContent
      aria-describedby="filter-description"
      className="bg-gradient-to-br from-purple-900 to-pink-900 border-white/10 text-white"
    >
      <SheetHeader>
        <SheetTitle className="text-white">Filter by Person</SheetTitle>
        <SheetDescription className="text-sm text-white/70">
          Select the people you want to filter by. You can select multiple
          people at once. Click &quot;Clear Filters&quot; to remove all selected filters.
        </SheetDescription>
      </SheetHeader>

      <div className="p-4">
        <ScrollArea className="h-[400px] pr-4 space-y-4">
          {allPeople.length === 0 ? (
            <p className="text-white/70 text-center py-8">
              No people detected in your images yet
            </p>
          ) : (
            allPeople.map((person) => (
              <div key={person.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`person-${person.id}`}
                  checked={selectedPeople.includes(person.id)}
                  onCheckedChange={() => togglePersonFilter(person.id)}
                  className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                />
                <Label
                  htmlFor={`person-${person.id}`}
                  className="text-white cursor-pointer flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  {person.name}
                </Label>
              </div>
            ))
          )}
        </ScrollArea>
        {selectedPeople.length > 0 && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full mt-2 border-white/20 text-black hover:bg-white/10"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </SheetContent>
  );
}
