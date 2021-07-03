export {};

declare module NodeJS {
  interface Global {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

declare const process: NodeJS.Process;
declare global {
  const webkitSpeechRecognition: new () => SpeechRecognition;
}
