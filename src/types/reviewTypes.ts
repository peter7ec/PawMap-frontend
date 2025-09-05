export type Review = {
  id: string;
  comment: string;
  createdAt: string;
  rating: number;
  user: {
    name: string;
    profile_avatar: string | null;
    id: string;
  };
};
export type ReviewCreatedResponse = {
  id: string;
  comment: string;
  rating: number;
  locationId: string;
  userId: string;
  createdAt: string;
};
