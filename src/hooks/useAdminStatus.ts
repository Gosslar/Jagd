import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface UserRole {
  rolle: string;
  aktiv: boolean;
  beschreibung?: string;
}

interface UserProfile {
  freigabe_status: string;
  benutzer_typ: string;
  aktiv: boolean;
}

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
        // Lade Benutzerrollen
        const { data: roles, error: rolesError } = await supabase
          .from('benutzer_rollen_2025_10_31_11_00')
          .select('rolle, aktiv, beschreibung')
          .eq('user_id', user.id)
          .eq('aktiv', true);

        if (rolesError) {
          console.error('Fehler beim Laden der Rollen:', rolesError);
          throw rolesError;
        }

        // Lade Benutzerprofil
        const { data: profile, error: profileError } = await supabase
          .from('benutzer_profile_2025_10_31_11_00')
          .select('freigabe_status, benutzer_typ, aktiv')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Fehler beim Laden des Profils:', profileError);
          throw profileError;
        }

        const userRoles = (roles || []) as UserRole[];
        const userProfile = profile as UserProfile | null;

        // Bestimme Admin-Status
        const isSuperAdmin = userRoles.some(r => r.rolle === 'super_admin' && r.aktiv);
        const isAdmin = userRoles.some(r => r.rolle === 'admin' && r.aktiv) || isSuperAdmin;
        const isShopUser = userRoles.some(r => r.rolle === 'shop_user' && r.aktiv);
        const isApproved = userProfile?.freigabe_status === 'freigegeben' && userProfile?.aktiv !== false;

        // Bestimme Benutzertyp
        let userType = 'guest';
        if (userProfile) {
          if (isSuperAdmin) {
            userType = 'super_admin';
          } else if (isAdmin) {
            userType = 'admin';
          } else if (isShopUser && isApproved) {
            userType = 'shop_user';
          } else if (userProfile.freigabe_status === 'wartend') {
            userType = 'pending';
          } else if (userProfile.freigabe_status === 'abgelehnt') {
            userType = 'rejected';
          } else if (userProfile.freigabe_status === 'gesperrt') {
            userType = 'blocked';
          }
        }

        setAdminStatus({
          isAdmin,
          isSuperAdmin,
          isShopUser: isShopUser && isApproved,
          isApproved,
          userType,
          roles: userRoles.map(r => r.rolle),
          loading: false,
        });

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