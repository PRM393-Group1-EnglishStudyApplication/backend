import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';

// Tao URL toi dich vu Google Translate TTS (ham thuan -> unit test duoc)
export function buildTtsUrl(text: string, lang: string, baseUrl: string = env.tts.baseUrl): string {
  const params = new URLSearchParams({
    ie: 'UTF-8',
    client: 'tw-ob',
    q: text,
    tl: lang,
  });
  return `${baseUrl}?${params.toString()}`;
}

export interface SynthesizedAudio {
  buffer: Buffer;
  contentType: string;
  url: string;
}

// Goi (proxy) toi dich vu TTS ben thu 3 va lay ve audio
export async function synthesizeSpeech(text: string, lang: string): Promise<SynthesizedAudio> {
  const cleaned = text.trim();
  if (!cleaned) {
    throw ApiError.badRequest('text khong duoc de trong.');
  }
  if (cleaned.length > env.tts.maxLength) {
    throw ApiError.badRequest(`text toi da ${env.tts.maxLength} ky tu.`);
  }

  const url = buildTtsUrl(cleaned, lang);
  const response = await fetch(url, {
    headers: {
      // Google TTS yeu cau User-Agent dang trinh duyet
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    },
  });

  if (!response.ok) {
    throw new ApiError(502, `Dich vu TTS loi (HTTP ${response.status}).`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    contentType: response.headers.get('content-type') || 'audio/mpeg',
    url,
  };
}
