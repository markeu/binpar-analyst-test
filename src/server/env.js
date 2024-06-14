const { z } = require('zod');

/*eslint sort-keys: "error"*/
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  POKEMON_API_BASE_URL: z.string()
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  throw new Error(
    '❌ Invalid environment variables: ' +
      JSON.stringify(env.error.format(), null, 4),
  );
}
module.exports.env = env.data;