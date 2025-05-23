import { Skeleton } from "@/components/ui/skeleton";

const ModalLoadingContent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
      {/* <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div> */}

      {/* Pulsing text */}
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-medium text-gray-700">
          Loading Doctor Information
        </h3>
        <p className="text-sm text-gray-500">
          Please wait while we fetch the details...
        </p>
      </div>

      <div className="w-full max-w-md space-y-4 mt-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    </div>
  );
};

export default ModalLoadingContent;
