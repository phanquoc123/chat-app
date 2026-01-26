import { useAuthStore } from "@/stores/useAuthStore"
import { useNavigate } from "react-router";
import { Button } from "../ui/button";


const Logout = () => {
    const { signOut}  = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/signin');
    }
  return (
    <>
    <Button variant="ghost" onClick={handleLogout}>Logout</Button>
    </>
  )
}

export default Logout