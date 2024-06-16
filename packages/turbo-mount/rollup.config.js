import * as path from "node:path";
import * as fs from "node:fs";
import alias from '@rollup/plugin-alias';
import typescript from "@rollup/plugin-typescript";
import {terser} from "rollup-plugin-terser";

const pluginsPath = path.resolve(__dirname, 'src', 'plugins');

const external = [
  "@hotwired/stimulus",
  "react",
  "react-dom/client",
  "vue",
  "turbo-mount",
  "turbo-mount/registerComponents",
  "stimulus-vite-helpers",
  ...fs.readdirSync(pluginsPath).map(plugin => `turbo-mount/${plugin}`)
]

const plugins = [
  typescript(),
  alias({
    entries: [
      {find: 'turbo-mount', replacement: './index'}
    ]
  }),
]

const entrypoints = fs.readdirSync(pluginsPath).flatMap(plugin => {
  return [
    {
      input: path.join(pluginsPath, plugin, 'index.ts'),
      output: path.join('dist', 'plugins', `${plugin}.js`)
    },
    {
      input: path.join(pluginsPath, plugin, 'registerComponents.ts'),
      output: path.join('dist', 'registerComponents', `${plugin}.js`)
    }
  ]
});

entrypoints.unshift({
  input: path.join("src", "index.ts"),
  output: path.join("dist", "turbo-mount.js")
}, {
  input: path.join("src", "registerComponents.ts"),
  output: path.join("dist", "registerComponents.js")
}, {
  input: path.join("src", "registerComponents/vite.ts"),
  output: path.join("dist", "registerComponents/vite.js")
}, {
  input: path.join("src", "registerComponents/esbuild.ts"),
  output: path.join("dist", "registerComponents/esbuild.js")
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
