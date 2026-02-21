import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const window = new JSDOM('').window
const purify = DOMPurify(window)

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const sanitizeContent = (content) => {
  return purify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target']
  })
}

export const validateComment = (comment) => {
  const errors = {}

  if (!comment.authorName?.trim()) {
    errors.authorName = 'Name is required'
  }

  if (!comment.authorEmail?.trim()) {
    errors.authorEmail = 'Email is required'
  } else if (!validateEmail(comment.authorEmail)) {
    errors.authorEmail = 'Invalid email'
  }

  if (!comment.content?.trim()) {
    errors.content = 'Comment is required'
  } else if (comment.content.length > 4000) {
    errors.content = 'Comment is too long'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      ...comment,
      authorName: comment.authorName?.trim(),
      authorEmail: comment.authorEmail?.trim(),
      authorUrl: comment.authorUrl?.trim(),
      content: sanitizeContent(comment.content)
    }
  }
}