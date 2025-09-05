import { useLocation, useNavigate } from "react-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import AuthContext from "../contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { loginSchema, type LoginData } from "../services/authSchema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";

export default function LoginPage() {
  const auth = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginData> = useCallback(
    async (data) => {
      setLoading(true);
      if (!auth) {
        setLoading(false);
        return;
      }

      const loginResult = await auth.login(data.email, data.password);
      if (!loginResult.ok) {
        setApiError(loginResult.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate("/");
    },
    [auth, navigate]
  );
  useEffect(() => {
    if (auth?.user) navigate("/search");
  }, [auth?.user, navigate]);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-4xl p-0 flex flex-row overflow-hidden animate-in fade-in-50 duration-700">
        <div className="hidden md:block md:w-1/2">
          <img
            src="/pet-friendly-cafe-login.png"
            alt="Egy személy kutyával a parkban"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl">
              Login
              <div className="w-full flex">
                <Alert
                  variant="default"
                  className={`flex ${
                    successMessage
                      ? "bg-green-100 border-green-400 mt-5"
                      : "px-0 bg-transparent border-transparent"
                  }`}
                >
                  <AlertDescription>
                    {successMessage || "Please enter your login data"}
                  </AlertDescription>
                </Alert>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col items-center"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="w-5/5">
                <div className="h-20">
                  <Label className="my-2" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="example@gmail.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">
                      {errors.email.message}
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
                    {...register("password")}
                    placeholder="**********"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex">
                    <Button disabled={loading}>
                      {!loading ? (
                        "Login"
                      ) : (
                        <>
                          <Loader2Icon className="animate-spin" />
                          Loading...
                        </>
                      )}
                    </Button>
                  </div>
                  <Separator orientation="horizontal" className="my-5 h-full" />
                  <div>
                    <p className="mb-4">
                      You do not have account?{" "}
                      <a className="underline" href="/registration">
                        Register!
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              {apiError && (
                <Alert className="mt-3" variant="destructive">
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
