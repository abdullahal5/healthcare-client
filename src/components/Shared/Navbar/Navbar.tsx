"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, Calendar, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { routes } from "@/constant/Navbar.constant";

const Navbar = () => {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const router = useRouter();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`bg-white shadow-md sticky top-0 z-50 ${
        isScrolled ? "shadow-lg" : "shadow-md"
      } transition-shadow duration-300`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo with smooth hover */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold">
                <span className="text-[#1586FD]">H</span>ealth
                <span className="text-[#1586FD]">C</span>are
              </h1>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {routes.map((route) => (
              <motion.div
                key={route.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={route.path}
                  className={`px-3 py-2 rounded-md transition-all duration-200 hover:bg-slate-100 hover:text-[#1586FD] ${
                    pathname === route.path
                      ? "text-[#1586FD] font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {route.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Search and Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 256 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative overflow-hidden"
                >
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="w-full pr-8 border-[#0f172a]/50 border right-0"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                  <X
                    className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 cursor-pointer hover:text-[#1586FD] transition-colors"
                    onClick={() => setIsSearchOpen(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {!isSearchOpen && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search"
                  className="border-[#0f172a]/50"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => router.push("/register")}
                variant="outline"
                className="font-medium"
              >
                Sign Up
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => router.push("/login")}
                className="bg-[#1586FD] hover:bg-[#0e6cd0] transition-colors duration-200"
              >
                Login
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
                className="mr-2"
              >
                {isSearchOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </Button>
            </motion.div>

            <Sheet>
              <SheetTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button variant="ghost" size="icon" aria-label="Menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                {/* Added SheetTitle for accessibility */}
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="flex flex-col h-full"
                >
                  <div className="py-6">
                    <h2 className="text-2xl font-bold mb-6">
                      <span className="text-[#1586FD]">H</span>ealth
                      <span className="text-[#1586FD]">C</span>are
                    </h2>
                    <div className="space-y-4">
                      {routes.map((route) => (
                        <motion.div
                          key={route.path}
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Link
                            href={route.path}
                            className={`flex items-center text-lg ${
                              pathname === route.path
                                ? "text-[#1586FD] font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            {route.icon}
                            {route.name}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto space-y-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button className="w-full bg-[#1586FD] hover:bg-[#0e6cd0] transition-colors duration-200">
                        Login
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" className="w-full">
                        Sign Up
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="mt-3 pb-2">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-full pr-8 border-[#0f172a]/50 border right-0"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Appointment Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-[#1586FD] text-white py-2 px-4 text-center text-sm"
      >
        <div className="container mx-auto flex justify-center items-center">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Need an appointment? Call us at (123) 456-7890 or</span>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="link"
              className="text-white p-0 h-auto ml-1 underline hover:no-underline"
            >
              book online
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
