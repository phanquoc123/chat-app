import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { UserPlus } from "lucide-react";
import SearchForm from "../AddFriendModal/SearchForm";
import SendFriendRequest from "../AddFriendModal/SendFriendRequest";
import type { User } from "@/types/user";
import { useFriendStore } from "@/stores/useFriendStore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";


export interface IFormValues {
  username: string;
  message: string;
}

export default function AddFriendModal() {
  const [isFound, setIsFound] = useState<boolean | null>(null);
  const [searchUser, setSearchUser] = useState<User>();
  const [searchUsername, setSearchUsername] = useState<string>("");

  const {loading, searchUserByUsername , sendFriendRequest} = useFriendStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: { username: "", message: "" },
  });

  const usernameValue = watch("username");

  const handleSearch = handleSubmit(async (data) => {
    const username = data.username.trim();
    if (!username) return;

    setIsFound(null);
    setSearchUsername(username);

    try {
      const foundUser = await searchUserByUsername(username);
      if (foundUser) {
        setIsFound(true);
        setSearchUser(foundUser);
      } else {
        setIsFound(false);
      }
    } catch (error) {
      console.error(error);
      setIsFound(false);
    }
  });

  const handleSend = handleSubmit(async (data) => {
    if (!searchUser) return;
    // console.log(searchUser._id);
    // console.log(data.message.trim());
    

    try {
      await sendFriendRequest(searchUser._id, data.message.trim());
      toast.success("Sent friend request successfully");

      handleCancel();
    } catch (error) {
      console.error("Lỗi xảy ra khi gửi request từ form", error);
    }
  });

  const handleCancel = () => {
    reset();
    setSearchUsername("");
    setIsFound(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
   <div className="flex justify-center items-center size-5 rounded-full z-10 cursor-pointer hover:bg-blue-500">
    <UserPlus className="size-4"/>
    <span className="sr-only">Add Friend</span>
   </div>
      </DialogTrigger>

      <DialogContent className="max-w-lg border-none">
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
        </DialogHeader>

        {!isFound && <>
          <SearchForm   register={register}
              errors={errors}
              username={usernameValue}
              loading={loading}
              isFound={isFound}
              searchUsername={searchUsername}
              onSubmit={handleSearch}
              onCancel={handleCancel}/>
        </>}
        {isFound && <>
          <SendFriendRequest  register={register}
              loading={loading}
              searchUsername={searchUsername}
              onSubmit={handleSend}
              onCancel={() => setIsFound(null)}/>
        </>}
      </DialogContent>
    </Dialog>
  )
}