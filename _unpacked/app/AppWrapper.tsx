import { AuthProvider } from "@/app/contexts/auth-context";
import AppContent from "@/app/AppContent";

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
