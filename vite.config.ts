import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import packageJSON from './package.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: 'chunk-analysis.html',
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          primeui: ['primevue', '@primeuix/themes'],
          ui: ['wavesurfer.js', 'vue-draggable-plus'],
          vue: ['vue', 'pinia'],
          nlp: ['compromise', 'compromise-speech', 'compromise-syllables'],
          lodash: ['lodash-es'],
          codemirror: [
            'codemirror',
            '@codemirror/commands',
            '@codemirror/search',
            '@codemirror/state',
            '@codemirror/view',
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __VERSION__: JSON.stringify(packageJSON.version),
  },
})
