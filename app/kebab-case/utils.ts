// ケバブケース・スネークケース変換ユーティリティ

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

export function toKebabCase(input: string): string {
  return tokenize(input).join('-');
}

export function toSnakeCase(input: string): string {
  return tokenize(input).join('_');
}
