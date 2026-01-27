import Logout from "@/components/auth/Logout";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

export default function ChatAppPage() {
    const { user } = useAuthStore();

    const handleTest = async () => {
        try {
          await api.get('/users/test', { withCredentials: true });
          toast.success("Test endpoint working");
        } catch (error) {
            console.error(error);
        }
    };

  return (
    <>
      Chat appp
      {user && <p>Welcome, {user?.displayName}!</p>}
      <Logout />
      <Button  onClick={handleTest}>Test API</Button>
    </>
  );
}
