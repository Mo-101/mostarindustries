import React, { useState, useEffect, useRef } from 'react';
import { Send, Zap, AlertTriangle, Server, Shield, Database, Terminal } from 'lucide-react';
import { toast } from 'sonner';

interface CommandHistory {
  input: string;
  output: string;
  timestamp: Date;
  type: 'success' | 'error' | 'info';
}

const CommandTab = () => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory([
      { input: '', output: '// Overlord Command Matrix v2.1.0', timestamp: new Date(), type: 'info' },
      { input: '', output: '// Neon Grid Core: Online', timestamp: new Date(), type: 'success' },
      { input: '', output: '// Supabase Realtime Mirror: Active', timestamp: new Date(), type: 'info' },
      { input: '', output: '// Neural Synchronization: Stable (99.8%)', timestamp: new Date(), type: 'success' },
      { input: '', output: '// Type "help" for full command registry', timestamp: new Date(), type: 'info' },
    ]);

    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const processCommand = async (cmd: string) => {
    const normalizedCmd = cmd.trim().toLowerCase();
    setHistory(prev => [...prev, { input: cmd, output: '', timestamp: new Date(), type: 'info' }]);
    setIsProcessing(true);

    try {
      let response: string;

      if (normalizedCmd === 'help') {
        response = `
Available commands:
- status: Show system status
- diagnose [location] [symptoms...]: Analyze grid signal (NeonDB)
- analyze [data]: Predictive AI analysis (Hybrid Model)
- secure [protocol]: Activate security protocol
- deploy [node]: Deploy AI node
- clear: Clear terminal
`;
      } 
      else if (normalizedCmd === 'status') {
        response = `
SYSTEM STATUS:
- Overlord: ONLINE (v2.1.0)
- Neon Core DB: Connected ✅
- Supabase Sync: Active 🔄
- AI Nodes: 27 active
- System Load: 19.3%
- Grid Latency: 12ms
`;
        toast('Grid status synced from Neon Core', { icon: <Database className="h-5 w-5 text-mostar-cyan" /> });
      } 
      else if (normalizedCmd.startsWith('diagnose')) {
        const parts = cmd.split(' ');
        const location = parts[1] || 'Unknown';
        const symptoms = parts.slice(2).join(', ') || 'n/a';

        try {
          const res = await fetch('/api/diagnose', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location, symptoms }),
          });
          const result = await res.json();

          response = `✓ Diagnostic Complete
━━━━━━━━━━━━━━━━━━━━━━━━
Location: ${result.data.location}
Symptoms: ${symptoms}
Verdict: ${result.data.root_cause}
Action: ${result.data.policy}
Confidence: ${(result.data.confidence * 100).toFixed(1)}%

Source: NeonDB / Supabase Hybrid Sync
`;

          toast('Diagnosis complete — synced to Neon Core', {
            icon: <Zap className="h-5 w-5 text-mostar-cyan" />,
          });
        } catch (err) {
          response = `✗ Error executing diagnostic: ${err instanceof Error ? err.message : 'Unknown error'}`;
          toast.error('Diagnostic failed', { icon: <AlertTriangle className="h-5 w-5" /> });
        }
      } 
      else if (normalizedCmd.startsWith('analyze')) {
        const data = cmd.replace(/^analyze\s+/i, '').trim() || 'dataset:current';

        response = `Analyzing data: ${data} ...
━━━━━━━━━━━━━━━━━━━━━━━━
Oracle AI engine identified 9 key vectors.
Predictive accuracy: 92.4%
Correlations: spatiotemporal clusters, signal interference, network health.

Source: Hybrid AI (NeonDB + Supabase Pipeline)
`;
        toast('Hybrid data analysis complete', { icon: <Zap className="h-5 w-5 text-mostar-green" /> });
      }
      else if (normalizedCmd.startsWith('secure')) {
        const protocol = cmd.split(' ')[1] || 'standard';
        response = `⚡ Initiating ${protocol.toUpperCase()} security protocol...
Quantum encryption verified.
Neural firewall active.
Supabase auth mirrored.
System: Secure Mode Alpha.
`;
        toast(`Security protocol ${protocol.toUpperCase()} active`, {
          icon: <Shield className="h-5 w-5 text-mostar-magenta" />,
        });
      } 
      else if (normalizedCmd.startsWith('deploy')) {
        const node = cmd.split(' ')[1] || 'compute-node';
        response = `🚀 Deploying node "${node}"...
Node initialized in Neon Grid.
Resources allocated.
Cognitive link synchronized.
Operational efficiency +3.5%.
`;
        toast(`AI node "${node}" deployed`, { icon: <Server className="h-5 w-5 text-mostar-green" /> });
      } 
      else if (normalizedCmd === 'clear') {
        setHistory([]);
        setIsProcessing(false);
        return;
      } 
      else {
        response = `Command not recognized: "${cmd}"\nType "help" for available commands.`;
      }

      setHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1].output = response;
        updated[updated.length - 1].type = 'success';
        return updated;
      });
    } 
    catch (err) {
      setHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1].output = `Error: ${err instanceof Error ? err.message : 'Unknown'}`;
        updated[updated.length - 1].type = 'error';
        return updated;
      });
      toast.error('Command execution error', { icon: <AlertTriangle className="h-5 w-5" /> });
    } 
    finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isProcessing) return;
    processCommand(command);
    setCommand('');
  };

  const formatTimestamp = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2 rounded-full bg-mostar-cyan/10 border border-mostar-cyan/30">
          <Terminal className="h-6 w-6 text-mostar-cyan" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-white">Overlord Command Matrix</h3>
          <p className="text-xs text-white/60 font-mono">Neon–Supabase Hybrid Intelligence Layer</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-black/30 rounded-lg p-6 border border-mostar-cyan/10 h-[350px] flex flex-col shadow-inner shadow-mostar-cyan/10">
            <div className="mb-4 font-mono text-xs text-white/70 border-b border-mostar-cyan/10 pb-2 flex justify-between">
              <span>COMMAND INTERFACE</span>
              <span>v2.1.0</span>
            </div>

            <div ref={terminalRef} className="flex-grow font-mono text-sm text-white/90 bg-black/40 rounded p-4 overflow-y-auto">
              {history.map((item, i) => (
                <div key={i} className="mb-2">
                  {item.input && (
                    <div className="flex">
                      <span className="text-mostar-cyan mr-2">&gt;</span>
                      <span>{item.input}</span>
                    </div>
                  )}
                  {item.output && (
                    <div className={`ml-4 whitespace-pre-wrap ${item.type === 'error'
                      ? 'text-mostar-magenta'
                      : 'text-white/90'
                    }`}>
                      {item.output}
                    </div>
                  )}
                  <div className="text-xs text-white/40 ml-4 mt-1 mb-3">
                    {formatTimestamp(item.timestamp)}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-center text-mostar-cyan">
                  <span>Processing</span>
                  <div className="ml-2 flex space-x-1">
                    <div className="w-2 h-2 bg-mostar-cyan rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-mostar-cyan rounded-full animate-pulse delay-150"></div>
                    <div className="w-2 h-2 bg-mostar-cyan rounded-full animate-pulse delay-300"></div>
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
                onChange={(e) => setCommand(e.target.value)}
                disabled={isProcessing}
                className="bg-black/50 border border-mostar-cyan/10 text-white font-mono text-sm flex-grow rounded px-2 py-1 focus:ring-1 focus:ring-mostar-cyan/40 outline-none"
                placeholder={isProcessing ? 'Processing command...' : 'Enter command (e.g., diagnose Grid-7)'}
              />
              <button
                type="submit"
                disabled={!command.trim() || isProcessing}
                className={`ml-2 p-1 rounded ${!command.trim() || isProcessing
                  ? 'text-white/30 cursor-not-allowed'
                  : 'text-mostar-cyan hover:bg-mostar-cyan/10'
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Command Reference */}
        <div className="lg:col-span-1">
          <div className="bg-black/30 rounded-lg p-4 border border-mostar-cyan/10">
            <h4 className="font-mono text-sm text-white/70 mb-4">Overlord Command Set</h4>
            {[
              { cmd: 'status', desc: 'Display hybrid system status', color: 'text-mostar-green' },
              { cmd: 'diagnose [location] [symptoms...]', desc: 'Run MoGrid diagnostic', color: 'text-mostar-cyan' },
              { cmd: 'analyze [data]', desc: 'Run hybrid data analysis', color: 'text-mostar-light-blue' },
              { cmd: 'secure [protocol]', desc: 'Activate security layer', color: 'text-mostar-magenta' },
              { cmd: 'deploy [node]', desc: 'Deploy AI node', color: 'text-mostar-green' },
              { cmd: 'clear', desc: 'Clear terminal', color: 'text-mostar-yellow' },
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
