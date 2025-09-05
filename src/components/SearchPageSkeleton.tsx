import { Skeleton } from "./ui/skeleton";

export default function SearchPageSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 ">
      <Skeleton className="h-82 my-3 w-full rounded-xl" />
      <Skeleton className="h-82 my-3 w-full rounded-xl" />
      <Skeleton className="h-82 my-3 w-full rounded-xl" />
      <Skeleton className="h-82 my-3 w-full rounded-xl" />
      <Skeleton className="h-82 my-3 w-full rounded-xl" />
      <Skeleton className="h-82 my-3 w-full rounded-xl" />
    </div>
  );
}
