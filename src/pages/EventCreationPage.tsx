import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { CircleX } from "lucide-react";
import { useNavigate } from "react-router";
import AuthContext from "../contexts/AuthContext";
import {
  createEventSchema,
  type CreateEventSchema,
} from "../schemas/eventCreationFormData";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import addNewEvent from "../services/addNewEvent";
import park from "../assets/Park.jpg";
import EventDatePicker from "../components/EventDatePicker";
import { Textarea } from "../components/ui/textarea";
import EventLocationSearchDialog from "../components/EventLocationSearchDialog";
import { getCombinedDateTime } from "../lib/utils";

export default function EventCreationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);

  const [startsAtDate, setStartsAtDate] = useState<Date | undefined>(today);
  const [startsAtTime, setStartsAtTime] = useState<string>("10:30:00");

  const [endsAtDate, setEndsAtDate] = useState<Date | undefined>(today);
  const [endsAtTime, setEndsAtTime] = useState<string>("10:30:00");

  const [locationName, setLocationName] = useState<string | null>(null);
  const [locationImage, setLocationImage] = useState<string | null>(null);
  const [locationAddress, setLocationAddress] = useState<string | null>(null);

  const auth = useContext(AuthContext);
  const token = auth!.user?.token;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      locationId: null,
      address: "",
      title: "",
      description: "",
      startsAt: today,
      endsAt: today,
    },
  });

  useEffect(() => {
    const combined = getCombinedDateTime(startsAtDate, startsAtTime);
    if (combined) {
      setValue("startsAt", combined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [startsAtDate, startsAtTime, setValue]);

  useEffect(() => {
    const combined = getCombinedDateTime(endsAtDate, endsAtTime);
    if (combined) {
      setValue("endsAt", combined, { shouldValidate: true, shouldDirty: true });
    }
  }, [endsAtDate, endsAtTime, setValue]);

  const onSubmit: SubmitHandler<CreateEventSchema> = useCallback(
    async (data: CreateEventSchema) => {
      setIsSubmitting(true);
      try {
        if (!token) {
          setSubmissionError("User is not authenticated");
          return;
        }

        await addNewEvent(data, token);
        reset();
        setLocationName(null);
        setSubmissionError(null);
        setEndsAtDate(today);
        setStartsAtDate(today);
        setStartsAtTime("10:30:00");
        setEndsAtTime("10:30:00");
        navigate("/my-events");
      } catch (error) {
        setSubmissionError("Failed to create event");
      } finally {
        setIsSubmitting(false);
      }
    },
    [token, reset, today, navigate]
  );

  return (
    <div className="max-w-full lg:max-w-6xl mx-auto my-10 p-4 sm:p-6 lg:p-10">
      <Card className="p-4 sm:p-6 w-full space-y-6 lg:p-10 overflow-auto">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="w-full lg:w-2/5">
            <img
              src={park}
              alt="park img"
              className="w-full  aspect-video lg:aspect-auto my-4 object-cover rounded-lg"
            />
          </div>

          <div className="w-full lg:w-2/3">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">
              Create New Event
            </h1>

            {submissionError && (
              <p className="text-sm text-red-500">{submissionError}</p>
            )}

            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3 sm:space-y-4"
            >
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  {...register("title")}
                  className={`mt-1  ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.title && (
                  <p className="text-xs sm:text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  {...register("description")}
                  className={`mt-1 h-32 overflow-y-auto w-full resize-none ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } `}
                  rows={5}
                  placeholder="Tell us about your event..."
                />
                {errors.description && (
                  <p className="text-xs sm:text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  type="text"
                  {...register("address")}
                  className={`mt-1 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.address && (
                  <p className="text-xs sm:text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              <div className="relative inline-block w-full">
                {!locationName && (
                  <EventLocationSearchDialog
                    onSelect={(id, name, address, img) => {
                      setValue("locationId", id, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setLocationName(name);
                      setLocationImage(img);
                      setLocationAddress(address);
                    }}
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
                      onClick={() => {
                        setValue("locationId", null, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        setLocationName(null);
                        setLocationImage(null);
                        setLocationAddress(null);
                      }}
                      className="absolute top-5 right-3   text-gray-400 hover:text-red-500"
                    >
                      <CircleX />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? "Creating.." : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}
