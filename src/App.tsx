import React, { useState, useMemo } from 'react';
import {
  Network,
  Tv,
  LayoutGrid,
  Laptop,
  Smartphone,
  BookOpen,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  RouterConfig,
  ServerConfig,
  RobotConfig,
  PhoneConfig,
  LaptopConfig,
} from './types/network';
import { evaluateNetwork } from './utils/networkEngine';
import { RobotLiveBroadcaster } from './components/RobotLiveBroadcaster';
import { NetworkTopologyCanvas } from './components/NetworkTopologyCanvas';
import { PhoneDeviceView } from './components/DevicePanels/PhoneDeviceView';
import { LaptopDeviceView } from './components/DevicePanels/LaptopDeviceView';
import { RouterModal } from './components/DevicePanels/RouterModal';
import { ServerModal } from './components/DevicePanels/ServerModal';
import { RobotModal } from './components/DevicePanels/RobotModal';
import { TeachingMissionBar } from './components/TeachingMissionBar';
import { KnowledgeBaseModal } from './components/KnowledgeBaseModal';

// Complete initial working configuration
const DEFAULT_ROUTER: RouterConfig = {
  lanIp: '192.168.1.1',
  subnetMask: '255.255.255.0',
  dhcpEnabled: true,
  dhcpStart: '192.168.1.101',
  dhcpEnd: '192.168.1.200',
  wifiEnabled: true,
  wifiSsid: 'EduLab-WiFi-7A',
  wifiPassword: 'robot888',
  wifiChannel: 6,
};

const DEFAULT_SERVER: ServerConfig = {
  cabledToRouter: true,
  ipMode: 'static',
  staticIp: '192.168.1.100',
  subnetMask: '255.255.255.0',
  gateway: '192.168.1.1',
  serviceRunning: true,
  rtmpPort: 1935,
  httpPort: 8080,
};

const DEFAULT_ROBOT: RobotConfig = {
  connectionType: 'ethernet',
  wifiSsid: 'EduLab-WiFi-7A',
  wifiPassword: 'robot888',
  ipMode: 'static',
  staticIp: '192.168.1.50',
  subnetMask: '255.255.255.0',
  gateway: '192.168.1.1',
  targetServerIp: '192.168.1.100',
  targetStreamKey: 'live/robot',
  cameraActive: true,
  micActive: true,
  isStreaming: true,
  topicIndex: 0,
};

const DEFAULT_PHONE: PhoneConfig = {
  wifiConnected: true,
  wifiSsid: 'EduLab-WiFi-7A',
  wifiPassword: 'robot888',
  ipMode: 'dhcp',
  staticIp: '192.168.1.108',
  subnetMask: '255.255.255.0',
  gateway: '192.168.1.1',
  appOpened: true,
};

const DEFAULT_LAPTOP: LaptopConfig = {
  connectionType: 'ethernet',
  wifiSsid: 'EduLab-WiFi-7A',
  wifiPassword: 'robot888',
  ipMode: 'static',
  staticIp: '192.168.1.120',
  subnetMask: '255.255.255.0',
  gateway: '192.168.1.1',
  activeApp: 'browser',
};

// Misconfigured state for classroom challenges
const CHALLENGE_ROUTER: RouterConfig = {
  ...DEFAULT_ROUTER,
  wifiEnabled: false,
  wifiPassword: 'science2026',
};

const CHALLENGE_SERVER: ServerConfig = {
  ...DEFAULT_SERVER,
  cabledToRouter: false,
  staticIp: '192.168.2.100', // wrong subnet
  gateway: '192.168.2.1',
  serviceRunning: false,
};

const CHALLENGE_ROBOT: RobotConfig = {
  ...DEFAULT_ROBOT,
  connectionType: 'none',
  targetServerIp: '192.168.1.200', // points to wrong IP
  isStreaming: false,
};

const CHALLENGE_PHONE: PhoneConfig = {
  ...DEFAULT_PHONE,
  wifiConnected: false,
  wifiPassword: '',
};

const CHALLENGE_LAPTOP: LaptopConfig = {
  ...DEFAULT_LAPTOP,
  connectionType: 'none',
  staticIp: '10.0.0.15', // wrong IP
  gateway: '10.0.0.1',
};

export default function App() {
  const [router, setRouter] = useState<RouterConfig>(DEFAULT_ROUTER);
  const [server, setServer] = useState<ServerConfig>(DEFAULT_SERVER);
  const [robot, setRobot] = useState<RobotConfig>(DEFAULT_ROBOT);
  const [phone, setPhone] = useState<PhoneConfig>(DEFAULT_PHONE);
  const [laptop, setLaptop] = useState<LaptopConfig>(DEFAULT_LAPTOP);

  // Modals & Panels
  const [selectedDevice, setSelectedDevice] = useState<
    'router' | 'server' | 'robot' | 'phone' | 'laptop' | null
  >(null);
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'terminals' | 'topology'>('all');

  // Compute live network evaluation
  const evaluated = useMemo(
    () => evaluateNetwork(router, server, robot, phone, laptop),
    [router, server, robot, phone, laptop]
  );

  const handleApplyReferenceSolution = () => {
    setRouter(DEFAULT_ROUTER);
    setServer(DEFAULT_SERVER);
    setRobot(DEFAULT_ROBOT);
    setPhone(DEFAULT_PHONE);
    setLaptop(DEFAULT_LAPTOP);
  };

  const handleResetLab = () => {
    setRouter(CHALLENGE_ROUTER);
    setServer(CHALLENGE_SERVER);
    setRobot(CHALLENGE_ROBOT);
    setPhone(CHALLENGE_PHONE);
    setLaptop(CHALLENGE_LAPTOP);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Bar - Strict Constitution: Brand Zone, Navigation Links, Primary Actions */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <Network className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-100">
            网络探索实验室：机器人直播与局域网实训
          </span>
        </div>

        {/* Zone 2: Navigation views */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'all'
                ? 'bg-slate-800 text-sky-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            综合工作台
          </button>
          <button
            onClick={() => setActiveTab('terminals')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'terminals'
                ? 'bg-slate-800 text-sky-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            手机与电脑终端投影
          </button>
          <button
            onClick={() => setActiveTab('topology')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'topology'
                ? 'bg-slate-800 text-sky-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            拓扑接线与协议层
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsKnowledgeOpen(true)}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>知识卡片</span>
          </button>

          <button
            onClick={handleApplyReferenceSolution}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>参考接线</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1560px] w-full mx-auto p-4 md:p-6 flex flex-col">
        {/* Middle School Mission & Objective Guidance */}
        <TeachingMissionBar
          router={router}
          server={server}
          robot={robot}
          phone={phone}
          laptop={laptop}
          evaluated={evaluated}
          onApplyReferenceSolution={handleApplyReferenceSolution}
          onResetLab={handleResetLab}
          onOpenKnowledge={() => setIsKnowledgeOpen(true)}
        />

        {/* Comprehensive Sandbox Workspace */}
        {activeTab === 'all' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Robot Streamer Studio & Network Topology Canvas (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Robot Live Broadcaster Studio */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <h3 className="text-sm font-semibold text-slate-200">
                      推流源：智能直播机器人 (RTMP Source)
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    IP: {evaluated.effectiveRobotIp || '未配置'}
                  </span>
                </div>
                <RobotLiveBroadcaster
                  robot={robot}
                  onUpdateRobot={setRobot}
                  streamPublished={evaluated.robotStreamPublished}
                  onOpenSettings={() => setSelectedDevice('robot')}
                />
              </div>

              {/* Physical & Logical LAN Topology Canvas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <h3 className="text-sm font-semibold text-slate-200">
                      局域网拓扑与连线状态 (Router &amp; Server Core)
                    </h3>
                  </div>
                </div>
                <NetworkTopologyCanvas
                  router={router}
                  server={server}
                  robot={robot}
                  phone={phone}
                  laptop={laptop}
                  evaluated={evaluated}
                  onSelectDevice={dev => setSelectedDevice(dev)}
                  selectedDevice={selectedDevice}
                />
              </div>
            </div>

            {/* Right Column: Reception Terminals (Phone & Laptop Projection) (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <h3 className="text-sm font-semibold text-slate-200">
                    看播终端：手机与笔记本电脑实时投影
                  </h3>
                </div>
                <div className="text-xs text-slate-400">
                  {evaluated.phoneCanWatchStream && evaluated.laptopCanWatchStream ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 双终端画面已同步
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> 等待正确网络配置
                    </span>
                  )}
                </div>
              </div>

              {/* Interactive Phone Terminal */}
              <div className="flex flex-col items-center p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
                <div className="w-full flex items-center justify-between mb-2 px-2 text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-pink-400" /> 终端一：学生手机 (Wi-Fi 接入)
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    {evaluated.effectivePhoneIp || '未分配IP'}
                  </span>
                </div>
                <PhoneDeviceView
                  phone={phone}
                  onUpdatePhone={setPhone}
                  router={router}
                  robot={robot}
                  evaluated={evaluated}
                />
              </div>

              {/* Interactive Laptop Terminal */}
              <div className="flex flex-col items-center p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
                <div className="w-full flex items-center justify-between mb-2 px-2 text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-teal-400" /> 终端二：学生笔记本 (以太网/Wi-Fi)
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    {evaluated.effectiveLaptopIp || '未配置IP'}
                  </span>
                </div>
                <LaptopDeviceView
                  laptop={laptop}
                  onUpdateLaptop={setLaptop}
                  router={router}
                  robot={robot}
                  evaluated={evaluated}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Terminals Live Focus View */}
        {activeTab === 'terminals' && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-slate-100">
                  双终端收看实时比对模式
                </h3>
                <p className="text-xs text-slate-400">
                  观察当 Wi-Fi、静态IP、默认网关设置正确时，机器人说话画面如何同步投射到手机和笔记本屏幕上。
                </p>
              </div>
              <button
                onClick={() => setSelectedDevice('server')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
              >
                检查服务器状态
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Phone View */}
              <div className="flex flex-col items-center p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
                <h4 className="font-semibold text-slate-200 text-sm mb-4 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-pink-400" /> 手机端直播接收效果
                </h4>
                <PhoneDeviceView
                  phone={phone}
                  onUpdatePhone={setPhone}
                  router={router}
                  robot={robot}
                  evaluated={evaluated}
                />
              </div>

              {/* Laptop View */}
              <div className="flex flex-col items-center p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
                <h4 className="font-semibold text-slate-200 text-sm mb-4 flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-teal-400" /> 笔记本电脑浏览器播放与终端测试
                </h4>
                <LaptopDeviceView
                  laptop={laptop}
                  onUpdateLaptop={setLaptop}
                  router={router}
                  robot={robot}
                  evaluated={evaluated}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Topology & Protocol Explorer */}
        {activeTab === 'topology' && (
          <div className="space-y-6">
            <NetworkTopologyCanvas
              router={router}
              server={server}
              robot={robot}
              phone={phone}
              laptop={laptop}
              evaluated={evaluated}
              onSelectDevice={dev => setSelectedDevice(dev)}
              selectedDevice={selectedDevice}
            />

            {/* Network Addressing Summary Table */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
              <h4 className="font-semibold text-sm text-slate-100 mb-3">
                局域网全网设备寻址与接口参数总表
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-sans">
                      <th className="pb-2">设备名称</th>
                      <th className="pb-2">角色</th>
                      <th className="pb-2">接入介质</th>
                      <th className="pb-2">IPv4 地址</th>
                      <th className="pb-2">子网掩码</th>
                      <th className="pb-2">默认网关</th>
                      <th className="pb-2">状态</th>
                      <th className="pb-2 font-sans">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-2.5 font-sans font-medium text-slate-100">无线路由器</td>
                      <td className="py-2.5 font-sans text-emerald-400">网络网关核心</td>
                      <td className="py-2.5">LAN/WLAN</td>
                      <td className="py-2.5 text-emerald-300">{router.lanIp}</td>
                      <td className="py-2.5">{router.subnetMask}</td>
                      <td className="py-2.5">-(本设备)</td>
                      <td className="py-2.5 font-sans text-emerald-400">运行中</td>
                      <td className="py-2.5">
                        <button
                          onClick={() => setSelectedDevice('router')}
                          className="text-sky-400 hover:underline font-sans"
                        >
                          设置
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans font-medium text-slate-100">流媒体服务器</td>
                      <td className="py-2.5 font-sans text-indigo-400">视频推流/分发</td>
                      <td className="py-2.5 font-sans">
                        {server.cabledToRouter ? '以太网 (LAN1)' : '未插线'}
                      </td>
                      <td className="py-2.5 text-indigo-300">{server.staticIp}</td>
                      <td className="py-2.5">{server.subnetMask}</td>
                      <td className="py-2.5">{server.gateway}</td>
                      <td className="py-2.5 font-sans">
                        {evaluated.serverOnline ? (
                          <span className="text-emerald-400">在线</span>
                        ) : (
                          <span className="text-rose-400">异常/离线</span>
                        )}
                      </td>
                      <td className="py-2.5">
                        <button
                          onClick={() => setSelectedDevice('server')}
                          className="text-sky-400 hover:underline font-sans"
                        >
                          设置
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans font-medium text-slate-100">智能直播机器人</td>
                      <td className="py-2.5 font-sans text-sky-400">RTMP视频采集</td>
                      <td className="py-2.5 font-sans">
                        {robot.connectionType === 'ethernet'
                          ? '以太网 (LAN2)'
                          : robot.connectionType === 'wifi'
                          ? 'Wi-Fi'
                          : '未联网'}
                      </td>
                      <td className="py-2.5 text-sky-300">{evaluated.effectiveRobotIp || '未分配'}</td>
                      <td className="py-2.5">{robot.subnetMask}</td>
                      <td className="py-2.5">{robot.gateway}</td>
                      <td className="py-2.5 font-sans">
                        {evaluated.robotStreamPublished ? (
                          <span className="text-emerald-400">正在推流</span>
                        ) : (
                          <span className="text-amber-400">未推流</span>
                        )}
                      </td>
                      <td className="py-2.5">
                        <button
                          onClick={() => setSelectedDevice('robot')}
                          className="text-sky-400 hover:underline font-sans"
                        >
                          设置
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans font-medium text-slate-100">学生手机终端</td>
                      <td className="py-2.5 font-sans text-pink-400">直播观众客户端</td>
                      <td className="py-2.5 font-sans">Wi-Fi 无线</td>
                      <td className="py-2.5 text-pink-300">{evaluated.effectivePhoneIp || '未分配'}</td>
                      <td className="py-2.5">{phone.subnetMask}</td>
                      <td className="py-2.5">{phone.gateway}</td>
                      <td className="py-2.5 font-sans">
                        {evaluated.phoneCanWatchStream ? (
                          <span className="text-emerald-400">正在播放</span>
                        ) : (
                          <span className="text-rose-400">无法播放</span>
                        )}
                      </td>
                      <td className="py-2.5">
                        <button
                          onClick={() => setSelectedDevice('phone')}
                          className="text-sky-400 hover:underline font-sans"
                        >
                          设置
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans font-medium text-slate-100">学生笔记本终端</td>
                      <td className="py-2.5 font-sans text-teal-400">浏览器播放/CMD测试</td>
                      <td className="py-2.5 font-sans">
                        {laptop.connectionType === 'ethernet'
                          ? '以太网 (LAN3)'
                          : laptop.connectionType === 'wifi'
                          ? 'Wi-Fi'
                          : '未连接'}
                      </td>
                      <td className="py-2.5 text-teal-300">{evaluated.effectiveLaptopIp || '未分配'}</td>
                      <td className="py-2.5">{laptop.subnetMask}</td>
                      <td className="py-2.5">{laptop.gateway}</td>
                      <td className="py-2.5 font-sans">
                        {evaluated.laptopCanWatchStream ? (
                          <span className="text-emerald-400">正在播放</span>
                        ) : (
                          <span className="text-rose-400">无法播放</span>
                        )}
                      </td>
                      <td className="py-2.5">
                        <button
                          onClick={() => setSelectedDevice('laptop')}
                          className="text-sky-400 hover:underline font-sans"
                        >
                          设置
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Pop-up Modals for Node Configuration */}
      {selectedDevice === 'router' && (
        <RouterModal
          router={router}
          onUpdateRouter={setRouter}
          server={server}
          robot={robot}
          laptop={laptop}
          onClose={() => setSelectedDevice(null)}
        />
      )}

      {selectedDevice === 'server' && (
        <ServerModal
          server={server}
          onUpdateServer={setServer}
          router={router}
          robot={robot}
          evaluated={evaluated}
          onClose={() => setSelectedDevice(null)}
        />
      )}

      {selectedDevice === 'robot' && (
        <RobotModal
          robot={robot}
          onUpdateRobot={setRobot}
          router={router}
          server={server}
          evaluated={evaluated}
          onClose={() => setSelectedDevice(null)}
        />
      )}

      {/* 7th Grade Knowledge Base Modal */}
      {isKnowledgeOpen && (
        <KnowledgeBaseModal onClose={() => setIsKnowledgeOpen(false)} />
      )}
    </div>
  );
}
