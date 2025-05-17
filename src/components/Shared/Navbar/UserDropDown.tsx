import { Button } from "@/components/ui/button";
import { getUserInfo, removeUser } from "@/services/auth.services";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const UserDropDown = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [mounted, setMounted] = useState(false);
  const MotionButton = motion(Button);

  useEffect(() => {
    setMounted(true);
    setUserInfo(getUserInfo());
  }, []);

  const handleLogout = () => {
    removeUser()
    router.push("/login");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {userInfo ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userInfo?.photoUrl} />
                <AvatarFallback className="flex items-center justify-center bg-gray-100">
                  <User className="h-4 w-4 text-gray-600" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-md border bg-white shadow-lg"
            align="end"
            forceMount
          >
            <DropdownMenuItem
              onClick={() => router.push("/dashboard")}
              className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-50"
            >
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <MotionButton
            onClick={() => router.push("/register")}
            variant="outline"
            className="font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </MotionButton>
          <MotionButton
            onClick={() => router.push("/login")}
            className="bg-[#1586FD] hover:bg-[#0e6cd0] transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </MotionButton>
        </>
      )}
    </div>
  );
};

export const MobileUserDropdown = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [mounted, setMounted] = useState(false);
  const MotionButton = motion(Button);

  useEffect(() => {
    setMounted(true);
    setUserInfo(getUserInfo());
  }, []);

  const handleLogout = () => {
    removeUser();
    router.push("/login");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="mt-auto space-y-3">
      {userInfo ? (
        <>
          <Button onClick={() => router.push("/dashboard")} className="w-full">
            Dashboard
          </Button>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <MotionButton
            onClick={() => router.push("/login")}
            className="w-full bg-[#1586FD] hover:bg-[#0e6cd0]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Login
          </MotionButton>
          <MotionButton
            onClick={() => router.push("/register")}
            variant="outline"
            className="w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign Up
          </MotionButton>
        </>
      )}
    </div>
  );
};
