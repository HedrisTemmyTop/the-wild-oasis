import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.SUPABASE_URL || "https://ozmavzxnpughpcrqwsfa.supabase.co",
  process.env.SUPABASE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96bWF2enhucHVnaHBjcnF3c2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1NTg2MzMsImV4cCI6MjA0NDEzNDYzM30.BO-Jxw2vHWm3qXn9C8CFqaveaeR_qK1FsytRdWS3Tms"
);

export default supabase;
