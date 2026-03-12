import type { UseFormRegister } from "react-hook-form";
import type { IFormValues } from "../chat/AddFriendModal";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

interface SearchFormProps {
  register: UseFormRegister<IFormValues>;

  loading: boolean;

  searchUsername: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}
export default function SendFriendRequest({register, loading, searchUsername, onSubmit, onCancel}: SearchFormProps) {
  return (
      <form className="space-y-4" onSubmit={onSubmit}>
   <div>
    <span className="text-green-500">Found user: <span className="font-semibold">{searchUsername}</span></span>
    <div className="space-y-2">
      <Label htmlFor="message">Introduce</Label>
      <Textarea 
      className="mb-3"
      id="message"
      {...register("message")}
      placeholder="Add friend"
      disabled={loading}
      />

    </div>
    <DialogFooter>
      <Button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </Button>
      <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
        Cancel
      </Button>
    </DialogFooter>
   </div>
      </form>
  )
}