// netlify/functions/comments.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL 
const supabaseKey = process.env.SUPABASE_ANON_KEY 

const supabase = createClient(supabaseUrl, supabaseKey)

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers }
  }

  try {
    if (event.httpMethod === 'GET') {
      const postId = event.queryStringParameters?.postId
      
      if (!postId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'postId é obrigatório' })
        }
      }

      const { data: comments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .is('parent_id', null)
        .eq('is_approved', true)
        .order('created_at', { ascending: true })

      if (error) throw error

      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const { data: replies, error: repliesError } = await supabase
            .from('comments')
            .select('*')
            .eq('parent_id', comment.id)
            .eq('is_approved', true)
            .order('created_at', { ascending: true })

          if (repliesError) throw repliesError

          return { ...comment, replies: replies || [] }
        })
      )

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          comments: commentsWithReplies 
        })
      }
    }

    if (event.httpMethod === 'POST') {
      if (!event.body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Body não fornecido' })
        }
      }

      let data
      try {
        data = JSON.parse(event.body)
      } catch (e) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'JSON inválido no body' })
        }
      }
      
      const errors = {}
      
      if (!data.authorName?.trim()) {
        errors.authorName = 'Nome é obrigatório'
      }
      
      if (!data.authorEmail?.trim()) {
        errors.authorEmail = 'Email é obrigatório'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.authorEmail)) {
        errors.authorEmail = 'Email inválido'
      }
      
      if (!data.content?.trim()) {
        errors.content = 'Comentário é obrigatório'
      } else if (data.content.length > 4000) {
        errors.content = 'Comentário muito longo (máx 4000 caracteres)'
      }
      
      if (Object.keys(errors).length > 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ errors })
        }
      }

      const sanitize = (str) => {
        if (!str) return ''
        return str.replace(/[<>]/g, '').trim()
      }

      const { data: comment, error } = await supabase
        .from('comments')
        .insert([{
          post_id: data.postId,
          parent_id: data.parentId || null,
          author_name: sanitize(data.authorName).substring(0, 100),
          author_email: data.authorEmail.trim().toLowerCase(),
          author_url: data.authorUrl ? sanitize(data.authorUrl).substring(0, 500) : null,
          content: sanitize(data.content).substring(0, 4000),
          is_approved: false
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro Supabase:', error)
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            error: 'Erro ao salvar comentário',
            details: error.message 
          })
        }
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ 
          success: true,
          message: 'Comentário enviado para moderação',
          comment
        })
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método não permitido' })
    }

  } catch (error) {
    console.error('Erro na function:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erro interno do servidor',
        message: error.message 
      })
    }
  }
}