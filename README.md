# create-scorer

Easiest way to scaffold a new scorer app.

## Usage

```bash
# with bun
bunx @o-zone/create-scorer my-scorer

# with npm
npm create @o-zone/scorer my-scorer
```

Or run without arguments to be prompted for the name:

```bash
bunx @o-zone/create-scorer
```

## What you get

Each generated scorer project includes:

- **[Bun](https://bun.sh)** — fast all-in-one JavaScript runtime and package manager
- **[TypeScript](https://www.typescriptlang.org)** — strict type checking
- **[Biome](https://biomejs.dev)** — fast linter and formatter
- **[@total-typescript/ts-reset](https://www.totaltypescript.com/ts-reset)** — TypeScript utility reset for safer types

## Development

```bash
bun install
bun run build   # compile CLI to dist/
bun run dev     # run CLI from source
bun run check   # lint + format check
```
