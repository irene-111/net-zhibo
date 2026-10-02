import React from 'react';
import { X, BookOpen, Layers, Shield, Network, Radio, CheckCircle2 } from 'lucide-react';

interface KnowledgeBaseModalProps {
  onClose: () => void;
}

export const KnowledgeBaseModal: React.FC<KnowledgeBaseModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100">七年级计算机网络核心知识宝典</h3>
              <p className="text-[11px] text-slate-400">初中信息技术：局域网与流媒体实训概念指南</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Card 1: IP Address */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
              <Network className="w-4 h-4" />
              <span>1. 什么是 IP 地址？（网络世界的门牌号）</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              在局域网中，每台设备（服务器、机器人、手机、电脑）都必须拥有独一无二的
              <strong> IPv4 地址</strong>。IPv4 采用“点分十进制”，例如 <code>192.168.1.100</code>
              ，分为四段，每段数值范围在 <code>0 ~ 255</code> 之间。
            </p>
            <div className="p-2 bg-slate-900 rounded-lg text-[11px] text-amber-300">
              ⚠️ 注意：局域网中绝不能出现相同的两个 IP，否则会发生“IP冲突”，导致两台设备都无法正常联网！
            </div>
          </div>

          {/* Card 2: Subnet Mask & Gateway */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Layers className="w-4 h-4" />
              <span>2. 什么是子网掩码与默认网关？</span>
            </div>
            <div className="space-y-1.5 text-slate-300 leading-relaxed text-xs">
              <p>
                <strong>子网掩码（如 255.255.255.0）：</strong>
                用来区分“网络号”与“主机号”。掩码为 255 的前三段（192.168.1）必须完全相同，属于同一个“班级网段”，设备之间才能直接进行数据通信。
              </p>
              <p>
                <strong>默认网关（Default Gateway）：</strong>
                是整个局域网对外进出的大门，通常就是<strong>路由器的 LAN 口 IP（如 192.168.1.1）</strong>
                。所有终端如果要与外部或服务器交互，必须将网关准确指向路由器。
              </p>
            </div>
          </div>

          {/* Card 3: Static IP vs DHCP */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
              <Shield className="w-4 h-4" />
              <span>3. 静态 IP 与动态 DHCP 有什么区别？</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-semibold text-sky-300 block mb-1">静态 IP (Static IP)</span>
                <p className="text-slate-400">
                  由管理员手动固定设置，IP 永远不会改变。
                  <br />
                  适用对象：<strong>流媒体服务器、打印机、摄像头推流机器人</strong>等需要长期被别人访问的设备。
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-semibold text-emerald-300 block mb-1">动态 DHCP</span>
                <p className="text-slate-400">
                  由路由器的 DHCP 服务池自动分配临时租用的 IP。
                  <br />
                  适用对象：<strong>学生的手机、平板、访客笔记本</strong>等便携移动设备。
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Streaming Pipeline */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Radio className="w-4 h-4" />
              <span>4. 机器人直播推流与拉流的链路原理</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              直播的完整过程分为三步：
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
              <li>
                <strong>机器人推流 (Publish / Ingest)：</strong>机器人摄像头录制视频后，通过局域网以 RTMP 协议将视频流推送至服务器（<code>rtmp://192.168.1.100:1935/live</code>）。
              </li>
              <li>
                <strong>服务器转码分发 (Media Server)：</strong>流媒体服务器接收到视频流后，切片分发为网络播放格式（HTTP-FLV / HLS / WebRTC）。
              </li>
              <li>
                <strong>手机与电脑拉流播放 (Play / Subscribe)：</strong>终端连入同一个局域网，通过播放器向服务器请求视频流，投射出机器人的实时直播画面！
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium"
          >
            我明白了
          </button>
        </div>
      </div>
    </div>
  );
};
