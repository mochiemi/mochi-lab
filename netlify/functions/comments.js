// netlify/functions/comments.js
import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase (substitua com seus dados)
const supabaseUrl = 'https://qexppbbnyaupjwfgbeli.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFleHBwYmJueWF1cGp3ZmdiZWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MzY4ODksImV4cCI6MjA3ODExMjg4OX0.shf8ymoUVLJY-c3-pWjMQ8Y7etNFh0dv9EQX5BzN3cw eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFleHBwYmJueWF1cGp3ZmdiZWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MzY4ODksImV4cCI6MjA3ODExMjg4OX0.shf8ymoUVLJY-c3-pWjMQ8Y7etNFh0dv9EQX5BzN3cw'

const supabase = createClient(supabaseUrl, supabaseKey)

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    }
  }

  try {
    // GET - Buscar comentários
    if (event.httpMethod === 'GET') {
      const postId = event.queryStringParameters?.postId
      
      if (!postId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'postId é obrigatório' })
        }
      }

      // Buscar comentários principais (sem parent_id)
      const { data: comments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .is('parent_id', null)
        .eq('is_approved', true)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Para cada comentário, buscar suas respostas
      const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
        const { data: replies } = await supabase
          .from('comments')
          .select('*')
          .eq('parent_id', comment.id)
          .eq('is_approved', true)
          .order('created_at', { ascending: true })

        return {
          ...comment,
          replies: replies || []
        }
      }))

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          comments: commentsWithReplies || [] 
        })
      }
    }

    // POST - Criar novo comentário
    if (event.httpMethod === 'POST') {
      // Verificar se há body
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
          body: JSON.stringify({ error: 'JSON inválido' })
        }
      }
      
      // Validações básicas
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

      // Sanitização básica
      const sanitize = (str) => {
        if (!str) return ''
        return str
          .replace(/[<>]/g, '')
          .trim()
          .substring(0, 4000)
      }

      // Inserir no banco
      const { data: comment, error } = await supabase
        .from('comments')
        .insert([{
          post_id: data.postId,
          parent_id: data.parentId || null,
          author_name: sanitize(data.authorName).substring(0, 100),
          author_email: data.authorEmail.trim().toLowerCase(),
          author_url: data.authorUrl ? sanitize(data.authorUrl).substring(0, 500) : null,
          content: sanitize(data.content),
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

    // Método não permitido
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método não permitido' })
    }

  } catch (error) {
    console.error('Erro na função:', error)
    
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