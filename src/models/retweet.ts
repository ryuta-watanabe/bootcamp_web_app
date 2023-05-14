import {databaseManager} from "@/db/index";
import {PostWithUser} from "@/models/post";
import {UserWithoutPassword} from "@/models/user";
import {Retweet} from "@prisma/client";

type RetweetData = Pick<Retweet, "userId" | "postId">;

export const getPostRetweetedCount = async (
  postId: number
): Promise<number> => {
  const prisma = databaseManager.getInstance();
  const count = await prisma.retweet.count({
    where: {
      postId,
    },
  });
  return count;
};

export const createRetweet = async (
  retweetData: RetweetData
): Promise<Retweet> => {
  const prisma = databaseManager.getInstance();
  const retweet = await prisma.retweet.create({
    data: retweetData,
  });
  return retweet;
};

export const deleteRetweet = async (
  retweetData: RetweetData
): Promise<Retweet> => {
  const prisma = databaseManager.getInstance();
  const retweet = await prisma.retweet.delete({
    where: {
      /* eslint-disable camelcase */
      userId_postId: {
        userId: retweetData.userId,
        postId: retweetData.postId,
      },
      /* eslint-enable camelcase */
    },
  });
  return retweet;
};

export const hasUserRetweetedPost = async (
  userId: number,
  postId: number
): Promise<boolean> => {
  const prisma = databaseManager.getInstance();
  const retweet = await prisma.retweet.findFirst({
    where: {
      userId,
      postId,
    },
  });
  return retweet !== null;
};

export const getAllRetweets = async (): Promise<
  Array<{createdAt: Date; user: UserWithoutPassword; post: PostWithUser}>
> => {
  const prisma = databaseManager.getInstance();
  const retweets = await prisma.retweet.findMany({
    select: {
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          imageName: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      post: {
        select: {
          id: true,
          content: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              imageName: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });

  return retweets;
};
