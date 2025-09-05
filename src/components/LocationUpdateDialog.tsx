import { useEffect, useState, useContext, useCallback, useMemo } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import {
  updateLocation as updateLocationSchema,
  type UpdateLocationSchema,
} from "../schemas/locationSchema";
import updateLocation from "../services/updateLocation";
import { Textarea } from "./ui/textarea";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (
    id: string,
    name: string,
    city: string,
    street: string,
    img: string,
    locationType?: UpdateLocationSchema["type"],
    description?: string | null
  ) => void;
  selectedLocationId: string;
  selectedLocationName: string;
  selectedLocationStreet: string | null;
  selectedLocationImg?: string | null;
  selectedLocationType?: UpdateLocationSchema["type"];
  selectedLocationCity?: string | null;
  selectedLocationDescription?: string | null;
};

export default function LocationUpdateDialog({
  open,
  onOpenChange,
  onSelect,
  selectedLocationId,
  selectedLocationName,
  selectedLocationStreet,
  selectedLocationImg,
  selectedLocationType,
  selectedLocationCity,
  selectedLocationDescription,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>(
    selectedLocationImg ? [selectedLocationImg] : []
  );
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const auth = useContext(AuthContext);
  const token = useMemo(() => auth?.user?.token ?? null, [auth?.user?.token]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<UpdateLocationSchema>({
    resolver: zodResolver(updateLocationSchema),
    defaultValues: {
      name: selectedLocationName || "",
      address: {
        street: selectedLocationStreet || "",
        city: selectedLocationCity || "",
      },
      description: selectedLocationDescription || "",
      type: selectedLocationType,
      images: undefined,
    },
  });

  useEffect(() => {
    reset({
      name: selectedLocationName || "",
      address: {
        street: selectedLocationStreet || "",
        city: selectedLocationCity || "",
      },
      description: selectedLocationDescription || "",
      type: selectedLocationType,
      images: undefined,
    });
    setUploadedImageUrls(selectedLocationImg ? [selectedLocationImg] : []);
  }, [
    selectedLocationName,
    selectedLocationStreet,
    selectedLocationCity,
    selectedLocationDescription,
    selectedLocationType,
    selectedLocationImg,
    reset,
  ]);

  const watchedLocationType = watch("type");

  const cleanPayload = useCallback(
    (data: UpdateLocationSchema): Partial<UpdateLocationSchema> => {
      const entries = Object.entries(data).filter(([key, val]) => {
        if (key === "images") return Array.isArray(val) && val.length > 0;
        if (typeof val === "string") return val.trim() !== "";
        return val !== undefined && val !== null;
      });
      return Object.fromEntries(entries) as Partial<UpdateLocationSchema>;
    },
    []
  );

  const onSubmit = useCallback(
    async (data: UpdateLocationSchema) => {
      if (!selectedLocationId) {
        setSubmissionError("Invalid location ID.");
        return;
      }
      try {
        if (!token) {
          setSubmissionError("You must be logged in to update a location.");
          return;
        }
        setIsSubmitting(true);
        setSubmissionError(null);

        const payload = cleanPayload(data);
        if (Object.keys(payload).length === 0) {
          setIsSubmitting(false);
          setSubmissionError("Provide at least on data change.");
          return;
        }

        await updateLocation(token!, selectedLocationId, payload);

        onSelect(
          selectedLocationId,
          payload.name ?? selectedLocationName ?? "",
          payload.address?.city ?? selectedLocationCity ?? "",
          payload.address?.street ?? selectedLocationStreet ?? "",
          (payload.images && payload.images.length > 0
            ? uploadedImageUrls[0]
            : selectedLocationImg) || "",
          payload.type ?? selectedLocationType,
          payload.description ?? selectedLocationDescription ?? null
        );

        setIsSubmitting(false);
        onOpenChange(false);
      } catch (e: any) {
        setIsSubmitting(false);
        setSubmissionError(e?.message || "Failed to update location");
      }
    },
    [
      cleanPayload,
      onOpenChange,
      onSelect,
      selectedLocationCity,
      selectedLocationDescription,
      selectedLocationId,
      selectedLocationImg,
      selectedLocationName,
      selectedLocationStreet,
      selectedLocationType,
      token,
      uploadedImageUrls,
    ]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition"
          aria-label="Edit location"
          type="button"
        />
      </DialogTrigger>

      <DialogContent className="sm:w-[900px] sm:h-[690px] w-full sm:rounded-lg h-[91vh] flex flex-col p-0 sm:p-6">
        <DialogHeader className=" p-4 sm:p-6 border-b sticky top-0 bg-white z-10:p-0">
          <DialogTitle className="text-lg sm:text-xl">
            Update your location details
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 h-auto max-h-[100vh] sm:max-h-full sm:overflow-visible">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col  p-4 sm:p-6"
            noValidate
          >
            <div className="flex flex-col gap-1">
              <Label htmlFor="locationName" className="text-sm font-medium">
                Location Name
              </Label>
              <Input
                id="locationName"
                type="text"
                {...register("name")}
                className={`border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md p-2`}
              />
              <p className="text-sm text-red-500 min-h-[1.25rem]">
                {errors.name?.message}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <Label
                htmlFor="locationStreetAddress"
                className="text-sm font-medium"
              >
                City
              </Label>
              <Input
                id="city"
                type="text"
                {...register("address.city")}
                className={`border ${
                  errors.address?.city ? "border-red-500" : "border-gray-300"
                } rounded-md p-2`}
              />
              <p className="text-sm text-red-500 min-h-[1.25rem]">
                {errors.address?.city?.message}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <Label
                htmlFor="locationStreetAddress"
                className="text-sm font-medium"
              >
                Address
              </Label>
              <Input
                id="strees"
                type="text"
                {...register("address.street")}
                className={`border ${
                  errors.address?.street ? "border-red-500" : "border-gray-300"
                } rounded-md p-2`}
              />
              <p className="text-sm text-red-500 min-h-[1.25rem]">
                {errors.address?.street?.message}
              </p>
            </div>
            <div className="flex flex-col gap-2 ">
              <Label className="block text-sm font-medium ">
                Location Type
              </Label>
              <Select
                value={watchedLocationType}
                onValueChange={(val: string) =>
                  setValue("type", val as UpdateLocationSchema["type"], {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a location type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PARK">Park</SelectItem>
                  <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                  <SelectItem value="HOTEL">Hotel</SelectItem>
                  <SelectItem value="MUSEUM">Museum</SelectItem>
                  <SelectItem value="STORE">Store</SelectItem>
                  <SelectItem value="CAFÉ">Café</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1 m">
              <Label
                htmlFor="locationDescription"
                className="text-sm font-medium"
              >
                Description
              </Label>
              <Textarea
                {...register("description")}
                id="locationDescription"
                className={`border resize-none break-words break ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 max-h-20  overflow-y-auto`}
              />

              <p className="text-sm text-red-500 min-h-[1.25rem]">
                {errors.description?.message}
              </p>
            </div>

            {submissionError && (
              <p className="text-red-600 font-medium mt-2">{submissionError}</p>
            )}

            <div className="flex justify-end space-x-3 mt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 transition "
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
