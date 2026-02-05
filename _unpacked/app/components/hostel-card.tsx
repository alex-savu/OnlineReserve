import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { MapPin, Star, Bed, Users, Wifi, Crown } from "lucide-react";
import { ImageCarousel } from "@/app/components/image-carousel";
import type { Hostel } from "@/app/types";

interface HostelCardProps {
  hostel: Hostel;
  onViewDetails: (hostel: Hostel) => void;
}

export function HostelCard({ hostel, onViewDetails }: HostelCardProps) {
  const minPrice = Math.min(...hostel.rooms.map(r => r.price));
  const availableRooms = hostel.rooms.filter(r => r.available).length;
  const isFeatured = hostel.featured;

  return (
    <Card 
      className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group ${isFeatured ? 'ring-2 ring-primary' : ''}`}
      onClick={() => onViewDetails(hostel)}
    >
      {isFeatured && (
        <div className="bg-primary text-primary-foreground px-3 py-1.5 text-xs sm:text-sm font-semibold flex items-center gap-1 justify-center">
          <Crown className="size-3.5 sm:size-4" />
          <span>Pensiune Premium</span>
        </div>
      )}
      <ImageCarousel images={hostel.images} alt={hostel.name} />
      <CardHeader className="p-3 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="line-clamp-1 text-base sm:text-lg">{hostel.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1 text-xs sm:text-sm">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">{hostel.location}</span>
            </CardDescription>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1 shrink-0 text-xs sm:text-sm px-2 py-0.5">
            <Star className="size-3 fill-current" />
            {hostel.rating}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 sm:space-y-3 p-3 sm:p-6 pt-0">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{hostel.description}</p>
        <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1">
            <Bed className="size-3.5 sm:size-4" />
            <span>{hostel.rooms.length} camere</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="size-3.5 sm:size-4" />
            <span>Max {Math.max(...hostel.rooms.map(r => r.capacity))}</span>
          </div>
          {hostel.amenities.includes("wifi") && (
            <div className="flex items-center gap-1">
              <Wifi className="size-3.5 sm:size-4" />
              <span>Wi-Fi</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pt-2 border-t text-xs sm:text-sm">
          <div className="text-muted-foreground">
            {availableRooms > 0 ? (
              <span className="text-green-600 font-medium">{availableRooms} disponibile</span>
            ) : (
              <span className="text-destructive">Complet ocupat</span>
            )}
          </div>
          <div className="text-muted-foreground">{hostel.reviews} recenzii</div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-3 sm:p-6 pt-0">
        <div>
          <div className="text-xs text-muted-foreground">De la</div>
          <div>
            <span className="text-xl sm:text-2xl font-semibold">{minPrice} RON</span>
            <span className="text-xs sm:text-sm text-muted-foreground">/noapte</span>
          </div>
        </div>
        <Button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onViewDetails(hostel);
          }} 
          size="sm" 
          className="text-xs sm:text-sm"
        >
          Vezi Detalii
        </Button>
      </CardFooter>
    </Card>
  );
}