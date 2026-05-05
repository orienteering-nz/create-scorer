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
pnpm install
pnpm run build   # compile CLI to dist/ via tsc
pnpm run check   # lint + format check with biome
```

### Releasing

This package uses [changesets](https://github.com/changesets/changesets) for versioning and releases.

```bash
# create a changeset describing your changes
pnpx changeset

# version and release (automated via GitHub Actions on main)
```

When a PR is merged to `main`, the release workflow will either:
- Open a "Version Packages" PR with the version bump and changelog, or
- Publish to npm automatically once the Version Packages PR is merged.
