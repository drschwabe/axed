import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'lib.js',
  output: {
    file: 'dist/lib.mjs',
    format: 'es'
  },
  plugins: [
    commonjs(), 
  ]
}
