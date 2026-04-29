export interface ConsoleLogEntry {
  timestamp: number;
  level: string;
  text: string;
  url?: string;
  lineNumber?: number;
}

export interface WsFrameEntry {
  timestamp: number;
  direction: 'sent' | 'received';
  url: string;
  payloadData: string;
}

class RingBuffer<T> {
  private buf: (T | undefined)[];
  private head = 0;
  private count = 0;

  constructor(private readonly capacity: number) {
    this.buf = new Array(capacity);
  }

  push(item: T): void {
    this.buf[this.head] = item;
    this.head = (this.head + 1) % this.capacity;
    if (this.count < this.capacity) this.count++;
  }

  toArray(): T[] {
    const result: T[] = [];
    for (let i = 1; i <= this.count; i++) {
      const idx = (this.head - i + this.capacity) % this.capacity;
      result.push(this.buf[idx] as T);
    }
    return result;
  }

  clear(): void {
    this.buf = new Array(this.capacity);
    this.head = 0;
    this.count = 0;
  }
}

const bufferSize = parseInt(process.env['CDP_BUFFER_SIZE'] ?? '500', 10);

export const consoleLogs = new RingBuffer<ConsoleLogEntry>(bufferSize);
export const wsFrames = new RingBuffer<WsFrameEntry>(bufferSize);
