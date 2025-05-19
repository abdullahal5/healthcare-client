"use client";
import { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import {
  UploadCloud,
  X,
  FileText,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { toast } from "sonner";
import { Controller, useFormContext } from "react-hook-form";

type FileUploaderProps = {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  maxFiles?: number;
  onFileChange?: (files: File | File[] | null) => void;
  label?: string;
  className?: string;
  name: string;
};

const HCFileUploader = forwardRef(function HCFileUploader(
  {
    accept = "image/*,application/pdf",
    maxSize = 5,
    multiple = false,
    maxFiles = 5,
    onFileChange,
    label = "Upload File",
    className = "",
    name,
  }: FileUploaderProps,
  ref
) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback(
    (selectedFiles: File[]) => {
      const validFiles = selectedFiles.filter((file) => {
        if (file.size > maxSize * 1024 * 1024) {
          toast.warning(`File "${file.name}" exceeds ${maxSize}MB limit`);
          return false;
        }
        return true;
      });

      // Check max files limit
      if (multiple && maxFiles && files.length + validFiles.length > maxFiles) {
        toast.warning(`You can upload a maximum of ${maxFiles} files`);
        return;
      }

      const newFiles = multiple ? [...files, ...validFiles] : [validFiles[0]];
      setFiles(newFiles);
      if (onFileChange) {
        onFileChange(multiple ? newFiles : newFiles[0] || null);
      }

      // Simulate upload progress
      setIsUploading(true);
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      validFiles.forEach((file) => {
        if (file.type.startsWith("image")) {
          const reader = new FileReader();
          reader.onload = () => {
            setPreviews((prev) => ({
              ...prev,
              [file.name]: reader.result as string,
            }));
          };
          reader.readAsDataURL(file);
        }
      });
    },
    [maxSize, multiple, maxFiles, files, onFileChange]
  );

  const handleInputChange = (file: File[]) => {
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveFile = (fileName: string) => {
    const newFiles = files.filter((file) => file.name !== fileName);
    setFiles(newFiles);
    setPreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[fileName];
      return newPreviews;
    });
    if (onFileChange) {
      onFileChange(multiple ? newFiles : newFiles[0] || null);
    }
  };

  const handleRemoveAll = () => {
    setFiles([]);
    setPreviews({});
    if (onFileChange) onFileChange(null);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image")) {
      return <ImageIcon className="w-5 h-5" />;
    }
    return <FileText className="w-5 h-5" />;
  };

  const resetFiles = useCallback(() => {
    setFiles([]);
    setPreviews({});
    setUploadProgress(0);
    setIsUploading(false);
  }, []);

  useImperativeHandle(ref, () => ({
    reset: resetFiles,
  }));

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value, ...field },
        fieldState: { error },
      }) => {
        const handleFileChangeWithHookForm = (newFiles: File[] | null) => {
          if (!newFiles) {
            onChange(null);
            if (onFileChange) onFileChange(null);
            return;
          }

          onChange(multiple ? newFiles : newFiles[0]);
          handleFileChange(newFiles);
        };

        return (
          <div
            className={`flex flex-col items-center gap-4 w-full ${className}`}
          >
            <div
              className={`w-full max-w-md border-2 border-dashed rounded-xl transition-all ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground/30"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const droppedFiles = Array.from(e.dataTransfer.files || []);
                handleFileChangeWithHookForm(droppedFiles);
              }}
            >
              <label className="flex flex-col items-center justify-center p-6 cursor-pointer">
                <div className="p-3 rounded-full bg-primary/10 mb-3">
                  <UploadCloud className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">
                    {isDragging
                      ? "Drop your files here"
                      : `Click to upload or drag and drop`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {accept.includes("image") ? "Images" : "Files"} up to{" "}
                    {maxSize}
                    MB
                    {multiple && maxFiles && ` (Max ${maxFiles} files)`}
                  </p>
                </div>
                <input
                  type={name}
                  accept={accept}
                  {...field}
                  className="hidden"
                  onChange={(e) =>
                    handleFileChangeWithHookForm(
                      Array.from(e.target.files || [])
                    )
                  }
                  multiple={multiple}
                />
              </label>
            </div>
            {error && (
              <span className="text-red-500 font-medium text-sm text-left">
                {error.message}
              </span>
            )}

            {files.length > 0 && (
              <div className="w-full space-y-4">
                {files.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={handleRemoveAll}
                  >
                    Remove All
                  </Button>
                )}

                {files?.map((file) => (
                  <Card
                    key={file.name}
                    className="w-full max-w-md transition-all animate-in fade-in"
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file)}
                        <CardTitle className="text-sm font-medium truncate max-w-[200px]">
                          {file.name}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemoveFile(file.name)}
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {isUploading && (
                        <div className="space-y-2">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-xs text-muted-foreground text-center">
                            {uploadProgress}% uploaded
                          </p>
                        </div>
                      )}

                      {!isUploading &&
                      previews[file.name] &&
                      file.type.startsWith("image") ? (
                        <div className="mt-2 rounded-lg overflow-hidden border">
                          <Image
                            src={previews[file.name]}
                            alt={`Preview of ${file.name}`}
                            width={500}
                            height={500}
                            className="w-full h-auto max-h-60 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center p-4 bg-muted rounded-lg mt-2">
                          {isUploading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                          ) : (
                            <div className="text-center">
                              <FileText className="w-8 h-8 mx-auto text-muted-foreground" />
                              <p className="text-xs text-muted-foreground mt-2">
                                {file.type.split("/")[1]?.toUpperCase() ||
                                  "FILE"}{" "}
                                - {(file.size / 1024 / 1024).toFixed(2)}MB
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      }}
    />
  );
});

export default HCFileUploader;
