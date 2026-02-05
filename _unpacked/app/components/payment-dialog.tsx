import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Separator } from "@/app/components/ui/separator";
import { CreditCard, Wallet, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import type { BookingData } from "@/app/types";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: BookingData | null;
  onPaymentSuccess: () => void;
}

export function PaymentDialog({ open, onOpenChange, booking, onPaymentSuccess }: PaymentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!booking) return;

    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast.error("Te rugăm să completezi toate câmpurile cardului");
        return;
      }

      if (cardNumber.replace(/\s/g, "").length !== 16) {
        toast.error("Număr card invalid");
        return;
      }
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      setPaymentComplete(true);
      
      setTimeout(() => {
        onPaymentSuccess();
        onOpenChange(false);
        setPaymentComplete(false);
        resetForm();
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Eroare la procesarea plății");
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCardNumber("");
    setCardName("");
    setExpiryDate("");
    setCvv("");
    setPaymentMethod("card");
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {!paymentComplete ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Finalizare Rezervare</DialogTitle>
              <DialogDescription>
                Alege metoda de plată pentru a finaliza rezervarea
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Booking Summary */}
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pensiune:</span>
                  <span className="font-medium">{booking.hostelName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cameră:</span>
                  <span>{booking.roomName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Perioada:</span>
                  <span>
                    {format(new Date(booking.checkIn), "dd MMM", { locale: ro })} - {format(new Date(booking.checkOut), "dd MMM yyyy", { locale: ro })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Persoane:</span>
                  <span>{booking.guests}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total de plată:</span>
                  <span className="text-primary">{booking.totalPrice} RON</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-4">
                <Label className="text-base">Metodă de plată</Label>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "card" | "cash")}>
                  <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="size-5" />
                      <div>
                        <div className="font-medium">Card bancar</div>
                        <div className="text-xs text-muted-foreground">Plată online securizată</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="size-5" />
                      <div>
                        <div className="font-medium">Plată la pensiune</div>
                        <div className="text-xs text-muted-foreground">Numerar sau card la check-in</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === "card" && (
                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Număr card</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-name">Numele de pe card</Label>
                    <Input
                      id="card-name"
                      placeholder="ION POPESCU"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Data expirării</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        maxLength={5}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                        maxLength={4}
                        type="password"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Procesare plată...
                      </>
                    ) : (
                      <>Plătește {booking.totalPrice} RON</>
                    )}
                  </Button>
                </form>
              )}

              {/* Cash Payment */}
              {paymentMethod === "cash" && (
                <div className="space-y-4">
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 text-sm">
                    <p className="text-blue-900 dark:text-blue-100">
                      <strong>Important:</strong> Vei plăti suma de <strong>{booking.totalPrice} RON</strong> direct la pensiune, la momentul check-in-ului.
                      Rezervarea ta va fi confirmată, dar te rugăm să respecti termenul de plată.
                    </p>
                  </div>

                  <Button onClick={handlePayment} className="w-full" size="lg" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Confirmare...
                      </>
                    ) : (
                      <>Confirmă rezervarea</>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="size-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Check className="size-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Rezervare confirmată!</h3>
              <p className="text-sm text-muted-foreground">
                Vei primi un email de confirmare în curând
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}