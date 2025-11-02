export const navigationConfig = [
  {
    id: 'home',
    labelKey: 'nav.home',
    items: [
      {
        path: '/',
        labelKey: 'nav.home',
        icon: 'hi-home'
      },
      {
        path: '/blog',
        labelKey: 'nav.blog',
        icon: 'oi-pencil'
      }
    ]
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
        path: '/projects',
        labelKey: 'nav.projects',
        icon: 'hi-light-bulb'
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
        path: '/components',
        labelKey: 'nav.components',
        icon: 'md-settingssuggest-outlined'
      },
      {
        path: '/icons',
        labelKey: 'nav.icons',
        icon: 'oi-star'
      }
    ]
  },
  {
    id: 'more',
    labelKey: 'nav.more',
    items: [
      {
        path: '/poke-forms',
        labelKey: 'nav.pokeform',
        icon: 'md-catchingpokemon-twotone'
      },
      {
        path: '/i-list',
        labelKey: 'nav.iList',
        icon: 'bi-card-checklist'
      }
    ]
  }
]