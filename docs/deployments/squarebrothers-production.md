# Square Brothers CMS Production Deployment

The CMS deploys to the Square Brothers VPS as a standalone PM2 process behind nginx.

## Runtime

- public hostname: `cms.trainzilla.in`
- app root: `/home/ubuntu/apps/trainzilla-cms`
- PM2 name: `trainzilla-cms`
- local port: `127.0.0.1:3001`
- nginx site: `/etc/nginx/sites-available/cms.trainzilla.in`
- persistent environment: `/home/ubuntu/apps/trainzilla-cms/shared/.env`
- persistent uploads: `/home/ubuntu/apps/trainzilla-cms/shared/media`

The server does not need GitHub access. Deploy from this local repository with:

```bash
./scripts/deploy-production.sh
```

The script runs `npm ci` and `npm run build` locally, packages Next's standalone runtime and static assets, adds the `sharp` WebAssembly runtime required by this VPS CPU, rsyncs that immutable release to the VPS, reloads PM2, verifies `/admin` locally, and keeps five releases. It does not install packages or build on the VPS.

Before the first deployment, create the private shared environment on the VPS with at least:

```dotenv
DATABASE_URL=<production CMS MongoDB URL for the trainzilla_cms database>
PAYLOAD_SECRET=<stable random value>
PAYLOAD_PUBLIC_SERVER_URL=https://cms.trainzilla.in
NODE_ENV=production
PORT=3001
```

Do not commit this file or copy the backend application's database URL. The CMS needs its own `trainzilla_cms` database.

The local deploy workstation also needs the same values in `.env.production.local` so Next can build with its production configuration. This file is gitignored.

Enable the nginx site and run Certbot only after `cms.trainzilla.in` resolves to the VPS origin. Use `pm2 logs trainzilla-cms` and the shared log files for follow-up.
