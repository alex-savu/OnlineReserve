export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  beds: string;
  price: number;
  image: string;
  amenities: string[];
  available: boolean;
  description: string;
}

export interface Hostel {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  images: string[]; // Changed from image to images array
  rating: number;
  reviews: number;
  description: string;
  amenities: string[];
  rooms: Room[];
  featured?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  adminId?: string; // Admin assigned to this hostel
}

export interface BookingData {
  id: string;
  hostelId: string;
  hostelName: string;
  roomId: string;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  totalPrice: number;
  status: "confirmed" | "cancelled";
  createdAt: Date;
}

export type UserRole = "admin" | "hostel-admin" | "user";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  assignedHostelId?: string; // For hostel-admin role
  createdAt: Date;
}

export interface Feedback {
  id: string;
  hostelId: string;
  hostelName: string;
  adminId: string;
  adminName: string;
  message: string;
  type: "issue" | "suggestion" | "info";
  status: "new" | "reviewed" | "resolved";
  createdAt: Date;
}

export interface HostelStats {
  hostelId: string;
  hostelName: string;
  totalBookings: number;
  activeBookings: number;
  cancelledBookings: number;
  revenue: number;
  occupancyRate: number;
  averageStay: number;
}

export interface Invitation {
  id: string;
  email: string;
  hostelId: string;
  hostelName: string;
  invitedBy: string;
  invitedByName: string;
  status: "pending" | "accepted" | "rejected" | "expired";
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
  rejectedAt?: string;
}