import React, { useState, useEffect } from 'react';
import {
  Video,
  Mic,
  MicOff,
  Radio,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  Eye,
  Sliders,
} from 'lucide-react';
import { RobotConfig, ROBOT_TOPICS } from '../types/network';

interface RobotLiveBroadcasterProps {
  robot: RobotConfig;
  onUpdateRobot: (updater: (prev: RobotConfig) => RobotConfig) => void;
  streamPublished: boolean;
  onOpenSettings: () => void;
}

export const RobotLiveBroadcaster: React.FC<RobotLiveBroadcasterProps> = ({
  robot,
  onUpdateRobot,
  streamPublished,
  onOpenSettings,
}) => {
  const [mouthOpen, setMouthOpen] = useState(false);
  const [blink, setBlink] = useState(false);
  const [audioSpeechEnabled, setAudioSpeechEnabled] = useState(false);
  const [viewerCount, setViewerCount] = useState(42);

  const currentTopic = ROBOT_TOPICS[robot.topicIndex] || ROBOT_TOPICS[0];

  // Animated mouth and blink effect for robot
  useEffect(() => {
    if (!robot.cameraActive || !robot.isStreaming) {
      setMouthOpen(false);
      return;
    }

    const mouthInterval = setInterval(() => {
      setMouthOpen(prev => !prev);
    }, 280);

    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3500);

    return () => {
      clearInterval(mouthInterval);
      clearInterval(blinkInterval);
    };
  }, [robot.cameraActive, robot.isStreaming]);

  // Voice synthesis when topic changes or user clicks speak
  const triggerSpeech = (text: string) => {
    if (!audioSpeechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 1.05;
      utterance.pitch = 1.25; // slightly cute robotic pitch
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore audio restriction
    }
  };

  const handleNextTopic = () => {
    const nextIdx = (robot.topicIndex + 1) % ROBOT_TOPICS.length;
    onUpdateRobot(prev => ({ ...prev, topicIndex: nextIdx }));
    triggerSpeech(ROBOT_TOPICS[nextIdx].speech);
  };

  const toggleStreaming = () => {
    onUpdateRobot(prev => {
      const nextStreaming = !prev.isStreaming;
      return { ...prev, isStreaming: nextStreaming };
    });
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-xl flex flex-col">
      {/* Studio Top Bar */}
      <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            {streamPublished && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                streamPublished ? 'bg-red-500' : 'bg-slate-500'
              }`}
            ></span>
          </span>
          <span className="text-xs font-semibold tracking-wider text-slate-200">
            {streamPublished ? 'LIVE 智能直播间·已推流' : 'OFFLINE 直播间·未推流'}
          </span>
          <span className="text-slate-600 text-xs">|</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Eye className="w-3 h-3 text-slate-400" />
            <span className="tabular-nums font-mono">{streamPublished ? viewerCount : 0}</span> 人在线
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const next = !audioSpeechEnabled;
              setAudioSpeechEnabled(next);
              if (next) triggerSpeech(currentTopic.speech);
            }}
            title={audioSpeechEnabled ? '关闭机器人朗读声音' : '开启机器人朗读声音'}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              audioSpeechEnabled
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {audioSpeechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onOpenSettings}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 border border-slate-700 transition-colors"
          >
            <Sliders className="w-3 h-3" />
            <span>推流设置</span>
          </button>
        </div>
      </div>

      {/* Main Broadcast Screen Area */}
      <div className="relative aspect-video w-full bg-gradient-to-b from-slate-900 via-indigo-950/60 to-slate-950 flex items-center justify-center overflow-hidden">
        {/* Studio Background Image with Scrim */}
        <img
          src="/src/assets/images/broadcast_studio_stage_1790952309226.jpg"
          alt="Studio Background"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // fallback gracefully
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Ambient Grid overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* The Live Stream Robot Character */}
        {robot.cameraActive ? (
          <div className="relative z-10 flex flex-col items-center">
            {/* Robot Head & Body (High Quality Animated SVG/Canvas Art) */}
            <div className="relative flex flex-col items-center group cursor-pointer" onClick={handleNextTopic}>
              {/* Antenna */}
              <div className="w-1.5 h-6 bg-slate-400 rounded-t-full relative flex items-center justify-center">
                <div
                  className={`w-3.5 h-3.5 rounded-full absolute -top-2 ${
                    streamPublished
                      ? 'bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse'
                      : 'bg-amber-400'
                  }`}
                />
              </div>

              {/* Robot Head Chassis */}
              <div className="w-36 h-28 bg-gradient-to-b from-slate-700 to-slate-800 rounded-3xl border-2 border-slate-600 shadow-2xl p-2.5 flex flex-col items-center justify-center relative">
                {/* Ears / Headphone dials */}
                <div className="absolute -left-3 top-8 w-3 h-8 bg-sky-500 rounded-l-md shadow-md" />
                <div className="absolute -right-3 top-8 w-3 h-8 bg-sky-500 rounded-r-md shadow-md" />

                {/* Face Digital Screen */}
                <div className="w-full h-full bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center p-2 relative overflow-hidden">
                  {/* Digital scanline */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-transparent h-12 animate-pulse pointer-events-none" />

                  {/* Robot Eyes */}
                  <div className="flex items-center gap-5 mb-2">
                    <div
                      className={`w-5 h-5 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8] flex items-center justify-center transition-all duration-150 ${
                        blink ? 'h-0.5 scale-y-10' : 'h-5'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white -translate-x-0.5 -translate-y-0.5" />
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8] flex items-center justify-center transition-all duration-150 ${
                        blink ? 'h-0.5 scale-y-10' : 'h-5'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white -translate-x-0.5 -translate-y-0.5" />
                    </div>
                  </div>

                  {/* Robot Mouth */}
                  <div className="w-10 h-3 flex items-center justify-center">
                    {mouthOpen ? (
                      <div className="w-7 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                    ) : (
                      <div className="w-6 h-1 rounded-full bg-sky-300" />
                    )}
                  </div>
                </div>
              </div>

              {/* Robot Torso / Desk Microphone */}
              <div className="w-24 h-12 bg-slate-800 rounded-b-2xl border-t border-slate-700 flex items-center justify-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono tracking-widest text-slate-300">ROBOT-7A</span>
              </div>
            </div>

            {/* Speech Bubble / Teaching Topic */}
            <div className="mt-2 max-w-sm px-3.5 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-sky-500/30 text-center shadow-lg">
              <div className="text-[11px] font-semibold text-sky-300 flex items-center justify-center gap-1 mb-0.5">
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>{currentTopic.title}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{currentTopic.speech}</p>
            </div>
          </div>
        ) : (
          <div className="text-center p-6 bg-slate-950/70 rounded-xl border border-slate-800">
            <Video className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">摄像头已关闭</p>
            <p className="text-xs text-slate-500 mt-1">开启摄像头以激活机器人视频流输入</p>
          </div>
        )}

        {/* Live Broadcast Watermark / Telemetry overlay */}
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[11px] font-mono text-slate-300 flex items-center gap-2">
          <span className="text-red-400 font-bold">REC</span>
          <span>1080P 60FPS</span>
          <span>H.264</span>
        </div>

        {/* Target Server Indicator */}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-[11px] font-mono text-slate-300">
          目标推流: <span className="text-amber-300">{robot.targetServerIp || '未配置'}</span>
        </div>
      </div>

      {/* Broadcast Controls Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Camera Toggle */}
          <button
            onClick={() => onUpdateRobot(prev => ({ ...prev, cameraActive: !prev.cameraActive }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              robot.cameraActive
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:bg-slate-700'
                : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{robot.cameraActive ? '摄像头开启' : '摄像头关闭'}</span>
          </button>

          {/* Mic Toggle */}
          <button
            onClick={() => onUpdateRobot(prev => ({ ...prev, micActive: !prev.micActive }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              robot.micActive
                ? 'bg-slate-800 text-sky-400 border border-sky-500/30 hover:bg-slate-700'
                : 'bg-slate-850 text-slate-500 border border-slate-800 hover:text-slate-400'
            }`}
          >
            {robot.micActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span>{robot.micActive ? '麦克风' : '麦克风静音'}</span>
          </button>

          {/* Switch Topic Button */}
          <button
            onClick={handleNextTopic}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3 h-3 text-amber-400" />
            <span>切换科普话题</span>
          </button>
        </div>

        {/* Master Stream Button */}
        <button
          onClick={toggleStreaming}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
            robot.isStreaming
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>{robot.isStreaming ? '停止推流 (Stop)' : '开始推流 (Start Stream)'}</span>
        </button>
      </div>
    </div>
  );
};
