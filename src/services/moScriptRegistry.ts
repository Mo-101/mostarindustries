export type MoScript = {
  id: string;
  name: string;
  trigger: string;
  inputs: string[];
  logic: (inputs: Record<string, unknown>) => unknown;
  voiceLine?: (result: unknown) => string;
  sass?: boolean;
};

type ExecutionLog = {
  id: string;
  timestamp: string;
  inputs: Record<string, unknown>;
  result: unknown;
  success: boolean;
  error?: string;
};

type ShipmentRecord = {
  forwarder: string;
  cost: number;
  deliveryTime: number;
  onTime: boolean;
  origin: string;
  destination: string;
  transportType: string;
};

type SystemMetrics = {
  uptime: number;
  responseTime: number;
  incidentFreeHours: number;
};

type AgentStatus = {
  activeAgents: number;
  totalAgents: number;
  harmonyIndex: number;
  degradedAgents: string[];
};

type SecurityLog = {
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  unknownSource: boolean;
  description: string;
};

const sampleShipmentData: ShipmentRecord[] = [
  {
    forwarder: 'Cheetah Logistics',
    cost: 1320,
    deliveryTime: 46,
    onTime: true,
    origin: 'Nairobi',
    destination: 'Kampala',
    transportType: 'air',
  },
  {
    forwarder: 'Savannah Express',
    cost: 1180,
    deliveryTime: 64,
    onTime: true,
    origin: 'Nairobi',
    destination: 'Kampala',
    transportType: 'road',
  },
  {
    forwarder: 'Maritime Africa',
    cost: 870,
    deliveryTime: 128,
    onTime: false,
    origin: 'Mombasa',
    destination: 'Dar es Salaam',
    transportType: 'sea',
  },
  {
    forwarder: 'Cheetah Logistics',
    cost: 1410,
    deliveryTime: 51,
    onTime: true,
    origin: 'Nairobi',
    destination: 'Kigali',
    transportType: 'air',
  },
  {
    forwarder: 'Savannah Express',
    cost: 1110,
    deliveryTime: 71,
    onTime: true,
    origin: 'Nairobi',
    destination: 'Kigali',
    transportType: 'road',
  },
  {
    forwarder: 'SkyBridge East',
    cost: 1485,
    deliveryTime: 49,
    onTime: true,
    origin: 'Addis Ababa',
    destination: 'Lusaka',
    transportType: 'air',
  },
];

const sampleSystemMetrics: SystemMetrics = {
  uptime: 0.998,
  responseTime: 118,
  incidentFreeHours: 46,
};

const sampleAgentStatus: AgentStatus = {
  activeAgents: 12,
  totalAgents: 12,
  harmonyIndex: 0.984,
  degradedAgents: [],
};

const sampleSecurityLogs: SecurityLog[] = [
  {
    severity: 'LOW',
    unknownSource: false,
    description: 'Routine credential rotation completed',
  },
  {
    severity: 'MEDIUM',
    unknownSource: false,
    description: 'Firewall adaptive rule update propagated',
  },
  {
    severity: 'HIGH',
    unknownSource: true,
    description: 'Unclassified packet pinged peripheral node',
  },
];

const sampleAccessPatterns = {
  normal: 96,
  anomalous: 4,
};

const rankForwarders = (shipmentData: ShipmentRecord[]) => {
  const metrics = shipmentData.reduce<Record<string, {
    forwarder: string;
    totalShipments: number;
    totalCost: number;
    totalTime: number;
    onTimeDeliveries: number;
    transportMix: Set<string>;
  }>>((acc, record) => {
    if (!acc[record.forwarder]) {
      acc[record.forwarder] = {
        forwarder: record.forwarder,
        totalShipments: 0,
        totalCost: 0,
        totalTime: 0,
        onTimeDeliveries: 0,
        transportMix: new Set(),
      };
    }

    const entry = acc[record.forwarder];
    entry.totalShipments += 1;
    entry.totalCost += record.cost;
    entry.totalTime += record.deliveryTime;
    entry.transportMix.add(record.transportType);
    if (record.onTime) {
      entry.onTimeDeliveries += 1;
    }

    return acc;
  }, {});

  const ranked = Object.values(metrics)
    .map((entry) => {
      const avgCost = entry.totalCost / entry.totalShipments;
      const avgTime = entry.totalTime / entry.totalShipments;
      const onTimeRate = entry.onTimeDeliveries / entry.totalShipments;
      const score = (onTimeRate * 70) + (entry.transportMix.size * 10) - (avgCost / 1500) * 10 - (avgTime / 120) * 10;

      return {
        name: entry.forwarder,
        avgCost,
        avgTime,
        onTimeRate,
        shipments: entry.totalShipments,
        transportVariety: entry.transportMix.size,
        score: Number(score.toFixed(2)),
      };
    })
    .sort((a, b) => b.score - a.score);

  return {
    top: ranked[0],
    all: ranked,
    generatedAt: new Date().toISOString(),
  };
};

const detectSavingsRoutes = (shipmentData: ShipmentRecord[]) => {
  const byRoute = shipmentData.reduce<Record<string, { records: ShipmentRecord[] }>>((acc, record) => {
    const key = `${record.origin} -> ${record.destination}`;
    if (!acc[key]) {
      acc[key] = { records: [] };
    }
    acc[key].records.push(record);
    return acc;
  }, {});

  const opportunities = Object.entries(byRoute).map(([route, { records }]) => {
    const avgCost = records.reduce((sum, item) => sum + item.cost, 0) / records.length;
    const slowerOptions = records.filter((item) => item.transportType === 'sea' || item.transportType === 'road');
    const fastest = records.reduce((prev, current) => (prev.deliveryTime <= current.deliveryTime ? prev : current));
    const potentialSavings = colderDiscount(avgCost, slowerOptions.length > 0);

    return {
      route,
      currentAvgCost: Number(avgCost.toFixed(2)),
      recommendedMode: slowerOptions.length > 0 ? 'sea-road hybrid' : 'air priority',
      fastestOption: {
        forwarder: fastest.forwarder,
        deliveryTime: fastest.deliveryTime,
        cost: fastest.cost,
      },
      potentialSavings,
    };
  }).sort((a, b) => b.potentialSavings.amount - a.potentialSavings.amount);

  return {
    topOpportunity: opportunities[0],
    allOpportunities: opportunities,
    generatedAt: new Date().toISOString(),
  };
};

const colderDiscount = (avgCost: number, hasAlternative: boolean) => {
  const baseDrop = hasAlternative ? 0.18 : 0.07;
  const amount = Number((avgCost * baseDrop).toFixed(2));
  return {
    amount,
    percentage: Number((baseDrop * 100).toFixed(1)),
  };
};

const computeSystemHealth = (metrics: SystemMetrics, agentStatus: AgentStatus) => {
  const uptimeScore = metrics.uptime * 40;
  const responseScore = Math.max(0, 30 - (metrics.responseTime / 10));
  const harmonyScore = agentStatus.harmonyIndex * 30;
  const totalScore = Math.min(100, uptimeScore + responseScore + harmonyScore);

  return {
    healthScore: Number(totalScore.toFixed(1)),
    status: totalScore > 85 ? 'OPTIMAL' : totalScore > 65 ? 'STABLE' : 'DEGRADED',
    metricsBreakdown: {
      uptime: Number((metrics.uptime * 100).toFixed(2)),
      responseTime: metrics.responseTime,
      harmonyIndex: Number((agentStatus.harmonyIndex * 100).toFixed(2)),
      incidentFreeHours: metrics.incidentFreeHours,
    },
    advisories: totalScore > 65 ? ['Maintain proactive monitoring cadence', 'Continue harmony checks every 6 hours'] : [
      'Increase redundancy on critical nodes',
      'Deploy additional diagnostics via Executor',
    ],
  };
};

const assessThreatLevel = (logs: SecurityLog[], access: { normal: number; anomalous: number }) => {
  const severityWeight = logs.reduce((sum, entry) => {
    const weight = entry.severity === 'HIGH' ? 3 : entry.severity === 'MEDIUM' ? 2 : 1;
    return sum + weight + (entry.unknownSource ? 1 : 0);
  }, 0);

  const anomalyWeight = access.anomalous / Math.max(access.normal + access.anomalous, 1);
  const score = Math.min(100, (severityWeight * 8) + (anomalyWeight * 100));

  return {
    threatLevel: Number(score.toFixed(1)),
    classification: score > 70 ? 'ELEVATED' : score > 40 ? 'HEIGHTENED' : 'NORMAL',
    highlightedEvents: logs.slice(0, 3),
    recommendedActions: score > 70
      ? ['Isolate sensitive endpoints', 'Initiate deep packet inspection', 'Notify Phoenix for ethics audit alignment']
      : ['Maintain normal monitoring cadence', 'Review access logs every 30 minutes'],
  };
};

export class MoScriptRegistry {
  private scripts = new Map<string, MoScript>();
  private history: ExecutionLog[] = [];

  constructor(initialScripts: MoScript[] = []) {
    initialScripts.forEach((script) => this.register(script));
  }

  register(script: MoScript) {
    this.scripts.set(script.id, script);
  }

  execute(id: string, inputs: Record<string, unknown>) {
    const script = this.scripts.get(id);
    if (!script) {
      const error = `MoScript "${id}" is not registered`;
      this.history.push({
        id,
        timestamp: new Date().toISOString(),
        inputs,
        result: null,
        success: false,
        error,
      });
      return { success: false, error };
    }

    try {
      const result = script.logic(inputs);
      const narrative = script.voiceLine ? script.voiceLine(result) : undefined;
      const logEntry: ExecutionLog = {
        id,
        timestamp: new Date().toISOString(),
        inputs,
        result,
        success: true,
      };
      this.history.push(logEntry);

      return {
        success: true,
        result,
        narrative,
        sass: script.sass ?? false,
        script,
      };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown execution failure';
      this.history.push({
        id,
        timestamp: new Date().toISOString(),
        inputs,
        result: null,
        success: false,
        error,
      });
      return { success: false, error, script };
    }
  }

  getScript(id: string) {
    return this.scripts.get(id);
  }

  listScripts() {
    return Array.from(this.scripts.values());
  }

  getHistory() {
    return this.history.slice(-25);
  }
}

export const moScriptRegistry = new MoScriptRegistry([
  {
    id: 'mo-fwd-eff-001',
    name: 'Forwarder Efficiency Ranker',
    trigger: 'onCalculateResults',
    inputs: ['shipmentData'],
    logic: ({ shipmentData }) => rankForwarders((shipmentData as ShipmentRecord[]) || sampleShipmentData),
    voiceLine: (result) => {
      if (!result || typeof result !== 'object' || !(result as { top?: { name?: string } }).top) {
        return 'Forwarder ranking complete. Top performer stands ready.';
      }
      const { top } = result as { top: { name: string } };
      return `After scouring every manifest, ${top.name} leads the pack - part cheetah, part calculator.`;
    },
    sass: true,
  },
  {
    id: 'mo-cost-saver-007',
    name: 'Cost Optimization Oracle',
    trigger: 'onMonthlyTrendUpdate',
    inputs: ['shipmentData'],
    logic: ({ shipmentData }) => detectSavingsRoutes((shipmentData as ShipmentRecord[]) || sampleShipmentData),
    voiceLine: (result) => {
      if (!result || typeof result !== 'object') {
        return 'Savings radar pinged - review the console for details.';
      }
      const { topOpportunity } = result as {
        topOpportunity?: { route?: string; potentialSavings?: { amount: number; percentage: number } };
      };
      if (!topOpportunity) {
        return 'Savings radar pinged - review the console for details.';
      }
      const amount = topOpportunity?.potentialSavings?.amount ?? 0;
      const percentage = topOpportunity?.potentialSavings?.percentage ?? 0;
      const route = topOpportunity?.route ?? 'priority corridor';
      return `Ka-ching. ${percentage}% unlock on ${route}. That margin covers snacks and starships.`;
    },
    sass: true,
  },
  {
    id: 'mo-health-check-002',
    name: 'Grid Health Diagnostic',
    trigger: 'onSystemCheck',
    inputs: ['systemMetrics', 'agentStatus'],
    logic: ({ systemMetrics, agentStatus }) => computeSystemHealth(
      (systemMetrics as SystemMetrics) || sampleSystemMetrics,
      (agentStatus as AgentStatus) || sampleAgentStatus,
    ),
    voiceLine: (result) => {
      if (!result || typeof result !== 'object' || !(result as { healthScore?: number }).healthScore) {
        return 'Grid health pulse captured.';
      }
      const { healthScore, status } = result as { healthScore: number; status: string };
      return `Grid vitality at ${healthScore}%. Status: ${status}. Keep the resonance steady.`;
    },
  },
  {
    id: 'mo-threat-assess-003',
    name: 'Threat Level Assessment',
    trigger: 'onSecurityScan',
    inputs: ['networkLogs', 'accessPatterns'],
    logic: ({ networkLogs, accessPatterns }) => assessThreatLevel(
      (networkLogs as SecurityLog[]) || sampleSecurityLogs,
      (accessPatterns as { normal: number; anomalous: number }) || sampleAccessPatterns,
    ),
    voiceLine: (result) => {
      if (!result || typeof result !== 'object' || !(result as { threatLevel?: number }).threatLevel) {
        return 'Threat grid scanned. No anomalies severe enough to broadcast.';
      }
      const { threatLevel, classification } = result as { threatLevel: number; classification: string };
      return `Threat resonance at ${threatLevel}. Classification: ${classification}. TsaTse Fly is on overwatch.`;
    },
    sass: true,
  },
]);

export const gatherInputsForScript = async (scriptId: string) => {
  const script = moScriptRegistry.getScript(scriptId);
  if (!script) {
    throw new Error(`Cannot gather inputs. MoScript "${scriptId}" is not registered.`);
  }

  const inputs: Record<string, unknown> = {};

  for (const key of script.inputs) {
    if (key === 'shipmentData') {
      inputs.shipmentData = sampleShipmentData;
    } else if (key === 'systemMetrics') {
      inputs.systemMetrics = sampleSystemMetrics;
    } else if (key === 'agentStatus') {
      inputs.agentStatus = sampleAgentStatus;
    } else if (key === 'networkLogs') {
      inputs.networkLogs = sampleSecurityLogs;
    } else if (key === 'accessPatterns') {
      inputs.accessPatterns = sampleAccessPatterns;
    }
  }

  return inputs;
};
