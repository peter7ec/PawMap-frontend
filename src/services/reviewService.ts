import type { ApiResponse } from "@/types/global";
import { API_URL } from "../constants/environment";
import type { ReviewCreatedResponse } from "@/types/reviewTypes";

export async function reviewCreate(
  token: string,
  locationId: string,
  comment: string,
  rating: number
): Promise<ApiResponse<ReviewCreatedResponse>> {
  const res = await fetch(`${API_URL}/api/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      comment,
      rating,
      locationId,
    }),
  });

  if (!res.ok) {
    try {
      const errorData: ApiResponse<null> = await res.json();

      throw new Error(
        errorData.message || "An unknown backend error occurred."
      );
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }

      const errorText = await res.text();
      throw new Error(
        `Backend error: ${res.status} - ${errorText || "No response text."}`
      );
    }
  }

  return res.json() as Promise<ApiResponse<ReviewCreatedResponse>>;
}

export async function reviewDetele(
  token: string,
  reviewId: string
): Promise<ApiResponse<ReviewCreatedResponse>> {
  const res = await fetch(`${API_URL}/api/review/${reviewId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    try {
      const errorData: ApiResponse<null> = await res.json();

      throw new Error(
        errorData.message || "An unknown backend error occurred."
      );
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }

      const errorText = await res.text();
      throw new Error(
        `Backend error: ${res.status} - ${errorText || "No response text."}`
      );
    }
  }
  return res.json() as Promise<ApiResponse<ReviewCreatedResponse>>;
}

export async function reviewEdit(
  token: string,
  locationId: string,
  reviewId: string,
  comment: string,
  rating: number
): Promise<ApiResponse<ReviewCreatedResponse>> {
  const res = await fetch(`${API_URL}/api/review/${reviewId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      comment,
      rating,
      locationId,
    }),
  });

  if (!res.ok) {
    try {
      const errorData: ApiResponse<null> = await res.json();

      throw new Error(
        errorData.message || "An unknown backend error occurred."
      );
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }

      const errorText = await res.text();
      throw new Error(
        `Backend error: ${res.status} - ${errorText || "No response text."}`
      );
    }
  }
  return res.json() as Promise<ApiResponse<ReviewCreatedResponse>>;
}
