import { useState, useRef, useCallback } from "react";
import axios from "axios";

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;
    setSelectedFile(files[0]);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    setResultUrl(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded / (progressEvent.total || 1)) * 100
          );
          setUploadProgress(percent);
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResultUrl(response.data.url);
    } catch {
      alert("Error uploading file");
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">
        Single File Upload
      </h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors
            ${
              isDragging
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <div className="text-gray-500 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-gray-600">
              {isDragging
                ? "Drop file here"
                : "Click to select a file or drag it here"}
            </p>
            <p className="text-sm text-gray-400 mt-2">Max file size: 5MB</p>
          </label>
        </div>

        {selectedFile && (
          <div className="mb-4">
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm text-gray-600 truncate">
                {selectedFile.name}
              </span>
              <span className="text-xs text-gray-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={isLoading || !selectedFile}
        >
          {isLoading ? "Uploading..." : "Upload File"}
        </button>
      </form>

      {isLoading && (
        <div className="text-center mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-gray-600">Uploading: {uploadProgress}%</p>
        </div>
      )}

      {resultUrl && (
        <div className="space-y-2">
          <div className="p-3 bg-gray-50 rounded-lg">
            <a
              href={resultUrl}
              className="text-blue-500 hover:underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {resultUrl}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
