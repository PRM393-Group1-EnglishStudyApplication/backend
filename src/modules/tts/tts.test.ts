import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildTtsUrl } from './service.js';

describe('tts.buildTtsUrl', () => {
  it('tao URL co day du tham so', () => {
    const url = buildTtsUrl('hello', 'en', 'https://tts.example.com/api');
    assert.ok(url.startsWith('https://tts.example.com/api?'));
    assert.match(url, /ie=UTF-8/);
    assert.match(url, /client=tw-ob/);
    assert.match(url, /tl=en/);
    assert.match(url, /q=hello/);
  });

  it('ma hoa ky tu dac biet/khoang trang', () => {
    const url = buildTtsUrl('xin chao', 'vi', 'https://tts.example.com/api');
    assert.match(url, /q=xin\+chao/);
    assert.match(url, /tl=vi/);
  });
});
