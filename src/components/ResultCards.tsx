import { useNavigate } from "react-router";
import { useCallback, useContext, useState } from "react";
import { CalendarDays, Heart, MessageSquareText, Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import type { SearchData } from "../types/searchTypes";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import AuthContext from "../contexts/AuthContext";
import SearchDialog from "./SearchDialog";

interface SearchResultCardProps {
  result: SearchData;
  isFavorite: boolean;
  onToggleFavorite: (locationId: string) => void;
}

export default function SearchResultCard({
  result,
  isFavorite,
  onToggleFavorite,
}: SearchResultCardProps) {
  const auth = useContext(AuthContext);

  const navigate = useNavigate();

  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const handleClick = useCallback(() => {
    navigate(`/location/${result.id}`);
  }, [navigate, result.id]);

  const handleFavClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!auth?.user) {
        setIsLoginDialogOpen(true);
        return;
      }
      onToggleFavorite(result.id);
    },
    [auth?.user, onToggleFavorite, result.id]
  );

  return (
    <div className="w-full my-3">
      <Card
        className="flex flex-col h-full cursor-pointer gap-0 py-0 overflow-hidden animate-in fade-in-5 [animation-duration:700ms] transition-all ease-in-out hover:scale-105 [transition-duration:300ms]"
        onClick={handleClick}
      >
        <div className="relative">
          <img
            src={result.images[0]}
            alt={result.name}
            className="h-48 w-full object-cover"
          />
          <Heart
            className={`absolute top-3 right-3 h-8 w-8 cursor-pointer transition-all ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "fill-white/75 text-white"
            }`}
            onClick={handleFavClick}
          />
        </div>

        <CardContent className=" flex flex-col p-4 pb-0">
          <h3 className="text-lg font-semibold">{result.name}</h3>
          <div className="flex justify-between mt-4">
            <div className="flex items-center">
              <MessageSquareText size={20} />
              {result._count.comments}
            </div>
            <div className="flex items-center">
              <CalendarDays size={20} />
              {result._count.events}
            </div>
            <div className="flex items-center">
              <Star size={20} />
              {result.reviewStats?.average !== null
                ? result.reviewStats.average.toFixed(1)
                : "N/A"}
            </div>
          </div>
          <Badge className="mt-2" variant={result.type}>
            {result.type}
          </Badge>
        </CardContent>
        <div className="flex-grow" />

        <Separator className="my-2" />

        <div className="mx-4 mb-2">
          <p className="text-sm text-muted-foreground">{result.address}</p>
        </div>
      </Card>
      <SearchDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
      />
    </div>
  );
}
