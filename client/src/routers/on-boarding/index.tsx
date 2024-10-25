import logo from "@/assets/whatsapp-logo.gif";

import { z } from "zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStateProvider } from "@/context/state-context";
import { formProfileSchema } from "@/utils/form-schema";
import { createUser } from "@/actions/user.api";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AvatarWidget from "@/components/avatar-widget";
import { reducerCases } from "@/context/constants";
import { toast } from "sonner";

function OnBoardingPage() {
  const [isPending, setIsPending] = useState(false);
  const [{ userInfo }, dispatch] = useStateProvider();
  const navigate = useNavigate();
  const [image, setImage] = useState(userInfo?.avatar || "");

  useEffect(() => {
    if(!userInfo)
        navigate("/login");
  }, []);

  const form = useForm<z.infer<typeof formProfileSchema>>({
    resolver: zodResolver(formProfileSchema),
    defaultValues: {
      email: userInfo?.email,
      first_name: userInfo?.first_name,
      last_name: userInfo?.last_name,
      bio: "",
      avatar: userInfo?.avatar,
      password: userInfo?.password,
    },
  });

  useEffect(() => {
    if(!image) return;
    if (image.length > 0) {
      form.setValue("avatar", image);
    }
  }, [image]);

  const onSubmit = async (values: z.infer<typeof formProfileSchema>) => {
    try {
      setIsPending(false);
      
      const { tokenData, infoUser, message } = await createUser({ ...values, });
      dispatch({
        type: reducerCases.SET_NEW_USER,
        newUser: false,
      });
      dispatch({
        type: reducerCases.SET_TOKEN_JWT,
        tokenData,
      });
      dispatch({
        type: reducerCases.SET_USER_INFO,
        userInfo: {
          ...infoUser,
        }
      });

      toast.success(message);
      navigate("/");
      form.reset();
    } catch (error) {
      console.log(error);
      toast.error("Uh oh! Something went wrong.");
    } finally {
      setIsPending(true);
    }
  };

  return (
    <div
      id="code"
      className="h-screen w-screen text-white flex flex-col items-center justify-center gap-6 transition-all duration-300"
    >
      <div className="flex items-center justify-center gap-2">
        <img className="w-44" src={logo} alt="Whatsapp Logo" />
        <span className="text-5xl">Whatsapp</span>
      </div>
      <Card className="w-2/5">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Create your profile</CardTitle>
          <CardDescription>
            Fill your information into the form to create profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full gap-2 items-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full"
              >
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="abc123"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="abc123"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="hobbies, books, your social media,..."
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending}>
                  Submit
                </Button>
              </form>
            </Form>
            <div className="w-0.5 h-56 ml-6 bg-white"></div>
            <AvatarWidget type="xl" image={image} setImage={setImage} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OnBoardingPage;
