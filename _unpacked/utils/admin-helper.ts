import { projectId, publicAnonKey } from "/utils/supabase/info";

/**
 * Helper function to promote a user to admin role
 * Usage from browser console:
 * 
 * import { promoteToAdmin } from '/src/utils/admin-helper.ts'
 * await promoteToAdmin('user@example.com', 'admin')
 */
export async function promoteToAdmin(email: string, role: 'admin' | 'hostel-admin' | 'user' = 'admin') {
  try {
    // Get current access token from localStorage
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('Nu ești autentificat. Te rugăm să te autentifici mai întâi.');
    }

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c7f3f823/admin/promote`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ email, role }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Eroare la promovarea utilizatorului');
    }

    console.log(`✅ Succes! Utilizatorul ${email} a fost promovat la rolul: ${role}`);
    console.log('🔄 Te rugăm să te deconectezi și să te autentifici din nou pentru a vedea modificările.');
    
    return data;
  } catch (error) {
    console.error('❌ Eroare:', error);
    throw error;
  }
}

/**
 * Helper function to set flag for next user to become hostel-admin
 * Usage from browser console:
 * 
 * setNextUserAsHostelAdmin()  // Default: P001 (Grozav Home)
 * setNextUserAsHostelAdmin('P002')  // For specific hostel
 */
export async function setNextUserAsHostelAdmin(hostelId: string = 'P001') {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c7f3f823/admin/set-next-hostel-admin`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hostelId }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Eroare la setarea flag-ului');
    }

    console.log(`✅ ${data.message}`);
    console.log(`🎯 Următorul utilizator care se va înregistra va deveni automat hostel-admin pentru pensiunea: ${hostelId}`);
    
    return data;
  } catch (error) {
    console.error('❌ Eroare:', error);
    throw error;
  }
}

// Make it available globally for easy access in console
if (typeof window !== 'undefined') {
  (window as any).promoteToAdmin = promoteToAdmin;
  (window as any).setNextUserAsHostelAdmin = setNextUserAsHostelAdmin;
}