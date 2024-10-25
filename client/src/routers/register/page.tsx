import logo from "@/assets/whatsapp-logo.gif";

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/state-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkUser } from "@/actions/user.api";
import { formRegisterSchema } from "@/utils/form-schema";

import { Input } from "@/components/ui/input";
import AuthActions from "@/components/auth/auth-actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  const [{}, dispatch] = useStateProvider();

  const form = useForm({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  // useEffect(() => {
  //   if (userInfo?.id && !newUser) navigate("/");
  // }, [userInfo, newUser]);

  const onSubmit = async (values: z.infer<typeof formRegisterSchema>) => {
    try {
      setIsPending(true);
      const { status, user } = await checkUser(values.email);

      if(!status) {
        dispatch({ type: reducerCases.SET_NEW_USER, newUser: true });
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            avatar: "",
            status: "Avaialble",
            password: values.password,
          },
        });
        navigate("/on-boarding");
      } else {
        const {
          id, first_name, last_name, email, avatar, bio,
       } = user;
       dispatch({
         type: reducerCases.SET_USER_INFO,
         userInfo: {
           id,
           first_name,
           last_name,
           email,
           avatar,
           bio,
           status: "Done",
         },
       });
      }
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
                Create new account<span className="text-green-500">.</span>
              </h1>
              <p className="text-gray-400 text-sm">
                Already A Member?{" "}
                <a href="/login" className="text-green-400 hover:underline">
                  Log In
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
                  <div className="grid md:grid-cols-2 md:gap-6">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              custom={true}
                              customName={"First name"}
                              htmlFor="floating_first_name"
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
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              custom={true}
                              customName={"Last name"}
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
                  </div>
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
                              htmlFor="floating_email"
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
                        <FormItem className="mb-5">
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
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem className="mb-5">
                          <FormControl>
                            <Input
                              custom={true}
                              customName={"Confirm Password"}
                              htmlFor="floating_confirm_password"
                              showPassword={showPassword}
                              setShowPassword={() =>
                                setShowPassword(!showPassword)
                              }
                              type="password"
                              placeholder=""
                              {...field}
                              disabled={isPending}
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
                    Create account
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

export default RegisterPage;
