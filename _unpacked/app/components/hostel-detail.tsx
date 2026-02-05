import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { RoomCard } from "@/app/components/room-card";
import { ImageCarousel } from "@/app/components/image-carousel";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Calendar } from "@/app/components/ui/calendar";
import {
  MapPin,
  Star,
  ArrowLeft,
  Wifi,
  Coffee,
  Car,
  Wind,
  Utensils,
  Dumbbell,
  Shirt,
  Calendar as CalendarIcon,
  Waves,
  Wine,
  Sparkles,
  ConciergeBell,
  User,
  Plane,
  Trees,
  Sun,
  Clock,
  PawPrint,
  WashingMachine,
  Snowflake,
} from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import type { Hostel, Room } from "@/app/types";
import { Label } from "@/app/components/ui/label";

interface HostelDetailProps {
  hostel: Hostel;
  onBack: () => void;
  onBookRoom: (room: Room, checkIn?: Date, checkOut?: Date) => void;
}

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  parking: Car,
  pool: Waves,
  restaurant: Utensils,
  bar: Wine,
  spa: Sparkles,
  gym: Dumbbell,
  "room-service": ConciergeBell,
  concierge: User,
  "airport-transfer": Plane,
  garden: Trees,
  terrace: Sun,
  "24h-reception": Clock,
  pets: PawPrint,
  laundry: WashingMachine,
  ac: Snowflake,
  breakfast: Coffee,
};

const amenityNames: Record<string, string> = {
  wifi: "WiFi Gratuit",
  parking: "Parcare Gratuită",
  pool: "Piscină",
  restaurant: "Restaurant",
  bar: "Bar",
  spa: "Spa & Wellness",
  gym: "Sală Fitness",
  "room-service": "Room Service",
  concierge: "Concierge",
  "airport-transfer": "Transfer Aeroport",
  garden: "Grădină",
  terrace: "Terasă",
  "24h-reception": "Recepție 24/7",
  pets: "Animale Permise",
  laundry: "Spălătorie",
  ac: "Aer Condiționat",
  breakfast: "Mic Dejun Inclus",
};

export function HostelDetail({ hostel, onBack, onBookRoom }: HostelDetailProps) {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const availableRooms = hostel.rooms.filter(r => r.available);

  const handleBookRoom = (room: Room) => {
    onBookRoom(room, checkIn, checkOut);
  };

  return (
    <div className="space-y-3 sm:space-y-6 px-2 sm:px-0">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} size="sm" className="text-xs sm:text-sm -ml-2 sm:ml-0">
        <ArrowLeft className="size-3.5 sm:size-4 mr-1 sm:mr-2" />
        Înapoi la lista pensiunilor
      </Button>

      {/* Hero Image */}
      <div className="aspect-[4/3] sm:aspect-video lg:aspect-[21/9] w-full overflow-hidden rounded-lg bg-gray-100">
        <ImageCarousel
          images={hostel.images}
          alt={hostel.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Hostel Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
        <div className="lg:col-span-2 space-y-3 sm:space-y-6">
          <div>
            <div className="flex items-start justify-between gap-2 sm:gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold mb-1 leading-tight">{hostel.name}</h1>
                <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground text-xs sm:text-base">
                  <MapPin className="size-3 sm:size-4 shrink-0" />
                  <span className="line-clamp-1">{hostel.location}</span>
                </div>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1 text-sm sm:text-lg px-2 sm:px-3 py-0.5 sm:py-1 shrink-0">
                <Star className="size-3 sm:size-4 fill-current" />
                {hostel.rating}
              </Badge>
            </div>
            <p className="text-xs sm:text-base text-muted-foreground leading-relaxed">{hostel.description}</p>
          </div>

          <Separator />

          {/* Amenities */}
          <div>
            <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4">Facilități</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {hostel.amenities.map((amenity) => {
                const Icon = amenityIcons[amenity.toLowerCase()];
                const name = amenityNames[amenity.toLowerCase()] || amenity;
                return (
                  <div key={amenity} className="flex items-center gap-2 text-xs sm:text-base">
                    {Icon && <Icon className="size-4 sm:size-5 text-primary shrink-0" />}
                    <span className="truncate">{name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <Card>
            <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-6">
              <CardTitle className="text-sm sm:text-lg">Informații de Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3 sm:p-6 pt-2 sm:pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Adresă</p>
                  <p className="text-xs sm:text-base">{hostel.address}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Telefon</p>
                  <p className="text-xs sm:text-base">{hostel.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                  <p className="text-xs sm:text-base break-all">{hostel.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Check-in / Check-out</p>
                  <p className="text-xs sm:text-base">14:00 / 11:00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Info Sidebar */}
        <div className="space-y-3 sm:space-y-4">
          <Card>
            <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-6">
              <CardTitle className="text-sm sm:text-lg">Informații Rapide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-2 sm:pt-0 text-xs sm:text-base">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Camere</span>
                <span className="font-semibold">{hostel.rooms.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Disponibile Acum</span>
                <span className="font-semibold text-green-600">{availableRooms.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rating</span>
                <span className="font-semibold">{hostel.rating}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recenzii</span>
                <span className="font-semibold">{hostel.reviews}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-end">
                <span className="text-xs text-muted-foreground">Începând de la</span>
                <div className="text-right">
                  <span className="text-lg sm:text-2xl font-bold">
                    {Math.min(...hostel.rooms.map(r => r.price))} RON
                  </span>
                  <span className="text-xs text-muted-foreground block">/noapte</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date Selection Card */}
          
        </div>
      </div>

      <Separator />

      {/* Available Rooms */}
      <div>
        <h2 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-6">Camere Disponibile</h2>
        {availableRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {hostel.rooms.map((room) => (
              <RoomCard key={room.id} room={room} onBook={handleBookRoom} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 sm:py-12 text-center">
              <p className="text-xs sm:text-base text-muted-foreground">Nu sunt camere disponibile în acest moment</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}