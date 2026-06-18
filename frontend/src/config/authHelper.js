import { supabase } from "../lib/supabaseClient";

export const getToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
};
