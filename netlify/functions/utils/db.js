import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY // Usar service key para admin

export const supabase = createClient(supabaseUrl, supabaseKey)

// Funções auxiliares
export const getCommentsByPost = async (postId, includeUnapproved = false) => {
  let query = supabase
    .from('comments')
    .select(`
      *,
      replies:comments!parent_id(*)
    `)
    .eq('post_id', postId)
    .is('parent_id', null)
    .order('created_at', { ascending: true })

  if (!includeUnapproved) {
    query = query.eq('is_approved', true)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export const createComment = async (commentData) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([{
      ...commentData,
      is_approved: false // Todos começam não aprovados
    }])
    .select()
    .single()

  if (error) throw error
  return data
}