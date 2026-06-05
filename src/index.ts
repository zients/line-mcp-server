#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { LineMessagingClient } from './services/line.js';
import { registerMessagingTools } from './tools/messaging.js';
import { registerProfileTools } from './tools/profile.js';
import { registerGroupTools } from './tools/group.js';
import { registerRichMenuTools } from './tools/richmenu.js';
import { registerInsightTools } from './tools/insight.js';
import { parseDefaultUid } from './utils/target.js';

const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN;

if (!channelAccessToken) {
  console.error(
    'Error: CHANNEL_ACCESS_TOKEN environment variable is required.\n' +
      'Get it from https://developers.line.biz/console/',
  );
  process.exit(1);
}

const defaultUidResult = parseDefaultUid(process.env.DEFAULT_UID);
if (!defaultUidResult.ok) {
  console.error(`Error: ${defaultUidResult.error}`);
  process.exit(1);
}
const defaultUid = defaultUidResult.value;

const server = new McpServer({
  name: '@zients/line-mcp-server',
  version: '1.0.1',
});

const lineService = new LineMessagingClient(channelAccessToken);

registerMessagingTools(server, lineService, defaultUid);
registerProfileTools(server, lineService);
registerGroupTools(server, lineService);
registerRichMenuTools(server, lineService);
registerInsightTools(server, lineService);

const transport = new StdioServerTransport();
try {
  await server.connect(transport);
} catch (err) {
  console.error('Failed to start MCP server:', err);
  process.exit(1);
}
