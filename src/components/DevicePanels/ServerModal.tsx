import React from 'react';
import { X, Server, Cable, Play, Square, Activity, ShieldCheck, AlertCircle } from 'lucide-react';
import { ServerConfig, RouterConfig, RobotConfig } from '../../types/network';
import { EvaluatedNetworkState } from '../../utils/networkEngine';

interface ServerModalProps {
  server: ServerConfig;
  onUpdateServer: (updater: (prev: ServerConfig) => ServerConfig) => void;
  router: RouterConfig;
  robot: RobotConfig;
  evaluated: EvaluatedNetworkState;
  onClose: () => void;
}

export const ServerModal: React.FC<ServerModalProps> = ({
  server,
  onUpdateServer,
  router,
  robot,
  evaluated,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100">流媒体服务器·控制中心</h3>
              <p className="text-[11px] text-slate-400">Live Media Ingest &amp; Distribution Server</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Section 1: Physical Link */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cable className="w-4 h-4 text-sky-400" />
              <div>
                <span className="font-semibold text-slate-200">物理网线连接 (Ethernet)</span>
                <p className="text-[11px] text-slate-400">
                  {server.cabledToRouter
                    ? '网线已牢固接入路由器 LAN 1 口'
                    : '⚠️ 网线未连接，请插入网线以接入局域网'}
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                onUpdateServer(prev => ({ ...prev, cabledToRouter: !prev.cabledToRouter }))
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                server.cabledToRouter
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
              }`}
            >
              {server.cabledToRouter ? '拔出网线' : '插入网线'}
            </button>
          </div>

          {/* Section 2: IPv4 Static Configuration */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 text-sm">
                静态 IP 地址配置 (Static IPv4)
              </span>
              <span className="text-[11px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                固定门牌号
              </span>
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              💡 <strong>初一知识点：</strong>流媒体服务器通常需要配置<strong>固定静态 IP</strong>
              （如 192.168.1.100）。若使用动态DHCP，服务器重启后IP变化会导致摄像头推流中断！
            </p>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">服务器静态 IP:</label>
                <input
                  type="text"
                  value={server.staticIp}
                  onChange={e =>
                    onUpdateServer(prev => ({ ...prev, staticIp: e.target.value.trim() }))
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-emerald-400 focus:outline-hidden focus:border-sky-500"
                  placeholder="192.168.1.100"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">子网掩码:</label>
                <input
                  type="text"
                  value={server.subnetMask}
                  onChange={e =>
                    onUpdateServer(prev => ({ ...prev, subnetMask: e.target.value.trim() }))
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-hidden focus:border-sky-500"
                  placeholder="255.255.255.0"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">默认网关:</label>
                <input
                  type="text"
                  value={server.gateway}
                  onChange={e =>
                    onUpdateServer(prev => ({ ...prev, gateway: e.target.value.trim() }))
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-amber-300 focus:outline-hidden focus:border-sky-500"
                  placeholder="192.168.1.1"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Live Media Service Daemon */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200 text-sm">
                  流媒体推流与转码分发服务 (Nginx-RTMP)
                </span>
                <p className="text-[11px] text-slate-400">RTMP 端口: 1935 · HTTP 播放端口: 8080</p>
              </div>
              <button
                onClick={() =>
                  onUpdateServer(prev => ({ ...prev, serviceRunning: !prev.serviceRunning }))
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  server.serviceRunning
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                }`}
              >
                {server.serviceRunning ? (
                  <>
                    <Square className="w-3.5 h-3.5" /> 停止服务
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> 启动服务
                  </>
                )}
              </button>
            </div>

            {/* Ingestion & Client Distribution Inspector */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1.5 font-mono">
              <div className="flex justify-between items-center text-slate-400">
                <span>视频源输入 (Ingestion):</span>
                {evaluated.robotStreamPublished ? (
                  <span className="text-emerald-400 font-semibold">
                    ● 接收中 (来自机器人 {evaluated.effectiveRobotIp} · 4500kbps)
                  </span>
                ) : (
                  <span className="text-slate-500">○ 无输入信号</span>
                )}
              </div>

              <div className="flex justify-between items-center text-slate-400">
                <span>终端拉流分发 (Subscribers):</span>
                <span className="text-sky-300 font-sans">
                  {evaluated.phoneCanWatchStream && evaluated.laptopCanWatchStream
                    ? '2台活跃终端 (手机 + 笔记本)'
                    : evaluated.phoneCanWatchStream
                    ? '1台活跃终端 (手机)'
                    : evaluated.laptopCanWatchStream
                    ? '1台活跃终端 (笔记本)'
                    : '0台在线观看'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium"
          >
            保存并关闭
          </button>
        </div>
      </div>
    </div>
  );
};
