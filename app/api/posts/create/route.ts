import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // ignore in server components
            }
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "NOT_SIGNED_IN" },
        { status: 401 }
      );
    }

    // Parse multipart/form-data
    const formData = await request.formData();
    
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const tags = formData.get("tags") as string | null;
    const file = formData.get("file") as File | null;

    // Validate required fields
    // title and file are required, description can be empty
    if (!title || !file) {
      return NextResponse.json(
        { 
          ok: false, 
          error: "Missing required fields",
          details: { title: !!title, description: description !== null, file: !!file }
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, error: "File must be an image" },
        { status: 400 }
      );
    }

    // Logging for debugging
    console.log("[POST /api/posts/create] User signed in:", !!user, "User ID:", user.id);
    const bucketName = "post_images";
    console.log("[POST /api/posts/create] Bucket name:", bucketName);
    console.log("[POST /api/posts/create] File info:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Upload file to Supabase Storage
    // Sanitize filename to remove any path separators
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const timestamp = Date.now();
    const filePath = `${user.id}/${timestamp}-${safeFileName}`;

    console.log("[POST /api/posts/create] Upload path:", filePath);

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[POST /api/posts/create] Upload error:", JSON.stringify(uploadError, null, 2));
      console.error("[POST /api/posts/create] Upload error details:", {
        message: uploadError.message,
        statusCode: uploadError.statusCode,
        error: uploadError.error,
      });
      return NextResponse.json(
        { 
          ok: false, 
          error: "Failed to upload image",
          details: uploadError 
        },
        { status: 500 }
      );
    }

    console.log("[POST /api/posts/create] Upload successful:", uploadData);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log("[POST /api/posts/create] Public URL:", publicUrl);

    // Process tags: split by comma, trim, remove empty
    const tagsArray = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    // Insert into posts table
    // Note: If schema uses different column names (e.g., caption instead of description),
    // update the insert object accordingly
    const { data: post, error: insertError } = await supabase
      .from("posts")
      .insert({
        author_id: user.id,
        title: title,
        description: description,
        tags: tagsArray,
        image_url: publicUrl,
        // If schema uses media_url instead of image_url, use: media_url: publicUrl,
        // If schema uses caption instead of description, use: caption: description,
        // created_at is set by default
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting post:", insertError);
      
      // Clean up uploaded file on error
      await supabase.storage.from(bucketName).remove([filePath]);

      return NextResponse.json(
        { 
          ok: false, 
          error: "Failed to create post",
          details: insertError 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, post },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Unexpected error in /api/posts/create:", error);
    return NextResponse.json(
      { 
        ok: false, 
        error: error.message || "An unexpected error occurred",
        details: error 
      },
      { status: 500 }
    );
  }
}
