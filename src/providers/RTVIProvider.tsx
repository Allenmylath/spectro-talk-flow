// src/providers/RTVIProvider.tsx
import { type PropsWithChildren, createContext, useContext, useState, useEffect } from 'react';
import { PipecatClient, RTVIEvent } from "@pipecat-ai/client-js";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { RTVI_CONFIG } from '@/config/rtvi';

const PipecatContext = createContext<PipecatClient | null>(null);

export function RTVIProvider({ children }: PropsWithChildren) {
  const [client, setClient] = useState<PipecatClient | null>(null);

  useEffect(() => {
    // Create transport with proper configuration
    const transport = new DailyTransport({
      bufferLocalAudioUntilBotReady: true,
      inputSettings: {
        video: {
          processor: { type: 'background-blur' }
        }
      }
    });

    // Create PipecatClient with correct constructor
    const pipecatClient = new PipecatClient({
      transport,
      enableMic: true,
      enableCam: false,
      callbacks: {
        onBotReady: () => console.log('Bot ready'),
        onBotTranscript: (data) => console.log('Bot said:', data.text),
        onUserTranscript: (data) => console.log('User said:', data.text),
        onError: (error) => console.error('Pipecat error:', error),
        onConnected: () => console.log('Connected to transport'),
        onDisconnected: () => console.log('Disconnected from transport'),
        onBotConnected: () => console.log('Bot joined session'),
        onBotDisconnected: () => console.log('Bot left session'),
        onTransportStateChanged: (state) => console.log('Transport state:', state)
      }
    });

    setClient(pipecatClient);

    return () => {
      if (pipecatClient) {
        pipecatClient.disconnect().catch(console.error);
      }
    };
  }, []);

  return (
    <PipecatContext.Provider value={client}>
      {children}
    </PipecatContext.Provider>
  );
}

export const usePipecat = () => useContext(PipecatContext);
