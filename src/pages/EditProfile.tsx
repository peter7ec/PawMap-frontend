import { useCallback, useContext, useState } from "react";
import { Loader2Icon, User } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import AuthContext from "../contexts/AuthContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { updateUserSchema, type UpdateUser } from "../services/authSchema";
import type { CloudinaryUploadResponse } from "@/services/imageService";
import uploadImagesToCloudinary, {
  deleteImagesByDeleteToken,
} from "../services/imageService";
import ImageUploader from "../components/ImageUpload";
import { Alert, AlertTitle } from "../components/ui/alert";

export default function EditProfile() {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [openEditAvatar, setOpenEditAvatar] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateUser>({
    resolver: zodResolver(updateUserSchema),
    mode: "onChange",
    defaultValues: {
      newEmail: undefined,
      newName: undefined,
      newPassword: undefined,
      newPasswordConfirmation: undefined,
      newProfile_avatar: [],
    },
  });

  const handleEditAvatarBtn = useCallback(() => {
    setOpenEditAvatar(!openEditAvatar);
    if (!openEditAvatar) setValue("newProfile_avatar", []);
  }, [openEditAvatar, setValue]);

  const onUploadComplete = useCallback(
    (_: string[], files: File[]) => {
      if (files && files.length > 0) {
        setValue("newProfile_avatar", files, { shouldValidate: true });
        setImageUploadError(null);
      } else {
        setValue("newProfile_avatar", [], {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    },
    [setValue]
  );

  const onSubmit: SubmitHandler<UpdateUser> = useCallback(
    async (data) => {
      setLoading(true);
      setImageUploadError(null);
      try {
        let imageUrls: CloudinaryUploadResponse[] = [];
        if (!auth) {
          setLoading(false);
          return;
        }
        if (data.newProfile_avatar!.length !== 0) {
          const uploadedUrls = await uploadImagesToCloudinary(
            data.newProfile_avatar!,
            "profile_avatars"
          );

          imageUrls = uploadedUrls;
        }
        const updateResult = await auth.update(
          auth!.user!.id,
          auth.user?.token as string,
          data.newName === "" ? undefined : data.newName,
          data.newEmail === "" ? undefined : data.newEmail,
          data.newPassword === "" ? undefined : data.newPassword,
          imageUrls.length === 0
            ? auth.user?.profile_avatar
            : imageUrls[0].secure_url
        );
        if (!updateResult.ok) {
          await deleteImagesByDeleteToken(imageUrls);
          setApiError(updateResult.message);
          setLoading(false);
          return;
        }
        reset();
        if (openEditAvatar) handleEditAvatarBtn();
        setLoading(false);
        toast.success("Successfully updated!", {
          duration: 3000,
          style: { background: "#f7f7f7", color: "green" },
        });
      } catch (error) {
        setApiError("Failed to update data. Please try again!");
        setLoading(false);
      }
    },
    [auth, reset, handleEditAvatarBtn, openEditAvatar]
  );

  return (
    <div className="h-full md:w-5/10 md:m-auto">
      <h1 className="text-2xl pb-3">Profile settings</h1>

      <div>
        <p className="text-xl">Current profile image:</p>
        {auth?.user?.profile_avatar !== null &&
        auth?.user?.profile_avatar !== "" ? (
          <img
            className="w-50 h-50 md:w-75 md:h-75 m-auto rounded-full my-3 object-cover"
            src={auth?.user?.profile_avatar}
            alt="profile"
          />
        ) : (
          <User className="w-50 h-50 m-auto" />
        )}
      </div>
      <div className="h-full">
        <p className="text-xl">Current name:</p>
        <p className="pb-3 text-green-500">{auth?.user?.name}</p>
        <p className="text-xl">Current email:</p>
        <p className="pb-3 text-green-500">{auth?.user?.email}</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col mt-3 gap-3 justify-between"
        >
          {openEditAvatar && (
            <div>
              <Label className="pb-3 text-xl">Upload new profile picture</Label>
              <ImageUploader
                onUploadComplete={onUploadComplete}
                onError={setImageUploadError}
                MAX_IMAGES={1}
              />
              <p className="text-red-500 text-sm mt-1 min-h-[1.25rem]">
                {imageUploadError || errors.newProfile_avatar?.message}
              </p>
            </div>
          )}
          <div>
            <Button
              onClick={handleEditAvatarBtn}
              type="button"
              variant={openEditAvatar ? "destructive" : "default"}
            >
              {openEditAvatar ? `Cancel` : `Edit avatar`}
            </Button>
          </div>
          <div>
            <Label className="my-2" htmlFor="newName">
              New name
            </Label>
            <Input
              placeholder="Enter your new name"
              id="newName"
              {...register("newName")}
            />
            {errors.newName && (
              <p className="text-sm text-red-600">{errors.newName.message}</p>
            )}
          </div>
          <div>
            <Label className="my-2" htmlFor="newEmail">
              New email
            </Label>
            <Input
              placeholder="Enter your new email"
              id="newEmail"
              {...register("newEmail")}
            />
            {errors.newEmail && (
              <p className="text-sm text-red-600">{errors.newEmail.message}</p>
            )}
          </div>
          <div>
            <Label className="my-2" htmlFor="newPassword">
              New password
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter your new password"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <Label className="my-2" htmlFor="newPasswordConfirmation">
              New password again
            </Label>
            <Input
              id="newPasswordConfirmation"
              type="password"
              placeholder="Enter your new password again"
              {...register("newPasswordConfirmation")}
            />
            {errors.newPasswordConfirmation && (
              <p className="text-sm text-red-600">
                {errors.newPasswordConfirmation.message}
              </p>
            )}
          </div>
          <div>
            <Button className="my-3" type="submit" disabled={loading}>
              {!loading ? (
                "Update"
              ) : (
                <>
                  <Loader2Icon className="animate-spin" />
                  Loading...
                </>
              )}
            </Button>
          </div>
          {apiError && (
            <Alert variant="destructive" className="w-8/10">
              <AlertTitle>{apiError}</AlertTitle>
            </Alert>
          )}
        </form>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
}
