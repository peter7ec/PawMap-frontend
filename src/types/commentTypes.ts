export type CommentForLocation = {
  user: {
    id: string;
    name: string;
    profile_avatar: string | null;
  };
  content: string;
  createdAt: string;
  _count: {
    replies: number;
  };
  id: string;
};
