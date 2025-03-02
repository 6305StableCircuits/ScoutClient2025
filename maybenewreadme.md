# 2025 Scouting App

The 6305 Scouting App.

## Stack

- [Svelte, SvelteKit](https://svelte.dev)
- [TailwindCSS](https://tailwindcss.com)
- [TypeScript](https://typescriptlang.org)
- [Vite](https://vitejs.dev)

## Routes

- `scout` - The main Scouting page.
- `data` - Anything relating to data recorded
    - `/team/[team]` - Data relating to a specific team
    - `/match/[match]` - Data relating to a specific match
    - `/scouter/[scouter]` - Data relating to a specific scouter
- `save` - Where data can be saved to the database, downloaded, removed
- `api` - The endpoint at which the database contents can be recorded or retrieved as JSON.

## Database

The database is composed of a single JSON file, found in `/src/routes/api/data.json`. Reading and writing to and from it can be done through either `fetch` or `fs` calls.

## Configuration

The configuration file can be found in `/src/lib/config.ts`. This configuration is used for the game structure and algorithm.
