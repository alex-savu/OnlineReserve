import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Badge } from "@/app/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch";
import { Checkbox } from "@/app/components/ui/checkbox";
import { 
  Home, 
  Bed, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Edit, 
  Save, 
  X,
  Send,
  AlertCircle,
  CheckCircle,
  MessageCircle,
  Coins,
  Calendar,
  CalendarCheck,
  Phone,
  Mail,
  Clock,
  FileText,
  Plus,
  Trash2,
  MapPin,
  Wifi,
  Tv,
  Snowflake,
  Coffee,
  Car,
  Dumbbell,
  Utensils,
  WashingMachine,
  Wine,
  TreeDeciduous,
  Mountain,
  Building,
  Briefcase,
  Shield,
  Wind,
  Bath,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import type { Hostel, BookingData, User, Feedback, Room } from "@/app/types";
import { Separator } from "@/app/components/ui/separator";
import { HostelEditTabs } from "@/app/components/hostel-edit-tabs";

interface HostelAdminDashboardProps {
  hostel: Hostel;
  bookings: BookingData[];
  user: User;
  onUpdateHostel: (hostel: Hostel) => void;
  onUpdateBooking: (booking: BookingData) => void;
  onLogout: () => void;
  onBack: () => void;
}

// DEMO DATA pentru feedback și chat
const DEMO_FEEDBACK: Feedback[] = [
  {
    id: "F001",
    hostelId: "P001",
    hostelName: "Grozav Home",
    adminId: "U002",
    adminName: "Manager Grozav Home",
    message: "Sistemul de rezervări funcționează excelent! Mulțumim pentru platformă.",
    type: "info",
    status: "reviewed",
    createdAt: new Date("2026-01-28T10:30:00Z"),
  },
  {
    id: "F002",
    hostelId: "P001",
    hostelName: "Grozav Home",
    adminId: "U002",
    adminName: "Manager Grozav Home",
    message: "Ar fi util să avem posibilitatea de a exporta rapoarte lunare în format PDF.",
    type: "suggestion",
    status: "new",
    createdAt: new Date("2026-01-30T14:15:00Z"),
  },
];

const DEMO_CHAT_MESSAGES = [
  { id: "M001", from: "admin", message: "Bună ziua! Cu ce vă pot ajuta?", timestamp: new Date("2026-02-01T09:00:00Z") },
  { id: "M002", from: "hostel-admin", message: "Salut! Aș vrea să știu când se implementează exportul de rapoarte.", timestamp: new Date("2026-02-01T09:15:00Z") },
  { id: "M003", from: "admin", message: "Funcția de export va fi disponibilă săptămâna viitoare. Vă anunț când este gata!", timestamp: new Date("2026-02-01T09:20:00Z") },
];

export function HostelAdminDashboard({ hostel, bookings, user, onUpdateHostel, onUpdateBooking, onLogout, onBack }: HostelAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("hostel");
  const [editMode, setEditMode] = useState(false);
  const [editedHostel, setEditedHostel] = useState<Hostel>(hostel);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(DEMO_FEEDBACK);
  const [newFeedback, setNewFeedback] = useState({ type: "info", message: "" });
  const [chatMessages, setChatMessages] = useState(DEMO_CHAT_MESSAGES);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [clientChatOpen, setClientChatOpen] = useState(false);

  // Close booking details panel when leaving the "bookings" tab
  useEffect(() => {
    if (activeTab !== "bookings") {
      setClientChatOpen(false);
      setSelectedBooking(null);
    }
  }, [activeTab]);

  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [clientMessages, setClientMessages] = useState<any[]>([]);
  const [newClientMessage, setNewClientMessage] = useState("");
  const [editedBooking, setEditedBooking] = useState<Partial<BookingData>>({});
  const [isSavingBooking, setIsSavingBooking] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [clientDetailsOpen, setClientDetailsOpen] = useState(false);

  // Filter bookings for this hostel only
  const hostelBookings = bookings.filter(b => b.hostelId === hostel.id);
  const activeBookings = hostelBookings.filter(b => b.status === "confirmed" && b.checkOut >= new Date());
  const totalRevenue = hostelBookings.filter(b => b.status === "confirmed").reduce((sum, b) => sum + b.totalPrice, 0);

  const ROOM_AMENITIES = [
    { value: "wifi", label: "WiFi", icon: Wifi },
    { value: "tv", label: "TV", icon: Tv },
    { value: "ac", label: "Aer Condiționat", icon: Snowflake },
    { value: "breakfast", label: "Mic Dejun Inclus", icon: Coffee },
    { value: "parking", label: "Parcare", icon: Car },
    { value: "gym", label: "Sală Fitness", icon: Dumbbell },
    { value: "restaurant", label: "Restaurant", icon: Utensils },
    { value: "laundry", label: "Spălătorie", icon: WashingMachine },
    { value: "minibar", label: "Mini Bar", icon: Wine },
    { value: "balcony", label: "Balcon", icon: TreeDeciduous },
    { value: "mountain-view", label: "Vedere la Munte", icon: Mountain },
    { value: "city-view", label: "Vedere la Oraș", icon: Building },
    { value: "desk", label: "Birou", icon: Briefcase },
    { value: "safe", label: "Seif", icon: Shield },
    { value: "hairdryer", label: "Uscător de Păr", icon: Wind },
    { value: "bathtub", label: "Cadă", icon: Bath },
  ];

  const handleSaveHostel = () => {
    console.log('DEMO: Saving hostel changes', editedHostel);
    onUpdateHostel(editedHostel);
    setEditMode(false);
    toast.success('Pensiunea a fost actualizată cu succes!');
  };

  const handleCancelEdit = () => {
    setEditedHostel(hostel);
    setEditMode(false);
  };

  const handleSaveBookingChanges = () => {
    if (!selectedBooking) return;

    setIsSavingBooking(true);
    
    try {
      // Create updated booking object
      const updatedBooking: BookingData = {
        ...selectedBooking,
        ...editedBooking,
      };

      // Call parent callback to update bookings array
      onUpdateBooking(updatedBooking);
      
      // Update local selected booking
      setSelectedBooking(updatedBooking);
      setEditedBooking({});
      
      toast.success('Modificările au fost salvate cu succes!');
    } catch (error: any) {
      console.error('Error saving booking:', error);
      toast.error('Eroare la salvarea modificărilor');
    } finally {
      setIsSavingBooking(false);
    }
  };

  const handleSendFeedback = () => {
    if (!newFeedback.message.trim()) {
      toast.error('Introduceți un mesaj');
      return;
    }

    const feedback: Feedback = {
      id: `F${Date.now()}`,
      hostelId: hostel.id,
      hostelName: hostel.name,
      adminId: user.id,
      adminName: user.name,
      message: newFeedback.message,
      type: newFeedback.type as "issue" | "suggestion" | "info",
      status: "new",
      createdAt: new Date(),
    };

    console.log('DEMO: Sending feedback', feedback);
    setFeedbackList([feedback, ...feedbackList]);
    setNewFeedback({ type: "info", message: "" });
    toast.success('Feedback trimis cu succes!');
  };

  const handleSendChatMessage = () => {
    if (!newChatMessage.trim()) return;

    const message = {
      id: `M${Date.now()}`,
      from: "hostel-admin",
      message: newChatMessage,
      timestamp: new Date(),
    };

    console.log('DEMO: Sending chat message', message);
    setChatMessages([...chatMessages, message]);
    setNewChatMessage("");
    toast.success('Mesaj trimis!');
  };

  const openClientChat = (booking: BookingData) => {
    setSelectedBooking(booking);
    setEditedBooking({}); // Reset edited booking when opening dialog
    // Initialize demo messages for this client
    setClientMessages([
      { id: "CM001", from: "client", message: "Bună ziua! Am o rezervare pentru săptămâna viitoare.", timestamp: new Date(Date.now() - 3600000) },
      { id: "CM002", from: "hostel", message: "Bună ziua! Da, vă confirm rezervarea. Cu ce vă pot ajuta?", timestamp: new Date(Date.now() - 1800000) },
    ]);
    setClientChatOpen(true);
  };

  const handleSendClientMessage = () => {
    if (!newClientMessage.trim()) return;

    const message = {
      id: `CM${Date.now()}`,
      from: "hostel",
      message: newClientMessage,
      timestamp: new Date(),
    };

    console.log('DEMO: Sending message to client', message);
    setClientMessages([...clientMessages, message]);
    setNewClientMessage("");
    toast.success('Mesaj trimis către client!');
  };

  // Alias for UI button handler (fix ReferenceError)
  const handleSendMessage = () => {
    handleSendClientMessage();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold truncate">Dashboard Administrator</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{hostel.name} - {user.name}</p>
            </div>
            <Button variant="outline" onClick={onBack} size="sm" className="text-xs sm:text-sm shrink-0">
              <ArrowLeft className="size-3.5 sm:size-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Înapoi</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-6">
          <Card>
            <CardHeader className="p-3 sm:pb-3 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Rezervări Active</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-xl sm:text-2xl font-bold">{activeBookings.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 sm:pb-3 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Rezervări</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-xl sm:text-2xl font-bold">{hostelBookings.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 sm:pb-3 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Venit Total</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-base sm:text-2xl font-bold truncate">{totalRevenue} RON</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 sm:pb-3 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Camere Disponibile</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-xl sm:text-2xl font-bold">{hostel.rooms.filter(r => r.available).length}/{hostel.rooms.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-0.5 sm:gap-1 h-auto">
            <TabsTrigger value="hostel" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3">
              <Home className="size-3.5 sm:size-4" />
              <span className="text-[10px] sm:text-sm">Pensiunea</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3">
              <Calendar className="size-3.5 sm:size-4" />
              <span className="text-[10px] sm:text-sm">Rezervări</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3">
              <Users className="size-3.5 sm:size-4" />
              <span className="text-[10px] sm:text-sm">Clienți</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3">
              <FileText className="size-3.5 sm:size-4" />
              <span className="text-[10px] sm:text-sm">Feedback</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3">
              <MessageSquare className="size-3.5 sm:size-4" />
              <span className="text-[10px] sm:text-sm">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3">
              <TrendingUp className="size-3.5 sm:size-4" />
              <span className="text-[10px] sm:text-sm">Statistici</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Pensiunea Mea */}
          <TabsContent value="hostel" className="space-y-3 sm:space-y-4">
            <Card>
              <CardHeader className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                  <div>
                    <CardTitle className="text-base sm:text-lg">Gestionează Pensiunea</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Editează detalii, imagini, facilități și camere</CardDescription>
                  </div>
                  {!editMode ? (
                    <Button onClick={() => setEditMode(true)} size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                      <Edit className="size-3.5 sm:size-4 mr-1 sm:mr-2" />
                      Editează
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSaveHostel} size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
                        <Save className="size-3.5 sm:size-4 mr-1 sm:mr-2" />
                        Salvează
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit} size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
                        <X className="size-3.5 sm:size-4 mr-1 sm:mr-2" />
                        Anulează
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <HostelEditTabs 
                  hostel={hostel}
                  editedHostel={editedHostel}
                  setEditedHostel={setEditedHostel}
                  editMode={editMode}
                  onEditRoom={(room) => {
                    setEditingRoom(room);
                    setRoomDialogOpen(true);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Rezervări */}
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rezervări</CardTitle>
                <CardDescription>Gestionează rezervările pentru pensiunea ta</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Cameră</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Preț</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Acțiuni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hostelBookings.length > 0 ? (
                      hostelBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.guestName}</div>
                              <div className="text-xs text-muted-foreground">{booking.guestEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.roomName}</TableCell>
                          <TableCell>{booking.checkIn.toLocaleDateString("ro-RO")}</TableCell>
                          <TableCell>{booking.checkOut.toLocaleDateString("ro-RO")}</TableCell>
                          <TableCell className="font-semibold">{booking.totalPrice} RON</TableCell>
                          <TableCell>
                            <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                              {booking.status === "confirmed" ? "Confirmat" : "Anulat"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => openClientChat(booking)}
                              className="transition-all duration-300 hover:scale-105 group"
                            >
                              <MessageCircle className="size-4 mr-1 group-hover:animate-bounce" />
                              Detalii
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          Nu există rezervări înregistrate
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Clienți */}
          <TabsContent value="clients" className="space-y-4">
            {/* Detalii Client Inline */}
            {selectedClient && clientDetailsOpen && (
              <Card className="border-2 border-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="size-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-xl font-bold">{selectedClient.name}</div>
                        <div className="text-sm text-muted-foreground">{selectedClient.email}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setClientDetailsOpen(false)}>
                      <X className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold">{selectedClient.bookings.length}</div>
                        <div className="text-xs text-muted-foreground">Rezervări</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold">
                          {selectedClient.bookings.reduce((sum: number, b: BookingData) => sum + b.totalPrice, 0)} RON
                        </div>
                        <div className="text-xs text-muted-foreground">Total</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold">
                          {selectedClient.bookings.filter((b: BookingData) => b.status === 'confirmed').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Confirmate</div>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <CalendarCheck className="size-4" />
                      Istoric ({selectedClient.bookings.length})
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedClient.bookings.map((booking: BookingData) => (
                        <div key={booking.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Bed className="size-5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{booking.roomName}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {booking.checkIn.toLocaleDateString('ro-RO')} - {booking.checkOut.toLocaleDateString('ro-RO')}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-sm">{booking.totalPrice} RON</div>
                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                              {booking.status === 'confirmed' ? 'OK' : 'Anulat'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Clienți</CardTitle>
                <CardDescription>Lista clienților care au făcut rezervări</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nume</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefon</TableHead>
                      <TableHead>Nr. Rezervări</TableHead>
                      <TableHead>Total Cheltuit</TableHead>
                      <TableHead>Acțiuni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      const uniqueClients = Array.from(
                        new Map(
                          hostelBookings.map(b => [
                            b.guestEmail,
                            {
                              name: b.guestName,
                              email: b.guestEmail,
                              phone: b.guestPhone,
                              bookings: hostelBookings.filter(bk => bk.guestEmail === b.guestEmail),
                            }
                          ])
                        ).values()
                      );

                      return uniqueClients.length > 0 ? (
                        uniqueClients.map((client) => (
                          <TableRow key={client.email}>
                            <TableCell className="font-medium">{client.name}</TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>{client.phone}</TableCell>
                            <TableCell>{client.bookings.length}</TableCell>
                            <TableCell className="font-semibold">
                              {client.bookings.reduce((sum, b) => sum + b.totalPrice, 0)} RON
                            </TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedClient(client);
                                  setClientDetailsOpen(true);
                                }}
                              >
                                Vezi Detalii
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            Nu există clienți înregistrați
                          </TableCell>
                        </TableRow>
                      );
                    })()}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Feedback */}
          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trimite Feedback către Admin Principal</CardTitle>
                <CardDescription>Raportează probleme, sugestii sau informații</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tip Feedback</Label>
                  <Select
                    value={newFeedback.type}
                    onValueChange={(value) => setNewFeedback({ ...newFeedback, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="issue">🔴 Problemă</SelectItem>
                      <SelectItem value="suggestion">💡 Sugestie</SelectItem>
                      <SelectItem value="info">ℹ️ Informație</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Mesaj</Label>
                  <Textarea
                    placeholder="Descrie problema, sugestia sau informația..."
                    rows={4}
                    value={newFeedback.message}
                    onChange={(e) => setNewFeedback({ ...newFeedback, message: e.target.value })}
                  />
                </div>

                <Button onClick={handleSendFeedback} className="w-full">
                  <Send className="size-4 mr-2" />
                  Trimite Feedback
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Istoric Feedback</CardTitle>
                <CardDescription>Feedback-ul tău trimis către admin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {feedbackList.map((fb) => (
                  <div key={fb.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={fb.type === "issue" ? "destructive" : fb.type === "suggestion" ? "default" : "secondary"}>
                          {fb.type === "issue" ? "Problemă" : fb.type === "suggestion" ? "Sugestie" : "Info"}
                        </Badge>
                        <Badge variant={fb.status === "new" ? "outline" : fb.status === "reviewed" ? "default" : "secondary"}>
                          {fb.status === "new" ? "Nou" : fb.status === "reviewed" ? "Revizuit" : "Rezolvat"}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {fb.createdAt.toLocaleDateString("ro-RO")}
                      </span>
                    </div>
                    <p className="text-sm">{fb.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Chat Admin */}
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Chat cu Admin Principal</CardTitle>
                <CardDescription>Conversație directă cu administratorul platformei</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 h-[400px] overflow-y-auto space-y-3">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.from === "hostel-admin" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.from === "hostel-admin"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {msg.timestamp.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Scrie un mesaj..."
                      value={newChatMessage}
                      onChange={(e) => setNewChatMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendChatMessage();
                      }}
                    />
                    <Button onClick={handleSendChatMessage}>
                      <Send className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Statistici */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Statistici Rezervări</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total rezervări:</span>
                    <span className="font-bold">{hostelBookings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rezervări active:</span>
                    <span className="font-bold">{activeBookings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rezervări anulate:</span>
                    <span className="font-bold text-red-600">
                      {hostelBookings.filter(b => b.status === "cancelled").length}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rată ocupare:</span>
                    <span className="font-bold">
                      {hostel.rooms.length > 0
                        ? Math.round((hostel.rooms.filter(r => !r.available).length / hostel.rooms.length) * 100)
                        : 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistici Financiare</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Venit total:</span>
                    <span className="font-bold">{totalRevenue} RON</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Venit mediu/rezervare:</span>
                    <span className="font-bold">
                      {hostelBookings.length > 0
                        ? Math.round(totalRevenue / hostelBookings.length)
                        : 0} RON
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preț mediu cameră:</span>
                    <span className="font-bold">
                      {hostel.rooms.length > 0
                        ? Math.round(hostel.rooms.reduce((sum, r) => sum + r.price, 0) / hostel.rooms.length)
                        : 0} RON
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating pensiune:</span>
                    <span className="font-bold">{hostel.rating}/10</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Details Panel */}
      {activeTab === "bookings" && clientChatOpen && selectedBooking && (
        <Card className="mt-6 border-2 border-primary/20">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                Gestionează Rezervare - {selectedBooking.guestName}
              </CardTitle>
              <CardDescription>
                Rezervare #{selectedBooking.id} • {selectedBooking.roomName}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setClientChatOpen(false)}
              className="shrink-0"
              aria-label="Închide"
            >
              <X className="size-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="px-3 py-1">
                  Detalii & Management
                </Badge>
              </div>

                {/* Status Management */}
                <Card className="border-2 border-primary/20 bg-muted/30">
                  <CardHeader className="pb-3 space-y-0">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="p-1.5 bg-primary rounded-lg">
                        <CheckCircle className="size-4 text-primary-foreground" />
                      </div>
                      <span>Management Status Rezervare</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-muted/50 rounded-xl border">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Label className="text-xs text-muted-foreground mb-1.5">Status Curent</Label>
                          <Badge 
                            variant={selectedBooking.status === "confirmed" ? "default" : "secondary"}
                            className="text-sm px-3 py-1"
                          >
                            {selectedBooking.status === "confirmed" ? "✓ Confirmat" : "✗ Anulat"}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full sm:w-auto">
                        <Label className="text-xs text-muted-foreground mb-1.5 block">Schimbă Status</Label>
                        <Select
                          value={selectedBooking.status}
                          onValueChange={(value) => {
                            setEditedBooking({ ...editedBooking, status: value as "confirmed" | "cancelled" });
                            selectedBooking.status = value as "confirmed" | "cancelled";
                          }}
                        >
                          <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="size-3.5" />
                                Confirmă Rezervarea
                              </div>
                            </SelectItem>
                            <SelectItem value="cancelled">
                              <div className="flex items-center gap-2">
                                <X className="size-3.5" />
                                Anulează Rezervarea
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toast.success("Email de confirmare trimis!")}
                        className="w-full"
                      >
                        <Mail className="size-4 mr-2" />
                        Trimite Confirmare
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toast.info("Reminder trimis clientului!")}
                        className="w-full"
                      >
                        <Clock className="size-4 mr-2" />
                        Trimite Reminder
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Booking Details - Editable */}
                <Card className="bg-muted/30">
                  <CardHeader className="pb-3 space-y-0">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary rounded-lg">
                          <Calendar className="size-4 text-primary-foreground" />
                        </div>
                        <span>Detalii Rezervare</span>
                      </span>
                      <Badge variant="outline" className="text-xs">
                        <Edit className="size-3 mr-1" />
                        Editabil
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <FileText className="size-3.5" />
                          Cod Rezervare
                        </Label>
                        <Input 
                          value={selectedBooking.id} 
                          disabled 
                          className="h-9 text-sm font-semibold bg-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <Bed className="size-3.5" />
                          Cameră
                        </Label>
                        <Select 
                          defaultValue={selectedBooking.roomName} 
                          onValueChange={(value) => {
                            const room = hostel.rooms.find(r => r.name === value);
                            setEditedBooking({ ...editedBooking, roomName: value, roomId: room?.id });
                          }}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {hostel.rooms.map(room => (
                              <SelectItem key={room.id} value={room.name}>
                                <div className="flex items-center gap-2">
                                  <Bed className="size-3.5" />
                                  {room.name} - {room.price} RON/noapte
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="size-3.5" />
                          Check-in
                        </Label>
                        <Input 
                          type="date" 
                          defaultValue={selectedBooking.checkIn.toISOString().split('T')[0]}
                          className="h-9"
                          onChange={(e) => setEditedBooking({ ...editedBooking, checkIn: new Date(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="size-3.5" />
                          Check-out
                        </Label>
                        <Input 
                          type="date"
                          defaultValue={selectedBooking.checkOut.toISOString().split('T')[0]}
                          className="h-9"
                          onChange={(e) => setEditedBooking({ ...editedBooking, checkOut: new Date(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <Users className="size-3.5" />
                          Număr Oaspeți
                        </Label>
                        <Input 
                          type="number" 
                          min="1"
                          defaultValue={selectedBooking.guests}
                          className="h-9"
                          onChange={(e) => setEditedBooking({ ...editedBooking, guests: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <Coins className="size-3.5" />
                          Preț Total (RON)
                        </Label>
                        <Input 
                          type="number" 
                          defaultValue={selectedBooking.totalPrice}
                          className="h-9 font-bold"
                          onChange={(e) => setEditedBooking({ ...editedBooking, totalPrice: parseFloat(e.target.value) })}
                        />
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <Users className="size-4" />
                        Informații Contact Client
                      </Label>
                      <div className="grid grid-cols-1 gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-muted rounded-lg">
                            <Users className="size-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <Label className="text-xs text-muted-foreground">Nume Complet</Label>
                            <Input 
                              defaultValue={selectedBooking.guestName}
                              className="h-9 mt-1"
                              placeholder="Nume complet"
                              onChange={(e) => setEditedBooking({ ...editedBooking, guestName: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-muted rounded-lg">
                            <Mail className="size-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <Label className="text-xs text-muted-foreground">Email</Label>
                            <Input 
                              type="email"
                              defaultValue={selectedBooking.guestEmail}
                              className="h-9 mt-1"
                              placeholder="Email"
                              onChange={(e) => setEditedBooking({ ...editedBooking, guestEmail: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-muted rounded-lg">
                            <Phone className="size-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <Label className="text-xs text-muted-foreground">Telefon</Label>
                            <Input 
                              type="tel"
                              defaultValue={selectedBooking.guestPhone}
                              className="h-9 mt-1"
                              placeholder="Telefon"
                              onChange={(e) => setEditedBooking({ ...editedBooking, guestPhone: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <FileText className="size-4" />
                        Cerințe Speciale
                      </Label>
                      <Textarea
                        defaultValue={selectedBooking.specialRequests || "Fără cerințe speciale"}
                        rows={4}
                        className="text-sm resize-none bg-muted/30 border-dashed"
                        placeholder="Adaugă cerințe speciale..."
                        onChange={(e) => setEditedBooking({ ...editedBooking, specialRequests: e.target.value })}
                      />
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={handleSaveBookingChanges}
                      disabled={isSavingBooking}
                    >
                      <Save className="size-4 mr-2" />
                      {isSavingBooking ? "Se salvează..." : "Salvează Toate Modificările"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <Card className="text-center p-4 bg-muted/30">
                    <div className="flex flex-col items-center gap-1">
                      <Calendar className="size-5 text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground font-medium">Nopți</p>
                      <p className="text-2xl font-bold">
                        {Math.ceil((selectedBooking.checkOut.getTime() - selectedBooking.checkIn.getTime()) / (1000 * 60 * 60 * 24))}
                      </p>
                    </div>
                  </Card>
                  <Card className="text-center p-4 bg-muted/30">
                    <div className="flex flex-col items-center gap-1">
                      <Coins className="size-5 text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground font-medium">Preț/Noapte</p>
                      <p className="text-2xl font-bold">
                        {Math.round(selectedBooking.totalPrice / Math.ceil((selectedBooking.checkOut.getTime() - selectedBooking.checkIn.getTime()) / (1000 * 60 * 60 * 24)))} <span className="text-sm">RON</span>
                      </p>
                    </div>
                  </Card>
                  <Card className="text-center p-4 bg-muted/30">
                    <div className="flex flex-col items-center gap-1">
                      <Users className="size-5 text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground font-medium">Oaspeți</p>
                      <p className="text-2xl font-bold">{selectedBooking.guests}</p>
                    </div>
                  </Card>
                </div>
              

            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="px-3 py-1">
                  Chat cu Client
                </Badge>
              </div>

                <Card className="border-2 border-primary/20 bg-muted/30">
                  <CardHeader className="pb-3 space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="p-1.5 bg-primary rounded-lg">
                        <MessageSquare className="size-4 text-primary-foreground" />
                      </div>
                      <span>Conversație cu {selectedBooking.guestName}</span>
                    </CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                      Comunică direct cu clientul în timp real
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Chat Messages */}
                    <div className="border rounded-xl p-4 h-[400px] overflow-y-auto space-y-3 bg-muted/20">
                      {clientMessages.length > 0 ? (
                        clientMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.from === "hostel" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                          >
                            <div
                              className={`max-w-[75%] rounded-lg p-3 shadow-sm ${
                                msg.from === "hostel"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-background border-2 border-muted"
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{msg.message}</p>
                              <p className={`text-xs mt-1.5 flex items-center gap-1 ${msg.from === "hostel" ? "opacity-80" : "text-muted-foreground"}`}>
                                <Clock className="size-3" />
                                {msg.timestamp.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <div className="p-4 bg-muted/50 rounded-full mb-4">
                            <MessageCircle className="size-12 text-muted-foreground/50" />
                          </div>
                          <p className="text-sm text-muted-foreground font-semibold">Nu există mesaje încă</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">Începe conversația cu clientul folosind template-urile rapide!</p>
                        </div>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="space-y-3 p-3 bg-muted/30 rounded-xl border">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Scrie un mesaj către client..."
                          value={newClientMessage}
                          onChange={(e) => setNewClientMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendClientMessage();
                            }
                          }}
                          className="flex-1"
                        />
                        <Button 
                          onClick={handleSendClientMessage} 
                          disabled={!newClientMessage.trim()}
                        >
                          <Send className="size-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        Apasă <kbd className="px-1.5 py-0.5 text-xs bg-muted border rounded">Enter</kbd> pentru a trimite mesajul
                      </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-border"></div>
                        <p className="text-xs font-medium text-muted-foreground">Template-uri Rapide</p>
                        <div className="h-px flex-1 bg-border"></div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setNewClientMessage("Bună ziua! Vă confirmăm rezervarea. Cu ce vă putem ajuta?");
                          }}
                        >
                          <CheckCircle className="size-3.5 mr-1.5" />
                          Confirmare rezervare
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setNewClientMessage("Ne apropiem de data check-in. Vă așteptăm cu drag!");
                          }}
                        >
                          <Clock className="size-3.5 mr-1.5" />
                          Reminder check-in
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setNewClientMessage("Mulțumim pentru sejur! Sperăm să reveniți!");
                          }}
                        >
                          <MessageCircle className="size-3.5 mr-1.5" />
                          Mulțumire
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              

            </div>
          </CardContent>
        </Card>
      )}
      {/* Room Dialog */}
      <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRoom && editedHostel.rooms.find(r => r.id === editingRoom.id) ? "Editează Cameră" : "Adaugă Cameră Nouă"}</DialogTitle>
            <DialogDescription>
              {editingRoom && editedHostel.rooms.find(r => r.id === editingRoom.id) ? "Modifică detaliile camerei" : "Adaugă o cameră nouă la pensiune"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Informații de Bază</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nume Cameră *</Label>
                  <Input
                    value={editingRoom?.name || ""}
                    onChange={(e) => setEditingRoom({ ...editingRoom!, name: e.target.value })}
                    placeholder="Suite Premium"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Tip Cameră</Label>
                  <Select
                    value={editingRoom?.type || "Standard"}
                    onValueChange={(value) => setEditingRoom({ ...editingRoom!, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Deluxe">Deluxe</SelectItem>
                      <SelectItem value="Suite">Suite</SelectItem>
                      <SelectItem value="Apartament">Apartament</SelectItem>
                      <SelectItem value="Cameră Dublă">Cameră Dublă</SelectItem>
                      <SelectItem value="Cameră Triplă">Cameră Triplă</SelectItem>
                      <SelectItem value="Cameră Family">Cameră Family</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Capacitate (persoane) *</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={editingRoom?.capacity || 2}
                    onChange={(e) => setEditingRoom({ ...editingRoom!, capacity: parseInt(e.target.value) || 2 })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Configurație Paturi</Label>
                  <Input
                    value={editingRoom?.beds || "1 pat dublu"}
                    onChange={(e) => setEditingRoom({ ...editingRoom!, beds: e.target.value })}
                    placeholder="1 pat dublu, 2 paturi single"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Preț/Noapte (RON) *</Label>
                  <Input
                    type="number"
                    min="0"
                    step="10"
                    value={editingRoom?.price || 300}
                    onChange={(e) => setEditingRoom({ ...editingRoom!, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>URL Imagine Cameră</Label>
                  <Input
                    value={editingRoom?.image || ""}
                    onChange={(e) => setEditingRoom({ ...editingRoom!, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                  <p className="text-xs text-muted-foreground">
                    URL complet către imaginea camerei
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-2">
              <Label>Descriere Cameră</Label>
              <Textarea
                rows={3}
                value={editingRoom?.description || ""}
                onChange={(e) => setEditingRoom({ ...editingRoom!, description: e.target.value })}
                placeholder="Descriere detaliată a camerei, facilități speciale, vedere..."
              />
            </div>

            <Separator />

            {/* Room Amenities */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">Facilități Cameră</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Selectează facilitățile disponibile în această cameră
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ROOM_AMENITIES.map((amenity) => {
                  const amenityKey = amenity.value;
                  const isChecked = editingRoom?.amenities?.includes(amenity.value) || false;
                  const Icon = amenity.icon;
                  
                  return (
                    <div key={amenity.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`room-amenity-${amenityKey}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const currentAmenities = editingRoom?.amenities || [];
                          const newAmenities = checked
                            ? [...currentAmenities, amenity.value]
                            : currentAmenities.filter((a) => a !== amenity.value);
                          setEditingRoom({ ...editingRoom!, amenities: newAmenities });
                        }}
                      />
                      <Label htmlFor={`room-amenity-${amenityKey}`} className="cursor-pointer text-sm flex items-center gap-2">
                        <Icon className="size-4 text-primary" />
                        {amenity.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Availability */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base">Disponibilitate Cameră</Label>
                <p className="text-sm text-muted-foreground">
                  Camera este disponibilă pentru rezervări
                </p>
              </div>
              <Switch
                checked={editingRoom?.available !== false}
                onCheckedChange={(checked) => setEditingRoom({ ...editingRoom!, available: checked })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setRoomDialogOpen(false);
                setEditingRoom(null);
              }}
            >
              <X className="size-4 mr-2" />
              Anulează
            </Button>
            <Button
              onClick={() => {
                if (!editingRoom?.name || !editingRoom?.price) {
                  toast.error('Completează câmpurile obligatorii: Nume și Preț');
                  return;
                }

                if (editingRoom) {
                  // Check if it's a new room (not in the list yet)
                  const existingRoomIndex = editedHostel.rooms.findIndex(r => r.id === editingRoom.id);
                  
                  if (existingRoomIndex >= 0) {
                    // Update existing room
                    const updatedRooms = editedHostel.rooms.map(r => r.id === editingRoom.id ? editingRoom : r);
                    setEditedHostel({ ...editedHostel, rooms: updatedRooms });
                    toast.success('Camera a fost actualizată cu succes!');
                  } else {
                    // Add new room
                    setEditedHostel({ ...editedHostel, rooms: [...editedHostel.rooms, editingRoom] });
                    toast.success('Camera a fost adăugată cu succes!');
                  }
                  
                  setRoomDialogOpen(false);
                  setEditingRoom(null);
                }
              }}
            >
              <Save className="size-4 mr-2" />
              Salvează Camera
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
}