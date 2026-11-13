import { createHandler } from './handler.mjs';

declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (request: Request) => Promise<Response>): void;
};

Deno.serve(createHandler({ env: (name: string) => Deno.env.get(name), fetch }));
