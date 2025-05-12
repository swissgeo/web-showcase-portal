# PWIP

| Branch  | Status                               |
| ------- | ------------------------------------ |
| develop | ![Build Status](CODEBUILD_BADGE_URL) |
| master  | ![Build Status](CODEBUILD_BADGE_URL) |

## Recommended IDE Setup

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

The project contains a submodule from [geonetwork](https://github.com/geonetwork/geonetwork-ui/tree/wc-dist-main).
To enable this, simply invoke before anything else.

```sh
git submodule init
git submodule update
```

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm run dev
```

### Compile and Minify for Production

```sh
pnpm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
pnpm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
pnpm run build
pnpm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm run lint
```
