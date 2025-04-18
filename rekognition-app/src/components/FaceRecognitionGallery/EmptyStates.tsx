import { User } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin mb-4"></div>
      <p className="text-white text-xl font-medium">Processing images...</p>
    </div>
  );
}
 
export function NoFilteredResults() {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 text-center">
      <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-4">
        <User className="h-8 w-8 text-white/70" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No images found</h3>
      <p className="text-white/70">Try adjusting your search or filters</p>
    </div>
  );
}
