import React, { useState } from 'react';
import {
  Globe,
  Terminal,
  Settings,
  RefreshCw,
  Wifi,
  Cable,
  CheckCircle2,
  AlertCircle,
  Play,
  Volume2,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { LaptopConfig, RouterConfig, RobotConfig, ROBOT_TOPICS } from '../../types/network';
import { EvaluatedNetworkState } from '../../utils/networkEngine';

interface LaptopDeviceViewProps {
  laptop: LaptopConfig;
  onUpdateLaptop: (updater: (prev: LaptopConfig) => LaptopConfig) => void;
  router: RouterConfig;
  robot: RobotConfig;
  evaluated: EvaluatedNetworkState;
}

export const LaptopDeviceView: React.FC<LaptopDeviceViewProps> = ({
  laptop,
  onUpdateLaptop,
  router,
  robot,
  evaluated,
}) => {
  const [activeWindow, setActiveWindow] = useState<'browser' | 'settings' | 'terminal'>('browser');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Microsoft Windows [版本 10.0.19045.3803]',
    '(c) 计算机网络与信息技术实训终端。保留所有权利。',
    '',
    '输入 ping <ip> 或 ipconfig 测试局域网连接...',
  ]);
  const [cmdInput, setCmdInput] = useState('');

  const currentTopic = ROBOT_TOPICS[robot.topicIndex] || ROBOT_TOPICS[0];
  const canPlay = evaluated.laptopCanWatchStream;

  // Terminal command execution
  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const newLogs = [...terminalLogs, `C:\\Users\\Student7A> ${trimmed}`];
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();

    if (cmd === 'cls' || cmd === 'clear') {
      setTerminalLogs([]);
      setCmdInput('');
      return;
    }

    if (cmd === 'help') {
      newLogs.push('可用命令:');
      newLogs.push('  ipconfig          - 显示当前笔记本IP地址、子网掩码与默认网关');
      newLogs.push('  ping <IP地址>     - 向指定目标IP发送ICMP回显请求，测试连通性');
      newLogs.push('  ping 192.168.1.1   - 测试路由器网关是否通畅');
      newLogs.push('  ping 192.168.1.100 - 测试流媒体服务器是否通畅');
      newLogs.push('  cls               - 清空终端屏幕');
    } else if (cmd === 'ipconfig') {
      newLogs.push('以太网适配器 本地连接:');
      newLogs.push(`   连接介质状态 . . . . . . . . : ${laptop.connectionType !== 'none' ? '已连接' : '介质已断开'}`);
      newLogs.push(`   连接类型 . . . . . . . . . . : ${laptop.connectionType === 'ethernet' ? '以太网双绞线' : laptop.connectionType === 'wifi' ? 'WLAN 802.11ax' : '未连接'}`);
      newLogs.push(`   IPv4 地址 . . . . . . . . . : ${evaluated.effectiveLaptopIp || '(未获取到IP)'}`);
      newLogs.push(`   子网掩码 . . . . . . . . . . : ${laptop.subnetMask}`);
      newLogs.push(`   默认网关 . . . . . . . . . . : ${laptop.gateway || '0.0.0.0'}`);
    } else if (cmd === 'ping') {
      const target = parts[1];
      if (!target) {
        newLogs.push('用法: ping <目标IP地址>');
      } else {
        newLogs.push(`正在 Ping ${target} 具有 32 字节的数据:`);
        if (laptop.connectionType === 'none') {
          newLogs.push('PING: 传输失败。常见故障: 物理线路未连接或Wi-Fi未连接。');
        } else if (!evaluated.laptopOnline) {
          newLogs.push(`来自 ${evaluated.effectiveLaptopIp || '127.0.0.1'} 的回复: 目标主机不可达 (本地IP或网关配置异常)`);
          newLogs.push('请求超时。');
        } else if (target === router.lanIp) {
          newLogs.push(`来自 ${target} 的回复: 字节=32 时间=1ms TTL=64`);
          newLogs.push(`来自 ${target} 的回复: 字节=32 时间=2ms TTL=64`);
          newLogs.push(`来自 ${target} 的回复: 字节=32 时间=1ms TTL=64`);
          newLogs.push(`来自 ${target} 的回复: 字节=32 时间=1ms TTL=64`);
          newLogs.push(`${target} 的 Ping 统计信息: 数据包: 已发送 = 4，已接收 = 4，丢失 = 0 (0% 丢失)`);
        } else if (target === evaluated.effectiveServerIp && evaluated.serverOnline) {
          newLogs.push(`来自 ${target} 的回复: 字节=32 时间=2ms TTL=64`);
          newLogs.push(`来自 ${target} 的回复: 字节=32 时间=3ms TTL=64`);
          newLogs.push(`来自 ${target} 的回复: 字节=32 时间=2ms TTL=64`);
          newLogs.push(`来自 ${target} 的回复: 字节=32 时间=2ms TTL=64`);
          newLogs.push(`${target} 的 Ping 统计信息: 数据包: 已发送 = 4，已接收 = 4，丢失 = 0 (0% 丢失)`);
        } else if (target === evaluated.effectiveRobotIp && evaluated.robotOnline) {
          newLogs.push(`来自 ${target} 的回复: 字节=32 时间=4ms TTL=64`);
          newLogs.push(`来自 ${target} 的回复: 字节=32 时间=5ms TTL=64`);
          newLogs.push(`来自 ${target} 的回复: 字节=32 时间=4ms TTL=64`);
          newLogs.push(`来自 ${target} 的回复: 字节=32 时间=4ms TTL=64`);
          newLogs.push(`${target} 的 Ping 统计信息: 数据包: 已发送 = 4，已接收 = 4，丢失 = 0 (0% 丢失)`);
        } else {
          newLogs.push('请求超时。');
          newLogs.push('请求超时。');
          newLogs.push('来自 192.168.1.1 的回复: 无法访问目标主机。');
          newLogs.push(`${target} 的 Ping 统计信息: 数据包: 已发送 = 4，已接收 = 0，丢失 = 4 (100% 丢失)`);
        }
      }
    } else {
      newLogs.push(`'${cmd}' 不是内部或外部命令，也不是可运行的程序。输入 help 查看帮助。`);
    }

    setTerminalLogs(newLogs);
    setCmdInput('');
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl">
      {/* Laptop Screen Bezel */}
      <div className="w-full bg-slate-900 rounded-t-2xl p-2.5 shadow-2xl border-4 border-slate-700 relative">
        {/* Top Webcam Notch */}
        <div className="flex justify-center mb-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-sky-600/80" />
          </div>
        </div>

        {/* Laptop Display (16:10 ratio) */}
        <div className="w-full aspect-[16/10] bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex flex-col relative select-none">
          {/* OS Window Header / App Tabs */}
          <div className="h-9 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveWindow('browser')}
                className={`px-3 py-1 rounded-t text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeWindow === 'browser'
                    ? 'bg-slate-950 text-sky-400 border-t-2 border-sky-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>直播浏览器</span>
              </button>
              <button
                onClick={() => setActiveWindow('settings')}
                className={`px-3 py-1 rounded-t text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeWindow === 'settings'
                    ? 'bg-slate-950 text-sky-400 border-t-2 border-sky-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>网络与IP设置</span>
              </button>
              <button
                onClick={() => setActiveWindow('terminal')}
                className={`px-3 py-1 rounded-t text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeWindow === 'terminal'
                    ? 'bg-slate-950 text-sky-400 border-t-2 border-sky-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>CMD 命令终端</span>
              </button>
            </div>

            {/* Window control dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
            </div>
          </div>

          {/* Window 1: Live Stream Web Browser */}
          {activeWindow === 'browser' && (
            <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
              {/* Browser Address Bar */}
              <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2">
                <div className="flex items-center gap-1 text-slate-400">
                  <RefreshCw className="w-3.5 h-3.5 cursor-pointer hover:text-slate-200" />
                </div>
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-0.5 text-xs font-mono text-slate-300 flex items-center justify-between">
                  <span>http://192.168.1.100:8080/live/robot</span>
                  <span className="text-[10px] text-emerald-400 font-sans">
                    {canPlay ? 'HTTP 200 OK (实时推流)' : 'ERR_NETWORK'}
                  </span>
                </div>
              </div>

              {/* Browser Viewport */}
              <div className="flex-1 relative flex flex-col justify-center items-center overflow-hidden">
                {canPlay ? (
                  <div className="w-full h-full relative flex flex-col justify-between">
                    {/* Main Robot Video Feed */}
                    <div className="relative flex-1 bg-gradient-to-b from-slate-900 to-indigo-950/70 flex items-center justify-center overflow-hidden">
                      <img
                        src="/src/assets/images/broadcast_studio_stage_1790952309226.jpg"
                        alt="Robot Stream Feed"
                        className="absolute inset-0 w-full h-full object-cover opacity-45"
                        referrerPolicy="no-referrer"
                      />

                      {/* Animated Robot Avatar in Browser Player */}
                      <div className="relative z-10 flex flex-col items-center">
                        {/* Antenna */}
                        <div className="w-1.5 h-5 bg-slate-400 rounded-t-full relative flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] absolute -top-1.5 animate-pulse" />
                        </div>
                        {/* Head */}
                        <div className="w-28 h-22 bg-slate-800 rounded-2xl border-2 border-slate-600 p-2 flex flex-col items-center justify-center shadow-xl">
                          <div className="w-full h-full bg-slate-950 rounded-xl flex flex-col items-center justify-center">
                            {/* Eyes */}
                            <div className="flex items-center gap-4 mb-1.5">
                              <div className="w-4 h-4 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                              <div className="w-4 h-4 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                            </div>
                            {/* Mouth */}
                            <div className="w-6 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          </div>
                        </div>
                      </div>

                      {/* Stream Diagnostics Overlay */}
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-2">
                        <span className="text-red-400 font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                          LIVE
                        </span>
                        <span>分辨率: 1080P</span>
                        <span>码率: 4500 kbps</span>
                        <span>延迟: 12ms</span>
                      </div>

                      {/* Speech subtitles */}
                      <div className="absolute bottom-3 left-4 right-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-sky-500/30 text-center">
                        <span className="text-sky-300 text-xs font-semibold mr-1.5">
                          【小智机器人】:
                        </span>
                        <span className="text-slate-100 text-xs">{currentTopic.speech}</span>
                      </div>
                    </div>

                    {/* Web Player Controls Bar */}
                    <div className="h-8 bg-slate-950 border-t border-slate-800 px-3 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 cursor-pointer" />
                        <Volume2 className="w-3.5 h-3.5 cursor-pointer hover:text-slate-200" />
                        <span className="text-[11px] font-mono text-slate-300">00:04:18 / LIVE</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="text-sky-400">超清 1080P</span>
                        <Maximize2 className="w-3.5 h-3.5 cursor-pointer hover:text-slate-200" />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Browser Network Error Screen */
                  <div className="text-center p-6 max-w-sm">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-3 text-rose-400">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-200 mb-1">无法访问此网站</h4>
                    <p className="text-xs text-rose-300 font-mono mb-2">
                      {evaluated.laptopDiagnostics.errorReason || 'ERR_CONNECTION_REFUSED'}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                      {evaluated.laptopDiagnostics.hint || '请检查笔记本网络配置与静态IP。'}
                    </p>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setActiveWindow('settings')}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium"
                      >
                        配置网卡静态IP
                      </button>
                      <button
                        onClick={() => setActiveWindow('terminal')}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
                      >
                        打开CMD执行 Ping
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Window 2: Network & IP Settings */}
          {activeWindow === 'settings' && (
            <div className="flex-1 p-4 bg-slate-950 overflow-y-auto space-y-3 text-xs">
              <div className="font-semibold text-slate-200 pb-1 border-b border-slate-800 flex items-center justify-between">
                <span>网络连接属性 (Internet Protocol Version 4)</span>
                <span className="text-[10px] text-slate-400">网卡适配器: Intel Wi-Fi 6 / Realtek PCIe GBE</span>
              </div>

              {/* Physical Media Selector */}
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[11px] font-medium text-slate-300 block">选择网络接入介质:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onUpdateLaptop(prev => ({ ...prev, connectionType: 'ethernet' }))}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-colors ${
                      laptop.connectionType === 'ethernet'
                        ? 'bg-sky-500/10 border-sky-500 text-sky-400 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Cable className="w-4 h-4" />
                    <span>以太网网线</span>
                  </button>
                  <button
                    onClick={() =>
                      onUpdateLaptop(prev => ({
                        ...prev,
                        connectionType: 'wifi',
                        wifiSsid: router.wifiSsid,
                        wifiPassword: router.wifiPassword,
                      }))
                    }
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-colors ${
                      laptop.connectionType === 'wifi'
                        ? 'bg-sky-500/10 border-sky-500 text-sky-400 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Wifi className="w-4 h-4" />
                    <span>Wi-Fi 无线网络</span>
                  </button>
                  <button
                    onClick={() => onUpdateLaptop(prev => ({ ...prev, connectionType: 'none' }))}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-colors ${
                      laptop.connectionType === 'none'
                        ? 'bg-rose-500/10 border-rose-500 text-rose-400 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>拔掉所有连接</span>
                  </button>
                </div>
              </div>

              {/* IPv4 Configuration Dialog */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="laptopIpMode"
                      checked={laptop.ipMode === 'dhcp'}
                      onChange={() => onUpdateLaptop(prev => ({ ...prev, ipMode: 'dhcp' }))}
                      className="accent-sky-500"
                    />
                    <span>自动获得 IP 地址 (DHCP)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="laptopIpMode"
                      checked={laptop.ipMode === 'static'}
                      onChange={() => onUpdateLaptop(prev => ({ ...prev, ipMode: 'static' }))}
                      className="accent-sky-500"
                    />
                    <span>使用下面的 IP 地址 (静态配置)</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">
                      IP 地址 (IPv4 Address):
                    </span>
                    <input
                      type="text"
                      disabled={laptop.ipMode === 'dhcp'}
                      value={laptop.ipMode === 'dhcp' ? evaluated.effectiveLaptopIp : laptop.staticIp}
                      onChange={e =>
                        onUpdateLaptop(prev => ({ ...prev, staticIp: e.target.value }))
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 disabled:opacity-60 focus:outline-hidden focus:border-sky-500"
                      placeholder="192.168.1.120"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">
                      子网掩码 (Subnet Mask):
                    </span>
                    <input
                      type="text"
                      disabled={laptop.ipMode === 'dhcp'}
                      value={laptop.subnetMask}
                      onChange={e =>
                        onUpdateLaptop(prev => ({ ...prev, subnetMask: e.target.value }))
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 disabled:opacity-60 focus:outline-hidden focus:border-sky-500"
                      placeholder="255.255.255.0"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">
                      默认网关 (Default Gateway):
                    </span>
                    <input
                      type="text"
                      disabled={laptop.ipMode === 'dhcp'}
                      value={laptop.gateway}
                      onChange={e =>
                        onUpdateLaptop(prev => ({ ...prev, gateway: e.target.value }))
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 disabled:opacity-60 focus:outline-hidden focus:border-sky-500"
                      placeholder="192.168.1.1"
                    />
                  </div>
                  <div className="flex items-end pb-0.5">
                    <button
                      onClick={() => setActiveWindow('browser')}
                      className="w-full py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-md transition-colors"
                    >
                      保存并返回直播浏览器
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Window 3: Command Prompt (CMD / Ping tool) */}
          {activeWindow === 'terminal' && (
            <div className="flex-1 bg-black p-3 font-mono text-xs flex flex-col justify-between overflow-hidden">
              {/* Quick test buttons for students */}
              <div className="pb-2 border-b border-zinc-800 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-zinc-500 font-sans">快捷调试命令:</span>
                <button
                  onClick={() => executeCommand('ipconfig')}
                  className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-emerald-400 text-[10px] border border-zinc-700"
                >
                  ipconfig
                </button>
                <button
                  onClick={() => executeCommand(`ping ${router.lanIp}`)}
                  className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-sky-400 text-[10px] border border-zinc-700"
                >
                  ping 路由器 ({router.lanIp})
                </button>
                <button
                  onClick={() => executeCommand(`ping ${serverIpTarget(evaluated)}`)}
                  className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-amber-400 text-[10px] border border-zinc-700"
                >
                  ping 流媒体服务器
                </button>
                <button
                  onClick={() => executeCommand('cls')}
                  className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-[10px] border border-zinc-700"
                >
                  cls 清屏
                </button>
              </div>

              {/* Terminal Logs View */}
              <div className="flex-1 overflow-y-auto space-y-0.5 py-2 scrollbar-thin text-zinc-300">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="whitespace-pre-wrap leading-tight">
                    {log}
                  </div>
                ))}
              </div>

              {/* Terminal Input Line */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  executeCommand(cmdInput);
                }}
                className="pt-1.5 border-t border-zinc-900 flex items-center gap-1"
              >
                <span className="text-emerald-500">C:\Users\Student7A&gt;</span>
                <input
                  type="text"
                  value={cmdInput}
                  onChange={e => setCmdInput(e.target.value)}
                  placeholder="在此输入 ping 或 ipconfig..."
                  className="flex-1 bg-transparent text-zinc-100 font-mono focus:outline-hidden"
                />
              </form>
            </div>
          )}

          {/* OS Taskbar */}
          <div className="h-7 bg-slate-900 border-t border-slate-800 px-3 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-sm bg-sky-500 flex items-center justify-center text-white text-[9px] font-bold">
                田
              </span>
              <span className="text-slate-300">七中实验机房-PC01</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {laptop.connectionType === 'ethernet' ? (
                  <Cable className="w-3 h-3 text-emerald-400" />
                ) : laptop.connectionType === 'wifi' ? (
                  <Wifi className="w-3 h-3 text-sky-400" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                )}
                <span className="font-mono text-[10px] text-slate-300">
                  {evaluated.effectiveLaptopIp || '未联网'}
                </span>
              </div>
              <span className="font-mono text-[10px]">09:41</span>
            </div>
          </div>
        </div>
      </div>

      {/* Laptop Keyboard Base & Touchpad (Physical Deck) */}
      <div className="w-[104%] h-4 bg-gradient-to-b from-slate-700 to-slate-800 rounded-b-xl border-t border-slate-600 shadow-xl flex items-center justify-center">
        <div className="w-20 h-1 bg-slate-500/60 rounded-full" />
      </div>
    </div>
  );
};

function serverIpTarget(evaluated: EvaluatedNetworkState): string {
  return evaluated.effectiveServerIp || '192.168.1.100';
}
