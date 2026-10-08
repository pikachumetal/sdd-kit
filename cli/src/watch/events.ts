import { isRecord, sameText, toCount, type Json } from '../cli/records.ts';
import { readText } from '../cli/files.ts';

export interface ToolUse {
  call: Json;
  index: number;
  timestamp: unknown;
}

export const SHELL_TOOLS = ['bash', 'powershell'];

export const isShellTool = (use: ToolUse): boolean => SHELL_TOOLS.includes(String(use.call.name).toLowerCase());

function parseEvent(line: string): Json | null {
  try {
    const parsed: unknown = JSON.parse(line);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export const readEvents = (file: string): Json[] => readText(file).split(/\r\n|\n|\r/).map(parseEvent).filter((event): event is Json => event !== null);

export function contentBlocks(event: Json, blockType: string): Json[] {
  const content = event.message?.content;
  const blocks: unknown[] = Array.isArray(content) ? content : content == null ? [] : [content];
  return blocks.filter((block): block is Json => isRecord(block) && sameText(block.type, blockType));
}

export const toolUses = (events: Json[]): ToolUse[] =>
  events.flatMap((event, index) => contentBlocks(event, 'tool_use').map((call) => ({ call, index, timestamp: event.timestamp })));

export function isFinished(events: Json[]): boolean {
  const lastAnswer = events.filter((event) => sameText(event.type, 'assistant')).at(-1);
  return lastAnswer !== undefined && sameText(lastAnswer.message?.stop_reason, 'end_turn');
}

export function isPending(events: Json[], toolUse: ToolUse): boolean {
  const id = String(toolUse.call.id);
  const answered = events.slice(toolUse.index + 1).some((event) => contentBlocks(event, 'tool_result').some((block) => sameText(block.tool_use_id, id)));
  return !answered;
}

export function selectWatched(uses: ToolUse[], pending: ToolUse[]): ToolUse | undefined {
  return pending.filter(isShellTool).at(-1) ?? pending.at(-1) ?? uses.at(-1);
}

export function hasHookAfter(events: Json[], lastUse: ToolUse, hookEvent: string): boolean {
  return events.slice(lastUse.index + 1).some((event) => {
    if (!sameText(event.type, 'attachment') || !sameText(event.attachment?.hookEvent, hookEvent)) return false;
    return hookEvent === 'PermissionRequest' || sameText(event.attachment?.toolUseID, String(lastUse.call.id));
  });
}

export function outputTokens(events: Json[]): number {
  const byMessage = new Map<string, number>();
  for (const event of events) {
    if (!sameText(event.type, 'assistant') || event.message?.usage == null) continue;
    byMessage.set(String(event.message.id ?? '').toLowerCase(), toCount(event.message.usage.output_tokens));
  }
  return [...byMessage.values()].reduce((sum, tokens) => sum + tokens, 0);
}
