import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Mail, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import type { User } from "@/app/types";

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

interface InvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostelId: string;
  hostelName: string;
  accessToken: string;
  onSuccess: (userId?: string) => void;
}

export function InvitationDialog({ open, onOpenChange, hostelId, hostelName, accessToken, onSuccess }: InvitationDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [assigningUser, setAssigningUser] = useState(false);

  // Load users from API
  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      console.log('DEMO: Loading demo users...');
      
      // Simulează API delay
      await new Promise((r) => setTimeout(r, 600));
      
      // Folosește DEMO_USERS în loc de API call
      const availableUsers = DEMO_USERS.filter(
        (u: any) => u.role === "user" || (u.role === "hostel-admin" && u.id === "U002")
      );
      
      console.log('✅ DEMO: Users loaded:', availableUsers.length);
      setUsers(availableUsers);
    } catch (error) {
      console.error('DEMO: Failed to load users:', error);
      toast.error('Eroare la încărcarea utilizatorilor (DEMO)');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSendInvitation = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Te rugăm să introduci o adresă de email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast.error("Te rugăm să introduci o adresă de email validă");
      return;
    }

    setLoading(true);

    try {
      console.log("DEMO: Sending invitation", {
        email: inviteEmail.trim(),
        hostelId,
        hostelName,
      });

      // Simulează request
      await new Promise((r) => setTimeout(r, 800));

      toast.success(`Invitație trimisă cu succes către ${inviteEmail}! (DEMO)`);
      setInviteEmail("");
      setInviteName("");
      onOpenChange(false);
    } catch (error: any) {
      console.error("DEMO: Send invitation error:", error);
      toast.error(error.message || "DEMO: Eroare la trimiterea invitației");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignUser = async () => {
    if (!selectedUserId) {
      toast.error('Selectează un utilizator');
      return;
    }

    console.log('DEMO: Assign user - Start', { selectedUserId, hostelId });
    setAssigningUser(true);

    try {
      // DEMO MODE - No API call, just simulate success
      await new Promise((r) => setTimeout(r, 800)); // Simulate delay
      
      console.log('✅ DEMO: User assigned successfully (local only)');
      
      toast.success('Administrator atribuit cu succes! (DEMO)');
      
      // Call onSuccess to refresh hostels locally
      onSuccess(selectedUserId);
      onOpenChange(false);
      setSelectedUserId('');
    } catch (error) {
      console.error('DEMO: Assign user error:', error);
      toast.error('Eroare la atribuirea administratorului (DEMO)');
    } finally {
      setAssigningUser(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Atribuie Administrator</DialogTitle>
          <DialogDescription>
            Alege un utilizator existent sau trimite o invitație pentru <strong>{hostelName}</strong>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">
              <Users className="size-4 mr-2" />
              Utilizator Existent
            </TabsTrigger>
            <TabsTrigger value="invite">
              <Mail className="size-4 mr-2" />
              Trimite Invitație
            </TabsTrigger>
          </TabsList>

          {/* Existing User Tab */}
          <TabsContent value="existing" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-select">Selectează Utilizator</Label>
              {loadingUsers ? (
                <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Se încarcă utilizatorii...
                </div>
              ) : users.length === 0 ? (
                <div className="text-sm text-muted-foreground p-4 border rounded-lg text-center">
                  Nu există utilizatori disponibili. Toți utilizatorii au deja pensiuni atribuite.
                </div>
              ) : (
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger id="user-select">
                    <SelectValue placeholder="Alege un utilizator..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <p className="text-xs text-muted-foreground">
                Utilizatorul selectat va deveni imediat administrator al acestei pensiuni.
              </p>
            </div>

            <div className="bg-muted p-3 rounded-lg text-sm space-y-2">
              <p className="font-semibold">Atribuire Directă:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Utilizatorul devine admin instant</li>
                <li>Nu necesită acceptare</li>
                <li>Schimbările apar după reautentificare</li>
              </ul>
            </div>

            <Button
              onClick={handleAssignUser}
              disabled={assigningUser || !selectedUserId || loadingUsers}
              className="w-full"
            >
              {assigningUser ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Se atribuie...
                </>
              ) : (
                "Atribuie Administrator"
              )}
            </Button>
          </TabsContent>

          {/* Invitation Tab */}
          <TabsContent value="invite" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Administrator</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Persoana invitată va primi acces după autentificare și acceptare.
              </p>
            </div>

            <div className="bg-muted p-3 rounded-lg text-sm space-y-2">
              <p className="font-semibold">Despre invitații:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Invitația este valabilă 7 zile</li>
                <li>Destinatarul trebuie să fie autentificat</li>
                <li>Necesită acceptare pentru a deveni admin</li>
                <li>Perfect pentru utilizatori noi</li>
              </ul>
            </div>

            <Button onClick={handleSendInvitation} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Se trimite...
                </>
              ) : (
                "Trimite Invitație"
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}