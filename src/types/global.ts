export type ApiResponse<T> = {
  ok: boolean;
  message: string;
  data: T;
};
export type Location = {
  id: string;
  name: string;
  address: string;
  images: string[];
  description: string;
  createdById: string;
  createdAt: string;
  type: "RESTAURANT" | string;
  _count: {
    comments: number;
    events: number;
  };
  reviewStats: {
    average: number | null;
    count: number;
  };
};

export type LocationUpdate = Omit<Location, "address"> & {
  address: { city: string; street: string };
};
