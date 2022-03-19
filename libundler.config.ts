import { defineConfig } from '@surmon-china/libundler'

export default defineConfig({
  libName: '',
  entry: 'src/netease.ts',
  outFileName: 'netease',
  targets: ['esm', 'cjs']
})
