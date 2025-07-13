// RTVI Configuration
export const RTVI_CONFIG = {
  baseUrl: import.meta.env.VITE_RTVI_BASE_URL || "http://localhost:7860",
  dailyApiKey: import.meta.env.VITE_DAILY_API_KEY,
  services: {
    llm: "openai",
    tts: "elevenlabs"
  },
  config: [
    {
      service: "tts",
      options: [
        { name: "voice", value: "pNInz6obpgDQGcFmaJgB" },
        { name: "model", value: "eleven_turbo_v2" }
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