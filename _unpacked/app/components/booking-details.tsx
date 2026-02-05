import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Input } from "@/app/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import type { BookingData, Hostel } from "@/app/types";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { useAuth } from "@/app/contexts/auth-context";

interface BookingDetailsProps {
  booking: BookingData;
  hostel: Hostel | undefined;
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  sender: "guest" | "host";
  message: string;
  timestamp: Date;
}

export function BookingDetails({ booking, hostel, onBack }: BookingDetailsProps) {
  const { getAccessToken } = useAuth();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [hasLoadedMessages, setHasLoadedMessages] = useState(false);

  // Întrebări frecvente cu răspunsuri automate
  const faqItems = [
    {
      question: "La ce oră este check-in și check-out?",
      answer: `Check-in este la ora 14:00, iar check-out la ora 12:00. Dacă aveți nevoie de un check-in mai devreme sau un check-out mai târziu, vă rugăm să ne contactați direct.`
    },
    {
      question: "Ce facilități sunt disponibile?",
      answer: `${hostel?.amenities?.join(', ') || 'WiFi gratuit, parcare, bucătărie comună'}. Pentru mai multe detalii, consultați descrierea completă a pensiunii sau contactați-ne direct.`
    },
    {
      question: "Este micul dejun inclus?",
      answer: "Informații despre micul dejun sunt disponibile în detaliile camerei. Pentru informații suplimentare, vă rugăm să contactați direct pensiunea."
    },
    {
      question: "Cum pot anula rezervarea?",
      answer: "Puteți anula rezervarea din secțiunea 'Rezervările Mele'. Anularea gratuită este disponibilă cu 48 ore înainte de check-in."
    },
    {
      question: "Cum ajung la pensiune?",
      answer: `Pensiunea se află în ${hostel?.location || booking.hostelName}. Puteți vedea locația exactă pe harta de mai sus. Pentru indicații detaliate, contactați gazda direct.`
    },
    {
      question: "Contact administrator",
      answer: "CONTACT_ADMIN" // Special marker pentru a trimite mesaj către admin
    }
  ];

  // Load messages when component mounts
  useEffect(() => {
    if (!hasLoadedMessages) {
      loadChatMessages();
    }
  }, [hasLoadedMessages]);

  const loadChatMessages = async () => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c7f3f823/chat/messages/${booking.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          setChatMessages(data.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          })));
        } else {
          // Add welcome message only if no previous messages
          setChatMessages([{
            id: "welcome",
            sender: "host",
            message: "Bună ziua! Vă mulțumim pentru rezervare. Cum vă pot ajuta? 😊\n\nApăsați pe butonul '?' pentru întrebări frecvente sau scrieți mesajul dvs.",
            timestamp: new Date(),
          }]);
        }
      }
      setHasLoadedMessages(true);
    } catch (error) {
      console.error("Error loading messages:", error);
      // Add welcome message on error
      setChatMessages([{
        id: "welcome",
        sender: "host",
        message: "Bună ziua! Vă mulțumim pentru rezervare. Cum vă pot ajuta? 😊\n\nApăsați pe butonul '?' pentru întrebări frecvente sau scrieți mesajul dvs.",
        timestamp: new Date(),
      }]);
      setHasLoadedMessages(true);
    }
  };

  const handleFAQSelect = async (faq: typeof faqItems[0]) => {
    setShowFAQ(false);
    
    // Add user question
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "guest",
      message: faq.question,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);

    // Wait a bit for natural feel
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (faq.answer === "CONTACT_ADMIN") {
      // Send message to admin
      await sendMessageToAdmin(faq.question);
      const adminMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "host",
        message: "Mesajul dvs. a fost trimis către administrator. Veți primi un răspuns în curând. Vă mulțumim pentru răbdare! 📧",
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, adminMessage]);
    } else {
      // Auto response
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "host",
        message: faq.answer,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, botMessage]);
      
      // Save messages
      await saveChatMessages([userMessage, botMessage]);
    }
    
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const accessToken = getAccessToken();
    if (!accessToken) {
      toast.error("Trebuie să fi autentificat pentru a folosi chat-ul!");
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "guest",
      message: newMessage,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    // Send to admin
    await sendMessageToAdmin(newMessage);

    // Auto response
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: "host",
      message: "Mesajul dvs. a fost trimis către administrator. Veți primi un răspuns în curând. În timpul așteptării, puteți consulta întrebările frecvente apăsând pe butonul '?'. 📧",
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, botMessage]);
    await saveChatMessages([userMessage, botMessage]);
    setIsLoading(false);
  };

  const sendMessageToAdmin = async (message: string) => {
    try {
      const accessToken = getAccessToken();
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c7f3f823/chat/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            bookingId: booking.id,
            message,
            guestName: booking.guestName,
            guestEmail: booking.guestEmail,
            hostelName: booking.hostelName,
          }),
        }
      );
    } catch (error) {
      console.error("Error sending message to admin:", error);
    }
  };

  const saveChatMessages = async (messages: ChatMessage[]) => {
    try {
      const accessToken = getAccessToken();
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c7f3f823/chat/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            bookingId: booking.id,
            messages,
          }),
        }
      );
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmată";
      case "cancelled":
        return "Anulată";
      case "pending":
        return "În așteptare";
      default:
        return status;
    }
  };

  // Get coordinates for map
  const getMapUrl = () => {
    if (!hostel?.coordinates) return "";
    const { lat, lng } = hostel.coordinates;
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${lat},${lng}&zoom=15`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Detalii Rezervare</h1>
          <p className="text-sm text-muted-foreground">Cod: {booking.id}</p>
        </div>
        <Badge className={getStatusColor(booking.status)}>
          {booking.status === "confirmed" && <CheckCircle2 className="size-3 mr-1" />}
          {booking.status === "cancelled" && <XCircle className="size-3 mr-1" />}
          {getStatusLabel(booking.status)}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informații Rezervare</CardTitle>
              <CardDescription>Detalii despre sejurul tău</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="size-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Pensiune</p>
                      <p className="text-sm text-muted-foreground">{booking.hostelName}</p>
                      {hostel && <p className="text-xs text-muted-foreground">{hostel.location}</p>}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="size-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Check-in</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.checkIn), "dd MMMM yyyy", { locale: ro })}
                      </p>
                      <p className="text-xs text-muted-foreground">Ora 14:00</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="size-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Check-out</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.checkOut), "dd MMMM yyyy", { locale: ro })}
                      </p>
                      <p className="text-xs text-muted-foreground">Ora 12:00</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Users className="size-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Cameră și Oaspeți</p>
                      <p className="text-sm text-muted-foreground">{booking.roomName}</p>
                      <p className="text-xs text-muted-foreground">{booking.guests} persoane</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="size-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Data rezervării</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.createdAt), "dd MMMM yyyy, HH:mm", { locale: ro })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total plătit:</span>
                <span className="text-2xl font-bold text-primary">{booking.totalPrice} RON</span>
              </div>
            </CardContent>
          </Card>

          {/* Guest Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informații Oaspete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Users className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Nume</p>
                  <p className="text-sm text-muted-foreground">{booking.guestName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{booking.guestEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Telefon</p>
                  <p className="text-sm text-muted-foreground">{booking.guestPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Map */}
          {hostel?.coordinates && (
            <Card>
              <CardHeader>
                <CardTitle>Locație</CardTitle>
                <CardDescription>Harta cu locația pensiunii</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden border">
                  <iframe
                    width="100%"
                    height="300"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${hostel.coordinates.lat},${hostel.coordinates.lng}&hl=ro&z=14&output=embed`}
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium mb-1">{hostel.name}</p>
                  <p className="text-muted-foreground">{hostel.location}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Chat */}
        <div className="space-y-6">
          <Card className="lg:sticky lg:top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="size-5" />
                Chat cu Pensiunea
              </CardTitle>
              <CardDescription>Comunică direct cu gazda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chat Messages */}
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "guest" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === "guest"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender === "guest" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {format(msg.timestamp, "HH:mm")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="space-y-2">
                {/* FAQ Panel */}
                {showFAQ && (
                  <div className="bg-muted rounded-lg p-3 space-y-2 max-h-[200px] overflow-y-auto">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Selectați o întrebare:</p>
                    {faqItems.map((faq, index) => (
                      <button
                        key={index}
                        onClick={() => handleFAQSelect(faq)}
                        className="w-full text-left text-sm p-2 rounded hover:bg-background transition-colors"
                      >
                        {faq.question}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setShowFAQ(!showFAQ)}
                    title="Întrebări frecvente"
                  >
                    <HelpCircle className="size-4" />
                  </Button>
                  <Input
                    placeholder="Scrie un mesaj..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isLoading}
                  />
                  <Button size="icon" onClick={handleSendMessage} disabled={isLoading}>
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          {hostel && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact Pensiune</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>+40 123 456 789</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-muted-foreground" />
                  <span>{hostel.name.toLowerCase().replace(/\s/g, "")}@email.ro</span>
                </div>
                <Separator />
                <Button variant="outline" className="w-full" size="sm">
                  <Phone className="size-4 mr-2" />
                  Sună Pensiunea
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}