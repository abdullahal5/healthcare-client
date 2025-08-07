import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Large 404 Text */}
        <div className="space-y-4">
          <div className="text-8xl md:text-9xl font-bold text-slate-300 dark:text-slate-700 select-none">
            404
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Compass
                className="h-16 pb-5 w-16 text-slate-400 dark:text-slate-500 animate-spin"
                style={{ animationDuration: "8s" }}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            The page you&apos;re looking for seems to have wandered off into the
            digital wilderness. Don&apos;t worry, even the best explorers sometimes
            take a wrong turn!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link
              href="javascript:history.back()"
              className="flex items-center border border-neutral-300 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>

        {/* Fun Message */}
        <div className="text-xs text-slate-400 dark:text-slate-500">
          Error Code: 404 • Page Not Found • But Your Journey Continues
        </div>
      </div>
    </div>
  );
}
