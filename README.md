# vue-script-type-check

[![CI](https://github.com/kawamataryo/vue-script-type-check/actions/workflows/ci.yml/badge.svg)](https://github.com/kawamataryo/vue-script-type-check/actions/workflows/ci.yml)
<a href="https://npmcharts.com/compare/vue-script-type-check?minimal=true"><img src="https://img.shields.io/npm/dt/vue-script-type-check.svg" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/vue-script-type-check"><img src="https://img.shields.io/npm/v/vue-script-type-check.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/vue-script-type-check"><img src="https://img.shields.io/npm/l/vue-script-type-check.svg" alt="License"></a>
<a href="https://github.com/kawamataryo/vue-script-type-check" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/kawamataryo/vue-script-type-check?style=social"></a>

command line Type-Checking tool for only the script part of Vue

https://user-images.githubusercontent.com/11070996/175428327-a67f970a-46d4-4de1-8317-77b68a4670e5.mp4

## 🚀 Usage

Run the script in the directory where `tsconfig.json` is located.

```bash
$ npx vue-script-type-check ./src/**/*.vue
```

### options

| option              | default           | description            |
| ------------------- | ----------------- | ---------------------- |
| -t, --tsconfig-path | `./tsconfig.json` | Path to tsconfig.json. |

## ✨ Contributing

Contributions are welcome 🎉  
We accept contributions via Pull Requests. See [this guide](https://github.com/kawamataryo/vue-script-type-check/blob/main/CONTRIBUTING.md) on how to make a contribution.

## 📄 License

vue-script-type-check is available under the MIT License.

## 🛣️ TODO

- [x] Fix bug where accurate line numbers were not displayed
- [ ] Add auto publish
