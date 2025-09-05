import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { registerUserSchema, type RegisterUser } from "../services/authSchema";
import AuthContext from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import uploadImagesToCloudinary, {
  deleteImagesByDeleteToken,
  type CloudinaryUploadResponse,
} from "../services/imageService";
import ImageUploader from "../components/ImageUpload";

export default function RegisterPage() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterUser>({
    resolver: zodResolver(registerUserSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      name: "",
      password: "",
      passwordConfirmation: "",
      profile_avatar: [],
    },
  });

  const onUploadComplete = useCallback(
    (_: string[], files: File[]) => {
      setValue("profile_avatar", files, { shouldValidate: true });
      setImageUploadError(null);
    },
    [setValue]
  );

  const onSubmit: SubmitHandler<RegisterUser> = useCallback(
    async (data) => {
      setLoading(true);
      setImageUploadError(null);
      try {
        let imageUrls: CloudinaryUploadResponse[] = [];
        if (!auth) {
          setLoading(false);
          return;
        }
        if (data.profile_avatar!.length !== 0) {
          const uploadedUrls = await uploadImagesToCloudinary(
            data.profile_avatar!,
            "profile_avatars"
          );

          imageUrls = uploadedUrls;
        }

        const registerResult = await auth.register(
          data.email,
          data.name,
          data.password,
          imageUrls.length === 0 ? "" : imageUrls[0].secure_url
        );
        if (!registerResult.ok) {
          await deleteImagesByDeleteToken(imageUrls);
          setApiError(registerResult.message);
          setLoading(false);
          return;
        }
        setLoading(false);

        navigate("/login", {
          state: {
            message: "Successfully registrated! Now you can login!",
          },
        });
      } catch (error) {
        setApiError("Failed to register. Please try again!");
        setLoading(false);
      }
    },
    [auth, navigate]
  );

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-4xl p-0 flex flex-row overflow-hidden animate-in fade-in-50 duration-700">
        <div className="hidden md:block md:w-1/2">
          <img
            src="/pet-register.png"
            alt="Person with a turtle"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl">
              Welcome to PawMap!
              <div className="w-full flex">
                <Alert
                  variant="default"
                  className="flex px-0 bg-transparent border-transparent"
                >
                  <AlertDescription>
                    Please enter your data for registration.
                  </AlertDescription>
                </Alert>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center  "
            >
              <div className="w-5/5">
                <div className="h-20">
                  <Label className="my-2" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="h-20">
                  <Label className="my-2" htmlFor="name">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="h-20">
                  <Label className="my-2" htmlFor="password">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="h-20">
                  <Label className="my-2" htmlFor="passwordConfirmation">
                    Password Confirmation
                  </Label>
                  <Input
                    id="passwordConfirmation"
                    type="password"
                    placeholder="Enter again your password"
                    {...register("passwordConfirmation")}
                  />
                  {errors.passwordConfirmation && (
                    <p className="text-sm text-red-600">
                      {errors.passwordConfirmation.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="block mb-2 font-medium">
                    Upload Profile picture (optional)
                  </Label>
                  <ImageUploader
                    onUploadComplete={onUploadComplete}
                    onError={setImageUploadError}
                    MAX_IMAGES={1}
                  />
                  <p className="text-red-500 text-sm mt-1 min-h-[1.25rem]">
                    {imageUploadError || errors.profile_avatar?.message}
                  </p>
                </div>
                <div />
                <div className="my-3">
                  <Button type="submit" disabled={loading}>
                    {!loading ? (
                      "Registration"
                    ) : (
                      <>
                        <Loader2Icon className="animate-spin" />
                        Loading...
                      </>
                    )}
                  </Button>
                  <Separator orientation="horizontal" className="my-5 h-full" />
                  <p className="mt-6">
                    You already registered?{" "}
                    <a className="underline" href="/login">
                      Login!
                    </a>
                  </p>
                </div>
              </div>
              {apiError && (
                <Alert variant="destructive" className="w-8/10">
                  <AlertTitle>{apiError}</AlertTitle>
                </Alert>
              )}
            </form>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
