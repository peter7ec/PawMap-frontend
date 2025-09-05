import type { CommentForLocation } from "./commentTypes";
import type { Event } from "./eventTypes";
import type { Review } from "./reviewTypes";

export type Location = {
  id: string;
  name: string;
  description: string;
  address: string;
  images: string[];
  createdById: string;
  createdAt: string;
  type: LocationType;
  reviews: Review[];
  comments: CommentForLocation[];
  events: Event[];
  createdBy: { name: string };
  lat: number | null;
  lon: number | null;
};
export enum LocationType {
  PARK = "PARK",
  RESTAURANT = "RESTAURANT",
  HOTEL = "HOTEL",
  MUSEUM = "MUSEUM",
  STORE = "STORE",
  CAFÉ = "CAFÉ",
  OTHER = "OTHER",
}
