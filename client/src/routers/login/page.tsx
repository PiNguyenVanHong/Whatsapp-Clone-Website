import logo from "@/assets/whatsapp-logo.gif";

import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useStateProvider } from "@/context/state-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { formLoginSchema } from "@/utils/form-schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AuthActions from "@/components/auth/auth-actions";
import { login } from "@/actions/auth.api";
import { toast } from "sonner";
import { reducerCases } from "@/context/constants";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  const [{ userInfo, newUser }, dispatch] = useStateProvider();

  const form = useForm({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (userInfo?.id && !newUser) navigate("/");
  }, [userInfo, newUser]);

  const onSubmit = async (values: z.infer<typeof formLoginSchema>) => {
    try {
      setIsPending(true);
      const { tokenData, infoUser } = await login(
        values.email,
        values.password
      );
      dispatch({
        type: reducerCases.SET_TOKEN_JWT,
        tokenData
      });
      dispatch({
        type: reducerCases.SET_USER_INFO,
        userInfo: infoUser,
      });
      toast.success("Login successfully!!!");
    } catch (error) {
      const {
        response: { data },
      }: any = error;
      toast.error(data.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background flex relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/10600609/pexels-photo-10600609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        }}
      >
        <div className="absolute left-0 top-0 w-5/12 h-full bg-background shadow-background shadow-[0_25px_20px_-12px]"></div>

        <div className="absolute right-0 top-0 w-7/12 h-full bg-gradient-to-r from-background to-backgfrom-background/70"></div>

        <div className="absolute right-0 bottom-0 w-7/12 h-full bg-gradient-to-t from-background to-transparent"></div>
      </div>

      <div className="w-full md:w-2/5 lg:w-1/3 bg-gray-800/0 p-8 mx-10 relative z-10">
        <div className="h-full flex flex-col justify-center">
          <div>
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <img src={logo} />
              </div>
              <span className="text-white text-xl font-semibold">
                Whatsapp Clone
              </span>
            </div>
            <div className="space-y-4">
              <p className="text-green-400 text-sm font-semibold">
                START CHATTING NOW
              </p>
              <h1 className="text-3xl font-bold text-white">
                Welcome back<span className="text-green-500">.</span>
              </h1>
              <p className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <a href="/register" className="text-green-400 hover:underline">
                  Sign up
                </a>
              </p>
            </div>
            <div className="mt-8 flex flex-col-reverse justify-center">
              <AuthActions />
              <div className="my-6 flex items-center justify-between">
                <hr className="w-full border-t border-gray-600" />
                <span className="px-4 text-gray-400">or</span>
                <hr className="w-full border-t border-gray-600" />
              </div>
              <Form {...form}>
                <form
                  className="space-y-4"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="mb-5">
                          <FormControl>
                            <Input
                              custom={true}
                              customName={"Email address"}
                              htmlFor="floating_last_name"
                              placeholder=""
                              {...field}
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              custom={true}
                              customName={"Password"}
                              htmlFor="floating_password"
                              showPassword={showPassword}
                              setShowPassword={() =>
                                setShowPassword(!showPassword)
                              }
                              type="password"
                              placeholder=""
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isPending}
                  >
                    Login account
                  </button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
