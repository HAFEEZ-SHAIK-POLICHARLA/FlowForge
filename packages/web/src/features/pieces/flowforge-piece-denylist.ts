export const FLOWFORGE_DENIED_PIECES = new Set<string>([
  'activepieces',
  'flow-helper',
  'flow-parser',

  'amazon-secrets-manager',
  'hashi-corp-vault',

  'azure-ad',
  'cyberark',
  'okta',

  'mcp',
  'http-oauth2',
]);

export function filterFlowForgePieces<T extends { name: string }>(
  pieces: T[],
): T[] {
  return pieces.filter(
    (piece) => !FLOWFORGE_DENIED_PIECES.has(piece.name),
  );
}