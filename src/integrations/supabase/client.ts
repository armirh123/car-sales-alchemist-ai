
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ptikyjafmjdsxeaazdbl.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aWt5amFmbWpkc3hlYWF6ZGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDcwMzEsImV4cCI6MjA2NDYyMzAzMX0.DkJ-DqV4XHStPjyO9EfXeiFWrpGMLgzqxLu0VUjb-P4"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})
