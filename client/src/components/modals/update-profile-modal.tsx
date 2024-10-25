import * as z from "zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAvatarUser, updateUser } from "@/actions/user.api";
import { formProfileSchema } from "@/utils/form-schema";
import { dataURLToBlob } from "@/lib/utils";

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

function UpdateProfileModal() {
  const [isPending, setIsPending] = useState(false);
  const { isOpen, type, onClose, data, next } = useModal();
  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);

  let isModalOpen = isOpen && type === "updateProfile";

  const { id, first_name, last_name, email, bio, avatar } = data;

  const form = useForm({
    resolver: zodResolver(formProfileSchema),
    defaultValues: {
      email: email,
      first_name: first_name,
      last_name: last_name,
      bio: bio,
      avatar: avatar,
    },
  });

  useEffect(() => {
    if (data) {
      form.setValue("email", email);
      form.setValue("first_name", first_name);
      form.setValue("last_name", last_name);
      form.setValue("bio", bio);
      form.setValue("avatar", avatar);

      setImage(avatar);
    }
  }, [form, data]);

  useEffect(() => {
    if (!image) {
      setImage(avatar);
    }
  }, [image]);

  const onSubmit = async (values: z.infer<typeof formProfileSchema>) => {
    setIsPending(true);

    try {
      if (image.includes("data:image")) {
        const formData = new FormData();

        if (file) {
          formData.append("file", file);
        } else {
          const imageBlob = dataURLToBlob(image);
          formData.append("file", imageBlob, "capture.jpg");
        }

        const { fileName } = await updateAvatarUser({
          file: formData,
          id: id!,
        });

        values.avatar = fileName;
      } else {
        values.avatar = image;
        form.setValue("avatar", image);
      }

      await updateUser({ ...values, id });

      toast.success("Congratulation! Updated Successfully!!!.");

      form.reset();
      onClose();
      next();
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div id="code">
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="p-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Customize your profile
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Give your profile a personality with a name, bios and an image.
              You can always change it later.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-8 px-6">
                <div className="flex items-center justify-center text-center">
                  <AvatarWidget
                    setFile={setFile}
                    type="lg"
                    image={image}
                    setImage={setImage}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        First name
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
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Last name
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
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Your Bio
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          disabled={isPending}
                          placeholder="Enter your bio"
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
    </div>
  );
}

export default UpdateProfileModal;
