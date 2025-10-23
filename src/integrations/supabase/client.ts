import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://whqbrtrbzulmifmrzchu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocWJydHJienVsbWlmbXJ6Y2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTQ4ODYsImV4cCI6MjA3NjU3MDg4Nn0.o34zBENNSVEM-atUKzPf0j7LXkaLCdvRgZt98aE2H00'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
