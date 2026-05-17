import React, { useState, useEffect } from "react";
import { ArrowRight, Loader2, User } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/Auth/AuthContext";
import PostEditor from "../../../components/PostEditor";

const CreatePost = () => {
    const { user } = useAuth();
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    const [draft, setDraft] = useState(null);
    const fetchUserDraft = async () => {
        try {
            const response = await fetch(API_URL + '/api/posts/draft', {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch drafts: ${response.status}`);
            }
            const data = await response.json();
            setDraft(data);
            // Handle the draft data as needed
        } catch (error) {
            console.error("Error fetching user draft:", error);
            setDraft(null); // Clear draft state on error
        }
    }

    useEffect(() => {
        fetchUserDraft();
    }, []);

    if (!user) {
        return (
            <div className="h-80 bg-slate-900 flex items-center justify-center p-8">
                <div className="max-w-2xl w-full text-center space-y-6">
                    <h1 className="text-3xl font-bold text-white">Username Required</h1>
                    <p className="text-slate-400 text-lg">
                        Set up a username to create and share your posts
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/dashboard/settings">
                            <Button variant="primary">
                                Set Up Username
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }


    return <PostEditor initialData={draft} mode="create" />
}

export default CreatePost
