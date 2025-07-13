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
    baseUrl: RTVI_CONFIG.baseUrl,
    services: RTVI_CONFIG.services,
    config: RTVI_CONFIG.config
  },
  enableMic: true,
  enableCam: true,
});

export function RTVIProvider({ children }: PropsWithChildren) {
  return <RTVIClientProvider client={client}>{children}</RTVIClientProvider>;
}