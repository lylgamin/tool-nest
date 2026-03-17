// キャメルケース・パスカルケース変換ユーティリティ

/**
 * 入力文字列をトークン（単語）の配列に分解する。
 * snake_case, kebab-case, スペース区切り, ドット区切り, camelCase, PascalCase に対応。
 */
export function tokenize(input: string): string[] {
  return (
    input
      // camelCase / PascalCase の境界に空白を挿入
      .replace(/([a-z\d])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      // 区切り文字で分割
      .split(/[\s\-_.]+/)
      .filter(Boolean)
      .map((w) => w.toLowerCase())
  );
}

export function toCamelCase(input: string): string {
  const tokens = tokenize(input);
  if (tokens.length === 0) return '';
  return (
    tokens[0] +
    tokens
      .slice(1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('')
  );
}

export function toPascalCase(input: string): string {
  return tokenize(input)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}
