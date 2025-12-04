# Nuxt Auto CRUD Starter

A starter template for [Nuxt Auto CRUD](https://github.com/clifordpereira/nuxt-auto-crud) module.

- [Documentation](https://auto-crud.clifland.in/)
- [Module Repo](https://github.com/clifordpereira/nuxt-auto-crud)
- [Report Issue](https://github.com/clifordpereira/nuxt-auto-crud/issues)
- [Creator Website](https://www.clifland.in/)

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

## Usage Modes

This template comes pre-configured with `nuxt-auto-crud` for a fullstack experience.

### Fullstack (Default)

No extra steps needed. `nuxt-auto-crud` is installed and configured.

### Frontend Only

If you wish to use this template as a frontend-only application:

1. Uninstall the module:
   ```bash
   npm uninstall nuxt-auto-crud
   ```
2. Open `nuxt.config.ts` and remove `'nuxt-auto-crud'` from the `modules` list.
3. Remove the `autoCrud` configuration block from `nuxt.config.ts`.

## Database Reset & Seeding

If you want to delete all data and start fresh:

1. Delete the `.data` directory.
2. Run the database generation command:
   ```bash
   bun db:generate
   ```
3. Restart the server:
   ```bash
   bun run dev
   ```

**Default Admin User:**

On server restart, a default admin user is created:
- **Email:** `admin@example.com`
- **Password:** `$1Password`

**Security Note:**
Log in with these credentials, create a new user with the `admin` role, and then delete this default admin user.
