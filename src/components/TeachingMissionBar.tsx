import React, { useEffect, useRef } from 'react';
import { CheckCircle2, Circle, Sparkles, RotateCcw, Wrench, Trophy, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  RouterConfig,
  ServerConfig,
  RobotConfig,
  PhoneConfig,
  LaptopConfig,
} from '../types/network';
import { EvaluatedNetworkState } from '../utils/networkEngine';

interface TeachingMissionBarProps {
  router: RouterConfig;
  server: ServerConfig;
  robot: RobotConfig;
  phone: PhoneConfig;
  laptop: LaptopConfig;
  evaluated: EvaluatedNetworkState;
  onApplyReferenceSolution: () => void;
  onResetLab: () => void;
  onOpenKnowledge: () => void;
}

export const TeachingMissionBar: React.FC<TeachingMissionBarProps> = ({
  router,
  server,
  robot,
  phone,
  laptop,
  evaluated,
  onApplyReferenceSolution,
  onResetLab,
  onOpenKnowledge,
}) => {
  // Check conditions for 6 educational tasks
  const task1 = server.cabledToRouter;
  const task2 =
    server.staticIp === '192.168.1.100' &&
    server.gateway === router.lanIp &&
    server.serviceRunning &&
    evaluated.serverOnline;
  const task3 = router.wifiEnabled && !!router.wifiSsid && !!router.wifiPassword;
  const task4 =
    evaluated.robotStreamPublished &&
    robot.targetServerIp === evaluated.effectiveServerIp;
  const task5 = evaluated.phoneCanWatchStream;
  const task6 = evaluated.laptopCanWatchStream;

  const tasks = [
    { id: 1, title: '服务器物理接线', desc: '将流媒体服务器网线插到路由器LAN口', passed: task1 },
    { id: 2, title: '服务器静态IP', desc: '配置IP: 192.168.1.100，网关与流媒体服务', passed: task2 },
    { id: 3, title: '路由器Wi-Fi开启', desc: '设置无线热点名称SSID与安全密码', passed: task3 },
    { id: 4, title: '机器人摄像头推流', desc: '将推流目标指向服务器并开始广播', passed: task4 },
    { id: 5, title: '手机端看播', desc: '手机连入Wi-Fi并成功接收机器人直播画面', passed: task5 },
    { id: 6, title: '笔记本端看播', desc: '笔记本配置静态IP并在浏览器播放直播', passed: task6 },
  ];

  const completedCount = tasks.filter(t => t.passed).length;
  const isAllComplete = completedCount === tasks.length;
  const hasTriggeredConfetti = useRef(false);

  useEffect(() => {
    if (isAllComplete && !hasTriggeredConfetti.current) {
      hasTriggeredConfetti.current = true;
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // fallback safely
      }
    } else if (!isAllComplete) {
      hasTriggeredConfetti.current = false;
    }
  }, [isAllComplete]);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl mb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>初一计算机网络实训任务清单</span>
              <span className="text-xs font-mono text-sky-400">
                ({completedCount} / {tasks.length} 项达成)
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              按步骤连通线路与IP配置，实现机器人直播实时投射至手机和笔记本终端
            </p>
          </div>
        </div>

        {/* Action Controls for Teachers & Students */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenKnowledge}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>网络概念速查</span>
          </button>

          <button
            onClick={onApplyReferenceSolution}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>一键参考配置 (演示模式)</span>
          </button>

          <button
            onClick={onResetLab}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置练习环境</span>
          </button>
        </div>
      </div>

      {/* Progressive Task Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3">
        {tasks.map(t => (
          <div
            key={t.id}
            className={`p-2.5 rounded-xl border text-xs transition-all ${
              t.passed
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-200">
                0{t.id}. {t.title}
              </span>
              {t.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-600 shrink-0" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
