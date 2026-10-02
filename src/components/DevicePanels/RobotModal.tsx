import React from 'react';
import { X, Bot, Cable, Wifi, Radio, Video, Mic, CheckCircle2, AlertTriangle } from 'lucide-react';
import { RobotConfig, RouterConfig, ServerConfig } from '../../types/network';
import { EvaluatedNetworkState } from '../../utils/networkEngine';

interface RobotModalProps {
  robot: RobotConfig;
  onUpdateRobot: (updater: (prev: RobotConfig) => RobotConfig) => void;
  router: RouterConfig;
  server: ServerConfig;
  evaluated: EvaluatedNetworkState;
  onClose: () => void;
}

export const RobotModal: React.FC<RobotModalProps> = ({
  robot,
  onUpdateRobot,
  router,
  server,
  evaluated,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100">智能直播机器人·推流网络配置</h3>
              <p className="text-[11px] text-slate-400">Stream Source Camera &amp; Network Adapter</p>
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
          {/* Section 1: Physical Link Mode */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="font-semibold text-slate-200 text-sm block">1. 接入介质选择 (物理网线 / Wi-Fi)</span>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onUpdateRobot(prev => ({ ...prev, connectionType: 'ethernet' }))}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-colors ${
                  robot.connectionType === 'ethernet'
                    ? 'bg-sky-500/10 border-sky-400 text-sky-300 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Cable className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-xs">以太网有线连接</div>
                  <div className="text-[10px] text-slate-400 font-normal">插线接入路由器 LAN 2口</div>
                </div>
              </button>

              <button
                onClick={() =>
                  onUpdateRobot(prev => ({
                    ...prev,
                    connectionType: 'wifi',
                    wifiSsid: router.wifiSsid,
                    wifiPassword: router.wifiPassword,
                  }))
                }
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-colors ${
                  robot.connectionType === 'wifi'
                    ? 'bg-sky-500/10 border-sky-400 text-sky-300 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Wifi className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-xs">Wi-Fi 无线连接</div>
                  <div className="text-[10px] text-slate-400 font-normal">无线连接教室路由器热点</div>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: IP Configuration */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 text-sm">2. 机器人 IP 地址配置</span>
              <div className="flex gap-2">
                <button
                  onClick={() => onUpdateRobot(prev => ({ ...prev, ipMode: 'static' }))}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    robot.ipMode === 'static'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  静态IP (推荐)
                </button>
                <button
                  onClick={() => onUpdateRobot(prev => ({ ...prev, ipMode: 'dhcp' }))}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    robot.ipMode === 'dhcp'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  自动获取 (DHCP)
                </button>
              </div>
            </div>

            {robot.ipMode === 'static' ? (
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">机器人静态 IP:</label>
                  <input
                    type="text"
                    value={robot.staticIp}
                    onChange={e =>
                      onUpdateRobot(prev => ({ ...prev, staticIp: e.target.value.trim() }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-emerald-400 focus:outline-hidden focus:border-sky-500"
                    placeholder="192.168.1.50"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">子网掩码:</label>
                  <input
                    type="text"
                    value={robot.subnetMask}
                    onChange={e =>
                      onUpdateRobot(prev => ({ ...prev, subnetMask: e.target.value.trim() }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-hidden focus:border-sky-500"
                    placeholder="255.255.255.0"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">默认网关:</label>
                  <input
                    type="text"
                    value={robot.gateway}
                    onChange={e =>
                      onUpdateRobot(prev => ({ ...prev, gateway: e.target.value.trim() }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-amber-300 focus:outline-hidden focus:border-sky-500"
                    placeholder="192.168.1.1"
                  />
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-slate-900 rounded-lg text-[11px] text-slate-400">
                当前DHCP指派IP: <span className="font-mono text-emerald-400">{evaluated.effectiveRobotIp || '未分配'}</span>
              </div>
            )}
          </div>

          {/* Section 3: Target Server Stream Destination */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="font-semibold text-slate-200 text-sm block">3. 摄像头推流目标配置 (RTMP Destination)</span>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              💡 机器人摄像头采集的视频需要推送到哪台服务器？此处必须填写<strong>流媒体服务器的实际静态 IP</strong>（当前服务器实际IP为:{' '}
              <span className="font-mono text-amber-300">{server.staticIp}</span>）。
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  目标流媒体服务器 IP (Target IP):
                </label>
                <input
                  type="text"
                  value={robot.targetServerIp}
                  onChange={e =>
                    onUpdateRobot(prev => ({ ...prev, targetServerIp: e.target.value.trim() }))
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-sky-400 focus:outline-hidden focus:border-sky-500"
                  placeholder="192.168.1.100"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">推流路径 / Stream Key:</label>
                <input
                  type="text"
                  value={robot.targetStreamKey}
                  onChange={e =>
                    onUpdateRobot(prev => ({ ...prev, targetStreamKey: e.target.value.trim() }))
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-hidden focus:border-sky-500"
                  placeholder="live/robot"
                />
              </div>
            </div>

            {/* Quick button to auto-fill matching server IP */}
            {robot.targetServerIp !== server.staticIp && (
              <button
                onClick={() =>
                  onUpdateRobot(prev => ({ ...prev, targetServerIp: server.staticIp }))
                }
                className="text-[11px] text-sky-400 hover:text-sky-300 underline block"
              >
                点此一键同步当前服务器IP ({server.staticIp})
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium"
          >
            完成并保存
          </button>
        </div>
      </div>
    </div>
  );
};
