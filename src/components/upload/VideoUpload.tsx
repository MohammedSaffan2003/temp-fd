import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, AlertCircle } from 'lucide-react';

interface VideoUploadProps {
  onUpload: (file: File) => Promise<void>;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onUpload }) => {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('video/')) {
      return 'Please upload a video file';
    }

    // 100MB limit
    if (file.size > 100 * 1024 * 1024) {
      return 'Video size must be less than 100MB';
    }

    return null;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setUploading(true);
      setError(null);
      await onUpload(file);
    } catch (err) {
      setError('Failed to upload video. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive
            ? 'border-red-600 bg-red-600/10'
            : 'border-gray-600 hover:border-red-600'
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
            <span>Uploading video...</span>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">
              {isDragActive ? 'Drop your video here' : 'Drag & drop your video here'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              or click to select a file
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Maximum video length: 40 seconds
              <br />
              Supported formats: MP4, MOV, AVI (max 100MB)
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="bg-red-600/10 border-l-4 border-red-600 p-4 rounded-r flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;