import { Skeleton } from "./ui/skeleton";

export default function LocationPageSkeleton() {
  return (
    <div className="w-8/10 h-120 px-4 m-auto">
      <Skeleton className="h-10 my-3 w-1/2 rounded-xl" />
      <Skeleton className="h-4 my-3 w-2/3 rounded-xl" />
      <Skeleton className="h-8/10 my-3 rounded-xl" />
    </div>
  );
}
