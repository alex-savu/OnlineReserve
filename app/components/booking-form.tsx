import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Calendar } from "@/app/components/ui/calendar";
import { Calendar as CalendarIcon, Check, X, AlertCircle } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ro } from "date-fns/locale";
import type { Hostel, Room, BookingData } from "@/app/types";
import { Badge } from "@/app/components/ui/badge";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { useAuth } from "@/app/contexts/auth-context";

interface BookingFormProps {
  hostels: Hostel[];
  bookings: BookingData[];
  onSubmit: (booking: BookingData) => void;
  preSelectedHostelId?: string;
  preSelectedRoomId?: string;
  preSelectedCheckIn?: Date;
  preSelectedCheckOut?: Date;
  onReset?: () => void;
}

export function BookingForm({ hostels, bookings, onSubmit, preSelectedHostelId, preSelectedRoomId, preSelectedCheckIn, preSelectedCheckOut, onReset }: BookingFormProps) {
  const { user } = useAuth();
  const [selectedHostelId, setSelectedHostelId] = useState<string>(preSelectedHostelId || "");
  const [selectedRoomId, setSelectedRoomId] = useState<string>(preSelectedRoomId || "");
  const [checkIn, setCheckIn] = useState<Date | undefined>(preSelectedCheckIn);
  const [checkOut, setCheckOut] = useState<Date | undefined>(preSelectedCheckOut);
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  // Update when pre-selected values change
  useEffect(() => {
    if (preSelectedHostelId) {
      setSelectedHostelId(preSelectedHostelId);
    }
    if (preSelectedRoomId) {
      setSelectedRoomId(preSelectedRoomId);
    }
    if (preSelectedCheckIn) {
      setCheckIn(preSelectedCheckIn);
    }
    if (preSelectedCheckOut) {
      setCheckOut(preSelectedCheckOut);
    }
  }, [preSelectedHostelId, preSelectedRoomId, preSelectedCheckIn, preSelectedCheckOut]);

  // Autocomplete guest information from authenticated user
  useEffect(() => {
    if (user) {
      // Set name from user metadata or email
      if (user.user_metadata?.name) {
        setGuestName(user.user_metadata.name);
      }
      
      // Set email from user
      if (user.email) {
        setGuestEmail(user.email);
      }
      
      // Set phone from user metadata if available
      if (user.user_metadata?.phone) {
        setGuestPhone(user.user_metadata.phone);
      }
    }
  }, [user]);

  // Get selected hostel
  const selectedHostel = hostels.find(h => h.id === selectedHostelId);

  // Check if a room is available for the selected dates
  const isRoomAvailableForDates = (roomId: string, checkInDate?: Date, checkOutDate?: Date): boolean => {
    if (!checkInDate || !checkOutDate) return true;

    // Check if there are any overlapping bookings for this room
    const hasOverlap = bookings.some(booking => {
      if (booking.roomId !== roomId || booking.status === "cancelled") return false;

      const bookingCheckIn = new Date(booking.checkIn);
      const bookingCheckOut = new Date(booking.checkOut);

      // Check for overlap
      return (
        (checkInDate >= bookingCheckIn && checkInDate < bookingCheckOut) ||
        (checkOutDate > bookingCheckIn && checkOutDate <= bookingCheckOut) ||
        (checkInDate <= bookingCheckIn && checkOutDate >= bookingCheckOut)
      );
    });

    return !hasOverlap;
  };

  // Get available rooms for selected hostel and dates
  const availableRooms = useMemo(() => {
    if (!selectedHostel) return [];
    
    return selectedHostel.rooms.map(room => ({
      ...room,
      isAvailable: isRoomAvailableForDates(room.id, checkIn, checkOut)
    }));
  }, [selectedHostel, checkIn, checkOut, bookings]);

  // Calculate total price
  const selectedRoom = availableRooms.find(r => r.id === selectedRoomId);
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const totalPrice = selectedRoom ? selectedRoom.price * nights : 0;

  // Check if selected room is available
  const isSelectedRoomAvailable = selectedRoom?.isAvailable ?? false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedHostel || !selectedRoom || !checkIn || !checkOut) {
      alert("Te rugăm să completezi toate câmpurile obligatorii!");
      return;
    }

    if (!isSelectedRoomAvailable) {
      alert("Camera selectată nu mai este disponibilă pentru datele alese!");
      return;
    }

    if (guests > selectedRoom.capacity) {
      alert(`Camera poate găzdui maximum ${selectedRoom.capacity} persoane!`);
      return;
    }

    const booking: BookingData = {
      id: `BK${Date.now()}`,
      hostelId: selectedHostel.id,
      hostelName: selectedHostel.name,
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      checkIn,
      checkOut,
      guests,
      guestName,
      guestEmail,
      guestPhone,
      totalPrice,
      status: "confirmed",
      createdAt: new Date(),
    };

    onSubmit(booking);

    // Form will be reset after successful payment
  };

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Creează o Rezervare</CardTitle>
        <CardDescription className="text-sm">Selectează pensiunea, camera și perioada dorită</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Hostel Selection */}
          <div className="space-y-2">
            <Label htmlFor="hostel" className="text-sm">Selectează Pensiunea *</Label>
            <Select value={selectedHostelId} onValueChange={(value) => {
              setSelectedHostelId(value);
              setSelectedRoomId(""); // Reset room when hostel changes
            }}>
              <SelectTrigger id="hostel" className="text-sm">
                <SelectValue placeholder="Alege o pensiune" />
              </SelectTrigger>
              <SelectContent>
                {hostels.map((hostel) => (
                  <SelectItem key={hostel.id} value={hostel.id} className="text-sm">
                    <div className="flex items-center justify-between gap-2 w-full">
                      <span>{hostel.name}</span>
                      <span className="text-xs text-muted-foreground">- {hostel.location}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Data Check-in *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left text-xs sm:text-sm">
                    <CalendarIcon className="mr-2 size-3.5 sm:size-4 shrink-0" />
                    <span className="truncate">{checkIn ? format(checkIn, "PPP", { locale: ro }) : "Selectează data"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    disabled={(date) => date < new Date()}
                    locale={ro}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Data Check-out *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left text-xs sm:text-sm">
                    <CalendarIcon className="mr-2 size-3.5 sm:size-4 shrink-0" />
                    <span className="truncate">{checkOut ? format(checkOut, "PPP", { locale: ro }) : "Selectează data"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={(date) => date <= (checkIn || new Date())}
                    locale={ro}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Room Selection */}
          {selectedHostel && (
            <div className="space-y-2">
              <Label htmlFor="room" className="text-sm">Selectează Camera *</Label>
              {checkIn && checkOut ? (
                <>
                  <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
                    <SelectTrigger id="room" className="text-sm">
                      <SelectValue placeholder="Alege o cameră" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.map((room) => (
                        <SelectItem 
                          key={room.id} 
                          value={room.id} 
                          className="text-sm"
                          disabled={!room.isAvailable}
                        >
                          <div className="flex items-center justify-between gap-2 w-full">
                            <span className={!room.isAvailable ? "opacity-50" : ""}>
                              {room.name} - {room.price} RON/noapte
                            </span>
                            {room.isAvailable ? (
                              <Badge variant="default" className="text-xs ml-2">
                                <Check className="size-3 mr-1" />
                                Disponibil
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs ml-2">
                                <X className="size-3 mr-1" />
                                Ocupat
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Availability Summary */}
                  <div className="text-xs text-muted-foreground mt-2">
                    {availableRooms.filter(r => r.isAvailable).length} din {availableRooms.length} camere disponibile pentru datele selectate
                  </div>

                  {selectedRoom && !isSelectedRoomAvailable && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="size-4" />
                      <AlertDescription className="text-xs">
                        Camera selectată este ocupată în perioada {format(checkIn, "dd MMM", { locale: ro })} - {format(checkOut, "dd MMM", { locale: ro })}. Te rugăm să alegi altă cameră sau alte date.
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              ) : (
                <Alert>
                  <AlertCircle className="size-4" />
                  <AlertDescription className="text-xs">
                    Selectează mai întâi datele de check-in și check-out pentru a vedea camerele disponibile
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Number of Guests */}
          <div className="space-y-2">
            <Label htmlFor="guests" className="text-sm">Număr Persoane *</Label>
            <Select value={guests.toString()} onValueChange={(v) => setGuests(Number(v))}>
              <SelectTrigger id="guests" className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()} className="text-sm">
                    {num} {num === 1 ? "Persoană" : "Persoane"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRoom && guests > selectedRoom.capacity && (
              <p className="text-xs text-destructive">
                Această cameră are capacitate maximă de {selectedRoom.capacity} {selectedRoom.capacity === 1 ? "persoană" : "persoane"}
              </p>
            )}
          </div>

          {/* Guest Information */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">Nume Complet *</Label>
            <Input
              id="name"
              placeholder="Popescu Ion"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">Adresă Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="ion@exemplu.ro"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              required
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm">Număr Telefon</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+40 7xx xxx xxx"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Price Summary */}
          {totalPrice > 0 && selectedRoom && isSelectedRoomAvailable && (
            <div className="p-3 sm:p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Pensiune:</span>
                <span className="font-medium">{selectedHostel?.name}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Cameră:</span>
                <span>{selectedRoom.name}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Preț cameră:</span>
                <span>{selectedRoom.price} RON/noapte</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Perioada:</span>
                <span>
                  {checkIn && checkOut && (
                    `${format(checkIn, "dd MMM", { locale: ro })} - ${format(checkOut, "dd MMM", { locale: ro })}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Număr nopți:</span>
                <span>{nights}</span>
              </div>
              <div className="flex justify-between font-semibold text-base sm:text-lg pt-2 border-t">
                <span>Total:</span>
                <span>{totalPrice} RON</span>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={!selectedHostel || !selectedRoom || !isSelectedRoomAvailable || !checkIn || !checkOut}
          >
            Confirmă Rezervarea
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}