import { describe, it, expect } from 'vitest';
import { tokenize, toKebabCase, toSnakeCase } from '../utils';

describe('tokenize', () => {
  it('camelCase を分割する', () => {
    expect(tokenize('fooBarBaz')).toEqual(['foo', 'bar', 'baz']);
  });

  it('PascalCase を分割する', () => {
    expect(tokenize('FooBarBaz')).toEqual(['foo', 'bar', 'baz']);
  });

  it('snake_case を分割する', () => {
    expect(tokenize('foo_bar_baz')).toEqual(['foo', 'bar', 'baz']);
  });

  it('スペース区切りを分割する', () => {
    expect(tokenize('foo bar baz')).toEqual(['foo', 'bar', 'baz']);
  });

  it('空文字は空配列を返す', () => {
    expect(tokenize('')).toEqual([]);
  });
});

describe('toKebabCase', () => {
  it('camelCase を変換する', () => {
    expect(toKebabCase('fooBarBaz')).toBe('foo-bar-baz');
  });

  it('PascalCase を変換する', () => {
    expect(toKebabCase('FooBarBaz')).toBe('foo-bar-baz');
  });

  it('snake_case を変換する', () => {
    expect(toKebabCase('foo_bar_baz')).toBe('foo-bar-baz');
  });

  it('スペース区切りを変換する', () => {
    expect(toKebabCase('hello world')).toBe('hello-world');
  });

  it('単語1つはそのまま', () => {
    expect(toKebabCase('hello')).toBe('hello');
  });

  it('空文字は空文字を返す', () => {
    expect(toKebabCase('')).toBe('');
  });

  it('大文字定数を変換する', () => {
    expect(toKebabCase('MAX_RETRY_COUNT')).toBe('max-retry-count');
  });
});

describe('toSnakeCase', () => {
  it('camelCase を変換する', () => {
    expect(toSnakeCase('fooBarBaz')).toBe('foo_bar_baz');
  });

  it('PascalCase を変換する', () => {
    expect(toSnakeCase('FooBarBaz')).toBe('foo_bar_baz');
  });

  it('kebab-case を変換する', () => {
    expect(toSnakeCase('foo-bar-baz')).toBe('foo_bar_baz');
  });

  it('スペース区切りを変換する', () => {
    expect(toSnakeCase('hello world')).toBe('hello_world');
  });

  it('単語1つはそのまま', () => {
    expect(toSnakeCase('hello')).toBe('hello');
  });

  it('空文字は空文字を返す', () => {
    expect(toSnakeCase('')).toBe('');
  });
});
