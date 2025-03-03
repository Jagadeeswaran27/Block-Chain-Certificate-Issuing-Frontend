import { useState } from "react";

interface FileUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
  accept?: string;
  placeholder?: string;
  fileTypes?: string;
}

const FileUpload = ({
  file,
  setFile,
  accept = "image/*,application/pdf",
  placeholder = "Drag and drop your file",
  fileTypes = "PDF, PNG, JPG up to 10MB",
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="h-full">
      <div
        className={`flex flex-col h-64 border-2 border-dashed rounded-lg 
          ${
            isDragging
              ? "border-primary-400 bg-primary-500/10"
              : "border-gray-600 hover:border-primary-400 bg-neutral-750/50"
          } 
          cursor-pointer transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="bg-primary-500/20 rounded-full p-3 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-primary-300 font-semibold mb-1">{file.name}</p>
            <p className="text-xs text-gray-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              onClick={(e) => {
                e.preventDefault();
                setFile(null);
              }}
              className="mt-3 text-xs text-gray-400 hover:text-white underline"
            >
              Remove file
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-full p-6">
            <div className="bg-neutral-850 rounded-full p-4 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-lg text-gray-400 font-medium mb-1">
                {isDragging ? "Drop your file here" : placeholder}
              </p>
              {!isDragging && (
                <p className="text-gray-500 mb-3">or click to browse</p>
              )}
              <p className="text-xs text-gray-500">{fileTypes}</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
