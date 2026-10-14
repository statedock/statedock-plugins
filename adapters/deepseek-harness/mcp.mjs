import * as mcpClient from '@deepseek-ai/dsh-mcp-client';

export const name = 'statedock-remote-mcp';
export const inject = ['tools'];

export async function apply(ctx) {
  const token = process.env.STATEDOCK_TOKEN;
  if (!token?.trim()) throw new Error('StateDock: supply STATEDOCK_TOKEN securely to the Harness process, or keep this optional connection disabled and reuse your existing StateDock MCP connection.');
  const connection = ctx.plugin(mcpClient, {
    serverName: 'statedock_plugin',
    transport: 'streamable-http',
    url: 'https://statedock.dev/mcp',
    headers: { Authorization: `Bearer ${token}` },
    failOnStartupError: true,
    reconnect: { enabled: false },
  });
  await connection.await();
}
