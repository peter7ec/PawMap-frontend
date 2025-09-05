import { useContext, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { createLocation } from "../services/locationService";
import uploadImagesToCloudinary, {
  deleteImagesByDeleteToken,
  type CloudinaryUploadResponse,
} from "../services/imageService";
import ImageUpload from "../components/ImageUpload";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { locationTypeImages } from "../constants/locations";
import { locationSchema } from "../schemas/locationSchema";
import AuthContext from "../contexts/AuthContext";
import { LocationType } from "../types/locationTypes";

type LocationFormData = z.infer<typeof locationSchema>;

export default function CreateLocationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const auth = useContext(AuthContext);
  const token = auth!.user?.token;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      address: { street: "", city: "" },
      description: "",
      images: [],
      type: LocationType.PARK,
    },
  });

  const watchedLocationType = watch("type");

  const onUploadComplete = useCallback(
    (_: string[], files: File[]) => {
      if (files && files.length > 0) {
        setValue("images", files, { shouldValidate: true });
        setImageUploadError(null);
      } else {
        setValue("images", [], { shouldValidate: true, shouldDirty: true });
      }
    },
    [setValue]
  );

  const onSubmit = useCallback(
    async (data: LocationFormData) => {
      setIsSubmitting(true);
      setImageUploadError(null);
      setSubmissionError(null);
      setSuccessMessage("");
      let imageUrls: CloudinaryUploadResponse[] = [];

      try {
        const uploadedUrls = await uploadImagesToCloudinary(
          data.images,
          "location_images"
        );
        imageUrls = uploadedUrls;
        const urls = imageUrls.map((url) => url.secure_url);

        const payload = {
          contentType: "LOCATION",
          name: data.name,
          address: {
            city: data.address.city,
            street: data.address.street,
          },
          description: data.description,
          images: urls,
          type: data.type,
          createdBy: auth?.user?.id,
        };

        if (!token) {
          setSubmissionError("You must be logged in to create a location.");
          setIsSubmitting(false);
          return;
        }

        await createLocation(payload, token);

        setSuccessMessage("Successfully added");
        reset();
        navigate("/my-locations");
      } catch (error) {
        await deleteImagesByDeleteToken(imageUrls);
        setSubmissionError("Failed to submit the form.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [token, reset, auth?.user?.id, navigate]
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card className="p-6 space-y-6 min-h-[950px] lg:min-h-[830px] md:min-h-[1150px]">
        <div className="flex flex-col lg:flex-row gap-6 max-h-screen">
          <div className="w-full lg:w-1/3">
            <img
              src={
                locationTypeImages[watchedLocationType] ||
                "/locationTypes/OTHER.jpg"
              }
              alt={watchedLocationType}
              className="w-full h-48 sm:h-64 md:h-80 lg:h-full object-cover rounded-lg"
            />
          </div>

          <div className="w-full lg:w-2/3 h-full flex flex-col">
            <h1 className="text-2xl font-bold mb-4 shrink-0">
              Create New Location
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 flex-grow"
              noValidate
            >
              <div>
                <Label className="block text-sm font-medium mb-1">Name</Label>
                <Input
                  {...register("name")}
                  className={`${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <p className="text-sm text-red-500 min-h-[1.25rem]">
                  {errors.name?.message}
                </p>
              </div>
              <div>
                <Label className="block text-sm font-medium mb-1">City</Label>
                <Input
                  {...register("address.city")}
                  className={`${
                    errors.address?.city ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <p className="text-sm text-red-500 min-h-[1.25rem]">
                  {errors.address?.city?.message}
                </p>
              </div>

              <div>
                <Label className="block text-sm font-medium mb-1">
                  Street Address
                </Label>
                <Input
                  {...register("address.street")}
                  className={`${
                    errors.address?.street
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <p className="text-sm text-red-500 min-h-[1.25rem]">
                  {errors.address?.street?.message}
                </p>
              </div>

              <div>
                <Label className="block text-sm font-medium mb-1">
                  Location Type
                </Label>
                <Select
                  value={watchedLocationType}
                  onValueChange={(value: LocationFormData["type"]) =>
                    setValue("type", value, {
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

              <div>
                <Label className="block text-sm font-medium mb-1">
                  Description
                </Label>
                <Textarea
                  {...register("description")}
                  rows={4}
                  className={`${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } resize-none`}
                />
                <p className="text-sm text-red-500 min-h-[1.25rem]">
                  {errors.description?.message}
                </p>
              </div>

              <div>
                <Label className="block mb-2 font-medium">Upload Images</Label>
                <ImageUpload
                  onUploadComplete={onUploadComplete}
                  onError={setImageUploadError}
                  MAX_IMAGES={5}
                />
                <p className="text-red-500 text-sm mt-1 min-h-[1.25rem]">
                  {imageUploadError || errors.images?.message}
                </p>
              </div>

              <div className="w-full space-y-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Location"}
                </Button>

                <div className="min-h-[1.25rem]">
                  {submissionError && (
                    <p className="text-sm text-red-500">{submissionError}</p>
                  )}
                  {successMessage && (
                    <p className="text-sm text-green-600">{successMessage}</p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}
