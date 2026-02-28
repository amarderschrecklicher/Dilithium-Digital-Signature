import React from "react";
import { File } from "lucide-react";
import { formatFileSize } from "../services/fileService";

const FileUploader = ({
  selectedFile,
  setSelectedFile,
  id = "file-upload",
  label = "Kliknite ili prevucite fajl",
}) => {
  return (
    <div className="w-full">
      <input
        type="file"
        id={id}
        accept="*/*"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        className="hidden"
      />

      <label
        htmlFor={id}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-gray-700 hover:border-indigo-400 hover:bg-gray-100"
      >
        <File className="h-5 w-5" />

        <span className="text-sm">
          {selectedFile ? selectedFile.name : label}
        </span>

        {selectedFile && (
          <span className="text-xs text-gray-500">
            ({formatFileSize(selectedFile.size)})
          </span>
        )}
      </label>
    </div>
  );
};

export default FileUploader;
