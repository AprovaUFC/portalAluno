import { createClient } from "@supabase/supabase-js";

export const supabase = createClient("https://cykmpzlfssdpbchxrult.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5a21wemxmc3NkcGJjaHhydWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMDU2NDUsImV4cCI6MjA1MDg4MTY0NX0.OspTdq5RA78Vc5I5WZ3QlFagD8oR5oWBSA8xnOCUo6o");