import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  FileText,
  Info,
  MapPin,
  Star,
  Calendar as CalendarIcon,
} from "lucide-react";
import type { Location } from "../types/locationTypes";
import { LocationType } from "../types/locationTypes";
import { getOneLocation } from "../services/locationService";
import ImageCarousel from "../components/ImageCarousel";
import ReviewCard from "../components/ReviewCard";
import LocationPageSkeleton from "../components/LocationPageSkeleton";
import EventCard from "../components/EventCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import AuthContext from "../contexts/AuthContext";
import ReviewModal from "../components/ReviewModal";
import type { Review, ReviewCreatedResponse } from "../types/reviewTypes";
import { Button } from "../components/ui/button";
import { reviewDetele } from "../services/reviewService";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import useLocationComments from "../features/comments/useComments";
import LocationCommentsSection from "../features/comments/containers/CommentsSection";
import LocationMap from "../components/LocationMap";
import formatDate from "../services/formatDate";
import { Badge } from "../components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";

const locationPlaceHolder: Location = {
  id: "",
  name: "",
  description: "",
  address: "",
  images: [],
  createdById: "",
  createdAt: "",
  type: LocationType.CAFÉ,
  reviews: [],
  comments: [],
  events: [],
  createdBy: { name: "" },
  lon: null,
  lat: null,
};

export default function OneLocationDetailPage() {
  const auth = useContext(AuthContext);
  const { locationId } = useParams<{ locationId: string }>();

  const {
    comments: liveComments,
    create: createComment,
    update: updateComment,
    remove: removeComment,
    typing: typingComment,
    typingUserId,
    setComments: setLiveComments,
    buildTree,
  } = useLocationComments(
    "location",
    locationId ?? "",
    auth?.user ? { id: auth.user.id } : undefined
  );

  const [locationData, setLocationData] =
    useState<Location>(locationPlaceHolder);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [modalPreviews, setModalPreviews] = useState<string[]>([]);
  const [reviewToDeleteId, setReviewToDeleteId] = useState<string | null>(null);

  const hasUserReviewed = locationData.reviews.some(
    (review) => review.user.id === auth?.user?.id
  );

  const handleReviewCreated = useCallback(
    (newReviewData: ReviewCreatedResponse) => {
      if (!auth?.user) return;
      const fullNewReview: Review = {
        id: newReviewData.id,
        comment: newReviewData.comment,
        rating: newReviewData.rating,
        createdAt: newReviewData.createdAt,
        user: {
          id: auth.user.id,
          name: auth.user.name,
          profile_avatar: auth.user.profile_avatar,
        },
      };
      setLocationData((prev) => ({
        ...prev,
        reviews: [...prev.reviews, fullNewReview],
      }));
      setReviewModalOpen(false);
    },
    [auth?.user]
  );

  const handleReviewUpdated = useCallback(
    (updatedReviewData: ReviewCreatedResponse) => {
      setLocationData((prev) => ({
        ...prev,
        reviews: prev.reviews.map((r) =>
          r.id === updatedReviewData.id
            ? {
                ...r,
                comment: updatedReviewData.comment,
                rating: updatedReviewData.rating,
              }
            : r
        ),
      }));
      setReviewModalOpen(false);
    },
    []
  );

  useEffect(() => {
    if (!locationData?.comments) return;
    setLiveComments((prev) => {
      if (prev.length > 0) return prev;
      const mapped = locationData.comments.map((c: any) => ({
        id: c.id,
        locationId: locationData.id,
        userId: c.user.id,
        content: c.content,
        createdAt: c.createdAt,
        parentId: c.parentId ?? null,
        user: {
          id: c.user.id,
          name: c.user.name,
          profile_avatar: c.user.profile_avatar,
        },
        repliesCount: c._count?.replies ?? 0,
      }));
      return mapped;
    });
  }, [locationData, setLiveComments]);

  const handleConfirmDelete = async () => {
    if (!auth?.user?.token || !reviewToDeleteId) {
      setError("The deletion failed.");
      setReviewToDeleteId(null);
      return;
    }
    try {
      await reviewDetele(auth.user.token, reviewToDeleteId);
      setLocationData((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((r) => r.id !== reviewToDeleteId),
      }));
    } catch (err: any) {
      setError(err.message || "Failed to delete rating.");
    } finally {
      setReviewToDeleteId(null);
    }
  };

  const openReviewModal = useCallback((reviewToEdit: Review | null = null) => {
    setEditingReview(reviewToEdit);
    setReviewModalOpen(true);
  }, []);

  useEffect(() => {
    if (!locationId) return;
    const fetchLocation = async () => {
      try {
        setLoading(true);
        const data = await getOneLocation(locationId);
        setLocationData(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();
  }, [locationId, auth?.user?.id]);

  const handleImageClick = (clickedIndex: number) => {
    const { images } = locationData;
    const reordered = [
      ...images.slice(clickedIndex),
      ...images.slice(0, clickedIndex),
    ];
    setModalPreviews(reordered);
    setIsModalOpen(true);
  };
  if (loading) {
    return <LocationPageSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h2 className="text-2xl font-semibold text-destructive">Error</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  const averageRating =
    locationData.reviews.length > 0
      ? locationData.reviews.reduce((acc, r) => acc + r.rating, 0) /
        locationData.reviews.length
      : 0;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          {locationData.name}
        </h1>
        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{locationData.address}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <Carousel className="w-full m-0">
              <CarouselContent>
                {locationData.images.map((url, index) => (
                  <CarouselItem key={url}>
                    <div
                      className="relative aspect-video overflow-hidden rounded-lg cursor-pointer"
                      onClick={() => handleImageClick(index)}
                    >
                      <img
                        src={url}
                        alt={locationData.name}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <ImageCarousel
              previews={modalPreviews}
              modalOpen={isModalOpen}
              setModalOpen={setIsModalOpen}
            />
          </div>

          {locationData.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {locationData.description}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Reviews
                </CardTitle>
                {auth?.user && !hasUserReviewed && (
                  <Button onClick={() => openReviewModal(null)}>
                    Write a Review
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {locationData.reviews.length > 0 ? (
                <div className="space-y-6">
                  {locationData.reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      currentUserId={auth?.user?.id}
                      onEditClick={openReviewModal}
                      onDeleteClick={setReviewToDeleteId}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No reviews yet. Be the first to write one!
                </p>
              )}
            </CardContent>
          </Card>

          <LocationCommentsSection
            authUserId={auth?.user?.id}
            comments={liveComments}
            typingUserId={typingUserId}
            create={createComment}
            update={updateComment}
            remove={removeComment}
            typing={typingComment}
            buildTree={buildTree}
          />
        </div>

        <div className="lg:col-span-1 space-y-8 mt-8 lg:mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span>
                    {averageRating.toFixed(1)} ({locationData.reviews.length}{" "}
                    reviews)
                  </span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Type</span>
                <Badge variant={locationData.type}>{locationData.type}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Added by</span>
                <span>{locationData.createdBy.name}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Created</span>
                <span>{formatDate(locationData.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              {locationData.lat && locationData.lon ? (
                <LocationMap
                  lat={locationData.lat}
                  lon={locationData.lon}
                  name={locationData.name}
                  address={locationData.address}
                />
              ) : (
                <p className="text-muted-foreground">Map is not available.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {locationData.events.length > 0 ? (
                <div className="space-y-4">
                  {locationData.events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No upcoming events at this location.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {auth?.user && isReviewModalOpen && (
        <ReviewModal
          open={isReviewModalOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) setEditingReview(null);
            setReviewModalOpen(isOpen);
          }}
          locationName={locationData.name}
          locationId={locationData.id}
          userId={auth.user.id}
          token={auth.user.token}
          initialData={editingReview}
          onReviewCreated={handleReviewCreated}
          onReviewUpdated={handleReviewUpdated}
        />
      )}
      <DeleteConfirmationModal
        isOpen={!!reviewToDeleteId}
        onOpenChange={(isOpen) => !isOpen && setReviewToDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Are you sure to delete this review?"
        description="This action cannot be undone. The rating will be permanently deleted."
      />
    </div>
  );
}
