import { useEffect, useRef, useState } from 'react';

interface VideoCallProps {
  roomUrl: string;
}

// This is a client-side only component
const DailyVideo = ({ roomUrl }: VideoCallProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const [callFrame, setCallFrame] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let frame: any = null;

    const loadAndInitDaily = async () => {
      try {
        if (!videoRef.current) {
          return;
        }

        const DailyIframe = (await import('@daily-co/daily-js')).default;
        if (!DailyIframe) {
          throw new Error('Failed to load Daily.co library');
        }

        frame = DailyIframe.createFrame(videoRef.current, {
          iframeStyle: {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            border: '0',
          },
        });

        setCallFrame(frame);

        await frame.join({ url: roomUrl });

      } catch (e: any) {
        console.error('Error initializing Daily.co frame:', e);
        setError(e.message || 'Failed to initialize video call');
      } finally {
        setLoading(false);
      }
    };

    loadAndInitDaily();

    return () => {
      if (frame) {
        frame.destroy();
      }
    };
  }, [roomUrl]);

  if (loading) {
    return <div>Loading Video Call...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div ref={videoRef} style={{ width: '100%', height: '100%' }} />;
};

// Main component that ensures client-side rendering
const VideoCall = ({ roomUrl }: VideoCallProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <DailyVideo roomUrl={roomUrl} /> : null;
};

export default VideoCall;
