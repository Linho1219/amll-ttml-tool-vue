import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import App from './App.vue'
import { definePreset } from '@primeuix/themes'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
  theme: {
    preset: definePreset(Aura, {
      semantic: {
        colorScheme: {
          light: {
            content: {
              background: '{surface.50}',
            },
          },
        },
      },
    }),
  },
})

app.mount('#app')
