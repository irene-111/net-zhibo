import React from 'react';
import { X, Wifi, Shield, Network, Cable, Check, AlertCircle } from 'lucide-react';
import { RouterConfig, ServerConfig, RobotConfig, LaptopConfig } from '../../types/network';

interface RouterModalProps {
  router: RouterConfig;
  onUpdateRouter: (updater: (prev: RouterConfig) => RouterConfig) => void;
  server: ServerConfig;
  robot: RobotConfig;
  laptop: LaptopConfig;
  onClose: () => void;
}

export const RouterModal: React.FC<RouterModalProps> = ({
  router,
  onUpdateRouter,
  server,
  robot,
  laptop,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100">无线双频路由器·网关控制台</h3>
              <p className="text-[11px] text-slate-400">Classroom Gateway &amp; Wireless AP</p>
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
          {/* Section 1: LAN & Gateway Settings */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 text-sm">局域网 (LAN) 与网关参数</span>
              <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                默认网关
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              路由器的 LAN 口 IP 地址即为全网设备的<strong>“默认网关 (Default Gateway)”</strong>。若服务器或电脑的网关与此不符，将无法正确进行数据转发。
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  路由器 LAN IP (默认网关):
                </label>
                <input
                  type="text"
                  value={router.lanIp}
                  onChange={e =>
                    onUpdateRouter(prev => ({ ...prev, lanIp: e.target.value.trim() }))
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-emerald-400 focus:outline-hidden focus:border-sky-500"
                  placeholder="192.168.1.1"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  子网掩码 (Subnet Mask):
                </label>
                <input
                  type="text"
                  value={router.subnetMask}
                  onChange={e =>
                    onUpdateRouter(prev => ({ ...prev, subnetMask: e.target.value.trim() }))
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-hidden focus:border-sky-500"
                  placeholder="255.255.255.0"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Wi-Fi Wireless AP Settings */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-sky-400" />
                <span className="font-semibold text-slate-200 text-sm">Wi-Fi 无线网络设置</span>
              </div>
              {/* Wi-Fi Switch */}
              <button
                onClick={() => onUpdateRouter(prev => ({ ...prev, wifiEnabled: !prev.wifiEnabled }))}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                  router.wifiEnabled ? 'bg-sky-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    router.wifiEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  无线网络名称 (SSID):
                </label>
                <input
                  type="text"
                  value={router.wifiSsid}
                  onChange={e =>
                    onUpdateRouter(prev => ({ ...prev, wifiSsid: e.target.value }))
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-sky-500"
                  placeholder="EduLab-WiFi-7A"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Wi-Fi 密码 (WPA2-PSK):
                </label>
                <input
                  type="text"
                  value={router.wifiPassword}
                  onChange={e =>
                    onUpdateRouter(prev => ({ ...prev, wifiPassword: e.target.value }))
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-amber-300 focus:outline-hidden focus:border-sky-500"
                  placeholder="robot888"
                />
              </div>
            </div>
          </div>

          {/* Section 3: DHCP Service Pool */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">DHCP 自动分配服务</span>
              <button
                onClick={() => onUpdateRouter(prev => ({ ...prev, dhcpEnabled: !prev.dhcpEnabled }))}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  router.dhcpEnabled
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {router.dhcpEnabled ? '已启用 (Enabled)' : '已停用 (Disabled)'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              为未配置静态IP的终端（如手机）自动指派空闲IP地址（地址池: 192.168.1.101 ~ 192.168.1.200）。
            </p>
          </div>

          {/* Section 4: Physical Ethernet Ports status */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-semibold text-slate-200 block">物理以太网 LAN 端口指示</span>
            <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
              <div
                className={`p-2 rounded-lg border ${
                  server.cabledToRouter
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <Cable className="w-4 h-4 mx-auto mb-1" />
                <div className="font-semibold">LAN 1</div>
                <div>{server.cabledToRouter ? '流媒体服务器' : '空闲'}</div>
              </div>

              <div
                className={`p-2 rounded-lg border ${
                  robot.connectionType === 'ethernet'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <Cable className="w-4 h-4 mx-auto mb-1" />
                <div className="font-semibold">LAN 2</div>
                <div>{robot.connectionType === 'ethernet' ? '直播机器人' : '空闲'}</div>
              </div>

              <div
                className={`p-2 rounded-lg border ${
                  laptop.connectionType === 'ethernet'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <Cable className="w-4 h-4 mx-auto mb-1" />
                <div className="font-semibold">LAN 3</div>
                <div>{laptop.connectionType === 'ethernet' ? '笔记本电脑' : '空闲'}</div>
              </div>

              <div className="p-2 rounded-lg border bg-slate-900 border-slate-800 text-slate-500">
                <Cable className="w-4 h-4 mx-auto mb-1" />
                <div className="font-semibold">LAN 4</div>
                <div>备用插口</div>
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
            完成配置
          </button>
        </div>
      </div>
    </div>
  );
};
