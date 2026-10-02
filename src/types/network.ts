export type ConnectionType = 'ethernet' | 'wifi' | 'none';
export type IpMode = 'static' | 'dhcp';

export interface RouterConfig {
  lanIp: string;
  subnetMask: string;
  dhcpEnabled: boolean;
  dhcpStart: string;
  dhcpEnd: string;
  wifiEnabled: boolean;
  wifiSsid: string;
  wifiPassword: string;
  wifiChannel: number;
}

export interface ServerConfig {
  cabledToRouter: boolean;
  ipMode: IpMode;
  staticIp: string;
  subnetMask: string;
  gateway: string;
  serviceRunning: boolean;
  rtmpPort: number;
  httpPort: number;
}

export interface RobotConfig {
  connectionType: ConnectionType;
  wifiSsid: string;
  wifiPassword: string;
  ipMode: IpMode;
  staticIp: string;
  subnetMask: string;
  gateway: string;
  targetServerIp: string;
  targetStreamKey: string;
  cameraActive: boolean;
  micActive: boolean;
  isStreaming: boolean;
  topicIndex: number;
}

export interface PhoneConfig {
  wifiConnected: boolean;
  wifiSsid: string;
  wifiPassword: string;
  ipMode: IpMode;
  staticIp: string;
  subnetMask: string;
  gateway: string;
  appOpened: boolean;
}

export interface LaptopConfig {
  connectionType: ConnectionType;
  wifiSsid: string;
  wifiPassword: string;
  ipMode: IpMode;
  staticIp: string;
  subnetMask: string;
  gateway: string;
  activeApp: 'browser' | 'settings' | 'terminal';
}

export interface DiagnosticResult {
  canReachRouter: boolean;
  canReachServer: boolean;
  effectiveIp: string;
  errorReason?: string;
  hint?: string;
}

// IP utility functions
export function isValidIpv4(ip: string): boolean {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    if (!/^\d+$/.test(part)) return false;
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
}

export function ipToNumber(ip: string): number {
  return ip
    .trim()
    .split('.')
    .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

export function isSameSubnet(ip1: string, ip2: string, mask: string): boolean {
  if (!isValidIpv4(ip1) || !isValidIpv4(ip2) || !isValidIpv4(mask)) return false;
  const num1 = ipToNumber(ip1);
  const num2 = ipToNumber(ip2);
  const numMask = ipToNumber(mask);
  return (num1 & numMask) === (num2 & numMask);
}

export const ROBOT_TOPICS = [
  {
    title: '局域网与IP地址基础',
    speech: '初一的同学们好！我是小智机器人！每一个接入局域网的设备都需要一个IP地址，就像每个人的门牌号一样！',
  },
  {
    title: '静态IP的意义',
    speech: '为什么直播服务器需要设置静态固定IP呢？因为如果服务器IP老是变化，机器人推流和同学们的设备就找不到它啦！',
  },
  {
    title: '子网掩码与网关',
    speech: '子网掩码 255.255.255.0 告诉我们前三段必须相同才能互相通信！而默认网关就是通往路由器的门卡！',
  },
  {
    title: 'Wi-Fi 无线网络连接',
    speech: '手机和笔记本通过无线的 Wi-Fi 信号接入路由器，需要输入正确的 SSID 和安全密码，才能进入同一个班级局域网哦！',
  },
];
