// src/providers/RTVIProvider.tsx
import { type PropsWithChildren, createContext, useContext, useState, useEffect } from 'react';
import { RTVIClient, RTVIEvent } from "@pipecat-ai/client-js";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { RTVI_CONFIG } from '@/config/rtvi';

const PipecatContext = createContext<RTVIClient | null>(null);

export function RTVIProvider({ children }: PropsWithChildren) {
  const [client, setClient] = useState<RTVIClient | null>(null);

  useEffect(() => {
    const pipecatClient = new RTVIClient({
      transport: new DailyTransport(),
      params: {
        baseUrl: RTVI_CONFIG.baseUrl,
        services: RTVI_CONFIG.services,
        config: RTVI_CONFIG.config
      },
      enableMic: true,
      enableCam: false,
      callbacks: {
        onBotReady: () => console.log('Bot ready'),
        onBotTranscript: (data: any) => console.log('Bot said:', data.text),
        onUserTranscript: (data: any) => console.log('User said:', data.text),
        onError: (error: any) => console.error('Pipecat error:', error)
      }
    });

    setClient(pipecatClient);

    return () => {
      pipecatClient.disconnect();
    };
  }, []);

  return (
    <PipecatContext.Provider value={client}>
      {children}
    </PipecatContext.Provider>
  );
}

export const usePipecat = () => useContext(PipecatContext);