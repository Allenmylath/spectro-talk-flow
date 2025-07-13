import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { RTVIFile } from "@/types/rtvi";
import { 
  Upload, 
  File, 
  FileText, 
  FileImage, 
  X, 
  Download,
  Eye,
  Trash2,
  FileCheck,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FileManagerProps {
  files: RTVIFile[];
  onFileUpload: (files: File[]) => void;
  onFileDelete: (fileId: string) => void;
  onFileAnalyze: (fileId: string) => void;
  maxFileSize?: number;
  supportedTypes?: string[];
  className?: string;
}

export function FileManager({
  files,
  onFileUpload,
  onFileDelete,
  onFileAnalyze,
  maxFileSize = 50 * 1024 * 1024, // 50MB
  supportedTypes = ['image/*', 'application/pdf', 'text/*', '.docx', '.doc'],
  className
}: FileManagerProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return FileImage;
    if (type.includes('pdf')) return FileText;
    if (type.startsWith('text/')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File) => {
    if (file.size > maxFileSize) {
      return `File size exceeds ${formatFileSize(maxFileSize)} limit`;
    }
    
    const isSupported = supportedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type);
      }
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });
    
    if (!isSupported) {
      return 'File type not supported';
    }
    
    return null;
  };

  const handleFiles = useCallback((fileList: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileList.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      // You could show these errors in a toast or alert
      console.warn('File validation errors:', errors);
    }

    if (validFiles.length > 0) {
      onFileUpload(validFiles);
    }
  }, [maxFileSize, supportedTypes, onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
      e.target.value = '';
    }
  };

  const FileCard = ({ file }: { file: RTVIFile }) => {
    const FileIcon = getFileIcon(file.type);
    const isUploading = file.uploadProgress !== undefined && file.uploadProgress < 100;
    const hasError = !!file.error;
    const isProcessed = !!file.processedAt;

    return (
      <Card className={cn(
        "p-4 space-y-3 hover-scale transition-all duration-200",
        hasError && "border-destructive bg-destructive/5",
        isProcessed && "border-success bg-success/5"
      )}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              hasError ? "bg-destructive/10 text-destructive" : 
              isProcessed ? "bg-success/10 text-success" :
              "bg-primary/10 text-primary"
            )}>
              {hasError ? (
                <AlertCircle className="h-5 w-5" />
              ) : isProcessed ? (
                <FileCheck className="h-5 w-5" />
              ) : (
                <FileIcon className="h-5 w-5" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{file.name}</h4>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {file.url && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Eye className="h-4 w-4" />
              </Button>
            )}
            
            {isProcessed && !hasError && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => onFileAnalyze(file.id)}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              onClick={() => onFileDelete(file.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Uploading...</span>
              <span className="font-medium">{file.uploadProgress}%</span>
            </div>
            <Progress value={file.uploadProgress} className="h-1" />
          </div>
        )}

        {hasError && (
          <div className="text-xs text-destructive bg-destructive/10 rounded-md p-2">
            {file.error}
          </div>
        )}

        {file.analysisResult && (
          <div className="text-xs text-muted-foreground bg-muted rounded-md p-2">
            <strong>Analysis:</strong> {file.analysisResult}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Zone */}
      <div
        className={cn(
          "upload-zone cursor-pointer",
          isDragOver && "dragover"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-lg">Drop files here</h3>
            <p className="text-muted-foreground text-sm">
              or click to browse files
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Max size: {formatFileSize(maxFileSize)}
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept={supportedTypes.join(',')}
          onChange={handleFileInputChange}
        />
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Files ({files.length})</h3>
            <Button variant="ghost" size="sm">
              Clear all
            </Button>
          </div>
          
          <div className="grid gap-3">
            {files.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}