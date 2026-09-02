module.exports = {
  apps: [
    {
      name: 'trainzilla-cms',
      cwd: '/home/ubuntu/apps/trainzilla-cms/current',
      script: 'server.js',
      interpreter: 'node',
      env_file: '/home/ubuntu/apps/trainzilla-cms/shared/.env',
      env: {
        NODE_ENV: 'production',
        PORT: '3001',
      },
      max_memory_restart: '600M',
      autorestart: true,
      watch: false,
      time: true,
      out_file: '/home/ubuntu/apps/trainzilla-cms/shared/logs/cms.out.log',
      error_file: '/home/ubuntu/apps/trainzilla-cms/shared/logs/cms.error.log',
      merge_logs: true,
    },
  ],
}
