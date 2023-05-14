import {PostWithUser} from "@/models/post";
import {UserWithoutPassword, getUserWithPostsIncludeRetweets} from "./user";

type TweetType = "post" | "retweet" | "like";

type Timeline = {
  type: TweetType;
  post: PostWithUser;
  user: UserWithoutPassword;
  activityAt: Date;
};

export const getuserTimeline = async (
  userId: number
): Promise<{user: UserWithoutPassword; timeline: Timeline[]} | null> => {
  const user = await getUserWithPostsIncludeRetweets(userId);
  if (!user) return null;

  const timeline = user.posts
    .map(
      (post): Timeline => ({
        type: "post" as const,
        post,
        user,
        activityAt: post.createdAt,
      })
    )
    .concat(
      user.retweets.map(retweet => ({
        type: "retweet" as const,
        post: retweet.post,
        user: retweet.user,
        activityAt: retweet.createdAt,
      }))
    );
  timeline.sort((a, b) => b.activityAt.getTime() - a.activityAt.getTime());
  return {user, timeline};
};
