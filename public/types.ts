export enum Speaker {
  User = 'user',
  Agent = 'agent',
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface TranscriptEntry {
  speaker: Speaker;
  text: string;
  sources?: GroundingSource[];
}

export enum AgentStatus {
  Idle = 'Idle',
  Thinking = 'Thinking',
  Error = 'Error',
}