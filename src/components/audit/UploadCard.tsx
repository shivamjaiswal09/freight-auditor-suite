import { useState, useRef } from "react";
import { Upload, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UploadCardProps {
  onProcess: (file: File) => void;
  disabled?: boolean;
}

export const UploadCard = ({ onProcess, disabled }: UploadCardProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleProcess = () => {
    if (file) {
      onProcess(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upload Invoice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`relative rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          } ${file ? "bg-muted/30" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          />
          
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <FileText className="h-12 w-12 text-primary" />
              <div>
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Drop invoice PDF here or click to upload</p>
                <p className="text-sm text-muted-foreground mt-1">
                  We'll use AI to extract invoice details and match them to proforma
                </p>
              </div>
            </div>
          )}
        </div>

        <Button 
          onClick={handleProcess} 
          disabled={!file || disabled}
          className="w-full"
          size="lg"
        >
          Process Invoice
        </Button>
      </CardContent>
    </Card>
  );
};
