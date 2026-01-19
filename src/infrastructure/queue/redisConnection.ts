export function redisUrlToConnection(redisUrl: string): {
  host: string;
  port: number;
  password?: string;
  maxRetriesPerRequest: null;
} {
  const u = new URL(redisUrl);
  return {
    host: u.hostname,
    port: parseInt(u.port || "6379", 10),
    ...(u.password && { password: u.password }),
    maxRetriesPerRequest: null,
  };
}
