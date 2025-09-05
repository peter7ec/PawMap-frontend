import type { LocationType } from "./locationTypes";

export type Favorite = {
  id: string;
  userId: string;
  locationId: string;
  user: {
    id: string;
    name: string;
  };
  location: {
    id: string;
    name: string;
    address: string;
    _count: {
      comments: number;
      events: number;
      reviews: number;
    };
    images: string[];
    description: string;
    type: LocationType;
    reviewAverage: number;
  };
};
