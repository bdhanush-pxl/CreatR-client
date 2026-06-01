import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import PostEditor from "../../../components/PostEditor";


const EditPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

    const fetchPost = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/posts/postsById/${id}`, {
                method: 'GET',
                credentials: 'include',
            })
            const data = await response.json();
            setPost(data.data);
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchPost();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="flex items-center space-x-3">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                    <span className="text-slate-300">Loading post...</span>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Post Not Found</h1>
                    <p className="text-slate-400">
                        The post you're looking for doesn't exist.
                    </p>
                </div>
            </div>
        );
    }


    return <PostEditor initialData={post} mode="edit" />;
}

export default EditPost
