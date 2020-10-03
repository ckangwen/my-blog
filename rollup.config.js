import typescript from 'rollup-plugin-typescript';
import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  input: './src/vue-router/example.ts',
  output: {
    file: './src/vue-router/example.js',
    format: 'iife'
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    typescript({
      exclude: "node_modules/**",
      typescript: require("typescript")
    }),
    nodeResolve()
  ]
}
// const name = 'render-component-with-props'
// const generateVueFilepath = name => `./src/vue/${name}/example/`
// export default {
//   input: generateVueFilepath(name) + 'index.ts',
//   output: {
//     file: generateVueFilepath(name) + 'index.js',
//     format: 'iife'
//   },
//   plugins: [
//     replace({
//       'process.env.NODE_ENV': JSON.stringify('development')
//     }),
//     typescript({
//       exclude: "node_modules/**",
//       typescript: require("typescript")
//     })
//   ]
// }