import { describe, expect, test } from 'vitest';
import { normalizeHandle, parseCardParams } from '../src/core/params.js';

const parse = (qs: string) => {
  const result = parseCardParams(new URLSearchParams(qs));
  if (!result.ok) throw new Error(result.error);
  return result.options;
};

describe('parseCardParams', () => {
  test('accepts the original Cardivo README example unchanged', () => {
    const o = parse(
      'name=Satya%20Wikananda&description=Hi,%20i%27m%20a%20front%20end%20web%20developer&image=https://avatars.githubusercontent.com/u/33148052?v=4&backgroundColor=%23ecf0f1&instagram=satyawikananda&linkedin=I%20Gusti%20Ngurah%20Satya%20%20Wikananda&github=satyawikananda&twitter=satya_wikananda&pattern=leaf&colorPattern=%23eaeaea',
    );
    expect(o.name).toBe('Satya Wikananda');
    expect(o.theme).toBe('classic');
    expect(o.image).toBe('https://avatars.githubusercontent.com/u/33148052?v=4');
    expect(o.colors.background).toBe('#ecf0f1');
    expect(o.pattern).toBe('leaf');
    expect(o.patternColor).toBe('#eaeaea');
    expect(o.socials.map((s) => s.platform.id)).toEqual([
      'instagram',
      'linkedin',
      'github',
      'twitter',
    ]);
    expect(o.socials[1]?.handle).toBe('I Gusti Ngurah Satya Wikananda');
  });

  test('requires a name', () => {
    expect(parseCardParams(new URLSearchParams('description=hi'))).toEqual({
      ok: false,
      error: 'The `name` parameter is required.',
    });
    expect(parseCardParams(new URLSearchParams('name=%20%20')).ok).toBe(false);
  });

  test('normalises colours and ignores invalid ones', () => {
    const o = parse(
      'name=A&backgroundColor=FFF&fontColor=%23112233&iconColor=red;background:url(x)',
    );
    expect(o.colors).toEqual({ background: '#ffffff', text: '#112233' });
    expect(parse('name=A&backgroundColor=transparent').colors.background).toBe('transparent');
  });

  test('falls back to defaults for unknown enum values', () => {
    const o = parse('name=A&theme=nope&avatarShape=star&animation=wobble&radius=999&opacity=7');
    expect(o.theme).toBe('classic');
    expect(o.avatarShape).toBeUndefined();
    expect(o.animation).toBe('auto');
    expect(o.radius).toBe(48);
    expect(o.patternOpacity).toBe(1);
  });

  test('theme and enum values are case-insensitive', () => {
    expect(parse('name=A&theme=ASCII').theme).toBe('ascii');
    expect(parse('name=A&pattern=polkadots').pattern).toBe('polkaDots');
    expect(parse('name=A&pattern=none').pattern).toBeNull();
    expect(parse('name=A&pattern=unknown').pattern).toBeUndefined();
  });

  test('disableAnimation keeps working like the original', () => {
    expect(parse('name=A&disableAnimation=true').animation).toBe('none');
    expect(parse('name=A&disableAnimation=false').animation).toBe('auto');
    expect(parse('name=A&animation=type').animation).toBe('type');
  });

  test('keeps social links in URL order, dedupes and supports aliases', () => {
    const o = parse('name=A&x=one&github=two&dev=three&devto=dup&mail=me%40x.dev&youtube=');
    expect(o.socials.map((s) => [s.platform.id, s.handle])).toEqual([
      ['x', 'one'],
      ['github', 'two'],
      ['devto', 'three'],
      ['email', 'me@x.dev'],
    ]);
  });

  test('caps socials and skills, trims long text', () => {
    const many = Array.from({ length: 12 }, (_, i) => `skill${i}`).join(',');
    const o = parse(
      `name=${'n'.repeat(100)}&skills=${many}&github=a&x=b&instagram=c&youtube=d&tiktok=e&discord=f&medium=g&reddit=h&twitch=i`,
    );
    expect([...o.name]).toHaveLength(60);
    expect(o.name.endsWith('…')).toBe(true);
    expect(o.skills).toHaveLength(8);
    expect(o.socials).toHaveLength(8);
  });

  test('image=none hides the avatar; non-http images are dropped', () => {
    expect(parse('name=A&image=none').hideAvatar).toBe(true);
    expect(parse('name=A&image=javascript:alert(1)').image).toBeNull();
    expect(parse('name=A&hideAvatar=1').hideAvatar).toBe(true);
  });
});

describe('normalizeHandle', () => {
  test('strips pasted profile URLs and @', () => {
    expect(normalizeHandle('https://github.com/balaqiang/', ['github.com'])).toBe('balaqiang');
    expect(normalizeHandle('www.x.com/balaqiang?s=20', ['x.com'])).toBe('balaqiang');
    expect(normalizeHandle('@balaqiang')).toBe('@balaqiang');
    expect(normalizeHandle('  spaced   out  ')).toBe('spaced out');
  });
});
