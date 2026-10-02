import React from 'react';
import {
  Server,
  Router as RouterIcon,
  Bot,
  Smartphone,
  Laptop,
  Wifi,
  Cable,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import {
  RouterConfig,
  ServerConfig,
  RobotConfig,
  PhoneConfig,
  LaptopConfig,
} from '../types/network';
import { EvaluatedNetworkState } from '../utils/networkEngine';

interface NetworkTopologyCanvasProps {
  router: RouterConfig;
  server: ServerConfig;
  robot: RobotConfig;
  phone: PhoneConfig;
  laptop: LaptopConfig;
  evaluated: EvaluatedNetworkState;
  onSelectDevice: (device: 'router' | 'server' | 'robot' | 'phone' | 'laptop') => void;
  selectedDevice: string | null;
}

export const NetworkTopologyCanvas: React.FC<NetworkTopologyCanvasProps> = ({
  router,
  server,
  robot,
  phone,
  laptop,
  evaluated,
  onSelectDevice,
  selectedDevice,
}) => {
  return (
    <div className="relative w-full rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl overflow-hidden flex flex-col justify-between min-h-[460px]">
      {/* Background Tech Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Topology Header */}
      <div className="flex items-center justify-between z-10 mb-4 pb-2 border-b border-slate-800/80">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>局域网物理与逻辑拓扑图 (LAN Topology)</span>
            <span className="text-[11px] text-sky-400 font-normal">点击任意设备打开配置面板</span>
          </h3>
        </div>

        {/* Global stream status */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                evaluated.robotStreamPublished ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              }`}
            />
            <span className="text-slate-300">
              视频推流: {evaluated.robotStreamPublished ? '已就绪 (RTMP)' : '未连通'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                evaluated.phoneCanWatchStream && evaluated.laptopCanWatchStream
                  ? 'bg-emerald-400 animate-pulse'
                  : evaluated.phoneCanWatchStream || evaluated.laptopCanWatchStream
                  ? 'bg-amber-400'
                  : 'bg-slate-500'
              }`}
            />
            <span className="text-slate-300">
              终端拉流: {evaluated.phoneCanWatchStream && evaluated.laptopCanWatchStream ? '全部就绪' : '部分/未就绪'}
            </span>
          </div>
        </div>
      </div>

      {/* SVG Connecting Lines with Packet Flow Animations */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          {/* Gradients for animated packet pulses */}
          <linearGradient id="streamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>

        {/* Dynamic Cables / Signal Lines will be highlighted based on states */}
      </svg>

      {/* Interactive Topology Nodes Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center flex-1 py-2">
        {/* Column 1: Video Production Sources (Robot Streamer) */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div
            onClick={() => onSelectDevice('robot')}
            className={`w-full max-w-[210px] p-4 rounded-xl border cursor-pointer transition-all duration-200 group text-left ${
              selectedDevice === 'robot'
                ? 'bg-slate-800/90 border-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.2)]'
                : 'bg-slate-850/80 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Bot className="w-5 h-5" />
              </div>
              {evaluated.robotStreamPublished ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <Radio className="w-3 h-3 animate-pulse" /> 推流中
                </span>
              ) : evaluated.robotOnline ? (
                <span className="text-[11px] text-amber-400">在线·未推流</span>
              ) : (
                <span className="text-[11px] text-rose-400">离线</span>
              )}
            </div>

            <div className="font-semibold text-sm text-slate-100 mb-0.5">智能直播机器人</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-2">
              {robot.connectionType === 'ethernet' ? (
                <>
                  <Cable className="w-3 h-3 text-emerald-400" /> <span>网线连接</span>
                </>
              ) : robot.connectionType === 'wifi' ? (
                <>
                  <Wifi className="w-3 h-3 text-sky-400" /> <span>无线Wi-Fi</span>
                </>
              ) : (
                <span className="text-rose-400">未接入网络</span>
              )}
            </div>

            <div className="pt-2 border-t border-slate-700/60 text-[11px] space-y-0.5 font-mono">
              <div className="text-slate-400 flex justify-between">
                <span>IP:</span>
                <span className="text-slate-200">{evaluated.effectiveRobotIp || '0.0.0.0'}</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>目标:</span>
                <span className="text-sky-300 truncate max-w-[110px]">{robot.targetServerIp || '未填'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Central Network Core (Router & Server) */}
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Server Node */}
          <div
            onClick={() => onSelectDevice('server')}
            className={`w-full max-w-[220px] p-4 rounded-xl border cursor-pointer transition-all duration-200 group text-left ${
              selectedDevice === 'server'
                ? 'bg-slate-800/90 border-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.2)]'
                : 'bg-slate-850/80 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Server className="w-5 h-5" />
              </div>
              {evaluated.serverOnline ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> 服务就绪
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-rose-400">
                  <AlertTriangle className="w-3 h-3" /> 离线/异常
                </span>
              )}
            </div>

            <div className="font-semibold text-sm text-slate-100 mb-0.5">流媒体服务器</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-2">
              <Cable className="w-3 h-3 text-emerald-400" />
              <span>{server.cabledToRouter ? 'LAN口已接线' : '未插网线'}</span>
            </div>

            <div className="pt-2 border-t border-slate-700/60 text-[11px] space-y-0.5 font-mono">
              <div className="text-slate-400 flex justify-between">
                <span>静态IP:</span>
                <span className="text-slate-200">{server.staticIp}</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>网关:</span>
                <span className="text-slate-300">{server.gateway}</span>
              </div>
            </div>
          </div>

          {/* Router Node (Center Hub) */}
          <div
            onClick={() => onSelectDevice('router')}
            className={`w-full max-w-[220px] p-4 rounded-xl border cursor-pointer transition-all duration-200 group text-left ${
              selectedDevice === 'router'
                ? 'bg-slate-800/90 border-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.2)]'
                : 'bg-slate-850/80 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <RouterIcon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                {router.wifiEnabled && (
                  <Wifi className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                )}
                <span className="text-[11px] text-emerald-400 font-medium">网关核心</span>
              </div>
            </div>

            <div className="font-semibold text-sm text-slate-100 mb-0.5">无线路由器 (网关)</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-2">
              <Wifi className="w-3 h-3 text-sky-400" />
              <span>SSID: {router.wifiSsid}</span>
            </div>

            <div className="pt-2 border-t border-slate-700/60 text-[11px] space-y-0.5 font-mono">
              <div className="text-slate-400 flex justify-between">
                <span>LAN IP:</span>
                <span className="text-emerald-400">{router.lanIp}</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>掩码:</span>
                <span className="text-slate-300">{router.subnetMask}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Client Terminals (Phone & Laptop) */}
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Phone Node */}
          <div
            onClick={() => onSelectDevice('phone')}
            className={`w-full max-w-[210px] p-4 rounded-xl border cursor-pointer transition-all duration-200 group text-left ${
              selectedDevice === 'phone'
                ? 'bg-slate-800/90 border-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.2)]'
                : 'bg-slate-850/80 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Smartphone className="w-5 h-5" />
              </div>
              {evaluated.phoneCanWatchStream ? (
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 直播投射中
                </span>
              ) : evaluated.phoneOnline ? (
                <span className="text-[11px] text-amber-400">已联网·无画面</span>
              ) : (
                <span className="text-[11px] text-rose-400">未连通</span>
              )}
            </div>

            <div className="font-semibold text-sm text-slate-100 mb-0.5">手机观看终端</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-2">
              <Wifi className="w-3 h-3 text-sky-400" />
              <span>{phone.wifiConnected ? `已连 ${phone.wifiSsid}` : 'Wi-Fi未连接'}</span>
            </div>

            <div className="pt-2 border-t border-slate-700/60 text-[11px] space-y-0.5 font-mono">
              <div className="text-slate-400 flex justify-between">
                <span>IP:</span>
                <span className="text-slate-200">{evaluated.effectivePhoneIp || '0.0.0.0'}</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>模式:</span>
                <span className="text-slate-300 font-sans">{phone.ipMode === 'dhcp' ? 'DHCP自动' : '静态IP'}</span>
              </div>
            </div>
          </div>

          {/* Laptop Node */}
          <div
            onClick={() => onSelectDevice('laptop')}
            className={`w-full max-w-[210px] p-4 rounded-xl border cursor-pointer transition-all duration-200 group text-left ${
              selectedDevice === 'laptop'
                ? 'bg-slate-800/90 border-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.2)]'
                : 'bg-slate-850/80 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Laptop className="w-5 h-5" />
              </div>
              {evaluated.laptopCanWatchStream ? (
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 直播投射中
                </span>
              ) : evaluated.laptopOnline ? (
                <span className="text-[11px] text-amber-400">已联网·无画面</span>
              ) : (
                <span className="text-[11px] text-rose-400">未连通</span>
              )}
            </div>

            <div className="font-semibold text-sm text-slate-100 mb-0.5">笔记本电脑终端</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-2">
              {laptop.connectionType === 'ethernet' ? (
                <>
                  <Cable className="w-3 h-3 text-emerald-400" /> <span>网线连接</span>
                </>
              ) : laptop.connectionType === 'wifi' ? (
                <>
                  <Wifi className="w-3 h-3 text-sky-400" /> <span>无线Wi-Fi</span>
                </>
              ) : (
                <span className="text-rose-400">介质已断开</span>
              )}
            </div>

            <div className="pt-2 border-t border-slate-700/60 text-[11px] space-y-0.5 font-mono">
              <div className="text-slate-400 flex justify-between">
                <span>IP:</span>
                <span className="text-slate-200">{evaluated.effectiveLaptopIp || '0.0.0.0'}</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>模式:</span>
                <span className="text-slate-300 font-sans">{laptop.ipMode === 'dhcp' ? 'DHCP自动' : '静态IP'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time IP Conflict or Warning Banner */}
      {evaluated.ipConflicts.length > 0 && (
        <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{evaluated.ipConflicts[0]}</span>
        </div>
      )}
    </div>
  );
};
