import { describe, it, expect } from 'vitest';
import { toHankaku, toZenkaku } from '../utils';

describe('toHankaku', () => {
  it('全角英数字を半角に変換する', () => {
    expect(toHankaku('ＡＢＣ')).toBe('ABC');
    expect(toHankaku('１２３')).toBe('123');
  });

  it('全角記号を半角に変換する', () => {
    expect(toHankaku('！？＆')).toBe('!?&');
    expect(toHankaku('（）')).toBe('()');
  });

  it('全角スペースを半角スペースに変換する', () => {
    expect(toHankaku('hello　world')).toBe('hello world');
  });

  it('全角カタカナを半角カタカナに変換する', () => {
    expect(toHankaku('アイウエオ')).toBe('ｱｲｳｴｵ');
    expect(toHankaku('カキクケコ')).toBe('ｶｷｸｹｺ');
  });

  it('濁音・半濁音を変換する', () => {
    expect(toHankaku('ガギグゲゴ')).toBe('ｶﾞｷﾞｸﾞｹﾞｺﾞ');
    expect(toHankaku('パピプペポ')).toBe('ﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ');
  });

  it('小文字カタカナを変換する', () => {
    expect(toHankaku('ァィゥェォ')).toBe('ｧｨｩｪｫ');
    expect(toHankaku('ッャュョ')).toBe('ｯｬｭｮ');
  });

  it('句読点・記号カタカナを変換する', () => {
    expect(toHankaku('。「」、・ー')).toBe('｡｢｣､･ｰ');
  });

  it('ひらがな・漢字はそのまま', () => {
    expect(toHankaku('あいう漢字')).toBe('あいう漢字');
  });

  it('空文字を返す', () => {
    expect(toHankaku('')).toBe('');
  });
});

describe('toZenkaku', () => {
  it('半角英数字を全角に変換する', () => {
    expect(toZenkaku('ABC')).toBe('ＡＢＣ');
    expect(toZenkaku('123')).toBe('１２３');
  });

  it('半角記号を全角に変換する', () => {
    expect(toZenkaku('!?&')).toBe('！？＆');
    expect(toZenkaku('()')).toBe('（）');
  });

  it('半角スペースを全角スペースに変換する', () => {
    expect(toZenkaku('hello world')).toBe('ｈｅｌｌｏ　ｗｏｒｌｄ');
  });

  it('半角カタカナを全角カタカナに変換する', () => {
    expect(toZenkaku('ｱｲｳｴｵ')).toBe('アイウエオ');
    expect(toZenkaku('ｶｷｸｹｺ')).toBe('カキクケコ');
  });

  it('半角濁音・半濁音（2文字）を全角に変換する', () => {
    expect(toZenkaku('ｶﾞｷﾞｸﾞｹﾞｺﾞ')).toBe('ガギグゲゴ');
    expect(toZenkaku('ﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ')).toBe('パピプペポ');
  });

  it('半角句読点を全角に変換する', () => {
    expect(toZenkaku('｡｢｣､･ｰ')).toBe('。「」、・ー');
  });

  it('空文字を返す', () => {
    expect(toZenkaku('')).toBe('');
  });
});
