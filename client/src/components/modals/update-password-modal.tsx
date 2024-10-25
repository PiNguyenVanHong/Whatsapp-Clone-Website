import * as z from "zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePasswordUser } from "@/actions/user.api";
import { formUpdatePasswordSchema } from "@/utils/form-schema";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AvatarWidget from "@/components/avatar-widget";

function UpdatePasswordModal() {
  const [isPending, setIsPending] = useState(false);
  const { isOpen, type, onClose, data, next } = useModal();
  const [image, setImage] = useState(data.avatar);

  let isModalOpen = isOpen && type === "updatePassword";

  const { email, avatar } = data;
  const form = useForm({
    resolver: zodResolver(formUpdatePasswordSchema),
    defaultValues: {
      email: "",
      password: "" ,
      new_password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.setValue("email", email);
    }
    setImage(avatar);
  }, [form, data]);

  const onSubmit = async (values: z.infer<typeof formUpdatePasswordSchema>) => {
    setIsPending(true);

    try {
      const { message } = await updatePasswordUser(values.email, values.password, values.new_password);

      toast.success(message);

      form.reset();
      onClose();
      next();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsPending(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="p-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your profile
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your profile a personality with a name, bios and an image. You
            can always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form 
            className="space-y-8" 
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                {image && <AvatarWidget type="lg" image={image} />}
              </div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Old Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        disabled={isPending}
                        placeholder="Enter your name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        disabled={isPending}
                        placeholder="Enter your name"
                        {...field}
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
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Confirm New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        disabled={isPending}
                        placeholder="Enter your name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant={"success"} disabled={isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdatePasswordModal;