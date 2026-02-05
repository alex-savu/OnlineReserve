import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Calendar, Mail, Phone, User, Trash2, Building2 } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import type { BookingData } from "@/app/types";

interface ReservationsListProps {
  bookings: BookingData[];
  onCancel: (bookingId: string) => void;
  onViewDetails?: (booking: BookingData) => void;
}

export function ReservationsList({ bookings, onCancel, onViewDetails }: ReservationsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmată";
      case "pending":
        return "În așteptare";
      case "cancelled":
        return "Anulată";
      default:
        return status;
    }
  };

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Nu există rezervări</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle>Toate Rezervările</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cod Rezervare</TableHead>
                  <TableHead>Oaspete</TableHead>
                  <TableHead>Cameră</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Persoane</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-sm">{booking.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{booking.guestName}</span>
                        <span className="text-xs text-muted-foreground">{booking.guestEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{booking.roomName}</span>
                        <span className="text-xs text-muted-foreground">{booking.hostelName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{format(booking.checkIn, "dd MMM yyyy", { locale: ro })}</TableCell>
                    <TableCell>{format(booking.checkOut, "dd MMM yyyy", { locale: ro })}</TableCell>
                    <TableCell>{booking.guests}</TableCell>
                    <TableCell>{booking.totalPrice} RON</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(booking.status)}>
                        {getStatusText(booking.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {booking.status === "confirmed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCancel(booking.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      )}
                      {onViewDetails && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails(booking)}
                        >
                          Detalii
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-sm text-muted-foreground">{booking.id}</p>
                  <CardTitle className="text-lg">{booking.roomName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{booking.hostelName}</p>
                </div>
                <Badge variant={getStatusColor(booking.status)}>
                  {getStatusText(booking.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="size-4 text-muted-foreground" />
                <span>{booking.guestName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="size-4 text-muted-foreground" />
                <span>{booking.guestEmail}</span>
              </div>
              {booking.guestPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{booking.guestPhone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <span>
                  {format(booking.checkIn, "dd MMM", { locale: ro })} - {format(booking.checkOut, "dd MMM yyyy", { locale: ro })}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Preț Total</p>
                  <p className="text-xl font-semibold">{booking.totalPrice} RON</p>
                </div>
                {booking.status === "confirmed" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onCancel(booking.id)}
                  >
                    Anulează
                  </Button>
                )}
                {onViewDetails && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(booking)}
                  >
                    Detalii
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}