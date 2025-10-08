import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bvnjjryxduiycahtbmdf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2bmpqcnl4ZHVpeWNhaHRibWRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4OTMyMDYsImV4cCI6MjA3NTQ2OTIwNn0.TVjIYr4u46yQaMh0EGET3zfO2Qu_a4bx8fhWwelOfn4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);