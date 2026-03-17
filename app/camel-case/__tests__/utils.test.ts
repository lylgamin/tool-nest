import { describe, it, expect } from 'vitest';
import { tokenize, toCamelCase, toPascalCase } from '../utils';

describe('tokenize', () => {
  it('snake_case を分割する', () => {
    expect(tokenize('foo_bar_baz')).toEqual(['foo', 'bar', 'baz']);
  });

  it('kebab-case を分割する', () => {
    expect(tokenize('foo-bar-baz')).toEqual(['foo', 'bar', 'baz']);
  });

  it('スペース区切りを分割する', () => {
    expect(tokenize('foo bar baz')).toEqual(['foo', 'bar', 'baz']);
  });

  it('camelCase を分割する', () => {
    expect(tokenize('fooBarBaz')).toEqual(['foo', 'bar', 'baz']);
  });

  it('PascalCase を分割する', () => {
    expect(tokenize('FooBarBaz')).toEqual(['foo', 'bar', 'baz']);
  });

  it('連続大文字 (ACRONYM) を分割する', () => {
    expect(tokenize('parseHTMLContent')).toEqual(['parse', 'html', 'content']);
  });

  it('空文字は空配列を返す', () => {
    expect(tokenize('')).toEqual([]);
  });
});

describe('toCamelCase', () => {
  it('snake_case を変換する', () => {
    expect(toCamelCase('foo_bar_baz')).toBe('fooBarBaz');
  });

  it('kebab-case を変換する', () => {
    expect(toCamelCase('foo-bar-baz')).toBe('fooBarBaz');
  });

  it('スペース区切りを変換する', () => {
    expect(toCamelCase('hello world')).toBe('helloWorld');
  });

  it('PascalCase を変換する', () => {
    expect(toCamelCase('FooBarBaz')).toBe('fooBarBaz');
  });

  it('単語1つはそのまま', () => {
    expect(toCamelCase('hello')).toBe('hello');
  });

  it('空文字は空文字を返す', () => {
    expect(toCamelCase('')).toBe('');
  });

  it('大文字で始まる単語も正しく処理する', () => {
    expect(toCamelCase('GET_USER_NAME')).toBe('getUserName');
  });
});

describe('toPascalCase', () => {
  it('snake_case を変換する', () => {
    expect(toPascalCase('foo_bar_baz')).toBe('FooBarBaz');
  });

  it('kebab-case を変換する', () => {
    expect(toPascalCase('foo-bar-baz')).toBe('FooBarBaz');
  });

  it('スペース区切りを変換する', () => {
    expect(toPascalCase('hello world')).toBe('HelloWorld');
  });

  it('camelCase を変換する', () => {
    expect(toPascalCase('fooBarBaz')).toBe('FooBarBaz');
  });

  it('単語1つは先頭大文字', () => {
    expect(toPascalCase('hello')).toBe('Hello');
  });

  it('空文字は空文字を返す', () => {
    expect(toPascalCase('')).toBe('');
  });
});
