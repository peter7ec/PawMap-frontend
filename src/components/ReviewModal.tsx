import { useForm, type SubmitHandler } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Rating, RatingButton } from "./ui/shadcn-io/rating";
import { Textarea } from "./ui/textarea";
import type { ReviewForm } from "@/schemas/reviewSchema";
import reviewSceham from "../schemas/reviewSchema";
import { reviewCreate, reviewEdit } from "../services/reviewService";
import { Alert, AlertTitle } from "./ui/alert";
import type { Review, ReviewCreatedResponse } from "@/types/reviewTypes";
import reviewArray from "../constants/reviewsRating";

export default function ReviewModal({
  locationName,
  locationId,
  userId,
  token,
  onReviewCreated,
  onReviewUpdated,
  open,
  onOpenChange,
  initialData,
}: {
  locationName: string;
  locationId: string;
  userId: string;
  token: string;
  onReviewCreated: (newReview: ReviewCreatedResponse) => void;
  onReviewUpdated: (updatedReview: ReviewCreatedResponse) => void;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialData?: Review | null;
}) {
  const isEditing = !!initialData;
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSceham),
    defaultValues: {
      locationId,
      userId,
      comment: initialData?.comment || "",
      rating: initialData?.rating || 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [ratingValue, setRatingValue] = useState(initialData?.rating || 0);

  useEffect(() => {
    if (initialData) {
      reset({
        locationId,
        userId,
        comment: initialData.comment,
        rating: initialData.rating,
      });
      setRatingValue(initialData.rating);
    } else {
      reset({
        locationId,
        userId,
        comment: "",
        rating: 0,
      });
      setRatingValue(0);
    }
  }, [initialData, reset, locationId, userId]);

  const onSubmit: SubmitHandler<ReviewForm> = useCallback(
    async (data) => {
      setLoading(true);
      setApiError("");

      try {
        if (isEditing && initialData?.id) {
          const response = await reviewEdit(
            token,
            data.locationId,
            initialData.id,
            data.comment,
            data.rating
          );
          onReviewUpdated(response.data);
        } else {
          const response = await reviewCreate(
            token,
            locationId,
            data.comment,
            data.rating
          );
          onReviewCreated(response.data);
        }
      } catch (error) {
        setApiError(
          error instanceof Error ? error.message : "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      isEditing,
      initialData,
      token,
      locationId,
      onReviewUpdated,
      onReviewCreated,
      setLoading,
      setApiError,
    ]
  );

  let buttonContent;
  if (loading) {
    buttonContent = (
      <>
        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        Submitting...
      </>
    );
  } else if (isEditing) {
    buttonContent = "Update";
  } else {
    buttonContent = "Save";
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Review ${locationName}` : `Review`}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your opinion."
              : `Tell us your opinion about ${locationName}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="description">Comment</Label>
              <Textarea
                id="comment"
                className="resize-none h-[150px]"
                {...register("comment")}
              />
              {errors.comment && (
                <p className="text-sm text-red-600">{errors.comment.message}</p>
              )}
            </div>
            <div className="grid gap-3">
              <Label>Rating</Label>
              <Rating
                value={ratingValue}
                onValueChange={(newValue) => {
                  setRatingValue(newValue);
                  setValue("rating", newValue, { shouldValidate: true });
                }}
              >
                {reviewArray.map((review) => (
                  <RatingButton key={review} />
                ))}
              </Rating>
              {errors.rating && (
                <p className="text-sm text-red-600">{errors.rating.message}</p>
              )}
            </div>
            {apiError && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>{apiError}</AlertTitle>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {buttonContent}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
