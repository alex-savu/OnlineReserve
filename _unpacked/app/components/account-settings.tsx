import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Separator } from "@/app/components/ui/separator";
import { User, Mail, Phone, Lock, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/contexts/auth-context";

export function AccountSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Profil actualizat cu succes!");
    } catch (error: any) {
      toast.error(error.message || "Eroare la salvarea profilului");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Parolele nu coincid!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Parola trebuie să aibă minim 6 caractere!");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Parolă schimbată cu succes!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Eroare la schimbarea parolei");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Informații Profil</CardTitle>
          <CardDescription>
            Actualizează informațiile tale personale
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="size-20">
              <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || ""} />
              <AvatarFallback className="text-lg">
                {user?.displayName ? getInitials(user.displayName) : <User className="size-8" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{user?.displayName || "Utilizator"}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <Separator />

          {/* Profile Form */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <User className="inline size-4 mr-1" />
                  Nume complet
                </Label>
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nume Prenume"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="inline size-4 mr-1" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exempluu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="inline size-4 mr-1" />
                Telefon
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+40 712 345 678"
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Se salvează...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  Salvează modificările
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Schimbă Parola</CardTitle>
          <CardDescription>
            Actualizează-ți parola pentru a-ți proteja contul
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">
                <Lock className="inline size-4 mr-1" />
                Parola curentă
              </Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">Parolă nouă</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmă parola</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading || !currentPassword || !newPassword}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Se schimbă...
                </>
              ) : (
                <>
                  <Lock className="mr-2 size-4" />
                  Schimbă parola
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Informații Cont</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Metodă autentificare:</span>
            <span className="font-medium">{user?.provider || "Email"}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cont creat:</span>
            <span className="font-medium">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("ro-RO", {
                day: "numeric",
                month: "long",
                year: "numeric"
              }) : "N/A"}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Ultima autentificare:</span>
            <span className="font-medium">
              {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString("ro-RO", {
                day: "numeric",
                month: "long",
                year: "numeric"
              }) : "N/A"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
