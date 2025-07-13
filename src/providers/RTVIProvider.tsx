// src/providers/RTVIProvider.tsx
import { type PropsWithChildren } from 'react';
import { PipecatClient } from '@pipecat-ai/client-js';
import { DailyTransport } from '@pipecat-ai/daily-transport';
import { PipecatClientProvider } from '@pipecat-ai/client-react';
import { RTVI_CONFIG } from '@/config/rtvi';

const transport = new DailyTransport();

const client = new PipecatClient({
  transport,
  params: {
    baseUrl: RTVI_CONFIG.baseUrl,
    endpoints: {
      connect: '/connect',
    },
  },
  config: RTVI_CONFIG.config,
  enableMic: true,
  enableCam: true,
});

export function RTVIProvider({ children }: PropsWithChildren) {
  return <PipecatClientProvider client={client}>{children}</PipecatClientProvider>;
}