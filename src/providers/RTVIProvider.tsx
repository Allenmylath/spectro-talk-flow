// src/providers/RTVIProvider.tsx
import { type PropsWithChildren } from 'react';
import { RTVIClient } from '@pipecat-ai/client-js';
import { DailyTransport } from '@pipecat-ai/daily-transport';
import { RTVIClientProvider } from '@pipecat-ai/client-react';
import { RTVI_CONFIG } from '@/config/rtvi';

const transport = new DailyTransport();

const client = new RTVIClient({
  transport,
  params: {
    baseUrl: "wss://api.pipecat.ai/v1/rtvi",
    services: {
      stt: "deepgram",
      llm: "openai", 
      tts: "cartesia"
    }
  },
  enableMic: true,
  enableCam: true,
});

export function RTVIProvider({ children }: PropsWithChildren) {
  return <RTVIClientProvider client={client}>{children}</RTVIClientProvider>;
}