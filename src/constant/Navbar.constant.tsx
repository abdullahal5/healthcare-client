import {
  Heart,
  Users,
  Info,
  Home,
} from "lucide-react";
import { ReactNode } from "react";

type Route = {
  path: string;
  name: string;
  icon: ReactNode;
};

export const routes: Route[] = [
  { path: "/", name: "Home", icon: <Home className="mr-2 h-4 w-4" /> },
  {
    path: "/services",
    name: "Services",
    icon: <Heart className="mr-2 h-4 w-4" />,
  },
  {
    path: "/doctors",
    name: "Doctors",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  { path: "/about", name: "About", icon: <Info className="mr-2 h-4 w-4" /> },
];
