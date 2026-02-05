import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedLocation: string;
  onLocationChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
  locations: string[];
  onClearFilters: () => void;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  selectedLocation,
  onLocationChange,
  priceRange,
  onPriceRangeChange,
  locations,
  onClearFilters,
}: SearchBarProps) {
  const hasFilters = searchQuery || selectedLocation !== "all" || priceRange !== "all";

  return (
    <div className="bg-card border rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex-1 min-w-0 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Caută pensiuni..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 text-sm sm:text-base"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex gap-2">
          <Select value={selectedLocation} onValueChange={onLocationChange}>
            <SelectTrigger className="w-full sm:w-[160px] text-xs sm:text-sm">
              <MapPin className="size-3.5 sm:size-4 mr-1 sm:mr-2 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate Locațiile</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={onPriceRangeChange}>
            <SelectTrigger className="w-full sm:w-[160px] text-xs sm:text-sm">
              <SlidersHorizontal className="size-3.5 sm:size-4 mr-1 sm:mr-2 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate Prețurile</SelectItem>
              <SelectItem value="budget">Buget (0-350 RON)</SelectItem>
              <SelectItem value="moderate">Moderat </SelectItem>
              <SelectItem value="premium">Premium </SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="col-span-2 sm:col-span-1 text-xs sm:text-sm">
              <X className="size-3.5 sm:size-4 mr-1" />
              Șterge
            </Button>
          )}
        </div>
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs sm:text-sm text-muted-foreground">Filtre active:</span>
          {searchQuery && (
            <Badge variant="secondary" className="text-xs">
              Căutare: {searchQuery}
            </Badge>
          )}
          {selectedLocation !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Locație: {selectedLocation.split(',')[0]}
            </Badge>
          )}
          {priceRange !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Preț: {priceRange === "budget" ? "Buget" : priceRange === "moderate" ? "Moderat" : "Premium"}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
