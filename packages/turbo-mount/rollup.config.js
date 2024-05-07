import typescript from "@rollup/plugin-typescript";
import {terser} from "rollup-plugin-terser";

const external = [
  "@hotwired/stimulus",
  "react",
  "react-dom/client",
  "vue",
]

export default [{
  input: "src/index.ts",
  output: [
    {
      name: "TurboMount",
      file: "dist/turbo-mount.umd.js",
      format: "umd",
      globals: {
        "react": "React",
        "react-dom/client": "ReactDOMClient",
        "@hotwired/stimulus": "Stimulus",
        "vue": "Vue"
      },
    },
    {
      file: "dist/turbo-mount.js",
      format: "es"
    }

  ],
  plugins: [
    typescript()
  ],
  external
},
  {
    input: "src/index.ts",
    output: {
      file: "dist/turbo-mount.min.js",
      format: "es",
      sourcemap: true
    },
    plugins: [
      typescript(),
      terser({
        mangle: true,
        compress: true
      })
    ],
    external
  }
];
