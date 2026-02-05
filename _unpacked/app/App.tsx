import { useState, useMemo, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { HostelCard } from "@/app/components/hostel-card";
import { HostelDetail } from "@/app/components/hostel-detail";
import { SearchBar } from "@/app/components/search-bar";
import { BookingForm } from "@/app/components/booking-form";
import { ReservationsList } from "@/app/components/reservations-list";
import { LoginDialog } from "@/app/components/login-dialog";
import { PaymentDialog } from "@/app/components/payment-dialog";
import { UserMenu } from "@/app/components/user-menu";
import { AccountSettings } from "@/app/components/account-settings";
import { BookingDetails } from "@/app/components/booking-details";
import { AdminDashboard } from "@/app/components/admin-dashboard";
import { HostelAdminDashboard } from "@/app/components/hostel-admin-dashboard";
import {
  AuthProvider,
  useAuth,
} from "@/app/contexts/auth-context";
import {
  Building2,
  CalendarCheck,
  ClipboardList,
  Search,
  LogIn,
  Settings,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/app/components/ui/sonner";
import type { Hostel, Room, BookingData } from "@/app/types";
// Import admin helper for easy promotion in console
import "/src/utils/admin-helper.ts";

const initialHostels: Hostel[] = [
  {
    id: "P001",
    name: "Grozav Home",
    location: "Vama Seacă, Alba",
    address: "Grozav Home, Str. Principală, 517339 Vama Seacă",
    phone: "+40 758 xxx xxx",
    email: "contact@grozavhome.ro",
    adminId: "U002", // Manager Grozav Home
    images: [
      "https://images.unsplash.com/photo-1744752769425-a17a053ed222?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1577922189281-74c171509aab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1672983665896-e02f28d14173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1567600175325-3573c56bee05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    rating: 9.8,
    reviews: 287,
    description:
      "Pensiune premium de lux în Vama Seacă, în apropierea Salinei Ocna Mureș. Facilități ultra-moderne, piscină încălzită, spa complet și restaurant gourmet. Experiență de 5 stele în inima naturii.",
    amenities: [
      "wifi",
      "breakfast",
      "parking",
      "ac",
      "restaurant",
      "gym",
      "laundry",
    ],
    featured: true,
    coordinates: {
      lat: 46.357932,
      lng: 23.930774,
    },
    rooms: [
      {
        id: "P001-R1",
        name: "Deluxe King Suite",
        type: "Suite Premium",
        capacity: 2,
        beds: "1 pat king size",
        price: 650,
        image:
          "https://images.unsplash.com/photo-1700805546327-761a8bae6a35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "tv", "ac", "breakfast"],
        available: true,
        description:
          "Suite luxoasă cu balcon panoramic, jacuzzi privat și design exclusivist. Mic dejun premium inclus.",
      },
      {
        id: "P001-R2",
        name: "Premium Double Deluxe",
        type: "Cameră Dublă Premium",
        capacity: 2,
        beds: "1 pat queen premium",
        price: 480,
        image:
          "https://images.unsplash.com/photo-1631015108776-19a4ac25a741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "tv", "ac", "breakfast"],
        available: true,
        description:
          "Cameră premium cu mobilier de lux, baie cu duș cu jets și vedere spectaculoasă la munte.",
      },
      {
        id: "P001-R3",
        name: "Family Luxury Suite",
        type: "Suite Familială Luxury",
        capacity: 4,
        beds: "1 pat king + 2 paturi",
        price: 850,
        image:
          "https://images.unsplash.com/photo-1617527042202-e588d3decc60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "tv", "ac", "breakfast"],
        available: true,
        description:
          "Suite familială ultra-spațioasă cu 2 dormitoare, living separat și toate facilitțile premium.",
      },
      {
        id: "P001-R4",
        name: "Royal Apartment",
        type: "Apartament Royal",
        capacity: 6,
        beds: "2 paturi king + canapea",
        price: 1200,
        image:
          "https://images.unsplash.com/photo-1700805546327-761a8bae6a35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "tv", "ac", "breakfast"],
        available: true,
        description:
          "Apartament exclusivist cu 3 dormitoare, living lux, bucătărie echipată și terasă privată panoramică.",
      },
    ],
  },
  {
    id: "P002",
    name: "Salin Home",
    location: "Ocna Mureș, Alba",
    address: "Str. Salinei nr. 15, Ocna Mureș, jud. Alba",
    phone: "+40 258 xxx xxx",
    email: "rezervari@salinhome.ro",
    images: [
      "https://images.unsplash.com/photo-1613421633801-c5827a8957c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1768573491344-4a2b9d2a03bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1672983665896-e02f28d14173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    rating: 9.3,
    reviews: 198,
    description:
      "Pensiune modernă cu terapie la doar 2 minute de Salina Ocna Mureș. Oferim tratamente cu sare, camere confortabile și atmosferă relaxantă. Ideal pentru cure și wellness.",
    amenities: ["wifi", "breakfast", "parking", "ac"],
    coordinates: {
      lat: 46.392144,
      lng: 23.853242,
    },
    rooms: [
      {
        id: "P002-R1",
        name: "Cameră Terapeutică Dublă",
        type: "Cameră Dublă",
        capacity: 2,
        beds: "1 pat dublu",
        price: 320,
        image:
          "https://images.unsplash.com/photo-1631015108776-19a4ac25a741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "tv", "ac", "breakfast"],
        available: true,
        description:
          "Cameră confortabilă cu aer condiționat și acces la tratamente cu sare din salină.",
      },
      {
        id: "P002-R2",
        name: "Superior Twin",
        type: "Cameră Twin",
        capacity: 2,
        beds: "2 paturi single",
        price: 340,
        image:
          "https://images.unsplash.com/photo-1617527042202-e588d3decc60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "tv", "ac", "breakfast"],
        available: true,
        description:
          "Cameră twin modernă, perfectă pentru prieteni sau colegi în cure.",
      },
      {
        id: "P002-R3",
        name: "Family Wellness",
        type: "Cameră Familială",
        capacity: 4,
        beds: "1 pat dublu + 2 paturi",
        price: 480,
        image:
          "https://images.unsplash.com/photo-1700805546327-761a8bae6a35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "tv", "ac", "breakfast"],
        available: true,
        description:
          "Cameră spațioasă pentru familii care urmează tratamente la salină.",
      },
    ],
  },
  {
    id: "P003",
    name: "Gold Residence - Pensiune Ocna Mureș",
    location: "Ocna Mureș, Alba",
    address: "Str. Principală nr. 78, Ocna Mureș, jud. Alba",
    phone: "+40 258 xxx xxx",
    email: "info@goldresidence.ro",
    images: [
      "https://images.unsplash.com/photo-1759162701761-91ed0a0ca7d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1768846316943-f8e58a34dc40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1669653862523-904e92ee90b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1766188539902-24ffc24e6b14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    rating: 9.1,
    reviews: 156,
    description:
      "Pensiune elegantă în centrul Ocnei Mureș, cu acces facil la toate atracțiile. Design modern, facilități complete și personal ospitalier. Perfectă pentru sejururi de relaxare și tratament.",
    amenities: [
      "wifi",
      "breakfast",
      "parking",
      "ac",
      "restaurant",
    ],
    coordinates: {
      lat: 46.0994,
      lng: 23.8594,
    },
    rooms: [
      {
        id: "P003-R1",
        name: "Standard Double",
        type: "Cameră Dublă",
        capacity: 2,
        beds: "1 pat dublu",
        price: 280,
        image:
          "https://images.unsplash.com/photo-1617527042202-e588d3decc60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "tv", "ac", "breakfast"],
        available: true,
        description:
          "Cameră standard cu dotări moderne și confort garantat.",
      },
      {
        id: "P003-R2",
        name: "Gold Suite",
        type: "Suite",
        capacity: 3,
        beds: "1 pat queen + canapea",
        price: 420,
        image:
          "https://images.unsplash.com/photo-1631015108776-19a4ac25a741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "tv", "ac", "breakfast"],
        available: true,
        description:
          "Suite elegantă cu living separat și facilități premium.",
      },
      {
        id: "P003-R3",
        name: "Apartament Gold",
        type: "Apartament",
        capacity: 5,
        beds: "2 dormitoare",
        price: 580,
        image:
          "https://images.unsplash.com/photo-1700805546327-761a8bae6a35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "tv", "ac", "breakfast"],
        available: true,
        description:
          "Apartament cu 2 dormitoare, bucătărie și living spațios, ideal pentru familii.",
      },
    ],
  },
  {
    id: "P004",
    name: "Pensiunea Valea Lină",
    location: "Rimetea, Alba",
    address: "Str. Principală nr. 45, Rimetea, jud. Alba",
    phone: "+40 258 xxx xxx",
    email: "contact@valealina.ro",
    images: [
      "https://images.unsplash.com/photo-1688544162363-c3763c11dd42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1719413920796-7d702d063934?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1593857389276-7c794900c90f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    rating: 9.4,
    reviews: 156,
    description:
      "Pensiune tradițională în inima Munților Apuseni, cu vedere spre Piatra Secuiului. Atmosferă caldă, camere confortabile și mic dejun tradițional românesc.",
    amenities: ["breakfast", "parking", "wifi"],
    rooms: [
      {
        id: "P004-R1",
        name: "Dublă Standard",
        type: "Cameră Dublă",
        capacity: 2,
        beds: "1 pat dublu",
        price: 320,
        image:
          "https://images.unsplash.com/photo-1617527042202-e588d3decc60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "breakfast"],
        available: true,
        description:
          "Cameră dublă confortabilă cu baie proprie și vedere la munte.",
      },
      {
        id: "P004-R2",
        name: "Dublă Deluxe",
        type: "Cameră Dublă",
        capacity: 2,
        beds: "1 pat queen",
        price: 380,
        image:
          "https://images.unsplash.com/photo-1631015108776-19a4ac25a741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "tv", "breakfast"],
        available: true,
        description:
          "Cameră deluxe cu balcon și vedere panoramică spre munți.",
      },
      {
        id: "P004-R3",
        name: "Cameră Family",
        type: "Cameră Familială",
        capacity: 4,
        beds: "1 pat dublu + 2 paturi",
        price: 520,
        image:
          "https://images.unsplash.com/photo-1700805546327-761a8bae6a35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "tv", "breakfast"],
        available: true,
        description:
          "Cameră spațioasă pentru familii, cu 4 locuri de dormit.",
      },
    ],
  },
  {
    id: "P005",
    name: "Pensiunea Cetate View",
    location: "Alba Iulia, Alba",
    address: "B-dul Ferdinand nr. 12, Alba Iulia",
    phone: "+40 258 xxx xxx",
    email: "rezervari@cetateview.ro",
    images: [
      "https://images.unsplash.com/photo-1764157281987-05ed94ee6bc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1620094946770-062f5cdd03ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1768846316943-f8e58a34dc40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1766188539902-24ffc24e6b14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    rating: 9.1,
    reviews: 203,
    description:
      "Pensiune urbană cu vedere la Cetatea Alba Carolina. Facilități SPA și locație centrală perfectă pentru explorarea orașului istoric.",
    amenities: ["parking", "wifi", "ac"],
    rooms: [
      {
        id: "P005-R1",
        name: "Single",
        type: "Cameră Single",
        capacity: 1,
        beds: "1 pat single",
        price: 220,
        image:
          "https://images.unsplash.com/photo-1617527042202-e588d3decc60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "ac"],
        available: true,
        description:
          "Cameră single confortabilă pentru călători de afaceri.",
      },
      {
        id: "P005-R2",
        name: "Dublă City",
        type: "Cameră Dublă",
        capacity: 2,
        beds: "1 pat dublu",
        price: 280,
        image:
          "https://images.unsplash.com/photo-1631015108776-19a4ac25a741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "tv", "ac"],
        available: true,
        description:
          "Cameră modernă cu vedere spre Cetatea Alba Carolina.",
      },
      {
        id: "P005-R3",
        name: "Junior Suite",
        type: "Suite",
        capacity: 3,
        beds: "1 pat queen + canapea",
        price: 440,
        image:
          "https://images.unsplash.com/photo-1700805546327-761a8bae6a35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "tv", "ac", "breakfast"],
        available: true,
        description:
          "Suite spațioasă cu living separat și facilități premium.",
      },
    ],
  },
  {
    id: "P006",
    name: "Cabana Fagul Mare",
    location: "Arieșeni, Alba",
    address: "Str. Stațiunii nr. 1, Arieșeni",
    phone: "+40 758 xxx xxx",
    email: "info@fagulmare.ro",
    images: [
      "https://images.unsplash.com/photo-1502885380958-f9f2289af1a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1730128269746-8d468968654e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1719328787112-b48d282da2b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1743633628268-f09200213861?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    rating: 9.6,
    reviews: 142,
    description:
      "Cabană premium la poalele pârtiilor de schi din Arieșeni. Ciubăr tradițional, grătar și atmosferă montană autentică.",
    amenities: ["parking", "wifi", "breakfast"],
    rooms: [
      {
        id: "P006-R1",
        name: "Cabana Întreagă",
        type: "Cabană Completă",
        capacity: 8,
        beds: "3 dormitoare",
        price: 600,
        image:
          "https://images.unsplash.com/photo-1617527042202-e588d3decc60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "tv", "breakfast"],
        available: true,
        description:
          "Cabană întreagă pentru grupuri, cu 3 dormitoare și living spațios cu șemineu.",
      },
    ],
  },
  {
    id: "P007",
    name: "Pensiunea Stejarul Spa",
    location: "Sebeș, Alba",
    address: "Str. Lucian Blaga nr. 34, Sebeș",
    phone: "+40 258 xxx xxx",
    email: "spa@stejarul.ro",
    images: [
      "https://images.unsplash.com/photo-1587814791300-62517c92ac12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1672983665896-e02f28d14173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1766188539902-24ffc24e6b14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1768573491344-4a2b9d2a03bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    rating: 8.9,
    reviews: 178,
    description:
      "Pensiune cu facilități SPA complete: saună finlandeză, piscină interioară încălzită și masaj terapeutic. Perfectă pentru relaxare și wellness.",
    amenities: ["wifi", "ac", "breakfast", "parking"],
    rooms: [
      {
        id: "P007-R1",
        name: "Dublă Spa",
        type: "Cameră Dublă",
        capacity: 2,
        beds: "1 pat queen",
        price: 350,
        image:
          "https://images.unsplash.com/photo-1631015108776-19a4ac25a741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "tv", "ac", "breakfast"],
        available: true,
        description:
          "Cameră elegantă cu acces inclus la zona SPA.",
      },
      {
        id: "P007-R2",
        name: "Suite Spa Premium",
        type: "Suite",
        capacity: 4,
        beds: "1 pat king + 2 paturi",
        price: 590,
        image:
          "https://images.unsplash.com/photo-1700805546327-761a8bae6a35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "tv", "ac", "breakfast"],
        available: true,
        description:
          "Suite luxoasă cu jacuzzi privat și acces premium la toate facilitățile SPA.",
      },
    ],
  },
  {
    id: "P008",
    name: "Pensiunea Apuseni Garden",
    location: "Câmpeni, Alba",
    address: "Str. Avram Iancu nr. 89, Câmpeni",
    phone: "+40 258 xxx xxx",
    email: "rezervari@apuseniegarden.ro",
    images: [
      "https://images.unsplash.com/photo-1688544162363-c3763c11dd42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1768573491344-4a2b9d2a03bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1719413920796-7d702d063934?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1766188539902-24ffc24e6b14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    rating: 9.0,
    reviews: 134,
    description:
      "Pensiune family-friendly cu loc de joacă pentru copii și grădină spațioasă cu zonă de grătar. Prietenos cu animalele de companie.",
    amenities: ["parking", "wifi", "breakfast"],
    rooms: [
      {
        id: "P008-R1",
        name: "Dublă Economy",
        type: "Cameră Dublă",
        capacity: 2,
        beds: "1 pat dublu",
        price: 260,
        image:
          "https://images.unsplash.com/photo-1617527042202-e588d3decc60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "breakfast"],
        available: true,
        description:
          "Cameră economică ideală pentru cupluri care caută confort la preț accesibil.",
      },
      {
        id: "P008-R2",
        name: "Triplă",
        type: "Cameră Tripl",
        capacity: 3,
        beds: "3 paturi single",
        price: 340,
        image:
          "https://images.unsplash.com/photo-1631015108776-19a4ac25a741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["wifi", "tv", "breakfast"],
        available: true,
        description:
          "Cameră triplă spațioasă pentru prieteni sau familii mici.",
      },
    ],
  },
];

function AppContent() {
  const { user, loading, accessToken } = useAuth();
  const [hostels, setHostels] =
    useState<Hostel[]>(initialHostels);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [selectedHostel, setSelectedHostel] =
    useState<Hostel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<
    Room | undefined
  >();
  const [preSelectedCheckIn, setPreSelectedCheckIn] = useState<Date | undefined>();
  const [preSelectedCheckOut, setPreSelectedCheckOut] = useState<Date | undefined>();
  const [activeTab, setActiveTab] = useState("browse");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] =
    useState(false);
  const [pendingBooking, setPendingBooking] =
    useState<BookingData | null>(null);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingData | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState("all");
  const [priceRange, setPriceRange] = useState("all");

  // Close admin dashboard and settings when user logs out
  useEffect(() => {
    if (!user) {
      setShowAdminDashboard(false);
      setShowSettings(false);
    }
  }, [user]);

  // Get unique locations
  const locations = useMemo(() => {
    const locs = hostels.map((h) => h.location);
    return Array.from(new Set(locs)).sort();
  }, [hostels]);

  // Filter and sort hostels - featured first
  const filteredHostels = useMemo(() => {
    const filtered = hostels.filter((hostel) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = hostel.name
          .toLowerCase()
          .includes(query);
        const matchesLocation = hostel.location
          .toLowerCase()
          .includes(query);
        const matchesDescription = hostel.description
          .toLowerCase()
          .includes(query);
        if (
          !matchesName &&
          !matchesLocation &&
          !matchesDescription
        ) {
          return false;
        }
      }

      // Location filter
      if (
        selectedLocation !== "all" &&
        hostel.location !== selectedLocation
      ) {
        return false;
      }

      // Price range filter
      if (priceRange !== "all") {
        const minPrice = Math.min(
          ...hostel.rooms.map((r) => r.price),
        );
        if (priceRange === "budget" && minPrice > 350)
          return false;
        if (
          priceRange === "moderate" &&
          (minPrice <= 350 || minPrice > 600)
        )
          return false;
        if (priceRange === "premium" && minPrice <= 600)
          return false;
      }

      return true;
    });

    // Sort: featured first, then by rating
    return filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });
  }, [hostels, searchQuery, selectedLocation, priceRange]);

  // Show loading state while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Se încarcă...</p>
        </div>
      </div>
    );
  }

  const handleViewHostelDetails = (hostel: Hostel) => {
    setSelectedHostel(hostel);
  };

  const handleBackToList = () => {
    setSelectedHostel(null);
    setSelectedRoom(undefined);
    setShowSettings(false);
    setSelectedBooking(null);
  };

  const handleBookRoom = (room: Room, checkIn?: Date, checkOut?: Date) => {
    if (!selectedHostel) return;
    setSelectedRoom(room);
    setPreSelectedCheckIn(checkIn);
    setPreSelectedCheckOut(checkOut);
    setActiveTab("book");
  };

  const handleSubmitBooking = (booking: BookingData) => {
    // Check if user is authenticated
    if (!user) {
      toast.error(
        "Trebuie să fii autentificat pentru a face rezervări",
      );
      setPendingBooking(booking);
      setLoginDialogOpen(true);
      return;
    }

    // Open payment dialog
    setPendingBooking(booking);
    setPaymentDialogOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (!pendingBooking) return;

    setBookings([pendingBooking, ...bookings]);

    toast.success("Rezervare Confirmată!", {
      description: `Cod: ${pendingBooking.id} la ${pendingBooking.hostelName}`,
    });

    setPendingBooking(null);
    setSelectedRoom(undefined);
    setSelectedHostel(null);
    setActiveTab("reservations");
  };

  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    if (
      confirm(
        `Sigur doriți să anulați rezervarea ${bookingId}?`,
      )
    ) {
      setBookings(
        bookings.map((b) =>
          b.id === bookingId
            ? { ...b, status: "cancelled" as const }
            : b,
        ),
      );

      toast.info("Rezervare Anulată", {
        description: `Rezervarea ${bookingId} a fost anulată cu succes.`,
      });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("all");
    setPriceRange("all");
  };

  const availableRoomsForBooking = selectedHostel
    ? selectedHostel.rooms
    : hostels.flatMap((h) => h.rooms);

  return (
    <div className="min-h-screen bg-background">
      <Toaster />

      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer"
              onClick={handleBackToList}
            >
              <Building2 className="size-6 sm:size-8 text-primary shrink-0" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">
                  BookaStay
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Rezervări pensiuni și cabane
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex flex-col items-end gap-1 text-xs sm:text-sm text-muted-foreground">
                <span>
                  {filteredHostels.length} proprietăți
                </span>
                <span>
                  {
                    bookings.filter(
                      (b) => b.status === "confirmed",
                    ).length
                  }{" "}
                  active
                </span>
              </div>

              {user ? (
                <UserMenu
                  onViewBookings={() =>
                    setActiveTab("reservations")
                  }
                  onViewSettings={() => setShowSettings(true)}
                  onViewAdmin={() => setShowAdminDashboard(true)}
                />
              ) : (
                <Button
                  onClick={() => setLoginDialogOpen(true)}
                  variant="default"
                  size="sm"
                >
                  <LogIn className="size-4 mr-2" />
                  <span className="hidden sm:inline">
                    Autentificare
                  </span>
                  <span className="sm:hidden">Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login Dialog */}
      <LoginDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
      />

      {/* Payment Dialog */}
      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        booking={pendingBooking}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {showAdminDashboard ? (
          // Check user role and show appropriate dashboard
          user?.user_metadata?.role === "hostel-admin" ? (
            <HostelAdminDashboard
              hostel={hostels.find(h => h.id === user.user_metadata?.assignedHostelId)!}
              bookings={bookings.filter(b => b.hostelId === user.user_metadata?.assignedHostelId)}
              user={user}
              onUpdateHostel={(updatedHostel) => {
                setHostels(hostels.map(h => h.id === updatedHostel.id ? updatedHostel : h));
              }}
              onUpdateBooking={(updatedBooking) => {
                setBookings(bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b));
              }}
              onLogout={() => {
                setShowAdminDashboard(false);
                setShowSettings(false);
              }}
              onBack={() => {
                setShowAdminDashboard(false);
              }}
            />
          ) : (
            <AdminDashboard
              hostels={hostels}
              bookings={bookings}
              onUpdateHostels={setHostels}
              onBack={() => setShowAdminDashboard(false)}
              accessToken={accessToken}
            />
          )
        ) : showSettings ? (
          <AccountSettings />
        ) : selectedBooking ? (
          <BookingDetails
            booking={selectedBooking}
            hostel={hostels.find(
              (h) => h.id === selectedBooking.hostelId,
            )}
            onBack={() => setSelectedBooking(null)}
          />
        ) : selectedHostel ? (
          <HostelDetail
            hostel={selectedHostel}
            onBack={handleBackToList}
            onBookRoom={handleBookRoom}
          />
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4 sm:space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3 max-w-[600px] mx-auto h-auto">
              <TabsTrigger
                value="browse"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 text-xs sm:text-sm"
              >
                <Search className="size-3.5 sm:size-4" />
                <span className="hidden sm:inline">
                  Caută Pensiuni
                </span>
                <span className="sm:hidden">Caută</span>
              </TabsTrigger>
              <TabsTrigger
                value="book"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 text-xs sm:text-sm"
              >
                <CalendarCheck className="size-3.5 sm:size-4" />
                <span className="hidden sm:inline">
                  Rezervare Nouă
                </span>
                <span className="sm:hidden">Rezervă</span>
              </TabsTrigger>
              <TabsTrigger
                value="reservations"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 text-xs sm:text-sm"
              >
                <ClipboardList className="size-3.5 sm:size-4" />
                <span className="hidden sm:inline">
                  Rezervările Mele
                </span>
                <span className="sm:hidden">Rezervări</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="browse"
              className="space-y-4 sm:space-y-6"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                  Descoperă cele mai atractive Pensiuni si
                  Cabane
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Disponibilitate în timp real. Confirmare
                  instant. {hostels.length} proprietăți.
                </p>
              </div>

              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                locations={locations}
                onClearFilters={handleClearFilters}
              />

              {filteredHostels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHostels.map((hostel) => (
                    <HostelCard
                      key={hostel.id}
                      hostel={hostel}
                      onViewDetails={handleViewHostelDetails}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg mb-4">
                    Nu am găsit pensiuni care să corespundă
                    criteriilor tale
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Încearcă să ajustezi filtrele de căutare
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="book"
              className="space-y-4 sm:space-y-6"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                  Creează o Rezervare
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Selectează pensiunea, perioada și completează
                  datele pentru rezervare
                </p>
              </div>
              <div className="max-w-2xl mx-auto">
                <BookingForm
                  hostels={hostels}
                  bookings={bookings}
                  onSubmit={handleSubmitBooking}
                  preSelectedHostelId={selectedHostel?.id}
                  preSelectedRoomId={selectedRoom?.id}
                  preSelectedCheckIn={preSelectedCheckIn}
                  preSelectedCheckOut={preSelectedCheckOut}
                />
              </div>
            </TabsContent>

            <TabsContent
              value="reservations"
              className="space-y-4 sm:space-y-6"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                  Rezervările Mele
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Vizualizează și gestionează toate rezervările
                  tale ({bookings.length} total)
                </p>
              </div>
              <ReservationsList
                bookings={bookings}
                onCancel={handleCancelBooking}
                onViewDetails={(booking) =>
                  setSelectedBooking(booking)
                }
              />
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-8 sm:mt-12 py-6 sm:py-8 bg-card">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-4 sm:mb-6">
            <div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                Despre BookaStay{" "}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Platforma ta de încredere pentru rezervarea
                pensiunilor și cabanelor
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                Politici
              </h3>
              <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                <li>Check-in: 14:00</li>
                <li>Check-out: 11:00</li>
                <li>Anulare gratuită până la 48h înainte</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                Contact
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Email: contact@bookastay.ro
                <br />
                Telefon: +40 258 xxx xxx
                <br />
                Program: Luni - Duminică, 08:00 - 20:00
              </p>
            </div>
          </div>
          <div className="text-center text-xs sm:text-sm text-muted-foreground border-t pt-4 sm:pt-6">
            <p>
              © 2026 BookaStay. Conectăm pensiuni autentice din
              inima Apusenilor
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}