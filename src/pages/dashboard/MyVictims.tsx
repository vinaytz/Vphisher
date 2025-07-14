
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Copy, ExternalLink, Film, PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Reel {
  id: string;
  reelId: string;
  redirectUrl: string;
  userId: string;
}

export default function MyReelsPage() {
  const { user, loading: authLoading } = useAuth();
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('reels')
          .select('id, "reelId", "redirectUrl", "userId"')
          .eq('userId', user.id);

        if (error) throw error;

        setReels(data as Reel[]);
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch ReelIDs.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchReels();
    }
  }, [user, authLoading]);

  const copyToClipboard = (reelId: string) => {
    const link = `$https://instagram-reels-post.vercel.app/${reelId}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  if (loading || authLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="bg-gray-800 border-gray-700 shadow-lg rounded-lg">
            <CardHeader className="pb-4">
              <Skeleton className="h-7 w-3/4 mb-2 bg-gray-700 rounded-md" />
              <Skeleton className="h-4 w-1/2 bg-gray-700 rounded-md" />
            </CardHeader>
            <CardContent className="flex flex-col space-y-3">
              <Skeleton className="h-10 w-full bg-gray-700 rounded-md" />
              <Skeleton className="h-10 w-full bg-gray-700 rounded-md" />
              <Skeleton className="h-10 w-full bg-gray-700 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-8 text-center">
        <PlusCircle className="h-16 w-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-gray-100">Create Your First Reel Link</h2>
        <p className="text-md text-gray-400 mb-6 max-w-md">You're just a few clicks away from generating a new reel link. Get started now.</p>
        <Link to="/dashboard/create">
          <Button className="bg-white hover:bg-gray-200 text-black font-medium py-2 px-4 rounded-lg flex items-center gap-2">
            <PlusCircle className="h-5 w-5" /> Create New Reel
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div class="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 rounded">
  <h3 class="text-base font-medium">
    Use this link if the copied one doesn’t work: 
    <a href="http://exam.com" target="_blank" class="text-blue-600 underline hover:text-blue-800 transition">
      http://exam.com
    </a>
  </h3>
</div>

      {reels.map((reel) => (
        <Card key={reel.id} className="flex flex-col bg-gray-800 border-gray-700 shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <CardHeader className="flex-grow pb-4">
            <CardTitle className="text-xl font-semibold text-gray-100 mb-1 flex items-center gap-2">
              <Film className="h-5 w-5 text-gray-400" /> {reel.reelId}
            </CardTitle>
            <CardDescription className="truncate text-gray-400">
              Redirects to: {reel.redirectUrl}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button
              onClick={() => copyToClipboard(reel.reelId)}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 text-gray-200 bg-gray-700 hover:bg-gray-600 border-gray-600"
            >
              <Copy className="h-4 w-4" /> Copy Link
            </Button>
            <a href={reel.redirectUrl} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 text-gray-200 bg-gray-700 hover:bg-gray-600 border-gray-600"
              >
                <ExternalLink className="h-4 w-4" /> Visit Redirect
              </Button>
            </a>
            <Link to={`/dashboard/submissions/${reel.reelId}`} className="w-full">
              <Button className="w-full bg-white hover:bg-gray-200 text-black">
                View Submissions
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
