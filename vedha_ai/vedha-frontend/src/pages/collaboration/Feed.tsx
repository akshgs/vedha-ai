import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import PostComposer from "@/components/ui/collaboration/PostComposer";
import PostCard from "@/components/ui/collaboration/PostCard";
import CommunityCard from "@/components/ui/collaboration/CommunityCard";
import { getNewsFeed, createFeedPost, getCommunities, type Post, type Community } from "@/services/networking";
import PageHeader from "@/components/ui/layout/PageHeader";

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeed() {
      try {
        setLoading(true);
        const [feedData, groupsData] = await Promise.all([getNewsFeed(), getCommunities()]);
        setPosts(feedData);
        setGroups(groupsData);
      } catch {
        toast.error("Failed to query collaboration feeds.");
      } finally {
        setLoading(false);
      }
    }
    void loadFeed();
  }, []);

  async function handleAddPost(text: string) {
    try {
      const added = await createFeedPost(text);
      setPosts([added, ...posts]);
      toast.success("Post published successfully!");
    } catch {
      toast.error("Failed to publish post.");
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-905 border border-slate-800 p-8 text-center text-slate-500 animate-pulse">
          Connecting collaboration feeds...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        <PageHeader
          title="Vedha Collaboration Feed"
          subtitle="Share technical project updates, ask algorithm questions, and network across developers and corporate mentors."
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-6">
            <PostComposer onPost={handleAddPost} />
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Communities Sidebar */}
          <div className="space-y-6">
            <Card variant="glass" className="p-5 space-y-4">
              <div className="flex gap-2 items-center border-b border-slate-800 pb-2.5">
                <Sparkles size={16} className="text-cyan-400 animate-pulse" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Suggested Groups</h3>
              </div>
              <div className="space-y-3">
                {groups.map((grp) => (
                  <CommunityCard
                    key={grp.id}
                    id={grp.id}
                    name={grp.name}
                    description={grp.description}
                    membersCount={grp.membersCount}
                    joined={grp.joined}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
