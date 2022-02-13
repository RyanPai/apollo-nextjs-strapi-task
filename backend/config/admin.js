module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'f6305a82b0348033e8dac2e9fcac10d5'),
  },
});
