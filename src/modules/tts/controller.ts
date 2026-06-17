import { z } from 'zod';
import { env } from '../../config/env.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import { buildTtsUrl, synthesizeSpeech } from './service.js';

export const ttsQuerySchema = z.object({
  text: z.string().min(1, 'text khong duoc de trong'),
  lang: z.string().min(2).max(10).optional(),
  // format=stream -> tra ve audio; format=link -> tra ve JSON kem URL
  format: z.enum(['stream', 'link']).optional(),
});

type TtsQuery = z.infer<typeof ttsQuerySchema>;

// GET /api/tts?text=hello&lang=en&format=stream|link
export const speak = asyncHandler(async (req, res) => {
  const { text, lang, format } = req.query as unknown as TtsQuery;
  const language = lang || env.tts.defaultLang;

  if (format === 'link') {
    return sendSuccess(
      res,
      { text, lang: language, audio_url: buildTtsUrl(text.trim(), language) },
      'TTS link generated'
    );
  }

  const audio = await synthesizeSpeech(text, language);
  res.setHeader('Content-Type', audio.contentType);
  res.setHeader('Content-Length', audio.buffer.length.toString());
  res.setHeader('Cache-Control', 'public, max-age=86400');
  return res.send(audio.buffer);
});
