import typescript from 'rollup-plugin-typescript';
import replace from 'rollup-plugin-replace';


const name = 'Vue.components'
const generateVueFilepath = name => `./src/vue/${name}/example/`
export default {
  input: generateVueFilepath(name) + 'index.ts',
  output: {
    file: generateVueFilepath(name) + 'index.js',
    format: 'iife'
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    typescript({
      exclude: "node_modules/**",
      typescript: require("typescript")
    })
  ]
}