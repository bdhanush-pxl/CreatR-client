import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { useNavigate } from "react-router";
import PostEditorHeader from "./PostEditorHeader";
import PostEditorContent from "./PostEditorContent";

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

    const handleSave = () => { }
    const handlePublish = () => { }
    const handleSchedule = () => { }
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

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

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <PostEditorHeader
                mode={mode}
                initialData={initialData}
                isPublishing={isCreateLoading || isUpdating}
                onSave={handleSave}
                onPublish={handlePublish}
                onSchedule={handleSchedule}
                onSettingsOpen={() => setIsSettingsOpen(true)}
                onBack={() => navigate("/dashboard")}
            />

            {/* Main editor content goes here */}
            <PostEditorContent form={form} setQuillRef={setQuillRef}
                onImageUpload={(type) => {
                    setImageModalType(type);
                    setIsImageModalOpen(true);
                }} />
        </div>
    )
}

export default PostEditor
