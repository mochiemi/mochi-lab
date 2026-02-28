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
      },
      // {
      //   path: '/articles',
      //   labelKey: 'nav.articles',
      //   icon: 'fa-regular-paper-plane'
      // },
      //       {
      //   path: '/medicines',
      //   labelKey: 'nav.medicines',
      //   icon: 'fa-regular-paper-plane'
      // }
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
      },
            // {
      //   path: '/drug-interactions',
      //   labelKey: 'nav.drugInteractions',
      //   icon: 'fa-regular-paper-plane'
      // },
      //       {
      //   path: '/calculators,
      //   labelKey: 'nav.calculators',
      //   icon: 'fa-regular-paper-plane'
      // }
    ]
  }
]