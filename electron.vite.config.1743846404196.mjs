// electron.vite.config.mjs
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import path from 'path'
import react from '@vitejs/plugin-react'
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    esbuild: {
      loader: 'jsx',
      include: /src\/renderer\/src\/.*\.js$/
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // This tells Sass to look in node_modules too
        includePaths: [path.resolve(__dirname, 'node_modules')]
      }
    }
  }
})
export { electron_vite_config_default as default }
