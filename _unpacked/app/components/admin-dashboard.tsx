import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Building2, Users, MessageSquare, TrendingUp, Plus, Edit, Trash2, UserPlus, AlertCircle, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { HostelFormDialog } from "@/app/components/hostel-form-dialog";
import { InvitationDialog } from "@/app/components/invitation-dialog";
import type { Hostel, User, Feedback, HostelStats, BookingData } from "@/app/types";
import { projectId } from "/utils/supabase/info";

// DEMO USERS - simulați pentru testare
const DEMO_USERS: User[] = [
  {
    id: "U002",
    email: "grozav@bookastay.ro",
    name: "Manager Grozav Home",
    role: "hostel-admin",
    createdAt: new Date("2026-01-15T10:00:00Z"),
  },
  {
    id: "U004",
    email: "andrei.popescu@example.ro",
    name: "Andrei Popescu",
    role: "user",
    createdAt: new Date("2026-01-20T14:30:00Z"),
  },
  {
    id: "U005",
    email: "maria.ionescu@example.ro",
    name: "Maria Ionescu",
    role: "user",
    createdAt: new Date("2026-01-22T09:15:00Z"),
  },
  {
    id: "U006",
    email: "ion.vasilescu@example.ro",
    name: "Ion Vasilescu",
    role: "user",
    createdAt: new Date("2026-01-25T16:45:00Z"),
  },
];

interface AdminDashboardProps {
  hostels: Hostel[];
  bookings: BookingData[];
  onUpdateHostels: (hostels: Hostel[]) => void;
  onBack: () => void;
  accessToken: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function AdminDashboard({ hostels, bookings, onUpdateHostels, onBack, accessToken }: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [editingHostel, setEditingHostel] = useState<Hostel | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignAdminDialogOpen, setIsAssignAdminDialogOpen] = useState(false);
  const [selectedHostelForAdmin, setSelectedHostelForAdmin] = useState<Hostel | null>(null);

  // Fetch hostels from backend
  const fetchHostels = async () => {
    try {
      console.log('Fetching hostels from API...');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c7f3f823/admin/hostels`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Hostels refreshed:', data.hostels?.length || 0);
        if (data.hostels) {
          onUpdateHostels(data.hostels);
        }
      } else {
        console.error('Failed to fetch hostels:', response.status);
      }
    } catch (error) {
      console.error('Failed to refresh hostels:', error);
    }
  };

  // Calculate statistics
  const stats: HostelStats[] = hostels.map(hostel => {
    const hostelBookings = bookings.filter(b => b.hostelId === hostel.id);
    const activeBookings = hostelBookings.filter(b => b.status === "confirmed");
    const cancelledBookings = hostelBookings.filter(b => b.status === "cancelled");
    const revenue = activeBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    
    // Calculate occupancy rate (simplified)
    const totalRooms = hostel.rooms.length;
    const occupiedRooms = hostel.rooms.filter(r => !r.available).length;
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
    
    // Calculate average stay
    const totalNights = activeBookings.reduce((sum, b) => {
      const nights = Math.ceil((b.checkOut.getTime() - b.checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return sum + nights;
    }, 0);
    const averageStay = activeBookings.length > 0 ? totalNights / activeBookings.length : 0;

    return {
      hostelId: hostel.id,
      hostelName: hostel.name,
      totalBookings: hostelBookings.length,
      activeBookings: activeBookings.length,
      cancelledBookings: cancelledBookings.length,
      revenue,
      occupancyRate,
      averageStay,
    };
  });

  const totalRevenue = stats.reduce((sum, s) => sum + s.revenue, 0);
  const totalBookings = stats.reduce((sum, s) => sum + s.totalBookings, 0);
  const averageOccupancy = stats.reduce((sum, s) => sum + s.occupancyRate, 0) / stats.length;

  // Load DEMO users data
  useEffect(() => {
    console.log('DEMO: Loading demo users in AdminDashboard');
    setUsers(DEMO_USERS);

    setFeedbacks([
      {
        id: "F001",
        hostelId: "P001",
        hostelName: "Grozav Home",
        adminId: "U002",
        adminName: "Manager Grozav Home",
        message: "Intampin dificultati la modificarea anumitor detalii referitoare la camere",
        type: "issue",
        status: "new",
        createdAt: new Date("2026-01-25"),
      },
      {
        id: "F002",
        hostelId: "P002",
        hostelName: "Salin Home",
        adminId: "U003",
        adminName: "Manager Salin Home",
        message: "Sugestie: ar fi util  un sistem de check-in automat",
        type: "suggestion",
        status: "reviewed",
        createdAt: new Date("2026-01-20"),
      },
    ]);
  }, []);

  const handleAddHostel = (formData: Partial<Hostel>) => {
    const newHostel: Hostel = {
      id: `P${String(hostels.length + 1).padStart(3, '0')}`,
      name: formData.name || '',
      location: formData.location || '',
      address: formData.address || '',
      phone: formData.phone || '',
      email: formData.email || '',
      images: formData.images || [],
      rating: 0,
      reviews: 0,
      description: formData.description || '',
      amenities: formData.amenities || [],
      rooms: formData.rooms || [],
      featured: formData.featured || false,
      coordinates: formData.coordinates || { lat: 46.0569, lng: 23.4762 },
    };
    
    onUpdateHostels([...hostels, newHostel]);
    setIsAddDialogOpen(false);
    toast.success("Pensiune adăugată cu succes!");
  };

  const handleEditHostel = (hostel: Hostel) => {
    setEditingHostel(hostel);
    setIsEditDialogOpen(true);
  };

  const handleUpdateHostel = (formData: Partial<Hostel>) => {
    if (!editingHostel) return;
    
    const updatedHostel: Hostel = {
      ...editingHostel,
      ...formData,
    };
    
    onUpdateHostels(hostels.map(h => h.id === editingHostel.id ? updatedHostel : h));
    setIsEditDialogOpen(false);
    setEditingHostel(null);
    toast.success("Pensiune actualizată cu succes!");
  };

  const handleDeleteHostel = (hostelId: string) => {
    if (confirm("Sigur doriți să ștergeți această pensiune?")) {
      onUpdateHostels(hostels.filter(h => h.id !== hostelId));
      toast.success("Pensiune ștearsă cu succes!");
    }
  };

  const handleAssignAdmin = (hostelId: string, adminId: string) => {
    const updatedHostels = hostels.map(h =>
      h.id === hostelId ? { ...h, adminId } : h
    );
    onUpdateHostels(updatedHostels);
    setIsAssignAdminDialogOpen(false);
    toast.success("Administrator atribuit cu succes!");
  };

  const handleUpdateFeedbackStatus = (feedbackId: string, status: Feedback["status"]) => {
    setFeedbacks(feedbacks.map(f =>
      f.id === feedbackId ? { ...f, status } : f
    ));
    toast.success("Status actualizat!");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Button variant="ghost" onClick={onBack} size="sm" className="mb-2 -ml-2">
            <ArrowLeft className="size-4 mr-2" />
            Înapoi
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Panou de Administrare</h1>
          <p className="text-sm text-muted-foreground">Gestionează pensiuni, utilizatori și statistici</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Pensiuni</CardTitle>
            <Building2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{hostels.length}</div>
            <p className="text-xs text-muted-foreground">
              {hostels.filter(h => h.featured).length} premium
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Rezervări</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {bookings.filter(b => b.status === "confirmed").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Venit Total</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{totalRevenue.toLocaleString()} RON</div>
            <p className="text-xs text-muted-foreground">Din rezervări active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Ocupare Medie</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{averageOccupancy.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Pe toate pensiunile</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
          <TabsList className="grid w-full grid-cols-5 min-w-[600px] sm:min-w-0">
            <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-4">
              <TrendingUp className="size-3 sm:size-4 sm:mr-2" />
              <span className="hidden sm:inline">Statistici</span>
            </TabsTrigger>
            <TabsTrigger value="hostels" className="text-xs sm:text-sm px-2 sm:px-4">
              <Building2 className="size-3 sm:size-4 sm:mr-2" />
              <span className="hidden sm:inline">Pensiuni</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm px-2 sm:px-4">
              <Users className="size-3 sm:size-4 sm:mr-2" />
              <span className="hidden sm:inline">Utilizatori</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs sm:text-sm px-2 sm:px-4">
              <MessageSquare className="size-3 sm:size-4 sm:mr-2" />
              <span className="hidden sm:inline">Feedback</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 sm:px-4">
              <TrendingUp className="size-3 sm:size-4 sm:mr-2" />
              <span className="hidden sm:inline">Analiză</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performanță Pensiuni</CardTitle>
              <CardDescription>Comparație rezervări și venituri</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hostelName" angle={-45} textAnchor="end" height={100} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="totalBookings" fill="#8884d8" name="Rezervări" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Venit (RON)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Rata de Ocupare</CardTitle>
                <CardDescription>Per pensiune</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hostelName" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="occupancyRate" fill="#0088FE" name="Ocupare %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuție Rezervări</CardTitle>
                <CardDescription>Per pensiune</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={stats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.hostelName.split(' ')[0]}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalBookings"
                    >
                      {stats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Hostels Management Tab */}
        <TabsContent value="hostels" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Gestionare Pensiuni</h3>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="size-4 mr-2" />
              Adaugă Pensiune
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {hostels.map((hostel) => {
              const hostelStat = stats.find(s => s.hostelId === hostel.id);
              const assignedAdmin = users.find(u => u.id === hostel.adminId);
              
              return (
                <Card key={hostel.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {hostel.name}
                          {hostel.featured && <Badge>Premium</Badge>}
                        </CardTitle>
                        <CardDescription>{hostel.location}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedHostelForAdmin(hostel);
                            setIsAssignAdminDialogOpen(true);
                          }}
                        >
                          <UserPlus className="size-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditHostel(hostel)}>
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteHostel(hostel.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Camere</p>
                        <p className="font-semibold">{hostel.rooms.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rezervări</p>
                        <p className="font-semibold">{hostelStat?.totalBookings || 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Venit</p>
                        <p className="font-semibold">{hostelStat?.revenue.toLocaleString() || 0} RON</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Ocupare</p>
                        <p className="font-semibold">{hostelStat?.occupancyRate.toFixed(1) || 0}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Administrator</p>
                        <p className="font-semibold text-xs">
                          {assignedAdmin ? assignedAdmin.name : "Neatribuit"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Users Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Gestionare Utilizatori</h3>
            <Button size="sm">
              <Plus className="size-4 mr-2" />
              <span className="hidden sm:inline">Adaugă Utilizator</span>
              <span className="sm:hidden">Adaugă</span>
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Nume</TableHead>
                      <TableHead className="min-w-[180px]">Email</TableHead>
                      <TableHead className="min-w-[100px]">Rol</TableHead>
                      <TableHead className="min-w-[150px]">Pensiune Atribuită</TableHead>
                      <TableHead className="min-w-[100px]">Data Creării</TableHead>
                      <TableHead className="min-w-[100px]">Acțiuni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                      const assignedHostel = hostels.find(h => h.adminId === user.id);
                      // Ensure createdAt is a Date object
                      const createdDate = user.createdAt instanceof Date ? user.createdAt : new Date(user.createdAt);
                      
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium text-xs sm:text-sm">{user.name}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs">
                              {user.role === "admin" ? "Admin" : user.role === "hostel-admin" ? "Admin P." : "User"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">{assignedHostel?.name || "-"}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{createdDate.toLocaleDateString("ro-RO")}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="size-3 sm:size-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="size-3 sm:size-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          <h3 className="text-lg font-semibold">Feedback de la Administratori</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {feedbacks.map((feedback) => (
              <Card key={feedback.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {feedback.hostelName}
                        <Badge variant={
                          feedback.type === "issue" ? "destructive" :
                          feedback.type === "suggestion" ? "default" : "secondary"
                        }>
                          {feedback.type === "issue" ? "Problemă" :
                           feedback.type === "suggestion" ? "Sugestie" : "Info"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        De la {feedback.adminName} • {feedback.createdAt.toLocaleDateString("ro-RO")}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {feedback.status === "new" && (
                        <Badge variant="outline">
                          <Clock className="size-3 mr-1" />
                          Nou
                        </Badge>
                      )}
                      {feedback.status === "reviewed" && (
                        <Badge variant="secondary">
                          <AlertCircle className="size-3 mr-1" />
                          Revizuit
                        </Badge>
                      )}
                      {feedback.status === "resolved" && (
                        <Badge variant="default">
                          <CheckCircle className="size-3 mr-1" />
                          Rezolvat
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{feedback.message}</p>
                  <div className="flex gap-2">
                    {feedback.status === "new" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateFeedbackStatus(feedback.id, "reviewed")}
                      >
                        Marchează ca Revizuit
                      </Button>
                    )}
                    {feedback.status === "reviewed" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateFeedbackStatus(feedback.id, "resolved")}
                      >
                        Marchează ca Rezolvat
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <h3 className="text-lg font-semibold">Analiză Detaliată</h3>
          
          <Card>
            <CardHeader>
              <CardTitle>Tabel Comparativ Pensiuni</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Pensiune</TableHead>
                      <TableHead className="min-w-[100px]">Total Rezervări</TableHead>
                      <TableHead className="min-w-[80px]">Active</TableHead>
                      <TableHead className="min-w-[80px]">Anulate</TableHead>
                      <TableHead className="min-w-[100px]">Venit</TableHead>
                      <TableHead className="min-w-[80px]">Ocupare</TableHead>
                      <TableHead className="min-w-[100px]">Ședere Medie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.map((stat) => (
                      <TableRow key={stat.hostelId}>
                        <TableCell className="font-medium">{stat.hostelName}</TableCell>
                        <TableCell>{stat.totalBookings}</TableCell>
                        <TableCell>{stat.activeBookings}</TableCell>
                        <TableCell>{stat.cancelledBookings}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{stat.revenue.toLocaleString()} RON</TableCell>
                        <TableCell>{stat.occupancyRate.toFixed(1)}%</TableCell>
                        <TableCell>{stat.averageStay.toFixed(1)} nopți</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assign Admin Dialog */}
      {selectedHostelForAdmin && (
        <InvitationDialog
          open={isAssignAdminDialogOpen}
          onOpenChange={setIsAssignAdminDialogOpen}
          hostelId={selectedHostelForAdmin.id}
          hostelName={selectedHostelForAdmin.name}
          accessToken={accessToken}
          onSuccess={(userId?: string) => {
            // DEMO: Update hostel and user locally
            if (userId) {
              console.log('DEMO: Updating hostel and user locally', { hostelId: selectedHostelForAdmin.id, userId });
              
              // Update hostels array
              const updatedHostels = hostels.map(h => 
                h.id === selectedHostelForAdmin.id 
                  ? { ...h, adminId: userId }
                  : h
              );
              onUpdateHostels(updatedHostels);
              
              // Update users array - assign hostel to user and update role
              setUsers(prevUsers => prevUsers.map(u => 
                u.id === userId 
                  ? { ...u, role: 'hostel-admin' as const, assignedHostelId: selectedHostelForAdmin.id }
                  : u
              ));
              
              toast.success(`✅ ${selectedHostelForAdmin.name} actualizat local!`);
            }
            
            setIsAssignAdminDialogOpen(false);
            setSelectedHostelForAdmin(null);
          }}
        />
      )}

      {/* Add Hostel Dialog */}
      <HostelFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddHostel}
        hostel={null}
      />

      {/* Edit Hostel Dialog */}
      <HostelFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleUpdateHostel}
        hostel={editingHostel}
      />
    </div>
  );
}