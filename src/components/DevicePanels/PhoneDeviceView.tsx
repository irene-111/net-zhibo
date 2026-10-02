import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  Radio,
  Settings,
  Tv,
  CheckCircle2,
  AlertTriangle,
  Send,
  Heart,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { PhoneConfig, RouterConfig, RobotConfig, ROBOT_TOPICS } from '../../types/network';
import { EvaluatedNetworkState } from '../../utils/networkEngine';

interface PhoneDeviceViewProps {
  phone: PhoneConfig;
  onUpdatePhone: (updater: (prev: PhoneConfig) => PhoneConfig) => void;
  router: RouterConfig;
  robot: RobotConfig;
  evaluated: EvaluatedNetworkState;
}

export const PhoneDeviceView: React.FC<PhoneDeviceViewProps> = ({
  phone,
  onUpdatePhone,
  router,
  robot,
  evaluated,
}) => {
  const [activeTab, setActiveTab] = useState<'stream' | 'settings'>('stream');
  const [passwordInput, setPasswordInput] = useState(phone.wifiPassword);
  const [selectedSsid, setSelectedSsid] = useState(phone.wifiSsid || router.wifiSsid);
  const [hearts, setHearts] = useState<number[]>([]);
  const [comments, setComments] = useState<string[]>([
    '终于连上教室局域网啦！🎉',
    '画面好清晰，机器人嘴巴在动！',
    'IP地址设置成功！',
  ]);
  const [inputComment, setInputComment] = useState('');

  const currentTopic = ROBOT_TOPICS[robot.topicIndex] || ROBOT_TOPICS[0];

  const handleConnectWifi = (ssid: string) => {
    onUpdatePhone(prev => ({
      ...prev,
      wifiConnected: true,
      wifiSsid: ssid,
      wifiPassword: passwordInput,
    }));
  };

  const handleDisconnectWifi = () => {
    onUpdatePhone(prev => ({
      ...prev,
      wifiConnected: false,
    }));
  };

  const handleSendHeart = () => {
    setHearts(prev => [...prev.slice(-10), Date.now()]);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputComment.trim()) return;
    setComments(prev => [...prev, inputComment.trim()]);
    setInputComment('');
  };

  const canPlay = evaluated.phoneCanWatchStream;

  return (
    <div className="flex flex-col items-center">
      {/* Smartphone Mockup Outer Body */}
      <div className="w-[320px] h-[610px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700 relative flex flex-col justify-between select-none">
        {/* Dynamic Island / Notch Speaker */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          <div className="w-2 h-2 rounded-full bg-sky-950 border border-sky-800/60" />
        </div>

        {/* Phone Screen Canvas */}
        <div className="w-full h-full bg-slate-950 rounded-[34px] overflow-hidden flex flex-col relative text-slate-100 border border-slate-800">
          {/* Status Bar */}
          <div className="pt-3 px-6 pb-1 flex items-center justify-between text-[11px] font-medium text-slate-300 z-20">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              {evaluated.phoneWifiAuthenticated ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span className="font-mono text-[10px]">5G</span>
              <div className="w-5 h-2.5 rounded-sm border border-slate-400 p-0.5 flex items-center">
                <div className="w-3 h-full bg-emerald-400 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* App Switcher Top Navigation */}
          <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-around z-20">
            <button
              onClick={() => setActiveTab('stream')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeTab === 'stream'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>七中直播</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>网络设置</span>
            </button>
          </div>

          {/* Tab 1: Live Stream Player App */}
          {activeTab === 'stream' && (
            <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-950">
              {canPlay ? (
                <div className="flex-1 flex flex-col justify-between relative">
                  {/* Stream Video Container */}
                  <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-slate-900 to-indigo-950/80 overflow-hidden flex items-center justify-center border-b border-slate-800">
                    <img
                      src="/src/assets/images/broadcast_studio_stage_1790952309226.jpg"
                      alt="Stream Video"
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                      referrerPolicy="no-referrer"
                    />

                    {/* Projected Robot Avatar */}
                    <div className="relative z-10 flex flex-col items-center scale-90">
                      {/* Antenna */}
                      <div className="w-1 h-4 bg-slate-400 rounded-t-full relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] absolute -top-1.5 -left-0.5 animate-pulse" />
                      </div>
                      {/* Head */}
                      <div className="w-24 h-20 bg-slate-800 rounded-2xl border border-slate-600 p-1.5 flex flex-col items-center justify-center shadow-lg">
                        <div className="w-full h-full bg-slate-950 rounded-xl flex flex-col items-center justify-center">
                          {/* Eyes */}
                          <div className="flex items-center gap-3 mb-1.5">
                            <div className="w-3.5 h-3.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
                            <div className="w-3.5 h-3.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
                          </div>
                          {/* Animated mouth */}
                          <div className="w-5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                      </div>
                    </div>

                    {/* LIVE badge & overlay */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span className="font-semibold text-red-400">直播中</span>
                      <span className="text-slate-400 font-mono">1080P</span>
                    </div>

                    {/* Floating Hearts Animation */}
                    <div className="absolute right-3 bottom-3 pointer-events-none flex flex-col items-center gap-2">
                      {hearts.slice(-4).map(h => (
                        <div
                          key={h}
                          className="text-pink-400 animate-bounce text-sm drop-shadow-[0_0_6px_rgba(244,114,182,0.8)]"
                        >
                          ❤️
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Robot Live Speaking Speech Banner */}
                  <div className="p-2.5 bg-slate-900 border-b border-slate-800">
                    <div className="text-[11px] text-sky-400 font-semibold flex items-center gap-1 mb-0.5">
                      <Sparkles className="w-3 h-3" />
                      <span>{currentTopic.title}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-snug line-clamp-2">
                      {currentTopic.speech}
                    </p>
                  </div>

                  {/* Barrage / Live Comments List */}
                  <div className="flex-1 p-2.5 overflow-y-auto space-y-1.5 text-[11px] scrollbar-thin">
                    <div className="text-slate-500 text-[10px] text-center">-- 进入智能网络直播间 --</div>
                    {comments.map((c, i) => (
                      <div key={i} className="flex items-start gap-1.5 bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/80">
                        <span className="text-sky-400 font-medium whitespace-nowrap">初一同学:</span>
                        <span className="text-slate-200">{c}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Interaction Bar */}
                  <form onSubmit={handleSendComment} className="p-2 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="发送弹幕互动..."
                      value={inputComment}
                      onChange={e => setInputComment(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-full px-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
                    />
                    <button
                      type="submit"
                      className="p-1.5 rounded-full bg-sky-600 text-white hover:bg-sky-500 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={handleSendHeart}
                      className="p-1.5 rounded-full bg-rose-600/30 text-rose-400 border border-rose-500/40 hover:bg-rose-600/50 transition-colors"
                    >
                      <Heart className="w-3 h-3 fill-rose-400" />
                    </button>
                  </form>
                </div>
              ) : (
                /* Educational Error Diagnostic View */
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 text-amber-400">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100 mb-1">
                    无法连接到机器人直播
                  </h4>
                  <p className="text-xs text-amber-300 font-medium mb-2">
                    {evaluated.phoneDiagnostics.errorReason || '网络未连通'}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-4 px-2">
                    {evaluated.phoneDiagnostics.hint || '请检查Wi-Fi连接、静态IP设置或服务器状态。'}
                  </p>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>前往手机设置修复网络</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Phone Settings App */}
          {activeTab === 'settings' && (
            <div className="flex-1 overflow-y-auto p-3 text-xs space-y-3 bg-slate-950">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-semibold text-slate-200 text-sm">无线局域网 (Wi-Fi)</span>
                <button
                  onClick={() =>
                    phone.wifiConnected ? handleDisconnectWifi() : handleConnectWifi(selectedSsid)
                  }
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                    phone.wifiConnected ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      phone.wifiConnected ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Wi-Fi Networks List */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider">
                  选择可用网络
                </label>

                {/* Router's SSID */}
                <div
                  onClick={() => setSelectedSsid(router.wifiSsid)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    selectedSsid === router.wifiSsid
                      ? 'bg-slate-900 border-sky-500/60'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-sky-400" />
                      <div>
                        <div className="font-medium text-slate-200">{router.wifiSsid}</div>
                        <div className="text-[10px] text-slate-400">
                          {router.wifiEnabled ? '信号强 · WPA2加密' : '⚠️ 路由器Wi-Fi未开启'}
                        </div>
                      </div>
                    </div>
                    {phone.wifiConnected && phone.wifiSsid === router.wifiSsid && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                </div>

                {/* Other simulated school networks */}
                <div
                  onClick={() => setSelectedSsid('Teachers_Office_5G')}
                  className="p-2.5 rounded-xl border border-slate-800/60 bg-slate-900/30 opacity-60 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="font-medium text-slate-300">Teachers_Office_5G</div>
                        <div className="text-[10px] text-slate-500">教师办公专网 (不可跨网段访问实验室)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Input for selected Wi-Fi */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-[11px] font-medium text-slate-300">
                  连接网络: <span className="text-sky-400">{selectedSsid}</span>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Wi-Fi 密码</label>
                  <input
                    type="text"
                    value={passwordInput}
                    onChange={e => {
                      setPasswordInput(e.target.value);
                      onUpdatePhone(prev => ({ ...prev, wifiPassword: e.target.value }));
                    }}
                    placeholder="输入Wi-Fi密码"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-sky-500"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleConnectWifi(selectedSsid)}
                    className="flex-1 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors"
                  >
                    连接此 Wi-Fi
                  </button>
                  {phone.wifiConnected && (
                    <button
                      onClick={handleDisconnectWifi}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                    >
                      断开
                    </button>
                  )}
                </div>
              </div>

              {/* IP Configuration (DHCP vs Static) */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-[11px] font-medium text-slate-300">IP 地址配置</div>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-lg">
                  <button
                    onClick={() => onUpdatePhone(prev => ({ ...prev, ipMode: 'dhcp' }))}
                    className={`py-1 rounded text-center transition-colors ${
                      phone.ipMode === 'dhcp'
                        ? 'bg-slate-800 text-sky-400 font-semibold shadow-xs'
                        : 'text-slate-400'
                    }`}
                  >
                    自动 (DHCP)
                  </button>
                  <button
                    onClick={() => onUpdatePhone(prev => ({ ...prev, ipMode: 'static' }))}
                    className={`py-1 rounded text-center transition-colors ${
                      phone.ipMode === 'static'
                        ? 'bg-slate-800 text-sky-400 font-semibold shadow-xs'
                        : 'text-slate-400'
                    }`}
                  >
                    静态 (Static)
                  </button>
                </div>

                {phone.ipMode === 'static' ? (
                  <div className="space-y-1.5 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400">静态 IP 地址</span>
                      <input
                        type="text"
                        value={phone.staticIp}
                        onChange={e =>
                          onUpdatePhone(prev => ({ ...prev, staticIp: e.target.value }))
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-200"
                        placeholder="192.168.1.108"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">子网掩码</span>
                      <input
                        type="text"
                        value={phone.subnetMask}
                        onChange={e =>
                          onUpdatePhone(prev => ({ ...prev, subnetMask: e.target.value }))
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-200"
                        placeholder="255.255.255.0"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">默认网关</span>
                      <input
                        type="text"
                        value={phone.gateway}
                        onChange={e =>
                          onUpdatePhone(prev => ({ ...prev, gateway: e.target.value }))
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-200"
                        placeholder="192.168.1.1"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 p-2 bg-slate-950 rounded">
                    <div>当前获取IP: <span className="font-mono text-emerald-400">{evaluated.effectivePhoneIp || '未分配'}</span></div>
                    <div>分配方式: 路由器 DHCP 服务池自动指派</div>
                  </div>
                )}
              </div>

              {/* Back to Live Stream shortcut */}
              <button
                onClick={() => setActiveTab('stream')}
                className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>返回直播间收看</span>
              </button>
            </div>
          )}

          {/* Bottom Home Indicator Bar */}
          <div className="pb-2 flex justify-center z-20">
            <div className="w-32 h-1 bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
