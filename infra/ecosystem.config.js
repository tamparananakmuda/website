/**
 * ==============================================================================
 * TAMPARAN ANAK MUDA — PM2 CLUSTER CONFIGURATION (INTERNAL LOAD BALANCER)
 * ==============================================================================
 * Mengapa PM2 Cluster Mode?
 * Node.js secara default hanya berjalan pada 1 core CPU (single thread).
 * Jika server VPS memiliki 4 core CPU, 3 core lainnya akan menganggur (idle).
 *
 * Dengan 'exec_mode: cluster' dan 'instances: max', PM2 akan otomatis membuat
 * worker process pada setiap core CPU dan mendistribusikan beban secara internal.
 * ==============================================================================
 */

module.exports = {
  apps: [
    {
      name: 'tam-website',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      // Gunakan semua core CPU yang tersedia di server untuk load balancing internal
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G', // Restart otomatis jika terjadi memory leak > 1GB
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Zero-downtime reload settings
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
    },
  ],
};
