import {
  RouterConfig,
  ServerConfig,
  RobotConfig,
  PhoneConfig,
  LaptopConfig,
  DiagnosticResult,
  isValidIpv4,
  isSameSubnet,
} from '../types/network';

export interface EvaluatedNetworkState {
  // Server evaluations
  serverOnline: boolean;
  serverDiagnostics: DiagnosticResult;
  effectiveServerIp: string;

  // Robot evaluations
  robotLinked: boolean;
  robotOnline: boolean;
  robotStreamPublished: boolean;
  robotDiagnostics: DiagnosticResult;
  effectiveRobotIp: string;

  // Phone evaluations
  phoneWifiAuthenticated: boolean;
  phoneOnline: boolean;
  phoneCanWatchStream: boolean;
  phoneDiagnostics: DiagnosticResult;
  effectivePhoneIp: string;

  // Laptop evaluations
  laptopLinked: boolean;
  laptopOnline: boolean;
  laptopCanWatchStream: boolean;
  laptopDiagnostics: DiagnosticResult;
  effectiveLaptopIp: string;

  // Global issues
  ipConflicts: string[];
}

export function evaluateNetwork(
  router: RouterConfig,
  server: ServerConfig,
  robot: RobotConfig,
  phone: PhoneConfig,
  laptop: LaptopConfig
): EvaluatedNetworkState {
  const ipConflicts: string[] = [];

  // 1. Router basics
  const routerIp = router.lanIp;
  const routerMask = router.subnetMask;

  // 2. Server evaluation
  let serverOnline = false;
  let effectiveServerIp = '';
  const serverDiagnostics: DiagnosticResult = {
    canReachRouter: false,
    canReachServer: false,
    effectiveIp: '',
  };

  if (!server.cabledToRouter) {
    serverDiagnostics.errorReason = '网线未连接：服务器未通过以太网线连接到路由器LAN口';
    serverDiagnostics.hint = '请在网络拓扑或服务器面板中将网线接入路由器。';
  } else if (server.ipMode === 'static') {
    if (!isValidIpv4(server.staticIp)) {
      serverDiagnostics.errorReason = 'IP格式错误：服务器静态IP地址不合规';
      serverDiagnostics.hint = '请输入合法的IPv4地址（如 192.168.1.100）。';
    } else if (!isSameSubnet(server.staticIp, routerIp, routerMask)) {
      serverDiagnostics.errorReason = `网段不匹配：服务器IP (${server.staticIp}) 与路由器网关 (${routerIp}) 不在同一网段`;
      serverDiagnostics.hint = `请将服务器IP修改为与路由器同一子网（如 192.168.1.xxx），掩码使用 ${routerMask}。`;
    } else if (server.gateway !== routerIp) {
      serverDiagnostics.errorReason = `网关配置错误：默认网关 (${server.gateway}) 必须是路由器的LAN口IP (${routerIp})`;
      serverDiagnostics.hint = `请将服务器的默认网关填写为 ${routerIp}。`;
    } else if (!server.serviceRunning) {
      serverDiagnostics.errorReason = '服务未启动：流媒体推流服务（Nginx-RTMP）处于关闭状态';
      serverDiagnostics.hint = '在服务器面板中开启流媒体服务。';
    } else {
      serverOnline = true;
      effectiveServerIp = server.staticIp;
      serverDiagnostics.canReachRouter = true;
      serverDiagnostics.canReachServer = true;
      serverDiagnostics.effectiveIp = server.staticIp;
    }
  } else {
    // Server on DHCP
    if (!router.dhcpEnabled) {
      serverDiagnostics.errorReason = 'DHCP获取失败：路由器未开启DHCP服务';
      serverDiagnostics.hint = '在路由器设置中启用DHCP服务，或为服务器配置固定静态IP。';
    } else {
      effectiveServerIp = '192.168.1.100';
      serverOnline = server.serviceRunning;
      serverDiagnostics.canReachRouter = true;
      serverDiagnostics.canReachServer = server.serviceRunning;
      serverDiagnostics.effectiveIp = effectiveServerIp;
    }
  }

  // 3. Robot evaluation
  let robotLinked = false;
  let robotOnline = false;
  let robotStreamPublished = false;
  let effectiveRobotIp = '';
  const robotDiagnostics: DiagnosticResult = {
    canReachRouter: false,
    canReachServer: false,
    effectiveIp: '',
  };

  if (robot.connectionType === 'none') {
    robotDiagnostics.errorReason = '未联网：机器人既未插网线，也未连接无线Wi-Fi';
    robotDiagnostics.hint = '为机器人选择连接以太网线或连接路由器的Wi-Fi。';
  } else if (robot.connectionType === 'wifi') {
    if (!router.wifiEnabled) {
      robotDiagnostics.errorReason = 'Wi-Fi已关闭：路由器Wi-Fi未开启';
      robotDiagnostics.hint = '请在路由器设置中开启 Wi-Fi 功能。';
    } else if (robot.wifiSsid !== router.wifiSsid) {
      robotDiagnostics.errorReason = `SSID不匹配：机器人连接的是 "${robot.wifiSsid || '未设置'}"，而路由器Wi-Fi是 "${router.wifiSsid}"`;
      robotDiagnostics.hint = `请在机器人网络设置中选择并连接 "${router.wifiSsid}"。`;
    } else if (robot.wifiPassword !== router.wifiPassword) {
      robotDiagnostics.errorReason = 'Wi-Fi密码错误：机器人输入的无线密码不正确';
      robotDiagnostics.hint = `请核对路由器Wi-Fi密码（当前设置密码为: ${router.wifiPassword}）。`;
    } else {
      robotLinked = true;
    }
  } else if (robot.connectionType === 'ethernet') {
    robotLinked = true;
  }

  if (robotLinked) {
    if (robot.ipMode === 'static') {
      if (!isValidIpv4(robot.staticIp)) {
        robotDiagnostics.errorReason = 'IP格式错误：机器人静态IP不合法';
        robotDiagnostics.hint = '请输入有效的IPv4地址（如 192.168.1.50）。';
      } else if (!isSameSubnet(robot.staticIp, routerIp, routerMask)) {
        robotDiagnostics.errorReason = `网段不一致：机器人IP (${robot.staticIp}) 与路由器网关不在同一子网`;
        robotDiagnostics.hint = `修改机器人IP使其处于 192.168.1.xxx 网段。`;
      } else {
        effectiveRobotIp = robot.staticIp;
        robotOnline = true;
        robotDiagnostics.canReachRouter = true;
        robotDiagnostics.effectiveIp = effectiveRobotIp;
      }
    } else {
      // DHCP
      if (router.dhcpEnabled) {
        effectiveRobotIp = '192.168.1.102';
        robotOnline = true;
        robotDiagnostics.canReachRouter = true;
        robotDiagnostics.effectiveIp = effectiveRobotIp;
      } else {
        robotDiagnostics.errorReason = 'DHCP获取失败：路由器未开启DHCP服务';
        robotDiagnostics.hint = '请为机器人配置静态IP，或者开启路由器DHCP服务。';
      }
    }

    if (robotOnline) {
      if (!serverOnline) {
        robotDiagnostics.canReachServer = false;
        robotDiagnostics.errorReason = '无法连通流媒体服务器：服务器离线或未插线';
        robotDiagnostics.hint = '请确保流媒体服务器已经正常配置并启动。';
      } else if (robot.targetServerIp !== effectiveServerIp) {
        robotDiagnostics.canReachServer = false;
        robotDiagnostics.errorReason = `推流目标地址错误：机器人配置推向 ${robot.targetServerIp}，但服务器实际IP是 ${effectiveServerIp}`;
        robotDiagnostics.hint = `请将机器人推流目标IP修改为服务器的真实IP (${effectiveServerIp})。`;
      } else if (!robot.cameraActive) {
        robotDiagnostics.errorReason = '摄像头未启用：机器人推流摄像头处于关闭状态';
        robotDiagnostics.hint = '开启机器人的直播摄像头。';
      } else if (!robot.isStreaming) {
        robotDiagnostics.errorReason = '未开始推流：机器人推流开关未打开';
        robotDiagnostics.hint = '点击“开启推流”按钮开始广播。';
      } else {
        robotDiagnostics.canReachServer = true;
        robotStreamPublished = true;
      }
    }
  }

  // 4. Phone evaluation
  let phoneWifiAuthenticated = false;
  let phoneOnline = false;
  let phoneCanWatchStream = false;
  let effectivePhoneIp = '';
  const phoneDiagnostics: DiagnosticResult = {
    canReachRouter: false,
    canReachServer: false,
    effectiveIp: '',
  };

  if (!phone.wifiConnected) {
    phoneDiagnostics.errorReason = 'Wi-Fi未连接：手机尚未打开或连接无线网络';
    phoneDiagnostics.hint = '在手机设置中打开Wi-Fi并选择教室无线路由器。';
  } else if (!router.wifiEnabled) {
    phoneDiagnostics.errorReason = '无线信号不可用：路由器Wi-Fi未开启';
    phoneDiagnostics.hint = '前往路由器面板开启Wi-Fi无线广播。';
  } else if (phone.wifiSsid !== router.wifiSsid) {
    phoneDiagnostics.errorReason = `Wi-Fi名称不符：连接了 "${phone.wifiSsid || '未知'}"，不是 "${router.wifiSsid}"`;
    phoneDiagnostics.hint = `请在手机Wi-Fi列表中选择正确的热点 "${router.wifiSsid}"。`;
  } else if (phone.wifiPassword !== router.wifiPassword) {
    phoneDiagnostics.errorReason = '身份认证失败：Wi-Fi密码不正确';
    phoneDiagnostics.hint = `请输入正确的Wi-Fi密码（路由器密码: ${router.wifiPassword}）。`;
  } else {
    phoneWifiAuthenticated = true;
  }

  if (phoneWifiAuthenticated) {
    if (phone.ipMode === 'static') {
      if (!isValidIpv4(phone.staticIp)) {
        phoneDiagnostics.errorReason = 'IP格式不合法：手机静态IP输入错误';
      } else if (!isSameSubnet(phone.staticIp, routerIp, routerMask)) {
        phoneDiagnostics.errorReason = `网段错误：手机静态IP (${phone.staticIp}) 与路由器网关不在同一网段`;
        phoneDiagnostics.hint = `将手机IP更改为 192.168.1.xxx 网段。`;
      } else {
        effectivePhoneIp = phone.staticIp;
        phoneOnline = true;
        phoneDiagnostics.canReachRouter = true;
        phoneDiagnostics.effectiveIp = effectivePhoneIp;
      }
    } else {
      // DHCP mode on phone
      if (router.dhcpEnabled) {
        effectivePhoneIp = '192.168.1.108';
        phoneOnline = true;
        phoneDiagnostics.canReachRouter = true;
        phoneDiagnostics.effectiveIp = effectivePhoneIp;
      } else {
        phoneDiagnostics.errorReason = '无法自动获取IP：路由器未启用DHCP服务';
        phoneDiagnostics.hint = '开启路由器DHCP，或在手机网络设置中手动配置静态IP。';
      }
    }

    if (phoneOnline) {
      if (!serverOnline) {
        phoneDiagnostics.canReachServer = false;
        phoneDiagnostics.errorReason = '无法连接直播服务器：流媒体服务器不可达';
      } else {
        phoneDiagnostics.canReachServer = true;
        if (!robotStreamPublished) {
          phoneDiagnostics.errorReason = '暂无直播信号：服务器正在运行，但机器人尚未推送视频流';
          phoneDiagnostics.hint = '请检查机器人摄像头的网络与推流配置。';
        } else {
          phoneCanWatchStream = true;
        }
      }
    }
  }

  // 5. Laptop evaluation
  let laptopLinked = false;
  let laptopOnline = false;
  let laptopCanWatchStream = false;
  let effectiveLaptopIp = '';
  const laptopDiagnostics: DiagnosticResult = {
    canReachRouter: false,
    canReachServer: false,
    effectiveIp: '',
  };

  if (laptop.connectionType === 'none') {
    laptopDiagnostics.errorReason = '网络适配器断开：未连接网线也未连接Wi-Fi';
    laptopDiagnostics.hint = '在笔记本网络中心选择连接以太网线或Wi-Fi无线网络。';
  } else if (laptop.connectionType === 'wifi') {
    if (!router.wifiEnabled) {
      laptopDiagnostics.errorReason = 'Wi-Fi不可用：路由器无线未启用';
    } else if (laptop.wifiSsid !== router.wifiSsid) {
      laptopDiagnostics.errorReason = `Wi-Fi SSID错误：当前连接 "${laptop.wifiSsid}"，应连接 "${router.wifiSsid}"`;
    } else if (laptop.wifiPassword !== router.wifiPassword) {
      laptopDiagnostics.errorReason = 'Wi-Fi安全密钥错误：输入的密码不匹配';
    } else {
      laptopLinked = true;
    }
  } else if (laptop.connectionType === 'ethernet') {
    laptopLinked = true;
  }

  if (laptopLinked) {
    if (laptop.ipMode === 'static') {
      if (!isValidIpv4(laptop.staticIp)) {
        laptopDiagnostics.errorReason = 'IP格式错误：笔记本静态IP地址不合规';
        laptopDiagnostics.hint = '请输入合法的IPv4地址，例如 192.168.1.120。';
      } else if (!isSameSubnet(laptop.staticIp, routerIp, routerMask)) {
        laptopDiagnostics.errorReason = `跨网段错误：笔记本IP (${laptop.staticIp}) 与路由器网关不在同一子网`;
        laptopDiagnostics.hint = `将笔记本IP设置为 192.168.1.xxx 网段，子网掩码填 255.255.255.0。`;
      } else if (laptop.gateway !== routerIp) {
        laptopDiagnostics.errorReason = `默认网关错误：笔记本网关 (${laptop.gateway}) 必须是路由器IP (${routerIp})`;
        laptopDiagnostics.hint = `将默认网关配置为 ${routerIp}。`;
      } else {
        effectiveLaptopIp = laptop.staticIp;
        laptopOnline = true;
        laptopDiagnostics.canReachRouter = true;
        laptopDiagnostics.effectiveIp = effectiveLaptopIp;
      }
    } else {
      if (router.dhcpEnabled) {
        effectiveLaptopIp = '192.168.1.115';
        laptopOnline = true;
        laptopDiagnostics.canReachRouter = true;
        laptopDiagnostics.effectiveIp = effectiveLaptopIp;
      } else {
        laptopDiagnostics.errorReason = 'DHCP获取失败：局域网中没有开启DHCP服务的路由器';
        laptopDiagnostics.hint = '在笔记本“网络和共享中心”中手动配置静态IP和子网掩码。';
      }
    }

    if (laptopOnline) {
      if (!serverOnline) {
        laptopDiagnostics.canReachServer = false;
        laptopDiagnostics.errorReason = '无法连通流媒体服务器：服务器离线';
      } else {
        laptopDiagnostics.canReachServer = true;
        if (!robotStreamPublished) {
          laptopDiagnostics.errorReason = '等待推流：已连入局域网服务器，但机器人未开始推流';
          laptopDiagnostics.hint = '检查机器人摄像头设置，确保推流状态为“推流中”。';
        } else {
          laptopCanWatchStream = true;
        }
      }
    }
  }

  // 6. Check IP conflicts
  const activeIps: { name: string; ip: string }[] = [];
  if (serverOnline && effectiveServerIp) activeIps.push({ name: '流媒体服务器', ip: effectiveServerIp });
  if (robotOnline && effectiveRobotIp) activeIps.push({ name: '直播机器人', ip: effectiveRobotIp });
  if (phoneOnline && effectivePhoneIp) activeIps.push({ name: '手机终端', ip: effectivePhoneIp });
  if (laptopOnline && effectiveLaptopIp) activeIps.push({ name: '笔记本终端', ip: effectiveLaptopIp });

  for (let i = 0; i < activeIps.length; i++) {
    for (let j = i + 1; j < activeIps.length; j++) {
      if (activeIps[i].ip === activeIps[j].ip) {
        ipConflicts.push(
          `IP冲突警告：【${activeIps[i].name}】与【${activeIps[j].name}】使用了相同的IP (${activeIps[i].ip})！局域网内每台设备必须有唯一的IP地址！`
        );
      }
    }
  }

  return {
    serverOnline,
    serverDiagnostics,
    effectiveServerIp,
    robotLinked,
    robotOnline,
    robotStreamPublished,
    robotDiagnostics,
    effectiveRobotIp,
    phoneWifiAuthenticated,
    phoneOnline,
    phoneCanWatchStream,
    phoneDiagnostics,
    effectivePhoneIp,
    laptopLinked,
    laptopOnline,
    laptopCanWatchStream,
    laptopDiagnostics,
    effectiveLaptopIp,
    ipConflicts,
  };
}
