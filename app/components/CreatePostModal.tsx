"use client";

import { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { ImageWithFallback } from "@/app/components/ImageWithFallback";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("File must be an image");
      return;
    }

    setSelectedFile(file);
    setError(null);
    
    // Create preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !title.trim()) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("tags", tags.trim());

      const res = await fetch("/api/posts/create", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!data.ok) {
        setError(data.error || "Something went wrong");
        setUploading(false);
        return;
      }

      // Reset form, close modal, and refresh feed
      resetForm();
      onClose();
      onSuccess();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      resetForm();
      onClose();
    }
  };

  const canSubmit = selectedFile !== null && title.trim() !== "";

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h2 className="text-xl font-semibold">Create Post</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={uploading}
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Content - Two column on desktop, stacked on mobile */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left: Image Preview (Desktop) / Top (Mobile) */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-muted/30">
            {previewUrl ? (
              <div className="relative w-full aspect-square max-w-md">
                <ImageWithFallback
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  disabled={uploading}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-square max-w-md border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-white"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
                <Upload className="size-12 mb-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground mb-1">Click to upload image</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
              </div>
            )}
          </div>

          {/* Right: Form (Desktop) / Bottom (Mobile) */}
          <div className="w-full md:w-1/2 flex flex-col overflow-hidden">
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title"
                    className="mt-2"
                    disabled={uploading}
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write a description..."
                    className="mt-2 min-h-[120px] resize-none"
                    disabled={uploading}
                  />
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Comma-separated tags (e.g., hair, color, balayage)"
                    className="mt-2"
                    disabled={uploading}
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Separate tags with commas
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
              </div>

              {/* Sticky Post Button - Desktop: bottom of right panel, Mobile: full width */}
              <div className="border-t p-6 bg-white shrink-0 md:sticky md:bottom-0">
                <div className="flex flex-col md:flex-row gap-3 md:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={uploading}
                    className="w-full md:w-auto md:min-w-[100px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploading || !canSubmit}
                    className="w-full md:w-auto md:min-w-[100px]"
                  >
                    {uploading ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
