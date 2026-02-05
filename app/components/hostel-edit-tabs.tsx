import { useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Badge } from "@/app/components/ui/badge";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Plus, X, Edit, Trash2, Wifi, Car, Waves, Utensils, Wine, Sparkles, Dumbbell, ConciergeBell, User, Plane, Trees, Sun, Clock, PawPrint, WashingMachine, Snowflake, Coffee } from "lucide-react";
import { toast } from "sonner";
import type { Hostel, Room } from "@/app/types";
import { Separator } from "@/app/components/ui/separator";

interface HostelEditTabsProps {
  hostel: Hostel;
  editedHostel: Hostel;
  setEditedHostel: (hostel: Hostel) => void;
  editMode: boolean;
  onEditRoom: (room: Room) => void;
}

const AVAILABLE_AMENITIES = [
  { value: "wifi", label: "WiFi Gratuit", icon: Wifi },
  { value: "parking", label: "Parcare Gratuită", icon: Car },
  { value: "pool", label: "Piscină", icon: Waves },
  { value: "restaurant", label: "Restaurant", icon: Utensils },
  { value: "bar", label: "Bar", icon: Wine },
  { value: "spa", label: "Spa & Wellness", icon: Sparkles },
  { value: "gym", label: "Sală Fitness", icon: Dumbbell },
  { value: "room-service", label: "Room Service", icon: ConciergeBell },
  { value: "concierge", label: "Concierge", icon: User },
  { value: "airport-transfer", label: "Transfer Aeroport", icon: Plane },
  { value: "garden", label: "Grădină", icon: Trees },
  { value: "terrace", label: "Terasă", icon: Sun },
  { value: "24h-reception", label: "Recepție 24/7", icon: Clock },
  { value: "pets", label: "Animale Permise", icon: PawPrint },
  { value: "laundry", label: "Spălătorie", icon: WashingMachine },
  { value: "ac", label: "Aer Condiționat", icon: Snowflake },
  { value: "breakfast", label: "Mic Dejun Inclus", icon: Coffee },
];

export function HostelEditTabs({ hostel, editedHostel, setEditedHostel, editMode, onEditRoom }: HostelEditTabsProps) {
  const [imageUrl, setImageUrl] = useState("");

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setEditedHostel({
        ...editedHostel,
        images: [...(editedHostel.images || []), imageUrl.trim()]
      });
      setImageUrl("");
      toast.success('Imagine adăugată!');
    }
  };

  const handleRemoveImage = (index: number) => {
    setEditedHostel({
      ...editedHostel,
      images: editedHostel.images?.filter((_, i) => i !== index) || []
    });
    toast.success('Imagine ștearsă!');
  };

  const handleAmenityToggle = (amenity: string) => {
    const currentAmenities = editedHostel.amenities || [];
    const isChecked = currentAmenities.includes(amenity);
    const newAmenities = isChecked
      ? currentAmenities.filter((a) => a !== amenity)
      : [...currentAmenities, amenity];
    setEditedHostel({ ...editedHostel, amenities: newAmenities });
  };

  if (!editMode) {
    // View Mode
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1 sm:space-y-2">
            <Label className="text-xs sm:text-sm text-muted-foreground">Nume Pensiune</Label>
            <p className="text-sm sm:text-base font-medium">{hostel.name}</p>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <Label className="text-xs sm:text-sm text-muted-foreground">Locație</Label>
            <p className="text-sm sm:text-base font-medium">{hostel.location}</p>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <Label className="text-xs sm:text-sm text-muted-foreground">Adresă</Label>
            <p className="text-sm sm:text-base font-medium">{hostel.address}</p>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <Label className="text-xs sm:text-sm text-muted-foreground">Contact</Label>
            <p className="text-sm sm:text-base font-medium truncate">{hostel.phone} • {hostel.email}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-1 sm:space-y-2">
          <Label className="text-xs sm:text-sm text-muted-foreground">Descriere</Label>
          <p className="text-sm">{hostel.description}</p>
        </div>

        <Separator />

        <div>
          <Label className="text-muted-foreground mb-2 block">Imagini ({hostel.images.length})</Label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {hostel.images.slice(0, 8).map((img, idx) => (
              <img key={idx} src={img} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded" />
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-muted-foreground mb-2 block">Facilități ({hostel.amenities.length})</Label>
          <div className="flex flex-wrap gap-2">
            {hostel.amenities.map((amenity, idx) => (
              <Badge key={idx} variant="outline">{amenity}</Badge>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-muted-foreground mb-2 block">Camere ({hostel.rooms.length})</Label>
          <div className="space-y-2">
            {hostel.rooms.map((room) => (
              <div key={room.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{room.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {room.type} • {room.capacity} persoane
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{room.price} RON</div>
                  <div className="text-xs text-muted-foreground">/noapte</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Edit Mode
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
        <TabsTrigger value="details" className="text-xs sm:text-sm">Detalii</TabsTrigger>
        <TabsTrigger value="images" className="text-xs sm:text-sm">Imagini</TabsTrigger>
        <TabsTrigger value="amenities" className="text-xs sm:text-sm">Facilități</TabsTrigger>
        <TabsTrigger value="rooms" className="text-xs sm:text-sm">Camere</TabsTrigger>
      </TabsList>

      {/* Details Tab */}
      <TabsContent value="details" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="name" className="text-xs sm:text-sm">Nume Pensiune *</Label>
            <Input
              id="name"
              value={editedHostel.name}
              onChange={(e) => setEditedHostel({ ...editedHostel, name: e.target.value })}
              placeholder="Grozav Home"
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="location" className="text-xs sm:text-sm">Locație *</Label>
            <Input
              id="location"
              value={editedHostel.location}
              onChange={(e) => setEditedHostel({ ...editedHostel, location: e.target.value })}
              placeholder="Vama Seacă, Apuseni"
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
            <Label htmlFor="address" className="text-xs sm:text-sm">Adresă Completă *</Label>
            <Input
              id="address"
              value={editedHostel.address}
              onChange={(e) => setEditedHostel({ ...editedHostel, address: e.target.value })}
              placeholder="Str. Principală nr. 123"
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="phone" className="text-xs sm:text-sm">Telefon</Label>
            <Input
              id="phone"
              value={editedHostel.phone}
              onChange={(e) => setEditedHostel({ ...editedHostel, phone: e.target.value })}
              placeholder="+40 123 456 789"
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              value={editedHostel.email}
              onChange={(e) => setEditedHostel({ ...editedHostel, email: e.target.value })}
              placeholder="contact@pensiune.ro"
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
            <Label htmlFor="description" className="text-xs sm:text-sm">Descriere</Label>
            <Textarea
              id="description"
              value={editedHostel.description}
              onChange={(e) => setEditedHostel({ ...editedHostel, description: e.target.value })}
              placeholder="Descrierea pensiunii..."
              rows={3}
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="lat" className="text-xs sm:text-sm">Latitudine (GPS)</Label>
            <Input
              id="lat"
              type="number"
              step="0.0001"
              value={editedHostel.coordinates?.lat || ""}
              onChange={(e) => setEditedHostel({
                ...editedHostel,
                coordinates: { ...editedHostel.coordinates!, lat: parseFloat(e.target.value) || 0 }
              })}
              placeholder="46.0569"
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="lng" className="text-xs sm:text-sm">Longitudine (GPS)</Label>
            <Input
              id="lng"
              type="number"
              step="0.0001"
              value={editedHostel.coordinates?.lng || ""}
              onChange={(e) => setEditedHostel({
                ...editedHostel,
                coordinates: { ...editedHostel.coordinates!, lng: parseFloat(e.target.value) || 0 }
              })}
              placeholder="23.4762"
              className="text-sm"
            />
          </div>

          <div className="flex items-center space-x-2 sm:col-span-2">
            <Checkbox
              id="featured"
              checked={editedHostel.featured}
              onCheckedChange={(checked) => setEditedHostel({ ...editedHostel, featured: checked as boolean })}
            />
            <Label htmlFor="featured" className="cursor-pointer text-xs sm:text-sm">
              Pensiune Premium (afișată cu prioritate)
            </Label>
          </div>
        </div>
      </TabsContent>

      {/* Images Tab */}
      <TabsContent value="images" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-xs sm:text-sm">Adaugă Imagini Pensiune</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL imagine"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddImage();
                }
              }}
              className="text-sm flex-1"
            />
            <Button type="button" onClick={handleAddImage} size="sm" className="w-full sm:w-auto">
              <Plus className="size-3.5 sm:size-4 mr-1 sm:mr-2" />
              Adaugă
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Introdu URL-ul imaginii
          </p>
        </div>

        {editedHostel.images && editedHostel.images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            {editedHostel.images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-28 sm:h-40 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 sm:top-2 sm:right-2 h-6 w-6 sm:h-8 sm:w-8 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="size-3 sm:size-4" />
                </Button>
                {index === 0 && (
                  <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-primary text-primary-foreground text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                    Principală
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-6 sm:p-8 text-center text-muted-foreground">
            <p className="text-sm">Nu există imagini adăugate</p>
            <p className="text-xs sm:text-sm">Adaugă prima imagine folosind câmpul de mai sus</p>
          </div>
        )}
      </TabsContent>

      {/* Amenities Tab */}
      <TabsContent value="amenities" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
        <div>
          <Label className="text-xs sm:text-sm">Facilități Pensiune</Label>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Selectează facilitățile disponibile în pensiune
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {AVAILABLE_AMENITIES.map((amenity) => {
              const Icon = amenity.icon;
              return (
                <div key={amenity.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`hostel-${amenity.value}`}
                    checked={editedHostel.amenities?.includes(amenity.value)}
                    onCheckedChange={() => handleAmenityToggle(amenity.value)}
                  />
                  <Label htmlFor={`hostel-${amenity.value}`} className="cursor-pointer text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                    <Icon className="size-3.5 sm:size-4 text-primary shrink-0" />
                    <span className="truncate">{amenity.label}</span>
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      </TabsContent>

      {/* Rooms Tab */}
      <TabsContent value="rooms" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3">
            <div>
              <h3 className="text-sm sm:text-lg font-semibold">Camere ({editedHostel.rooms.length})</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Gestionează camerele pensiunii</p>
            </div>
            <Button size="sm" onClick={() => {
              const newRoom: Room = {
                id: `${editedHostel.id}-R${editedHostel.rooms.length + 1}`,
                name: "Cameră Nouă",
                type: "Cameră Dublă",
                capacity: 2,
                beds: "1 pat dublu",
                price: 300,
                image: "https://images.unsplash.com/photo-1631015108776-19a4ac25a741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
                amenities: [],
                available: true,
                description: "Descriere cameră",
              };
              onEditRoom(newRoom);
            }} className="w-full sm:w-auto text-xs sm:text-sm">
              <Plus className="size-3.5 sm:size-4 mr-1 sm:mr-2" />
              Adaugă Cameră
            </Button>
          </div>
          <div className="space-y-2">
            {editedHostel.rooms.map((room) => (
              <div key={room.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-2.5 sm:p-3 border rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="text-sm sm:text-base font-medium truncate">{room.name}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground truncate">
                    {room.type} • {room.capacity} persoane • {room.beds}
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                  <div className="text-left sm:text-right">
                    <div className="text-sm sm:text-base font-bold">{room.price} RON</div>
                    <div className="text-xs text-muted-foreground">/noapte</div>
                  </div>
                  <Badge variant={room.available ? "default" : "secondary"} className="text-xs shrink-0">
                    {room.available ? "Disponibil" : "Ocupat"}
                  </Badge>
                  <div className="flex gap-1.5 sm:gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditRoom(room)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="size-3.5 sm:size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm(`Sigur doriți să ștergeți camera ${room.name}?`)) {
                          setEditedHostel({
                            ...editedHostel,
                            rooms: editedHostel.rooms.filter(r => r.id !== room.id)
                          });
                          toast.success('Camera a fost ștearsă');
                        }
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="size-3.5 sm:size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}