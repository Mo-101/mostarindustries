import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Cpu,
  Database,
  List,
  Send,
  Server,
  Shield,
  Terminal,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { gatherInputsForScript, moScriptRegistry } from '../../../services/moScriptRegistry';

type CommandTone = 'success' | 'error' | 'info';

interface CommandHistory {
  input: string;
  output: string;
  timestamp: Date;
  type: CommandTone;
}

const createBootHistory = (): CommandHistory[] => [
  { input: '', output: '// Overlord Command Matrix v2.1.0', timestamp: new Date(), type: 'info' },
  { input: '', output: '// Neon Grid Core: Online', timestamp: new Date(), type: 'success' },
  { input: '', output: '// Supabase Realtime Mirror: Active', timestamp: new Date(), type: 'info' },
  { input: '', output: '// Neural Synchronization: Stable (99.8%)', timestamp: new Date(), type: 'success' },
  { input: '', output: '// Body Layer: MoScript Engine calibrated - try "list moscripts"', timestamp: new Date(), type: 'info' },
  { input: '', output: '// Type "help" for full command registry', timestamp: new Date(), type: 'info' },
];

const formatTimestamp = (date: Date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const CommandTab = () => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>(createBootHistory);
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const processCommand = async (rawCommand: string) => {
    const normalizedCommand = rawCommand.trim().toLowerCase();
    setHistory((prev) => [...prev, { input: rawCommand, output: '', timestamp: new Date(), type: 'info' }]);
    setIsProcessing(true);

    try {
      let response = '';
      let tone: CommandTone = 'success';

      if (normalizedCommand === 'help') {
        response = `Available commands:
- status: Show system health (MoScript powered)
- diagnose [location] [symptoms...]: Analyze grid signal (NeonDB)
- analyze [data]: Predictive AI analysis (Hybrid Model)
- secure [protocol]: Activate security protocol
- deploy [node]: Deploy AI node
- list moscripts: Broadcast Body Layer registry
- run [moscript-id]: Execute a registered MoScript
- history: Show recent MoScript executions
- clear: Reset terminal feed`;
        tone = 'info';
      } else if (normalizedCommand === 'status') {
        try {
          const inputs = await gatherInputsForScript('mo-health-check-002');
          const execution = moScriptRegistry.execute('mo-health-check-002', inputs);

          if (execution.success && execution.result && typeof execution.result === 'object') {
            const { healthScore, status, metricsBreakdown, advisories } = execution.result as {
              healthScore: number;
              status: string;
              metricsBreakdown: { uptime: number; responseTime: number; harmonyIndex: number; incidentFreeHours: number };
              advisories: string[];
            };

            response = `SYSTEM STATUS
----------------
Overlord: ONLINE (v2.1.0)
Grid Health: ${status} (${healthScore}% vitality)
Uptime: ${metricsBreakdown.uptime}%
Response Time: ${metricsBreakdown.responseTime}ms
Harmony Index: ${metricsBreakdown.harmonyIndex}%
Incident-Free Hours: ${metricsBreakdown.incidentFreeHours}

Advisories:
${advisories.map((item) => `- ${item}`).join('\n')}`;

            toast('Grid status synced from MoScript diagnostic', {
              icon: <Database className="h-5 w-5 text-mostar-cyan" />,
            });
          } else {
            response = 'System health probe executed, but returned no payload.';
            tone = 'info';
          }
        } catch (error) {
          response = `System health probe failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
          tone = 'error';
          toast.error('Status check failed', { icon: <AlertTriangle className="h-5 w-5" /> });
        }
      } else if (normalizedCommand.startsWith('diagnose')) {
        const parts = rawCommand.split(' ');
        const location = parts[1] || 'Unknown';
        const symptoms = parts.slice(2).join(' ') || 'n/a';

        try {
          const res = await fetch('/api/diagnose', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location, symptoms }),
          });
          const result = await res.json();
          const data = result?.data ?? {};

          response = `DIAGNOSTIC COMPLETE
---------------------
Location: ${data.location ?? location}
Symptoms: ${symptoms}
Verdict: ${data.root_cause ?? 'Awaiting Judge verdict'}
Action: ${data.policy ?? 'Executor standing by'}
Confidence: ${data.confidence ? (data.confidence * 100).toFixed(1) : 'n/a'}%

Source: NeonDB / Supabase Hybrid Sync`;

          toast('Diagnosis complete - synced to Neon Core', { icon: <Zap className="h-5 w-5 text-mostar-cyan" /> });
        } catch (error) {
          response = `Error executing diagnostic: ${error instanceof Error ? error.message : 'Unknown error'}`;
          tone = 'error';
          toast.error('Diagnostic failed', { icon: <AlertTriangle className="h-5 w-5" /> });
        }
      } else if (normalizedCommand.startsWith('analyze')) {
        const data = rawCommand.replace(/^analyze\s+/i, '').trim() || 'dataset:current';
        response = `Hybrid analysis initiated for ${data}
----------------------------------------
Oracle AI identified 9 active vectors
Predictive accuracy: 92.4%
Correlations: spatiotemporal clusters, signal interference, network health`;
        toast('Hybrid data analysis complete', { icon: <Zap className="h-5 w-5 text-mostar-green" /> });
      } else if (normalizedCommand.startsWith('secure')) {
        const protocol = rawCommand.split(' ')[1] || 'standard';
        response = `SECURITY PROTOCOL: ${protocol.toUpperCase()}
--------------------------------
Quantum encryption verified
Neural firewall active
Supabase auth mirrored
System status: Secure Mode Alpha`;
        toast(`Security protocol ${protocol.toUpperCase()} active`, {
          icon: <Shield className="h-5 w-5 text-mostar-magenta" />,
        });
      } else if (normalizedCommand.startsWith('deploy')) {
        const node = rawCommand.split(' ')[1] || 'compute-node';
        response = `DEPLOYMENT REPORT
-----------------
Node: ${node}
Status: Online
Resources: Allocated
Cognitive Link: Synchronized
Net Efficiency: +3.5%`;
        toast(`AI node "${node}" deployed`, { icon: <Server className="h-5 w-5 text-mostar-green" /> });
      } else if (normalizedCommand === 'list moscripts' || normalizedCommand === 'moscripts') {
        const scripts = moScriptRegistry.listScripts();
        response = scripts.length
          ? `MOSCRIPT REGISTRY (${scripts.length})
-------------------------
${scripts.map((script) => `- ${script.id} :: ${script.name} [${script.trigger}]`).join('\n')}`
          : 'No MoScripts registered. Body Layer awaiting directives.';
        tone = 'info';
        toast('MoScript registry broadcast', { icon: <List className="h-5 w-5 text-mostar-light-blue" /> });
      } else if (normalizedCommand === 'history') {
        const logs = moScriptRegistry.getHistory();
        response = logs.length
          ? `MOSCRIPT EXECUTION LOG
-----------------------
${logs
            .map((entry) => {
              const stamp = new Date(entry.timestamp).toLocaleTimeString();
              return `- ${stamp} | ${entry.id} | ${entry.success ? 'SUCCESS' : `ERROR: ${entry.error ?? 'Unknown'}`}`;
            })
            .join('\n')}`
          : 'No MoScript executions recorded yet.';
        tone = 'info';
      } else if (normalizedCommand.startsWith('run ')) {
        const trimmedId = rawCommand.slice(4).trim();
        if (!trimmedId) {
          response = 'Specify a MoScript id. Example: run mo-fwd-eff-001';
          tone = 'error';
        } else {
          const script =
            moScriptRegistry.getScript(trimmedId) ?? moScriptRegistry.getScript(trimmedId.toLowerCase());

          if (!script) {
            response = `MoScript "${trimmedId}" not found. Type "list moscripts" to review available agents.`;
            tone = 'error';
          } else {
            try {
              const inputs = await gatherInputsForScript(script.id);
              const execution = moScriptRegistry.execute(script.id, inputs);

              if (execution.success) {
                const payload = JSON.stringify(execution.result, null, 2);
                response = `${execution.narrative ?? 'Execution complete.'}

Payload:
${payload}`;
                tone = 'success';
                toast(`MoScript ${script.id} executed`, { icon: <Cpu className="h-5 w-5 text-mostar-green" /> });
              } else {
                response = `Execution failure (${script.id}): ${execution.error ?? 'Unknown error'}`;
                tone = 'error';
                toast.error(`MoScript ${script.id} failed`, { icon: <AlertTriangle className="h-5 w-5" /> });
              }
            } catch (error) {
              response = `Unable to execute "${script.id}": ${error instanceof Error ? error.message : 'Unknown error'}`;
              tone = 'error';
              toast.error('MoScript execution error', { icon: <AlertTriangle className="h-5 w-5" /> });
            }
          }
        }
      } else if (normalizedCommand === 'clear') {
        setHistory(createBootHistory());
        setIsProcessing(false);
        return;
      } else {
        response = `Command not recognized: "${rawCommand}"
Type "help" for available commands.`;
        tone = 'error';
      }

      setHistory((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        last.output = response;
        last.type = tone;
        return updated;
      });
    } catch (error) {
      setHistory((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        last.output = `Command execution error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        last.type = 'error';
        return updated;
      });
      toast.error('Command execution error', { icon: <AlertTriangle className="h-5 w-5" /> });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!command.trim() || isProcessing) {
      return;
    }
    processCommand(command);
    setCommand('');
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2 rounded-full bg-mostar-cyan/10 border border-mostar-cyan/30">
          <Terminal className="h-6 w-6 text-mostar-cyan" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-white">Overlord Command Matrix</h3>
          <p className="text-xs text-white/60 font-mono">Neon-Supabase Hybrid Intelligence Layer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-black/30 rounded-lg p-6 border border-mostar-cyan/10 h-[350px] flex flex-col shadow-inner shadow-mostar-cyan/10">
            <div className="mb-4 font-mono text-xs text-white/70 border-b border-mostar-cyan/10 pb-2 flex justify-between">
              <span>COMMAND INTERFACE</span>
              <span>v2.1.0</span>
            </div>

            <div
              ref={terminalRef}
              className="flex-grow font-mono text-sm text-white/90 bg-black/40 rounded p-4 overflow-y-auto"
            >
              {history.map((item, index) => (
                <div key={`${item.timestamp.getTime()}-${index}`} className="mb-2">
                  {item.input && (
                    <div className="flex">
                      <span className="text-mostar-cyan mr-2">&gt;</span>
                      <span>{item.input}</span>
                    </div>
                  )}
                  {item.output && (
                    <div
                      className={`ml-4 whitespace-pre-wrap ${
                        item.type === 'error' ? 'text-mostar-magenta' : 'text-white/90'
                      }`}
                    >
                      {item.output}
                    </div>
                  )}
                  <div className="text-xs text-white/40 ml-4 mt-1 mb-3">{formatTimestamp(item.timestamp)}</div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-center text-mostar-cyan">
                  <span>Processing</span>
                  <div className="ml-2 flex space-x-1">
                    <div className="w-2 h-2 bg-mostar-cyan rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-mostar-cyan rounded-full animate-pulse delay-150" />
                    <div className="w-2 h-2 bg-mostar-cyan rounded-full animate-pulse delay-300" />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex">
              <span className="font-mono text-mostar-cyan mr-2 pt-1">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                disabled={isProcessing}
                className="bg-black/50 border border-mostar-cyan/10 text-white font-mono text-sm flex-grow rounded px-2 py-1 focus:ring-1 focus:ring-mostar-cyan/40 outline-none"
                placeholder={isProcessing ? 'Processing command...' : 'Enter command (e.g., run mo-fwd-eff-001)'}
              />
              <button
                type="submit"
                disabled={!command.trim() || isProcessing}
                className={`ml-2 p-1 rounded ${
                  !command.trim() || isProcessing ? 'text-white/30 cursor-not-allowed' : 'text-mostar-cyan hover:bg-mostar-cyan/10'
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-black/30 rounded-lg p-4 border border-mostar-cyan/10">
            <h4 className="font-mono text-sm text-white/70 mb-4">Overlord Command Set</h4>
            {[
              { cmd: 'status', desc: 'Display hybrid system status', color: 'text-mostar-green' },
              { cmd: 'diagnose [location] [symptoms...]', desc: 'Run MoGrid diagnostic', color: 'text-mostar-cyan' },
              { cmd: 'analyze [data]', desc: 'Run hybrid data analysis', color: 'text-mostar-light-blue' },
              { cmd: 'secure [protocol]', desc: 'Activate security layer', color: 'text-mostar-magenta' },
              { cmd: 'deploy [node]', desc: 'Deploy AI node', color: 'text-mostar-green' },
              { cmd: 'list moscripts', desc: 'Broadcast Body Layer registry', color: 'text-mostar-yellow' },
              { cmd: 'run [moscript-id]', desc: 'Execute cognitive routine', color: 'text-mostar-light-blue' },
              { cmd: 'history', desc: 'Review MoScript execution log', color: 'text-mostar-purple' },
              { cmd: 'clear', desc: 'Reset terminal feed', color: 'text-mostar-yellow' },
            ].map(({ cmd, desc, color }) => (
              <div key={cmd} className="p-2 rounded bg-white/5 hover:bg-white/10 transition-colors mb-2">
                <div className={`font-mono text-xs ${color} mb-1`}>{cmd}</div>
                <p className="text-xs text-white/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandTab;
