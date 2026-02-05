import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Users, Bed, Wifi, Coffee, Tv, Wind } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import type { Room } from "@/app/types";

interface RoomCardProps {
  room: Room;
  onBook: (room: Room) => void;
}

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  breakfast: Coffee,
  tv: Tv,
  ac: Wind,
};

const amenityNames: Record<string, string> = {
  wifi: "Wi-Fi",
  breakfast: "Mic dejun",
  tv: "TV",
  ac: "AC",
};

export function RoomCard({ room, onBook }: RoomCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] sm:aspect-video w-full overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm sm:text-base lg:text-lg line-clamp-1">{room.name}</CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-0.5">{room.type}</CardDescription>
          </div>
          <Badge variant={room.available ? "default" : "secondary"} className="text-xs shrink-0 px-2 py-0.5">
            {room.available ? "Disponibil" : "Ocupat"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4 lg:p-6 pt-0">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{room.description}</p>
        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <Users className="size-3.5 sm:size-4" />
            <span>{room.capacity} pers.</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="size-3.5 sm:size-4" />
            <span className="truncate">{room.beds}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {room.amenities.slice(0, 4).map((amenity) => {
            const Icon = amenityIcons[amenity.toLowerCase()];
            const name = amenityNames[amenity.toLowerCase()] || amenity;
            return Icon ? (
              <div key={amenity} className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon className="size-3 sm:size-3.5" />
                <span>{name}</span>
              </div>
            ) : null;
          })}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 p-3 sm:p-4 lg:p-6 pt-0">
        <div>
          <span className="text-lg sm:text-xl lg:text-2xl font-semibold">{room.price} RON</span>
          <span className="text-xs text-muted-foreground">/noapte</span>
        </div>
        <Button onClick={() => onBook(room)} disabled={!room.available} className="w-full sm:w-auto text-xs sm:text-sm">
          {room.available ? "Rezervă Acum" : "Indisponibil"}
        </Button>
      </CardFooter>
    </Card>
  );
}