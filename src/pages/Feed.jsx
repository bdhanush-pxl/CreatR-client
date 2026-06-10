import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth } from '../context/Auth/AuthContext';
import { useInView } from "react-intersection-observer";
import { TrendingUp, UserPlus, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import PostCard from "../components/PostCard";



function Feed() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("feed"); // "feed" or "trending"
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  const [feedData, setFeedData] = useState([]);
  const [isFeedLoading, setIsFeedLoading] = useState(false);

  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [isSuggestedUsersLoading, setIsSuggestedUsersLoading] = useState(false);

  const [trendingPosts, setTrendingPosts] = useState([]);
  const [isTrendingPostsLoading, setIsTrendingPostsLoading] = useState(false);

  const [isToggleFollowLoading, setIsToggleFollowLoading] = useState(false);

  // Infinite scroll detection
  const { ref: loadMoreRef } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });


  useEffect(() => {
    const fetchFeedData = async () => {
      if (!user) {
        toast.error("Please login to view your feed");
        return;
      }
      setIsFeedLoading(true);
      try {
        const response = await fetch(API_URL + '/api/feed/main?limit=15', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setFeedData(data.data);
      } catch (error) {
        toast.error(error.message || "Error fetching feed data");
        console.error("Error fetching feed data:", error);
      } finally {
        setIsFeedLoading(false);
      }
    };

    const fetchSuggestedUsers = async () => {
      if (!user) {
        return;
      }
      setIsSuggestedUsersLoading(true);
      try {
        const response = await fetch(API_URL + '/api/feed/suggested-users?limit=6', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setSuggestedUsers(data.data);
      } catch (error) {
        toast.error(error.message || "Error fetching suggested users");
        console.error("Error fetching suggested users:", error);
      } finally {
        setIsSuggestedUsersLoading(false);
      }
    };

    const fetchTrendingPosts = async () => {
      if(!user) return;
      setIsTrendingPostsLoading(true);
      try {
        const response = await fetch(API_URL + '/api/feed/trending-posts?limit=15', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setTrendingPosts(data.data);
      } catch (error) {
        toast.error(error.message || "Error fetching trending posts");
        console.error("Error fetching trending posts:", error);
      } finally {
        setIsTrendingPostsLoading(false);
      }
    };

    fetchFeedData();
    fetchSuggestedUsers();
    fetchTrendingPosts();
  }, [API_URL]);

  const handleFollowToggle = async (userId) => {
    if (!user) {
      toast.error("Please login to follow users");
      return;
    }
    setIsToggleFollowLoading(true);
    try {
      const followingId = userId;
      const response = await fetch(API_URL + `/api/follow/toggle/${followingId}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.data === true) {
        setSuggestedUsers(prev =>
          prev.filter(u => u._id !== userId)
        );
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

  // Get current posts based on active tab
  const getCurrentPosts = () => {
    switch (activeTab) {
      case "trending":
        return trendingPosts || [];
      default:
        return feedData?.posts || [];
    }
  };

  const isLoading =
    isFeedLoading || (activeTab === "trending" && isTrendingPostsLoading);
  const currentPosts = getCurrentPosts();
  console.log("Current Posts:", currentPosts);



  return (
    <div className="min-h-screen bg-slate-900 text-white pt-32 pb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Feed Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold gradient-text-primary pb-2">
            Discover Amazing Content
          </h1>
          <p className="text-slate-400">
            Stay up to date with the latest posts from creators you follow
          </p>
        </div>

        {/* Main Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-4 space-y-6">
            {/* Feed Tabs */}
            <div className="flex space-x-2">
              <Button
                onClick={() => setActiveTab("feed")}
                variant={activeTab === "feed" ? "primary" : "ghost"}
                className="flex-1 hover:cursor-pointer hover:bg-gray-600 hover:text-white"
              >
                For You
              </Button>
              <Button
                onClick={() => setActiveTab("trending")}
                variant={activeTab === "trending" ? "primary" : "ghost"}
                className="flex-1 hover:cursor-pointer hover:bg-gray-600 hover:text-white"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </Button>
            </div>

            {/* Create Post Prompt */}
            {user && (
              <Link
                to="/dashboard/createPost"
                className="flex items-center space-x-3 cursor-pointer"
              >
                <div className="relative w-10 h-10">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.firstName || "User"}
                      fill
                      className="rounded-full object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold">
                      {(user.firstName || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-slate-800 border border-slate-600 rounded-full px-4 py-3 text-slate-400 hover:border-slate-500 transition-colors">
                    What's on your mind? Share your thoughts...
                  </div>
                </div>
              </Link>
            )}

            {/* Posts Feed */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-4" />
                  <p className="text-slate-400">Loading posts...</p>
                </div>
              </div>
            ) : currentPosts.length === 0 ? (
              <Card className="card-glass">
                <CardContent className="text-center py-12">
                  <div className="space-y-4">
                    <div className="text-6xl">📝</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {activeTab === "trending"
                          ? "No trending posts right now"
                          : "No posts to show"}
                      </h3>
                      <p className="text-slate-400 mb-6">
                        {activeTab === "trending"
                          ? "Check back later for trending content"
                          : "Follow some creators to see their posts here"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Posts Grid */}
                <div className="space-y-6">
                  {currentPosts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      showActions={false}
                      showAuthor={true}
                      className="max-w-none"
                    />
                  ))}
                </div>

                {/* Load More Indicator */}
                {activeTab === "feed" && feedData?.hasMore && (
                  <div ref={loadMoreRef} className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Left Sidebar - Following */}
          <div className="lg:col-span-2 space-y-6 mt-14">
            {/* Suggested Users */}
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Suggested Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSuggestedUsersLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                  </div>
                ) : !suggestedUsers || suggestedUsers.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-slate-400 text-sm">
                      No suggestions available
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestedUsers.map((u) => (
                      <div key={u._id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Link to={`/${u.username}`}>
                            <div className="flex items-center space-x-3 cursor-pointer">
                              <div className="relative w-10 h-10">
                                {u.imageUrl ? (
                                  <img
                                    src={u.imageUrl}
                                    alt={u.name}
                                    fill
                                    className="rounded-full object-cover"
                                    sizes="40px"
                                  />
                                ) : (
                                  <div className="w-full h-full rounded-full bg-gradient-to-br hover:text-purple-400 flex items-center justify-center text-sm font-bold">
                                    {u.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium hover:text-purple-400 text-white">
                                  {u.name}
                                </p>
                                <p className="text-xs hover:text-purple-400 text-slate-400">
                                  @{u.username}
                                </p>
                              </div>
                            </div>
                          </Link>
                          <Button
                            onClick={() => handleFollowToggle(u._id)}
                            disabled={isToggleFollowLoading}
                            variant="outline"
                            size="sm"
                            className="border-purple-500 text-purple-400 hover:cursor-pointer hover:bg-purple-500 hover:text-white"
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Follow
                          </Button>
                        </div>
                        <div className="text-xs text-slate-500 pl-13">
                          {u.followerCount} followers • {u.postCount}{" "}
                          posts
                        </div>
                        {u.recentPosts && u.recentPosts.length > 0 && (
                          <div className="text-xs text-slate-400 pl-13">
                            Latest: "
                            {u.recentPosts[0].title.substring(0, 30)}..."
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feed
