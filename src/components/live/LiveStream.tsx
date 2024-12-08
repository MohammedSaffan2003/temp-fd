import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, MicOff, Video, VideoOff, Share2, Users, MessageCircle } from 'lucide-react';
import { Device } from 'mediasoup-client';
import LiveChat from './LiveChat';
import { useSocket } from '../../hooks/useSocket';
import { useAuthStore } from '../../store/authStore';

interface LiveStreamProps {
  streamId: string;
  isHost: boolean;
  onEnd?: () => void;
}

const LiveStream: React.FC<LiveStreamProps> = ({ streamId, isHost, onEnd }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const socket = useSocket();
  const { user } = useAuthStore();
  const deviceRef = useRef<Device | null>(null);
  const producerRef = useRef<any>(null);

  useEffect(() => {
    if (!socket || !user) return;

    const initializeStream = async () => {
      try {
        if (isHost) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
          });

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }

          // Initialize mediasoup device
          deviceRef.current = new Device();
          
          // Get router RTP capabilities
          const routerRtpCapabilities = await new Promise(resolve => {
            socket.emit('getRouterRtpCapabilities', resolve);
          });

          await deviceRef.current.load({ routerRtpCapabilities });

          // Create transport
          const transportInfo = await new Promise(resolve => {
            socket.emit('createWebRtcTransport', { sender: true }, resolve);
          });

          const sendTransport = deviceRef.current.createSendTransport(transportInfo);

          sendTransport.on('connect', async ({ dtlsParameters }, callback) => {
            socket.emit('connectWebRtcTransport', {
              transportId: sendTransport.id,
              dtlsParameters
            }, callback);
          });

          sendTransport.on('produce', async (parameters, callback) => {
            socket.emit('produce', {
              transportId: sendTransport.id,
              kind: parameters.kind,
              rtpParameters: parameters.rtpParameters,
              appData: parameters.appData
            }, callback);
          });

          // Start streaming video
          const videoTrack = stream.getVideoTracks()[0];
          producerRef.current = await sendTransport.produce({
            track: videoTrack,
            encodings: [
              { maxBitrate: 100000 },
              { maxBitrate: 300000 },
              { maxBitrate: 900000 }
            ],
            codecOptions: {
              videoGoogleStartBitrate: 1000
            }
          });
        } else {
          // Viewer logic
          socket.emit('joinStream', { streamId });
        }
      } catch (err) {
        console.error('Failed to initialize stream:', err);
      }
    };

    initializeStream();

    socket.on('viewerCount', (count: number) => {
      setViewerCount(count);
    });

    return () => {
      if (producerRef.current) {
        producerRef.current.close();
      }
      if (deviceRef.current) {
        deviceRef.current.dispose();
      }
      socket.emit('leaveStream', { streamId });
    };
  }, [socket, user, streamId, isHost]);

  const toggleAudio = () => {
    if (producerRef.current) {
      const audioTrack = producerRef.current.track;
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (producerRef.current) {
      const videoTrack = producerRef.current.track;
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const shareStream = () => {
    const streamUrl = `${window.location.origin}/live/${streamId}`;
    navigator.clipboard.writeText(streamUrl);
    // Show toast or notification
  };

  return (
    <div className="relative h-screen bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isHost}
        className="w-full h-full object-cover"
      />

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            {isHost && (
              <>
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full ${
                    isAudioEnabled ? 'bg-red-600' : 'bg-gray-600'
                  }`}
                >
                  {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </button>
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full ${
                    isVideoEnabled ? 'bg-red-600' : 'bg-gray-600'
                  }`}
                >
                  {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </button>
              </>
            )}
            <button
              onClick={shareStream}
              className="p-3 rounded-full bg-red-600"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <Users className="w-5 h-5" />
              <span>{viewerCount}</span>
            </div>
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-3 rounded-full bg-red-600"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
            {isHost && (
              <button
                onClick={onEnd}
                className="px-4 py-2 bg-red-600 rounded-full font-medium hover:bg-red-700 transition-colors"
              >
                End Stream
              </button>
            )}
          </div>
        </div>
      </div>

      {showChat && (
        <div className="absolute top-0 right-0 bottom-0 w-80 bg-black/80 border-l border-gray-800">
          <LiveChat streamId={streamId} />
        </div>
      )}
    </div>
  );
};

export default LiveStream;