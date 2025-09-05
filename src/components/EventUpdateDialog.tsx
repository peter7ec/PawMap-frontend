import { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { CircleX } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import AuthContext from "../contexts/AuthContext";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  type UpdateEventSchema,
  updateEventSchema,
} from "../schemas/eventCreationSchema";
import updateEvent from "../services/updateEvent";
import EventDatePicker from "./EventDatePicker";
import EventLocationSearchDialog from "./EventLocationSearchDialog";
import { Textarea } from "./ui/textarea";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (
    id: string,
    title: string,
    description: string,
    address: string,
    startsAt: Date,
    locationId: string,
    endsAt: Date
  ) => void;
  selectedEventId: string;
  selectedEventTitle: string;
  selectedEventAddress: string;
  selectedEventDescription: string;
  selectedEventLocationId: string;
  selectedEventStartsAt: Date;
  selectedEventEndsAt: Date;
};

export default function EventUpdateDialog({
  open,
  onOpenChange,
  onSelect,
  selectedEventId,
  selectedEventAddress,
  selectedEventDescription,
  selectedEventTitle,
  selectedEventLocationId,
  selectedEventStartsAt,
  selectedEventEndsAt,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const today = useMemo(() => new Date(), []);
  const [startsAtDate, setStartsAtDate] = useState<Date | undefined>(today);
  const [startsAtTime, setStartsAtTime] = useState<string>("10:30:00");

  const [endsAtDate, setEndsAtDate] = useState<Date | undefined>(today);
  const [endsAtTime, setEndsAtTime] = useState<string>("10:30:00");

  const [locationName, setLocationName] = useState<string | null>(null);
  const [locationImage, setLocationImage] = useState<string | null>(null);
  const [locationAddress, setLocationAddress] = useState<string | null>(null);

  const auth = useContext(AuthContext);
  const token = useMemo(() => auth?.user?.token ?? null, [auth?.user?.token]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<UpdateEventSchema>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      title: selectedEventTitle || "",
      address: selectedEventAddress || "",
      description: selectedEventDescription || "",
      startsAt: selectedEventStartsAt,
      endsAt: selectedEventEndsAt,
    },
  });

  useEffect(() => {
    if (startsAtDate && startsAtTime) {
      const [hours, minutes, seconds] = startsAtTime.split(":").map(Number);
      const date = new Date(startsAtDate);
      date.setHours(hours, minutes, seconds);
      setValue("startsAt", date);
    }
  }, [startsAtDate, startsAtTime, setValue]);

  useEffect(() => {
    if (endsAtDate && endsAtTime) {
      const [hours, minutes, seconds] = endsAtTime.split(":").map(Number);
      const date = new Date(endsAtDate);
      date.setHours(hours, minutes, seconds);
      setValue("endsAt", date);
    }
  }, [endsAtDate, endsAtTime, setValue]);
  useEffect(() => {
    reset({
      title: selectedEventTitle || "",
      address: selectedEventAddress || "",
      description: selectedEventDescription || "",
      startsAt: selectedEventStartsAt,
      endsAt: selectedEventEndsAt,
    });
  }, [
    selectedEventAddress,
    selectedEventTitle,
    selectedEventStartsAt,
    selectedEventEndsAt,
    selectedEventDescription,
    reset,
  ]);

  const cleanPayload = useCallback(
    (data: UpdateEventSchema): Partial<UpdateEventSchema> => {
      const entries = Object.entries(data).filter(([val]) => {
        if (typeof val === "string") return val.trim() !== "";
        return val !== undefined && val !== null;
      });
      return Object.fromEntries(entries) as Partial<UpdateEventSchema>;
    },
    []
  );

  const onSubmit = useCallback(
    async (data: UpdateEventSchema) => {
      if (!selectedEventId) {
        setSubmissionError("Invalid Event ID");
        return;
      }
      if (!token) {
        setSubmissionError("You must be logged in first");
        return;
      }

      setIsSubmitting(true);
      setSubmissionError(null);

      try {
        const payload = cleanPayload(data);

        if (Object.keys(payload).length === 0) {
          setIsSubmitting(false);
          setSubmissionError("Adj meg legalább egy módosítást.");
          return;
        }

        const normalizedPayload = {
          ...payload,
          startsAt: payload.startsAt
            ? payload.startsAt.toISOString()
            : undefined,
          endsAt: payload.endsAt ? payload.endsAt.toISOString() : undefined,
        };

        await updateEvent(token, selectedEventId, normalizedPayload);

        onSelect(
          selectedEventId,
          payload.title ?? selectedEventTitle ?? "",
          payload.description ?? selectedEventDescription ?? "",
          payload.address ?? selectedEventAddress ?? "",
          new Date(payload.startsAt ?? selectedEventStartsAt),
          payload.locationId ?? selectedEventLocationId ?? "",
          new Date(payload.endsAt ?? selectedEventEndsAt)
        );

        setIsSubmitting(false);
        onOpenChange(false);
      } catch (error) {
        setIsSubmitting(false);
        setSubmissionError("Failed to update");
      }
    },
    [
      selectedEventId,
      token,
      onSelect,
      setIsSubmitting,
      setSubmissionError,
      onOpenChange,
      selectedEventTitle,
      selectedEventAddress,
      selectedEventStartsAt,
      selectedEventEndsAt,
      selectedEventDescription,
      selectedEventLocationId,
      cleanPayload,
    ]
  );
  const handleSelect = useCallback(
    (id: string, name: string, address: string, img: string) => {
      setValue("locationId", id, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setLocationName(name);
      setLocationImage(img);
      setLocationAddress(address);
    },
    [setValue, setLocationName, setLocationImage, setLocationAddress]
  );

  const handleClick = useCallback(() => {
    setValue("locationId", null, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setLocationName(null);
    setLocationImage(null);
    setLocationAddress(null);
  }, [setValue, setLocationName, setLocationImage, setLocationAddress]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild />
      <DialogContent
        className="sm:w-[900px] sm:h-[730px] w-full sm:rounded-lg
          h-[90vh] flex flex-col
          p-0 sm:p-6 "
      >
        <DialogHeader className="p-4 sm:p-0">
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Update your event details
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 p-4 sm:p-6 max-w-4xl mx-auto"
            noValidate
          >
            <div className="flex flex-col">
              <Label htmlFor="eventTitle" className="mb-1 font-medium">
                Title:
              </Label>
              <Input
                id="eventTitle"
                type="text"
                {...register("title")}
                className={`border ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-invalid={errors.title ? "true" : "false"}
                aria-describedby="title-error"
              />
              {errors.title && (
                <p id="title-error" className="text-red-600 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className=" flex flex-col gap-4 ">
              <EventDatePicker
                date={startsAtDate}
                time={startsAtTime}
                setDate={setStartsAtDate}
                setTime={setStartsAtTime}
                fieldName="startsAt"
              />
              <EventDatePicker
                date={endsAtDate}
                time={endsAtTime}
                setDate={setEndsAtDate}
                setTime={setEndsAtTime}
                fieldName="endsAt"
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="address" className="mb-1 font-medium">
                Address
              </Label>
              <Input
                id="address"
                type="text"
                {...register("address")}
                className={`border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-invalid={errors.address ? "true" : "false"}
                aria-describedby="address-error"
              />
              {errors.address && (
                <p id="address-error" className="text-red-600 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <Label htmlFor="description" className="mb-1 font-medium">
                Description:
              </Label>
              <Textarea
                id="description"
                rows={5}
                {...register("description")}
                className={`mt-1 md:w-100 h-32 overflow-y-auto resize-none ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } `}
                aria-invalid={errors.description ? "true" : "false"}
                aria-describedby="description-error"
              />
              {errors.description && (
                <p id="description-error" className="text-red-600 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="relative inline-block w-full">
              {!locationName && (
                <EventLocationSearchDialog
                  onSelect={handleSelect}
                  selectedLocationName={locationName}
                />
              )}

              {locationName && (
                <div className="mt-3 flex items-center gap-4 p-3 border rounded-md bg-gray-50">
                  {locationImage && (
                    <img
                      src={locationImage}
                      alt={locationName}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{locationName}</span>
                    {locationAddress && (
                      <span className="text-sm text-gray-500">
                        {locationAddress}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    title="Clear selected location"
                    onClick={handleClick}
                    className="absolute top-5 right-3   text-gray-400 hover:text-red-500"
                  >
                    <CircleX />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                className="bg-gray-300 text-gray-700 hover:bg-gray-400"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 "
              >
                {isSubmitting ? "Updating..." : "Update Event"}
              </Button>
            </div>

            {submissionError && (
              <p className="text-red-600 text-center mt-4">{submissionError}</p>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
