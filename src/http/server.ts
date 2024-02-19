import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import cors from "@fastify/cors";

const prisma = new PrismaClient();

const app = fastify();

await app.register(cors, {});

app.get("/posts", async () => {
  const result = await prisma.posts.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
});

app.get("/posts/:id", async (request) => {
  return prisma.posts.findFirst({
    where: {
      id: request.params.id,
    },
  });
});

app.post("/posts", async (request, reply) => {
  const createPostBody = z.object({
    title: z.string(),
    content: z.string(),
    description: z.string(),
    imageUrl: z.string(),
    category: z.string(),
  });

  const post = createPostBody.parse(request.body);

  const resul = await prisma.posts.create({
    data: {
      title: post.title,
      content: post.content,
      description: post.description,
      imageUrl: post.imageUrl,
      category: post.category,
    },
  });
  return reply.status(201).send(resul);
});

app.put("/posts/:id", async (request) => {
  return prisma.posts.update({
    data: request.body as any,
    where: {
      id: request.params.id,
    },
  });
});

app.delete("/posts/:id", async (request) => {
  return prisma.posts.delete({
    where: {
      id: request.params.id,
    },
  });
});

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server rodando");
});
