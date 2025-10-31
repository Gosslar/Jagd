import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface AdminStatus {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isShopUser: boolean;
  isApproved: boolean;
  userType: string;
  roles: string[];
  loading: boolean;
}

export const useAdminStatus = (): AdminStatus => {
  const { user, loading: authLoading } = useAuth();
  const [adminStatus, setAdminStatus] = useState<AdminStatus>({
    isAdmin: false,
    isSuperAdmin: false,
    isShopUser: false,
    isApproved: false,
    userType: 'guest',
    roles: [],
    loading: true,
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authLoading) return;
      
      if (!user) {
        setAdminStatus({
          isAdmin: false,
          isSuperAdmin: false,
          isShopUser: false,
          isApproved: false,
          userType: 'guest',
          roles: [],
          loading: false,
        });
        return;
      }

      try {
        console.log('Checking admin status for user:', user.id, user.email);
        
        // Einfachste Lösung: Rolle direkt aus dem Profil laden
        const { data: profile, error: profileError } = await supabase
          .from('benutzer_profile_2025_10_31_11_00')
          .select('freigabe_status, benutzer_typ, aktiv, rolle')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.warn('Profil nicht verfügbar:', profileError);
          throw profileError;
        }

        console.log('Profil mit Rolle geladen:', profile);

        // Fallback für jagd@soliso.de
        if (user.email === 'jagd@soliso.de' && (!profile || !profile.rolle)) {
          console.log('Spezielle Behandlung für jagd@soliso.de - setze Super-Admin');
          const finalStatus = {
            isAdmin: true,
            isSuperAdmin: true,
            isShopUser: false,
            isApproved: true,
            userType: 'super_admin',
            roles: ['super_admin'],
            loading: false,
          };
          setAdminStatus(finalStatus);
          return;
        }

        if (!profile) {
          throw new Error('Kein Profil gefunden');
        }

        // Bestimme Admin-Status basierend auf der Rolle im Profil
        const userRole = profile.rolle || 'shop_user';
        const isSuperAdmin = userRole === 'super_admin';
        const isAdmin = userRole === 'admin' || isSuperAdmin;
        const isShopUser = userRole === 'shop_user';
        const isApproved = profile.freigabe_status === 'freigegeben' && profile.aktiv !== false;

        // Bestimme Benutzertyp
        let userType = 'guest';
        if (isSuperAdmin) {
          userType = 'super_admin';
        } else if (isAdmin) {
          userType = 'admin';
        } else if (isShopUser && isApproved) {
          userType = 'shop_user';
        } else if (profile.freigabe_status === 'wartend') {
          userType = 'pending';
        } else if (profile.freigabe_status === 'abgelehnt') {
          userType = 'rejected';
        } else if (profile.freigabe_status === 'gesperrt') {
          userType = 'blocked';
        }

        const finalStatus = {
          isAdmin,
          isSuperAdmin,
          isShopUser: isShopUser && isApproved,
          isApproved,
          userType,
          roles: [userRole],
          loading: false,
        };
        
        console.log('Final admin status:', finalStatus);
        setAdminStatus(finalStatus);

      } catch (error) {
        console.error('Fehler beim Prüfen des Admin-Status:', error);
        setAdminStatus({
          isAdmin: false,
          isSuperAdmin: false,
          isShopUser: false,
          isApproved: false,
          userType: 'error',
          roles: [],
          loading: false,
        });
      }
    };

    checkAdminStatus();
  }, [user, authLoading]);

  return adminStatus;
};