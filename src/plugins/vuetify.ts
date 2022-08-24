import 'vuetify/styles'
import '~/styles/variables.scss'

import type { ThemeDefinition } from 'vuetify'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const myCustomLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    'background': '#FFFFFF',
    'surface': '#FFFFFF',
    'primary': '#eff2be',
    'primary-darken-1': '#303123',
    'secondary': '#0e4830',
    'secondary-darken-1': '#061b0d',
    'error': '#B00020',
    'info': '#2196F3',
    'success': '#4CAF50',
    'warning': '#FB8C00',
  },
}

export default createVuetify({
  components,
  directives,
  defaults: {
    global: {
      ripple: false,
    },
  },
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    },
  },
})

