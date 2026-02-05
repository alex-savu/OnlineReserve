import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import type { Hostel, Room } from "@/app/types";

interface HostelFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostel?: Hostel | null;
  onSave: (hostel: Partial<Hostel>) => void;
}

const AVAILABLE_AMENITIES = [
  "WiFi Gratuit",
  "Parcare Gratuită",
  "Piscină",
  "Restaurant",
  "Bar",
  "Spa & Wellness",
  "Sală Fitness",
  "Room Service",
  "Concierge",
  "Transfer Aeroport",
  "Grădină",
  "Terasă",
  "Recepție 24/7",
  "Animale Permise",
  "Spălătorie",
];

const ROOM_AMENITIES = [
  "Aer Condiționat",
  "TV",
  "Mini Bar",
  "Baie Privată",
  "Balcon",
  "Vedere la Munte",
  "Vedere la Oraș",
  "Birou",
  "Seif",
  "Uscător de Păr",
];

export function HostelFormDialog({ open, onOpenChange, hostel, onSave }: HostelFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Hostel>>({
    name: "",
    location: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    images: [],
    amenities: [],
    rooms: [],
    featured: false,
    coordinates: { lat: 46.0569, lng: 23.4762 }, // Default Cluj-Napoca
  });

  const [imageUrl, setImageUrl] = useState("");
  const [currentRoom, setCurrentRoom] = useState<Partial<Room>>({
    name: "",
    type: "Standard",
    capacity: 2,
    beds: "1 pat dublu",
    price: 0,
    image: "",
    amenities: [],
    available: true,
    description: "",
  });
  const [editingRoomIndex, setEditingRoomIndex] = useState<number | null>(null);

  useEffect(() => {
    if (hostel) {
      setFormData({
        ...hostel,
        coordinates: hostel.coordinates || { lat: 46.0569, lng: 23.4762 },
      });
    } else {
      // Reset form for new hostel
      setFormData({
        name: "",
        location: "",
        address: "",
        phone: "",
        email: "",
        description: "",
        images: [],
        amenities: [],
        rooms: [],
        featured: false,
        coordinates: { lat: 46.0569, lng: 23.4762 },
      });
    }
  }, [hostel, open]);

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...(formData.images || []), imageUrl.trim()],
      });
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images?.filter((_, i) => i !== index) || [],
    });
  };

  const handleAmenityToggle = (amenity: string) => {
    const amenities = formData.amenities || [];
    if (amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: amenities.filter(a => a !== amenity),
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...amenities, amenity],
      });
    }
  };

  const handleRoomAmenityToggle = (amenity: string) => {
    const amenities = currentRoom.amenities || [];
    if (amenities.includes(amenity)) {
      setCurrentRoom({
        ...currentRoom,
        amenities: amenities.filter(a => a !== amenity),
      });
    } else {
      setCurrentRoom({
        ...currentRoom,
        amenities: [...amenities, amenity],
      });
    }
  };

  const handleAddRoom = () => {
    if (!currentRoom.name || !currentRoom.price) {
      toast.error("Te rugăm să completezi toate câmpurile obligatorii pentru cameră");
      return;
    }

    const newRoom: Room = {
      id: `R${String((formData.rooms?.length || 0) + 1).padStart(3, '0')}`,
      name: currentRoom.name!,
      type: currentRoom.type || "Standard",
      capacity: currentRoom.capacity || 2,
      beds: currentRoom.beds || "1 pat dublu",
      price: currentRoom.price!,
      image: currentRoom.image || "",
      amenities: currentRoom.amenities || [],
      available: currentRoom.available !== false,
      description: currentRoom.description || "",
    };

    if (editingRoomIndex !== null) {
      const rooms = [...(formData.rooms || [])];
      rooms[editingRoomIndex] = { ...newRoom, id: rooms[editingRoomIndex].id };
      setFormData({ ...formData, rooms });
      setEditingRoomIndex(null);
      toast.success("Cameră actualizată!");
    } else {
      setFormData({
        ...formData,
        rooms: [...(formData.rooms || []), newRoom],
      });
      toast.success("Cameră adăugată!");
    }

    // Reset current room
    setCurrentRoom({
      name: "",
      type: "Standard",
      capacity: 2,
      beds: "1 pat dublu",
      price: 0,
      image: "",
      amenities: [],
      available: true,
      description: "",
    });
  };

  const handleEditRoom = (index: number) => {
    const room = formData.rooms?.[index];
    if (room) {
      setCurrentRoom(room);
      setEditingRoomIndex(index);
    }
  };

  const handleDeleteRoom = (index: number) => {
    setFormData({
      ...formData,
      rooms: formData.rooms?.filter((_, i) => i !== index) || [],
    });
    toast.success("Cameră ștearsă!");
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.location || !formData.address) {
      toast.error("Te rugăm să completezi toate câmpurile obligatorii");
      return;
    }

    if (!formData.images?.length) {
      toast.error("Te rugăm să adaugi cel puțin o imagine");
      return;
    }

    if (!formData.rooms?.length) {
      toast.error("Te rugăm să adaugi cel puțin o cameră");
      return;
    }

    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{hostel ? "Editează Pensiune" : "Adaugă Pensiune Nouă"}</DialogTitle>
          <DialogDescription>
            Completează informațiile despre pensiune, adaugă imagini și definește camerele disponibile.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Detalii</TabsTrigger>
            <TabsTrigger value="images">Imagini</TabsTrigger>
            <TabsTrigger value="amenities">Facilități</TabsTrigger>
            <TabsTrigger value="rooms">Camere</TabsTrigger>
          </TabsList>

          {/* Basic Details Tab */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nume Pensiune *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Grozav Home"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Locație *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Vama Seacă, Apuseni"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Adresă Completă *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Str. Principală nr. 123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+40 123 456 789"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@pensiune.ro"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Descriere</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrierea pensiunii..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lat">Latitudine</Label>
                <Input
                  id="lat"
                  type="number"
                  step="0.0001"
                  value={formData.coordinates?.lat || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    coordinates: { ...formData.coordinates!, lat: parseFloat(e.target.value) }
                  })}
                  placeholder="46.0569"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lng">Longitudine</Label>
                <Input
                  id="lng"
                  type="number"
                  step="0.0001"
                  value={formData.coordinates?.lng || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    coordinates: { ...formData.coordinates!, lng: parseFloat(e.target.value) }
                  })}
                  placeholder="23.4762"
                />
              </div>

              <div className="flex items-center space-x-2 col-span-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Pensiune Premium (afișată cu prioritate)
                </Label>
              </div>
            </div>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-4">
            <div className="space-y-2">
              <Label>Adaugă Imagini</Label>
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL imagine sau nume fișier..."
                />
                <Button type="button" onClick={handleAddImage}>
                  <Plus className="size-4 mr-2" />
                  Adaugă
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Introdu URL-ul imaginii sau folosește Unsplash pentru imagini demo
              </p>
            </div>

            {formData.images && formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="size-4" />
                    </Button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Imagine Principală
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Amenities Tab */}
          <TabsContent value="amenities" className="space-y-4">
            <div>
              <Label>Facilități Pensiune</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Selectează facilitățile disponibile în pensiune
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AVAILABLE_AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={formData.amenities?.includes(amenity)}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                    />
                    <Label htmlFor={amenity} className="cursor-pointer text-sm">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Rooms Tab */}
          <TabsContent value="rooms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingRoomIndex !== null ? "Editează Cameră" : "Adaugă Cameră Nouă"}
                </CardTitle>
                <CardDescription>
                  Definește detaliile camerei
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="room-name">Nume Cameră *</Label>
                    <Input
                      id="room-name"
                      value={currentRoom.name}
                      onChange={(e) => setCurrentRoom({ ...currentRoom, name: e.target.value })}
                      placeholder="Suite Premium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room-type">Tip Cameră</Label>
                    <Select
                      value={currentRoom.type}
                      onValueChange={(value) => setCurrentRoom({ ...currentRoom, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Deluxe">Deluxe</SelectItem>
                        <SelectItem value="Suite">Suite</SelectItem>
                        <SelectItem value="Apartament">Apartament</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room-capacity">Capacitate (persoane) *</Label>
                    <Input
                      id="room-capacity"
                      type="number"
                      min="1"
                      value={currentRoom.capacity}
                      onChange={(e) => setCurrentRoom({ ...currentRoom, capacity: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room-beds">Configurație Paturi</Label>
                    <Input
                      id="room-beds"
                      value={currentRoom.beds}
                      onChange={(e) => setCurrentRoom({ ...currentRoom, beds: e.target.value })}
                      placeholder="1 pat dublu"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room-price">Preț/Noapte (RON) *</Label>
                    <Input
                      id="room-price"
                      type="number"
                      min="0"
                      value={currentRoom.price}
                      onChange={(e) => setCurrentRoom({ ...currentRoom, price: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room-image">URL Imagine</Label>
                    <Input
                      id="room-image"
                      value={currentRoom.image}
                      onChange={(e) => setCurrentRoom({ ...currentRoom, image: e.target.value })}
                      placeholder="URL imagine cameră"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="room-description">Descriere Cameră</Label>
                    <Textarea
                      id="room-description"
                      value={currentRoom.description}
                      onChange={(e) => setCurrentRoom({ ...currentRoom, description: e.target.value })}
                      placeholder="Descriere cameră..."
                      rows={2}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Facilități Cameră</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {ROOM_AMENITIES.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={`room-${amenity}`}
                            checked={currentRoom.amenities?.includes(amenity)}
                            onCheckedChange={() => handleRoomAmenityToggle(amenity)}
                          />
                          <Label htmlFor={`room-${amenity}`} className="cursor-pointer text-sm">
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 col-span-2">
                    <Checkbox
                      id="room-available"
                      checked={currentRoom.available}
                      onCheckedChange={(checked) => setCurrentRoom({ ...currentRoom, available: checked as boolean })}
                    />
                    <Label htmlFor="room-available" className="cursor-pointer">
                      Cameră disponibilă pentru rezervări
                    </Label>
                  </div>
                </div>

                <Button type="button" onClick={handleAddRoom} className="w-full">
                  {editingRoomIndex !== null ? "Actualizează Cameră" : "Adaugă Cameră"}
                </Button>

                {editingRoomIndex !== null && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingRoomIndex(null);
                      setCurrentRoom({
                        name: "",
                        type: "Standard",
                        capacity: 2,
                        beds: "1 pat dublu",
                        price: 0,
                        image: "",
                        amenities: [],
                        available: true,
                        description: "",
                      });
                    }}
                    className="w-full"
                  >
                    Anulează Editarea
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* List of added rooms */}
            {formData.rooms && formData.rooms.length > 0 && (
              <div className="space-y-2">
                <Label>Camere Adăugate ({formData.rooms.length})</Label>
                <div className="space-y-2">
                  {formData.rooms.map((room, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{room.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {room.type} • {room.capacity} persoane • {room.beds}
                            </p>
                            <p className="text-sm font-bold mt-1">{room.price} RON/noapte</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditRoom(index)}
                            >
                              Editează
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteRoom(index)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Anulează
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {hostel ? "Actualizează Pensiune" : "Salvează Pensiune"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
