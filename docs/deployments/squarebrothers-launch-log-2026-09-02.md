# Square Brothers CMS Launch Log

Date: 2026-09-02

## Status At Handoff

The Trainzilla CMS is live on the Square Brothers production VPS.

| Check | Result |
| --- | --- |
| Public hostname | `https://cms.trainzilla.in` |
| Active release | `20260902135933` |
| Source commit | `248133b` (`fix: support CMS runtime on Square Brothers CPU`) |
| PM2 process | `trainzilla-cms` is `online` |
| Local admin check | `http://127.0.0.1:3001/admin` returns `200` |
| Nginx admin check | `Host: cms.trainzilla.in` on port 80 returns `200` before redirect |
| HTTPS origin check | `https://cms.trainzilla.in/admin` returns `200` when resolved to the VPS origin |
| TLS | Let's Encrypt certificate installed; Certbot renewal timer is enabled |

## Production Topology

- VPS origin: `163.128.112.8`
- DNS: `cms.trainzilla.in` has an A record to the VPS origin.
- Application root: `/home/ubuntu/apps/trainzilla-cms`
- Release link: `/home/ubuntu/apps/trainzilla-cms/current`
- Persistent environment: `/home/ubuntu/apps/trainzilla-cms/shared/.env`
- Persistent upload directory: `/home/ubuntu/apps/trainzilla-cms/shared/media`
- PM2 logs: `/home/ubuntu/apps/trainzilla-cms/shared/logs/cms.out.log` and `cms.error.log`
- App listener: `127.0.0.1:3001`
- Nginx site: `/etc/nginx/sites-available/cms.trainzilla.in`

The CMS uses the existing production MongoDB cluster but has its own `trainzilla_cms` database. Do not point `DATABASE_URL` at a backend application database, and do not record the actual connection string in this repository.

## Deployment Model

Deployments are local-build, artifact-only releases:

```bash
cd '/Users/abhishek/Desktop/Trainzilla Projects/trainzilla_cms'
source "$HOME/.nvm/nvm.sh"
nvm use 22
./scripts/deploy-production.sh
```

The script builds locally, packages Next standalone output plus static assets, uploads with rsync, switches `current`, reloads PM2, waits for `/admin`, and retains five releases. It must not run `npm ci` or `npm run build` on the VPS.

The local, gitignored `.env.production.local` must match the server's CMS runtime values for build-time configuration. Treat both copies as secrets.

## CPU Compatibility Constraint

The Square Brothers VPS CPU cannot run the x86-64-v2 binary required by `sharp@0.34.x`; it also lacks the SIMD support required by that release's WASM fallback.

The CMS therefore pins `sharp` to `0.33.5`. The deploy script adds its prebuilt Linux x64 `sharp` and libvips packages to the standalone artifact. A direct runtime probe on the VPS succeeded with `sharp@0.33.5` and libvips `8.15.3`.

Do not upgrade `sharp` without validating the new runtime on this exact VPS CPU before deployment.

## TLS Notes

The CMS certificate was created by Certbot after public resolvers confirmed the A record. The first Certbot registration was created without an email contact because no server-side Certbot email was configured. Renewal is enabled, but expiry notification emails are not configured.

`nginx -t` passes. It emits existing `protocol options redefined` warnings across the CMS and control-plane TLS sites; do not alter unrelated production TLS configuration as part of CMS maintenance without a separate review.

## Remaining Work

- Create the first Payload admin at `https://cms.trainzilla.in/admin`.
- Run the seed scripts only after reviewing the target content and confirming the new CMS database is intended to receive it.
- Add `PAYLOAD_CMS_URL=https://cms.trainzilla.in` to the marketing site's Netlify build environment.
- Add `NETLIFY_BUILD_HOOK_URL` to the private CMS environment if publish-triggered marketing rebuilds are wanted.
- Add an email contact to the Certbot account or independently monitor certificate expiry.
- Include `/home/ubuntu/apps/trainzilla-cms/shared/media` in production backups before relying on binary media uploads.

## Next-Agent Checklist

1. Read this log and `squarebrothers-production.md` before changing the CMS.
2. Confirm PM2, local `/admin`, nginx, and the active release link are healthy.
3. Keep `shared/.env` and `shared/media` outside release directories.
4. Build locally on Node 22 and deploy through `scripts/deploy-production.sh`.
5. Validate direct origin HTTPS and public DNS after every infrastructure or TLS change.
6. Do not build, run `npm ci`, or install dependencies on the VPS as part of the CMS deployment workflow.
