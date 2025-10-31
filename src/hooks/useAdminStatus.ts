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
        console.log('Checking admin status for user:', user.id, user.email);
        
        // Versuche die neue einfache Tabelle zuerst
        let roles: UserRole[] = [];
        let profile: UserProfile | null = null;
        
        try {
          // Lade Benutzerrollen aus einfacher Tabelle (ohne Constraints)
          const { data: simpleRoles, error: simpleRolesError } = await supabase
            .from('simple_user_roles_2025_10_31_12_00')
            .select('role')
            .eq('user_id', user.id);

          if (simpleRolesError) {
            console.warn('Einfache Rollen-Tabelle nicht verfügbar:', simpleRolesError);
          } else {
            roles = (simpleRoles || []).map(r => ({ rolle: r.role, aktiv: true }));
            console.log('Rollen aus einfacher Tabelle geladen:', roles);
          }

          // Lade Benutzerprofil
          const { data: newProfile, error: newProfileError } = await supabase
            .from('benutzer_profile_2025_10_31_11_00')
            .select('freigabe_status, benutzer_typ, aktiv')
            .eq('user_id', user.id)
            .single();

          if (newProfileError && newProfileError.code !== 'PGRST116') {
            console.warn('Profil nicht verfügbar:', newProfileError);
          } else {
            profile = newProfile;
            console.log('Profil geladen:', profile);
          }
        } catch (newTableError) {
          console.warn('Neue Tabellen nicht verfügbar, versuche alte Tabellen:', newTableError);
        }
        
        // Fallback zu alten Tabellen wenn neue nicht funktionieren
        if (roles.length === 0 && !profile) {
          console.log('Versuche alte Tabellen als Fallback...');
          
          try {
            // Versuche alte Rollen-Tabelle
            const { data: oldRoles, error: oldRolesError } = await supabase
              .from('admin_rollen_2025_10_25_19_00')
              .select('rolle')
              .eq('user_id', user.id);

            if (!oldRolesError && oldRoles) {
              roles = oldRoles.map(r => ({ rolle: r.rolle === 'super_admin' ? 'super_admin' : 'admin', aktiv: true }));
              console.log('Rollen aus alter Tabelle geladen:', roles);
            }

            // Versuche altes Profil
            const { data: oldProfile, error: oldProfileError } = await supabase
              .from('user_profiles_2025_10_25_19_00')
              .select('freigabe_status')
              .eq('user_id', user.id)
              .single();

            if (!oldProfileError && oldProfile) {
              profile = {
                freigabe_status: oldProfile.freigabe_status,
                benutzer_typ: 'admin',
                aktiv: true
              };
              console.log('Profil aus alter Tabelle geladen:', profile);
            }
          } catch (oldTableError) {
            console.warn('Auch alte Tabellen nicht verfügbar:', oldTableError);
          }
        }
        
        // Spezielle Behandlung für jagd@soliso.de
        if (user.email === 'jagd@soliso.de' && roles.length === 0) {
          console.log('Spezielle Behandlung für jagd@soliso.de - setze Super-Admin');
          roles = [{ rolle: 'super_admin', aktiv: true }, { rolle: 'admin', aktiv: true }];
          profile = {
            freigabe_status: 'freigegeben',
            benutzer_typ: 'admin',
            aktiv: true
          };
        }

        console.log('Final roles:', roles);
        console.log('Final profile:', profile);

        // Bestimme Admin-Status
        const isSuperAdmin = roles.some(r => r.rolle === 'super_admin' && r.aktiv);
        const isAdmin = roles.some(r => r.rolle === 'admin' && r.aktiv) || isSuperAdmin;
        const isShopUser = roles.some(r => r.rolle === 'shop_user' && r.aktiv);
        const isApproved = profile?.freigabe_status === 'freigegeben' && profile?.aktiv !== false;

        // Bestimme Benutzertyp
        let userType = 'guest';
        if (profile) {
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
        }

        const finalStatus = {
          isAdmin,
          isSuperAdmin,
          isShopUser: isShopUser && isApproved,
          isApproved,
          userType,
          roles: roles.map(r => r.rolle),
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