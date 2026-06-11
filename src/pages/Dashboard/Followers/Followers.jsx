import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from "sonner";
import { UserPlus, UserMinus, Search, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { useAuth } from '../../../context/Auth/AuthContext';


const UserCard = ({ user, isLoading = false, variant = "follower", onToggle, }) => {
    return (
        <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            {/* Avatar + Info */}
            <div className="flex items-center space-x-3">
                <Link to={`/${user.username}`}>
                    <div className="relative w-10 h-10 cursor-pointer">
                        {user.imageUrl ? (
                            <img
                                src={user.imageUrl}
                                alt={user.name}
                                fill
                                className="rounded-full object-cover"
                                sizes="40px"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </Link>
                <Link to={user.username ? `/${user.username}` : ""}>
                    <div className="cursor-pointer">
                        <p className="font-medium text-white hover:text-purple-300">
                            {user.name}
                        </p>
                        {user.username && (
                            <p className="text-sm text-slate-400">@{user.username}</p>
                        )}
                    </div>
                </Link>
            </div>

            {/* Action Button */}
            {variant === "follower" ? (
                !user.followsBack && (
                    <Button
                        onClick={() => onToggle(user._id)}
                        disabled={isLoading}
                        variant="outline"
                        size="sm"
                        className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white hover:cursor-pointer"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <UserPlus className="h-4 w-4 mr-1" />
                                Follow Back
                            </>
                        )}
                    </Button>
                )
            ) : (
                <Button
                    onClick={() => onToggle(user._id)}
                    disabled={isLoading}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-red-400 hover:cursor-pointer"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <UserMinus className="h-4 w-4 mr-1" />
                            Unfollow
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}

const Followers = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [followers, setFollowers] = useState([]);
    const [isFollowersLoading, setIsFollowersLoading] = useState(false);
    const [following, setFollowing] = useState([]);
    const [isFollowingLoading, setIsFollowingLoading] = useState(false);
    const [isToggleFollowLoading, setIsToggleFollowLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("followers");
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    const { user } = useAuth();

    useEffect(() => {
        const fetchFollowers = async () => {
            setIsFollowersLoading(true);
            try {
                const response = await fetch(API_URL + '/api/follow/my-followers', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                setFollowers(data.data);
            } catch (error) {
                console.error("Error fetching followers:", error);
            } finally {
                setIsFollowersLoading(false);
            }
        };

        const fetchFollowing = async () => {
            setIsFollowingLoading(true);
            try {
                const response = await fetch(API_URL + '/api/follow/my-following', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                setFollowing(data.data);
            } catch (error) {
                console.error("Error fetching following:", error);
            } finally {
                setIsFollowingLoading(false);
            }
        };

        fetchFollowers();
        fetchFollowing();
    }, [API_URL])

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
            const isNowFollowing = !!data.data;
            const uid = String(userId);
            if (isNowFollowing) {
                // Ensure user is in following list
                setFollowing((prev) =>
                    prev.some((p) => String(p._id) === uid)
                        ? prev
                        : [
                            ...prev,
                            // try to reuse follower object if available so counts/details show correctly
                            ...(followers.find((f) => String(f._id) === uid) ? [followers.find((f) => String(f._id) === uid)] : [{ _id: uid }]),
                        ]
                );

                // If they are a follower, mark followsBack = true but keep them in followers list
                setFollowers((prev) =>
                    prev.map((f) => (String(f._id) === uid ? { ...f, followsBack: true } : f))
                );
            } else {
                // Remove from following list
                setFollowing((prev) => prev.filter((f) => String(f._id) !== uid));

                // If they are also a follower, mark followsBack = false (keep them in followers list)
                setFollowers((prev) =>
                    prev.map((f) => (String(f._id) === uid ? { ...f, followsBack: false } : f))
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
    };

    // Filter users based on search
    const filterUsers = (users) => {
        if (!searchQuery.trim()) return users || [];

        return (users || []).filter(
            (user) =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const filteredFollowers = filterUsers(followers);
    const filteredFollowing = filterUsers(following);

    const isLoading = isFollowersLoading || isFollowingLoading;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto" />
                    <p className="text-slate-400 mt-4">Loading ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 lg:p-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold gradient-text-primary">
                    Followers & Following
                </h1>
                <p className="text-slate-400 mt-2">
                    Manage your connections and discover new creators
                </p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="pl-10 bg-slate-800 border-slate-600"
                />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
                <TabsList className="grid w-full grid-cols-2 bg-slate-900">
                    <TabsTrigger className={`hover:cursor-pointer ${activeTab === "followers" ? "border-purple-500 text-purple-400" : ""}`} value="followers">
                        Followers ({filteredFollowers.length})
                    </TabsTrigger>
                    <TabsTrigger className={`hover:cursor-pointer ${activeTab === "following" ? "border-purple-500 text-purple-400" : ""}`} value="following">
                        Following ({filteredFollowing.length})
                    </TabsTrigger>
                </TabsList>

                {/* Followers Tab */}
                <TabsContent value="followers" className="mt-6">
                    {filteredFollowers.map((user) => (
                        <UserCard
                            key={user._id}
                            user={user}
                            variant="follower"
                            isLoading={isToggleFollowLoading}
                            onToggle={handleFollowToggle}
                        />
                    ))}
                </TabsContent>

                {/* Following Tab */}
                <TabsContent value="following" className="mt-6">
                    {filteredFollowing.map((user) => (
                        <UserCard
                            key={user._id}
                            user={user}
                            variant="following"
                            isLoading={isToggleFollowLoading}
                            onToggle={handleFollowToggle}
                        />
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Followers
