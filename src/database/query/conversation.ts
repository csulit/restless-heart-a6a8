import { asc, gt } from 'drizzle-orm';
import db from '..';
import { conversation as conversationSchema } from '../schema';

export const findMany = async (
  limit = 10,
  cursor?: {
    id: number;
  }
) => {
  const conversations = await db
    .select()
    .from(conversationSchema)
    .where(cursor ? gt(conversationSchema.id, cursor.id) : undefined)
    .limit(limit)
    .orderBy(asc(conversationSchema.id));

  let nextCursor: typeof cursor | undefined;

  if (conversations.length > limit) {
    const nextItem = conversations.pop();
    nextCursor = {
      id: nextItem!.id,
    };
  }

  let prevCursor: typeof cursor | undefined;
  if (cursor) {
    prevCursor = {
      id: conversations[conversations.length - 1]?.id,
    };
  }

  return {
    conversations,
    nextCursor,
    prevCursor,
  };
};

export const findOne = async (conversationId: number) => {
  const conversation = await db.query.conversation.findFirst({
    where: (c, { eq }) => eq(c.id, conversationId),
    with: {
      messages: {
        with: {
          sender: true,
          attachments: true,
        },
      },
      customer: true,
      supportAgent: true,
    },
  });

  if (!conversation) {
    return null;
  }

  return conversation;
};
