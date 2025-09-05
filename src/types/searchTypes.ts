import type { Event } from "./eventTypes";
import type { LocationType } from "./locationTypes";

export type SearchData = {
  id: string;
  name: string;
  address: string;
  images: string[];
  createdById: string;
  createdAt: Date;
  type: LocationType;
  _count: {
    comments: number;
    events: number;
  };
  reviewStats: {
    average: null | number;
    count: number;
  };
};
export type SearchResult = {
  ok: boolean;
  message: string;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  data: SearchData[];
};
export type EventSearchResult = {
  ok: boolean;
  message: string;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  data: Event[];
};
