import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth } from '../../context/Auth/AuthContext';
import PublicHeader from '../../components/PublicHeader';
import { Calendar, UserPlus, UserCheck } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import PostCard from '../../components/PostCard';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Eye,
  Heart,
  Loader2,
  MessageCircle,
  Send,
  Trash2,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { BarLoader } from "react-spinners";


const SinglePostPage = () => {
  const { username, postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  const [commentContent, setCommentContent] = useState("");
  const [post, setPost] = useState(null);
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [commentsData, setCommentsData] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {

    const fetchPost = async () => {
      setIsPostLoading(true);
      try {
        const response = await fetch(API_URL + `/api/public/post/${username}/${postId}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setPost(data.data);
        setLikeCount(data.data.likeCount || 0);
        console.log("Fetched post:", data.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsPostLoading(false);
      }
    }

    const fetchComments = async () => {
      setIsCommentsLoading(true);
      try {
        const response = await fetch(API_URL + `/api/comments/get/${postId}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setCommentsData(data.data);
        console.log("Fetched comments:", data.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsCommentsLoading(false);
      }
    }

    fetchPost();
    fetchComments();
  }, [username, postId]);

  useEffect(() => {
    const fetchHasLiked = async () => {
      if (!user) return;
      try {
        const response = await fetch(API_URL + `/api/likes/hasLiked/${postId}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setHasLiked(data.data);
        console.log("Fetched like status:", data.data);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    }

    fetchHasLiked();
  }, [user, postId])

  const toggleLike = async () => {
    if (!user) {
      toast.error("Please login to like the post");
      return;
    }
    try {
      const response = await fetch(API_URL + `/api/likes/toggle/${postId}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      setHasLiked(data.data.liked);
      setLikeCount(data.data.likeCount);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  }

  const addComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to add a comment");
      return;
    }
    if (!commentContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    setIsSubmittingComment(true);
    try {
      const response = await fetch(API_URL + `/api/comments/add/${postId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: commentContent })
      });
      const data = await response.json();
      setCommentsData([...commentsData, data.data]);
      toast.success("Comment added successfully");
      setCommentContent("");
    } catch (error) {
      toast.error("Error:", error.message || "Failed to add comment");
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  }

  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(API_URL + `/api/comments/delete/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      toast.success(data.message);
      setCommentsData(commentsData.filter((comment) => comment._id !== commentId));
    } catch (error) {
      toast.error("Error:", error.message || "Failed to delete comment");
      console.error("Error deleting comment:", error);
    }
  }

  const incrementView = async () => {
    try {
      await fetch(API_URL + `/api/public/post/${postId}/views`, {
        method: 'PUT',
        credentials: 'include',
      });
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  }

  useEffect(() => {
    if (post && !isPostLoading) {
      incrementView();
    }
  }, [isPostLoading])

  if (isPostLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <PublicHeader link={`/${username}`} title="Back to Profile" />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <article className="space-y-8">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative w-full h-96 rounded-xl overflow-hidden">
              <img
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
          )}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text-primary">
              {post.title}
            </h1>

            <div className="flex items-center justify-between">
              <Link to={`/${username}`}>
                <div className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                  <div className="relative w-12 h-12">
                    {post.author.imageUrl ? (
                      <img
                        src={post.author.imageUrl}
                        alt={post.author.name}
                        fill
                        className="rounded-full object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-lg font-bold">
                        {post.author.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-white">
                      {post.author.name}
                    </p>
                    <p className="text-sm text-slate-400">
                      @{post.author.username}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="text-right text-sm text-slate-400">
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.viewCount.toLocaleString()} views
                </div>
              </div>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          {/* Post Content */}
          <div
            className="prose prose-lg max-w-none prose-invert prose-purple break-words overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className="flex items-center gap-6 pt-4 border-t border-slate-800">
            <Button
              onClick={toggleLike}
              variant="ghost"
              className={`flex items-center gap-2 ${hasLiked
                ? "text-red-400 hover:text-red-300"
                : "text-slate-400 hover:text-white"
                }`}
            >
              <Heart className={`h-5 w-5 ${hasLiked ? "fill-current" : ""}`} />
              {likeCount} {likeCount === 1 ? "Like" : "Likes"}
            </Button>

            <div className="flex items-center gap-2 text-slate-400">
              <MessageCircle className="h-5 w-5" />
              {commentsData?.length || 0} comments
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-white">Comments</h2>
          {user ? (
            <Card className="card-glass">
              <CardContent className="p-6">
                <form onSubmit={addComment} className="space-y-4">
                  <Textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Write a comment..."
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 resize-none"
                    rows={3}
                    maxLength={1000}
                  />

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      {commentContent.length}/1000 characters
                    </p>
                    <Button
                      type="submit"
                      disabled={isSubmittingComment || !commentContent.trim()}
                      variant="primary"
                    >
                      {isSubmittingComment ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Post Comment
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-glass">
              <CardContent className="p-6 text-center">
                <p className="text-slate-400 mb-4">
                  Sign in to join the conversation
                </p>
                <Link href="/sign-in">
                  <Button variant="primary">Sign In</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {isCommentsLoading ? (
            <BarLoader width={"100%"} color="#D8B4FE" />
          ) : commentsData && commentsData.length > 0 ? (
            <div className="space-y-4">
              {commentsData.map((comment) => (
                <Card key={comment._id} className="card-glass">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-8 h-8">
                          {comment.author?.imageUrl ? (
                            <img
                              src={comment.author.imageUrl}
                              alt={comment.author.name}
                              fill
                              className="rounded-full object-cover"
                              sizes="32px"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold">
                              {comment.author?.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-medium text-white">
                            {comment.author?.name || "Anonymous"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      {/* delete button */}
                      {user &&
                        comment.author &&
                        (user._id === comment.authorId ||
                          user._id === post.authorId) && (
                          <Button
                            onClick={() => deleteComment(comment._id)}
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                    </div>

                    <p className="text-slate-300 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-glass">
              <CardContent className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No comments yet</p>
                <p className="text-slate-500 text-sm mt-1">
                  Be the first to share your thoughts!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Custom prose styles */}
      <style jsx global>{`
        .prose-invert h1 {
          color: white;
          font-weight: 700;
          font-size: 2.5rem;
          margin: 1.5rem 0;
        }
        .prose-invert h2 {
          color: white;
          font-weight: 600;
          font-size: 2rem;
          margin: 1.25rem 0;
        }
        .prose-invert h3 {
          color: white;
          font-weight: 600;
          font-size: 1.5rem;
          margin: 1rem 0;
        }
        .prose-invert p {
          color: rgb(203, 213, 225);
          line-height: 1.7;
          margin: 1rem 0;
        }
        .prose-invert blockquote {
          border-left: 4px solid rgb(147, 51, 234);
          color: rgb(203, 213, 225);
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
        }
        .prose-invert a {
          color: rgb(147, 51, 234);
        }
        .prose-invert a:hover {
          color: rgb(168, 85, 247);
        }
        .prose-invert code {
          background: rgb(51, 65, 85);
          color: rgb(248, 113, 113);
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
        }
        .prose-invert pre {
          background: rgb(30, 41, 59);
          color: white;
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid rgb(71, 85, 105);
          overflow-x: auto;
        }
        .prose-invert ul,
        .prose-invert ol {
          color: rgb(203, 213, 225);
          padding-left: 1.5rem;
        }
        .prose-invert li {
          margin: 0.25rem 0;
        }
        .prose-invert img {
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
        .prose-invert strong {
          color: white;
        }
        .prose-invert em {
          color: rgb(203, 213, 225);
        }
      `}</style>
      
    </div>
  )
}

export default SinglePostPage
