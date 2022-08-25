import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

export default {
  input: 'lib.js',
  output: {
    file: 'dist/lib.mjs',
    format: 'esm',
  },
  plugins: [
    commonjs({
      transformMixedEsModules : true,
      esmExternals : true 
    }), 
    resolve(), json()]
}
