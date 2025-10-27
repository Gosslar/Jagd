import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface AdminStatus {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isBenutzerAdmin: boolean;
  isLagerAdmin: boolean;
  loading: boolean;
}

export const useAdminStatus = (): AdminStatus => {
  const { user } = useAuth();
  const [adminStatus, setAdminStatus] = useState<AdminStatus>({
    isAdmin: false,
    isSuperAdmin: false,
    isBenutzerAdmin: false,
    isLagerAdmin: false,
    loading: true,
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setAdminStatus({
          isAdmin: false,
          isSuperAdmin: false,
          isBenutzerAdmin: false,
          isLagerAdmin: false,
          loading: false,
        });
        return;
      }

      try {
        // Prüfe Admin-Rollen
        const { data: roles, error } = await supabase
          .from('admin_rollen_2025_10_25_19_00')
          .select('rolle')
          .eq('user_id', user.id);

        if (error) {
          console.error('Fehler beim Laden der Admin-Rollen:', error);
          // Bei Fehler: Benutzer ist kein Admin
          setAdminStatus({
            isAdmin: false,
            isSuperAdmin: false,
            isBenutzerAdmin: false,
            isLagerAdmin: false,
            loading: false,
          });
          return;
        }

        const roleNames = roles?.map(r => r.rolle) || [];
        const isSuperAdmin = roleNames.includes('super_admin');
        const isBenutzerAdmin = roleNames.includes('benutzer_admin');
        const isLagerAdmin = roleNames.includes('lager_admin');
        const isAdmin = roleNames.length > 0;

        setAdminStatus({
          isAdmin,
          isSuperAdmin,
          isBenutzerAdmin,
          isLagerAdmin,
          loading: false,
        });

      } catch (error) {
        console.error('Fehler beim Prüfen der Admin-Berechtigung:', error);
        // Bei Fehler: Benutzer ist kein Admin
        setAdminStatus({
          isAdmin: false,
          isSuperAdmin: false,
          isBenutzerAdmin: false,
          isLagerAdmin: false,
          loading: false,
        });
      }
    };

    checkAdminStatus();
  }, [user]);

  return adminStatus;
};