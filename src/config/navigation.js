// config/navigation.js
export const navigationConfig = [
  {
    id: 'home',
    labelKey: 'nav.home',
    path: '/',
    isDirectLink: true 
  },
  {
    id: 'blog',
    labelKey: 'nav.blog',
    path: '/blog',
    icon: 'oi-pencil',
    isDirectLink: true 
  },
  {
    id: 'about',
    labelKey: 'nav.about',
    items: [
      {
        path: '/about',
        labelKey: 'nav.aboutThis',
        icon: 'gi-erlenmeyer'
      },
      {
        path: '/contact',
        labelKey: 'nav.contact',
        icon: 'fa-regular-paper-plane'
      }
    ]
  },
  {
    id: 'library',
    labelKey: 'nav.library',
    items: [
      {
        path: '/grade-horaria',
        labelKey: 'Grade Horária',
        icon: 'bi-calendar-heart'
      }
    ]
  },
  {
    id: 'tools',
    labelKey: 'nav.tools',
    items: [
      {
        path: '/i-list',
        labelKey: 'nav.iList',
        icon: 'bi-card-checklist'
      }
    ]
  }
]