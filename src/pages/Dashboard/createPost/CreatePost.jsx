import React from "react";
import { ArrowRight, Loader2, User } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/Auth/AuthContext";

const CreatePost = () => {
    const { user } = useAuth();

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


    return (
        <div>
            posttt
        </div>
    )
}

export default CreatePost
