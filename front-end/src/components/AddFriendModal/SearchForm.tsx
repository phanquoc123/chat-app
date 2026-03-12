import type { IFormValues } from "../chat/AddFriendModal";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

interface SearchFormProps {
  register: UseFormRegister<IFormValues>;
  errors: FieldErrors<IFormValues>;
  loading: boolean;
  username: string;
  isFound: boolean | null;
  searchUsername: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export default function SearchForm({
  register,
  errors,
  loading,
  username,
  isFound,
  searchUsername,
  onSubmit,
  onCancel,
}: SearchFormProps) {
  const showResult = isFound !== null && searchUsername.trim().length > 0;

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="username">Search by username</Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter username"
          autoComplete="off"
          aria-invalid={!!errors.username}
          disabled={loading}
          {...register("username")}
        />
        {errors.username && (
          <p className="text-xs text-destructive">
            {errors.username.message}
          </p>
        )}
      </div>

      {showResult && (
        <div className="text-sm">
          {isFound ? (
            <p className="text-emerald-600">
              Found user: <span className="font-semibold">{username}</span>
            </p>
          ) : (
            <p className="text-destructive">
              No user found with username{" "}
              <span className="font-semibold">{searchUsername}</span>
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={loading || !username?.trim()}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>
    </form>
  );
}