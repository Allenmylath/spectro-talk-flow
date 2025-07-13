// RTVI Configuration
export const RTVI_CONFIG = {
  baseUrl: import.meta.env.VITE_RTVI_BASE_URL || "http://localhost:7860",
  dailyApiKey: import.meta.env.VITE_DAILY_API_KEY,
  services: {
    stt: "deepgram",
    llm: "openai",
    tts: "cartesia"
  },
  config: [
    {
      service: "tts",
      options: [
        { name: "voice", value: "79a125e8-cd45-4c13-8a67-188112f4dd22" },
        { name: "model", value: "sonic-english" }
      ]
    },
    {
      service: "llm", 
      options: [
        { name: "model", value: "gpt-4o-mini" },
        { name: "temperature", value: 0.7 }
      ]
    }
  ]
};