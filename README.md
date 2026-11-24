# To Dos admin frontend

SPA de React 17 construida con Vite 8. Ya no usa Create React App.

## Requisitos

- Node.js 22.23.1 (fijado en `.nvmrc`; `engines.node >=22.12.0`).
- npm 10.
- Docker para los targets de `Makefile`.

```sh
nvm use
npm ci
```

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm start` | Servidor de desarrollo de Vite en http://localhost:3000 |
| `npm run build` | Bundle de producción en `build/` |
| `npm run serve` | Preview local del bundle con `vite preview` |
| `npm test` | Suite de Jest una sola vez |
| `npm run test:watch` | Jest en modo watch |
| `npm run coverage` | Jest con coverage en `coverage/` |
| `npm run lint` | ESLint sobre `src/` |

## Build

- `index.html` está en la raíz del proyecto; Vite copia el contenido de `public/` al output.
- `vite.config.mjs` inyecta `process.env.NODE_ENV` y las variables `REACT_APP_*` para conservar el contrato anterior sin renombrarlas a `VITE_*`.
- Los archivos que contienen JSX usan extensión `.jsx`: Vite 8 con Rolldown no habilita JSX desde `.js`.
- Jest se ejecuta de forma independiente con `babel.config.js` y `jest.config.js`; no se migró a Vitest.
- Se eliminó el service worker de CRA.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `REACT_APP_BACKEND_URL` | `baseURL` de Axios; por defecto `http://localhost:5001` |
| `REACT_APP_COMMIT_SHA` | Commit mostrado en el footer |
| `REACT_APP_BUILD_DATE` | Fecha de build mostrada en el footer |
| `REACT_APP_ALGOLIA_APP_ID` | App ID usado por la búsqueda de listas |

## Docker y CI

Los targets de `Makefile`:

- `make build`: construye `todos_base` con Node 22.23.1 y ejecuta `npm run build`.
- `make lint`, `make test-ci` y `make audit`: ejecutan ESLint, Jest y la auditoría de producción dentro de esa imagen.
- `make build-release`: pasa las variables anteriores como build args y genera `todos_release`, que sirve el SPA con `serve -s .` en el puerto 3000.

El job `test` de CircleCI ejecuta `make build`, `make lint`, `make audit` y `make test-ci`.
