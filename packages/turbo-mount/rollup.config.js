import * as path from "node:path";
import * as fs from "node:fs";
import alias from '@rollup/plugin-alias';
import typescript from "@rollup/plugin-typescript";
import {terser} from "rollup-plugin-terser";

const external = [
  "@hotwired/stimulus",
  "react",
  "react-dom/client",
  "vue",
  "turbo-mount",
  "stimulus-vite-helpers"
]

const plugins = [
  typescript(),
  alias({
    entries: [
      {find: 'turbo-mount', replacement: './index'}
    ]
  }),
]

const pluginsPath = path.resolve(__dirname, 'src', 'plugins');
const entrypoints = fs.readdirSync(pluginsPath).map(plugin => {
  const input = path.join(pluginsPath, plugin, 'index.ts');
  const output = path.join('dist', 'plugins', `${plugin}.js`);
  return {input, output}
});

entrypoints.unshift({
  input: path.join("src", "index.ts"),
  output: path.join("dist", "turbo-mount.js")
},{
  input: path.join("src", "vite.ts"),
  output: path.join("dist", "vite.js")
})

const config = entrypoints.flatMap(({input, output}) => (
  [
    {
      input,
      output: {
        file: output,
        format: "es"
      },
      plugins,
      external
    },
    {
      input,
      output: {
        file: output.replace(/\.js$/, '.min.js'),
        format: "es",
        sourcemap: true
      },
      plugins: [
        ...plugins,
        terser({
          mangle: true,
          compress: true
        })
      ],
      external
    }
  ]
));

export default config
