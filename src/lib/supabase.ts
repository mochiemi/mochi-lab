import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qexppbbnyaupjwfgbeli.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFleHBwYmJueWF1cGp3ZmdiZWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MzY4ODksImV4cCI6MjA3ODExMjg4OX0.shf8ymoUVLJY-c3-pWjMQ8Y7etNFh0dv9EQX5BzN3cw'

export const supabase = createClient(supabaseUrl, supabaseKey)