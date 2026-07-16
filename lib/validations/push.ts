import { z } from 'zod';

export const pushSubscribeSchema = z.object({
  subscription: z.record(z.string(), z.unknown()),
});

export type PushSubscribeInput = z.infer<typeof pushSubscribeSchema>;
