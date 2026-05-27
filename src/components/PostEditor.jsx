import React, { useState, useEffect , useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { useNavigate } from "react-router";
import PostEditorHeader from "./PostEditorHeader";
import PostEditorContent from "./PostEditorContent";
import PostEditorSettings from "./PostEditorSettings";
import ImageUploadModal from "./ImageUploadModal";
import { toast } from "sonner";


const postSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title too long"),
    content: z.string().min(1, "Content is required"),
    category: z.string().optional(),
    tags: z.array(z.string()).max(10, "Maximum 10 tags allowed"),
    featuredImage: z.string().optional(),
    scheduledFor: z.string().optional(),
});

const PostEditor = ({ initialData = null, mode = "create" }) => {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageModalType, setImageModalType] = useState("featured");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [quillRef, setQuillRef] = useState(null);
    const [isCreateLoading, setIsCreateLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    // const [savedSelection, setSavedSelection] = useState(null);

    // Tracks the last saved version so the header Draft badge updates
    // immediately after the first save without a page reload.
    const [savedPostData, setSavedPostData] = useState(initialData);

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

    const form = useForm({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: initialData?.title || "",
            content: initialData?.content || "",
            category: initialData?.category || "",
            tags: initialData?.tags || [],
            featuredImage: initialData?.featuredImage || "",
            scheduledFor: initialData?.scheduledFor
                ? new Date(initialData.scheduledFor).toISOString().slice(0, 16)
                : "",
        },
    });

    const { handleSubmit, watch, setValue } = form;
    const watchedValues = watch();

    const handleSave = (silent = false) => {
        handleSubmit((data) => onSubmit(data, "draft", silent))();
    };

    // Auto-save for drafts
    useEffect(() => {
        if (!watchedValues.title && !watchedValues.content) return;

        const autoSave = setInterval(() => {
            if (watchedValues.title || watchedValues.content) {
                if (mode === "create") handleSave(true); // Silent save
            }
        }, 30000);

        return () => clearInterval(autoSave);
    }, [watchedValues.title, watchedValues.content, mode, handleSave]);

    // Handle image selection
    const handleImageSelect = (imageData) => {
        if (imageModalType === "featured") {
            setValue("featuredImage", imageData.url);
            toast.success("Featured image added!");
        } else if (imageModalType === "content" && quillRef) {
            const quill = quillRef.getEditor();
            // const index = savedSelection?.index ?? quill.getSelection()?.index ?? quill.getLength();
            const range = quill.getSelection();
            const index = range ? range.index : quill.getLength();
            quill.insertEmbed(index, "image", imageData.url);
            quill.setSelection(index + 1);
            toast.success("Image inserted!");
            // setSavedSelection(null);
        }
        setIsImageModalOpen(false);
    };

    // Submit handler
    const onSubmit = async (data, action, silent = false) => {
        try {
            const postData = {
                title: data.title,
                content: data.content,
                category: data.category || undefined,
                tags: data.tags,
                featuredImage: data.featuredImage || null,
                status: action === "publish" ? "published" : "draft",
                scheduledFor: data.scheduledFor
                    ? new Date(data.scheduledFor).getTime()
                    : undefined,
            };

            let resultId;

            if (mode === "edit" && initialData?._id) {
                // Always use update for edit mode
                const response = await updatePost({
                    postId: initialData._id,
                    ...postData,
                });
                resultId = response.data;
            } else if (initialData?._id && action === "draft") {
                // If we have existing draft data, update it
                const response = await updatePost({
                    postId: initialData._id,
                    ...postData,
                });
                resultId = response.data;
            } else {
                // Create new post (will auto-update existing draft if needed)
                const response = await createPost(postData);
                resultId = response.data;
            }

            if (!silent) {
                const message =
                    action === "publish" ? "Post published!" : "Draft saved!";
                toast.success(message);
                if (action === "publish") navigate("/dashboard/posts");
            }

            // Update local state so the header Draft badge appears immediately.
            // Also notify DashboardLayout (which lives outside this tree) so the
            // sidebar badge refreshes without a full page reload.
            if (action !== "publish") {
                setSavedPostData((prev) => ({
                    ...prev,
                    _id: resultId ?? prev?._id,
                    status: "draft",
                }));
                window.dispatchEvent(new CustomEvent("draftSaved"));
            }
            else if (action === "publish") {
                window.dispatchEvent(new CustomEvent("draftPublished"));
            }

            return resultId;
        } catch (error) {
            if (!silent) toast.error(error.message || "Failed to save post");
            throw error;
        }
    };


    const handlePublish = () => {
        handleSubmit((data) => onSubmit(data, "publish"))();
    };

    const handleSchedule = () => {
        if (!watchedValues.scheduledFor) {
            toast.error("Please select a date and time to schedule");
            return;
        }
        handleSubmit((data) => onSubmit(data, "schedule"))();
    };


    const createPost = async (data) => {
        setIsCreateLoading(true);
        try {
            const response = await fetch(API_URL + '/api/posts/create', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to create post");
            }
            return result;
        } catch (error) {
            console.error("Error creating post:", error);
            throw error;
        } finally {
            setIsCreateLoading(false);
        }
    }

    const updatePost = async (data) => {
        setIsUpdating(true);
        try {
            const response = await fetch(API_URL + '/api/posts/update', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to update post");
            }
            return result;
        } catch (error) {
            console.error("Error updating post:", error);
            throw error;
        } finally {
            setIsUpdating(false);
        }
    }

    const handleOpenImageModal = useCallback((type) => {
        setImageModalType(type);
        setIsImageModalOpen(true);
    }, []);


    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <PostEditorHeader
                mode={mode}
                initialData={savedPostData}
                isPublishing={isCreateLoading || isUpdating}
                onSave={handleSave}
                onPublish={handlePublish}
                onSchedule={handleSchedule}
                onSettingsOpen={() => setIsSettingsOpen(true)}
                onBack={() => navigate("/dashboard")}
            />

            {/* Main editor content goes here */}
            <PostEditorContent form={form} setQuillRef={setQuillRef}
                onImageUpload={handleOpenImageModal} />

            {/* Settings */}
            <PostEditorSettings
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                form={form}
                mode={mode}
            />

            {/* Image Upload Modal */}
            <ImageUploadModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                onImageSelect={handleImageSelect}
                title={
                    imageModalType === "featured"
                        ? "Upload Featured Image"
                        : "Insert Image"
                }
            />
        </div>
    )
}

export default PostEditor