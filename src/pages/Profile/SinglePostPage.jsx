import React from 'react'
import { useParams } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth } from '../../context/Auth/AuthContext';
import PublicHeader from '../../components/PublicHeader';
import { Calendar, UserPlus, UserCheck } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import PostCard from '../../components/PostCard';
import { useNavigate } from 'react-router-dom';

const SinglePostPage = () => {
  const {username, postId} = useParams();
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <PublicHeader link={`/${username}`} title="Back to Profile" />
    </div>
  )
}

export default SinglePostPage
