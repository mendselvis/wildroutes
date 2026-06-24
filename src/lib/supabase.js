import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dramlcryttixceczbfdp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyYW1sY3J5dHRpeGNlY3piZmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNjAxNzcsImV4cCI6MjA5NzgzNjE3N30.kAkJoiNnxVN_KbDpf7fUxseNzZkGejKdQ6s4knNfIIs'

export const supabase = createClient(supabaseUrl, supabaseKey)