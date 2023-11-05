export type Message = {
  id: string;
  channel: string;
  timestamp: number;
  date: string;
  userAgent: string | null;
  sourceIp: string;
  body: string;
};
