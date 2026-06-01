import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { PlusCircle, Search, Filter, FileText } from "lucide-react";
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "sonner";
import PostCard from '../../../components/PostCard';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  // Filter and sort posts
  const filteredPosts = React.useMemo(() => {
    if (!posts) return [];

    let filtered = posts.filter((post) => {
      // Search filter
      const title = post?._doc.title ?? "";
      const matchesSearch = title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const postStatus = (post?._doc.status ?? "").toLowerCase();

      // Status filter
      const matchesStatus =
        statusFilter === "all" || postStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort posts
    filtered.sort((a, b) => {
      const aCreated = new Date(a?._doc.createdAt ?? 0).getTime();
      const bCreated = new Date(b?._doc.createdAt ?? 0).getTime();

      const aViews = a?._doc.viewCount ?? 0;
      const bViews = b?._doc.viewCount ?? 0;

      const aLikes = a?._doc.likeCount ?? 0;
      const bLikes = b?._doc.likeCount ?? 0;

      const aTitle = a?._doc.title ?? "";
      const bTitle = b?._doc.title ?? "";

      switch (sortBy) {
        case "newest":
          return bCreated - aCreated;
        case "oldest":
          return aCreated - bCreated;
        case "mostViews":
          return bViews - aViews;
        case "mostLikes":
          return bLikes - aLikes;
        case "alphabetical":
          return aTitle.localeCompare(bTitle);
        default:
          return bCreated - aCreated;
      }
    });

    return filtered;
  }, [posts, searchQuery, statusFilter, sortBy]);

  console.log("Filtered Posts:", filteredPosts);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/posts/posts`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setPosts(data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/posts/posts`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to delete post");
      }
      const result = await response.json();
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    } finally {      // Refresh posts after deletion
      fetchPosts();
    }
  }

  const handleEditPost = (id) => {
    navigate(`/dashboard/posts/${id}`);
  }

  const handleDuplicatePost = () => { }

  useEffect(() => {
    fetchPosts();
  }, []);

  console.log("All Posts:", posts.map(post => post._doc));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading your posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text-primary">My Posts</h1>
          <p className="text-slate-400 mt-2">
            Manage and track your content performance
          </p>
        </div>

        <Link to="/dashboard/createPost">
          <Button variant="primary">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Post
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card className="card-glass">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-slate-800 border-slate-600">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600 z-[100] w-[var(--radix-select-trigger-width)]">
                <SelectItem className="text-white hover:bg-slate-700 focus:bg-slate-700" value="all">All Status</SelectItem>
                <SelectItem className="text-white hover:bg-slate-700 focus:bg-slate-700" value="published">Published</SelectItem>
                <SelectItem className="text-white hover:bg-slate-700 focus:bg-slate-700" value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-40 bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600 z-[100] w-[var(--radix-select-trigger-width)]">
                <SelectItem className="text-white hover:bg-slate-700 focus:bg-slate-700" value="newest">Newest First</SelectItem>
                <SelectItem className="text-white hover:bg-slate-700 focus:bg-slate-700" value="oldest">Oldest First</SelectItem>
                <SelectItem className="text-white hover:bg-slate-700 focus:bg-slate-700" value="mostViews">Most Views</SelectItem>
                <SelectItem className="text-white hover:bg-slate-700 focus:bg-slate-700" value="mostLikes">Most Likes</SelectItem>
                <SelectItem className="text-white hover:bg-slate-700 focus:bg-slate-700" value="alphabetical">A-Z</SelectItem>
              </SelectContent>
            </Select>

          </div>
        </CardContent>
      </Card>

      {
        filteredPosts.length === 0 ? (
          <Card className="card-glass">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {searchQuery || statusFilter !== "all"
                  ? "No posts found"
                  : "No posts yet"}
              </h3>
              <p className="text-slate-400 mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first post to get started"}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Link href="/dashboard/createPost">
                  <Button variant="primary">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Your First Post
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard
                key={post._doc._id}
                post={post._doc}
                showActions={true}
                showAuthor={false}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                onDuplicate={handleDuplicatePost}
              />
            ))}
          </div>
        )
      }

    </div>
  )
}

export default MyPosts
