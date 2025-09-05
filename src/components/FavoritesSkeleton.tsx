import { Skeleton } from "./ui/skeleton";

export default function FavoritesSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-82 my-3 w-full rounded-xl" />
      <Skeleton className="h-82 my-3 w-full rounded-xl" />
      <Skeleton className="h-82 my-3 w-full rounded-xl" />
      <Skeleton className="h-82 my-3 w-full rounded-xl" />
      <Skeleton className="h-82 my-3 w-full rounded-xl" />
      <Skeleton className="h-82 my-3 w-full rounded-xl" />
    </div>
  );
}
