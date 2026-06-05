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

const PublicProfilePage = ({ params }) => {
  const { user } = useAuth();
  const { username } = useParams();
  const [friend, setFriend] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [postsData, setPostsData] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isToggleFollowLoading, setIsToggleFollowLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(API_URL + `/api/users/${username}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setFriend(data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsUserLoading(false);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch(API_URL + `/api/public/posts/${username}?limit=20`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setPostsData(data.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsPostsLoading(false);
      }
    };

    const fetchFollowerCount = async () => {
      try {
        const response = await fetch(API_URL + `/api/follow/count/${username}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setFollowerCount(data.data);
      } catch (error) {
        console.error("Error fetching follower count:", error);
      }
    };

    const checkIfFollowing = async () => {
      try {
        const followingId = friend?._id;
        const response = await fetch(API_URL + `/api/follow/isFollowing/${followingId}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setIsFollowing(data.data);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    }

    fetchUser();
    fetchPosts();
    fetchFollowerCount();
    checkIfFollowing();
  }, [username]);

  useEffect(() => {
    const checkIfFollowing = async () => {
      if (!friend?._id || !user) return;
      try {
        const followingId = friend?._id;
        const response = await fetch(API_URL + `/api/follow/isFollowing/${followingId}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setIsFollowing(data.data);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    }

    checkIfFollowing();
  }, [friend, user])




  const handleFollowToggle = async () => {
    if (!user) {
      toast.error("Please login to follow users");
      return;
    }
    setIsToggleFollowLoading(true);
    try {
      const followingId = friend._id;
      const response = await fetch(API_URL + `/api/follow/toggle/${followingId}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      setIsFollowing(data.data);
      if (data.data) {
        setFollowerCount((prev) => prev + 1);
      } else {
        setFollowerCount((prev) => prev - 1);
      }
      toast.success(data.message);
      console.log("Follow toggle response:", data);
    } catch (error) {
      console.error("Error toggling follow status:", error);
      toast.error("An error occurred while trying to follow/unfollow the user");
    } finally {
      setIsToggleFollowLoading(false);
    }
  }

  if (isUserLoading || isPostsLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = user && friend && user._id === friend._id;
  console.log("Friend data:", friend, "current user:", user, "Posts data:", postsData);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <PublicHeader link="/" title="Back to Home" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="relative w-24 h-24 mx-auto mb-6">
            {friend.profilePicture ? (
              <img
                src={friend.profilePicture}
                alt={friend.name}
                fill
                className="rounded-full object-cover border-2 border-slate-700"
                sizes="96px"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl font-bold">
                {friend.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-2 gradient-text-primary">
            {friend.name}
          </h1>

          <p className="text-xl text-slate-400 mb-4">@{friend.username}</p>

          {/* Follow Button */}
          {!isOwnProfile && user && (
            <Button
              onClick={handleFollowToggle}
              disabled={isToggleFollowLoading}
              variant={isFollowing ? "outline" : "primary"}
              className="mb-4 hover:cursor-pointer"
            >
              {isFollowing ? (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Follow
                </>
              )}
            </Button>
          )}

          <div className="flex items-center justify-center text-sm text-slate-500">
            <Calendar className="h-4 w-4 mr-2" />
            Joined{" "}
            {new Date(friend.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>

        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-12">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{postsData.length}</div>
            <div className="text-sm text-slate-400">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {followerCount || 0}
            </div>
            <div className="text-sm text-slate-400">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {postsData
                .reduce((acc, post) => acc + post.viewCount, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {postsData
                .reduce((acc, post) => acc + post.likeCount, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Total Likes</div>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Recent Posts</h2>
          {postsData.length === 0 ? (
            <Card className="card-glass">
              <CardContent className="text-center py-12">
                <p className="text-slate-400 text-lg">No posts yet</p>
                <p className="text-slate-500 text-sm mt-2">
                  Check back later for new content!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {postsData.map((post) => (
                <PostCard
                  onClick={() => navigate(`/${friend.username}/${post._id}`)}
                  key={post._id}
                  post={post}
                  showActions={false}
                  showAuthor={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PublicProfilePage