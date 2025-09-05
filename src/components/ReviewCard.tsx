import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Review } from "../types/reviewTypes";
import formatDate from "../services/formatDate";
import { Rating, RatingButton } from "./ui/shadcn-io/rating";
import reviewArray from "../constants/reviewsRating";
import CommentActions from "../features/comments/components/CommentActions";

interface ReviewCardProps {
  review: Review;
  onEditClick: (reviewToEdit: Review) => void;
  onDeleteClick: (reviewId: string) => void;
  currentUserId?: string;
}

export default function ReviewCard({
  review,
  onEditClick,
  onDeleteClick,
  currentUserId,
}: ReviewCardProps) {
  const { comment, createdAt, rating, id: reviewId } = review;
  const { name, profile_avatar: avatar, id: reviewUserId } = review.user;
  const isOwnReview = currentUserId === reviewUserId;

  return (
    <div className="flex gap-4 group">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar || undefined} alt={name} />
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(createdAt)}
            </p>
          </div>
          {isOwnReview && (
            <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <CommentActions
                isOwner={isOwnReview}
                onEdit={() => onEditClick(review)}
                onDelete={() => onDeleteClick(reviewId)}
              />
            </div>
          )}
        </div>

        {comment && (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap pb-2">
            {comment}
          </p>
        )}
        <Rating value={rating} readOnly>
          {reviewArray.map((reviews) => (
            <RatingButton key={reviews} className="text-yellow-300" />
          ))}
        </Rating>
      </div>
    </div>
  );
}
