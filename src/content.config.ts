import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
    excerpt: z.string(),
    passwords: z.array(z.object({
      hash: z.string(),
      encryptedContent: z.string(),
    })).optional(),
    alasan: z.string().optional(),
  }),
});

export const collections = { blog };