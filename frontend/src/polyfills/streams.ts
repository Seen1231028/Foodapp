// Polyfill for TextEncoderStream / TextDecoderStream when running Next.js on Bun
// Bun (as of 1.1.22) doesn't yet expose these globals expected by Next edge runtime ponyfills.
// We install web-streams-polyfill and map its TransformStream-based encoder/decoder.

import 'web-streams-polyfill';

// Very lightweight shim: implement TextEncoderStream & TextDecoderStream using existing TextEncoder/TextDecoder
// if they are missing.

if (typeof (globalThis as any).TextEncoderStream === 'undefined') {
  class TextEncoderStreamShim {
    private _encoder = new TextEncoder();
    readable: ReadableStream<Uint8Array>;
    writable: WritableStream<string>;
    constructor() {
      const transformer = {
        start() {},
        transform: (chunk: string, controller: TransformStreamDefaultController<Uint8Array>) => {
          controller.enqueue(this._encoder.encode(chunk));
        }
      };
      const { readable, writable } = new TransformStream<string, Uint8Array>(transformer);
      this.readable = readable;
      this.writable = writable;
    }
  }
  (globalThis as any).TextEncoderStream = TextEncoderStreamShim as any;
}

if (typeof (globalThis as any).TextDecoderStream === 'undefined') {
  class TextDecoderStreamShim {
    private _decoder: TextDecoder;
    readable: ReadableStream<string>;
    writable: WritableStream<Uint8Array>;
    constructor(label?: string, options?: TextDecoderOptions) {
      this._decoder = new TextDecoder(label, options);
      const transformer = {
        start() {},
        transform: (chunk: Uint8Array, controller: TransformStreamDefaultController<string>) => {
          controller.enqueue(this._decoder.decode(chunk, { stream: true }));
        },
        flush: (controller: TransformStreamDefaultController<string>) => {
          const tail = this._decoder.decode();
          if (tail) controller.enqueue(tail);
        }
      };
      const { readable, writable } = new TransformStream<Uint8Array, string>(transformer);
      this.readable = readable;
      this.writable = writable;
    }
  }
  (globalThis as any).TextDecoderStream = TextDecoderStreamShim as any;
}
