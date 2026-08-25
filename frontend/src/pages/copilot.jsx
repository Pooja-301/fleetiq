import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Send,
  Truck,
  Bot,
  User,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  RotateCcw,
  Fuel,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/dashboard/risk-badge";
import { askCopilot } from "@/lib/api";

const SUGGESTIONS = [
  "Which vehicles need urgent workshop attention?",
  "Show all trucks with brake wear issues",
  "What is the status and failure risk for FL-1042?",
  "Show vehicles assigned to Pune depot",
  "What is the estimated maintenance cost across the fleet?",
];

const INITIAL_MESSAGES = [
  {
    id: "welcome",
    role: "assistant",
    text: "Hello! I am **FleetIQ Copilot**, your predictive fleet intelligence assistant.\n\nI can analyze vehicle sensor telemetry, predict component failure risks, and help optimize maintenance schedules across all depots.\n\nHow can I assist you today?",
    vehicleCards: [],
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

export default function CopilotPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await askCopilot(query);
      const botMsg = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        text: res.reply || "I analyzed the fleet telemetry data.",
        vehicleCards: res.vehicleCards || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: `bot-err-${Date.now()}`,
        role: "assistant",
        text: "I was unable to query the backend service. Please make sure the backend is running.",
        vehicleCards: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AppShell
      title="FleetIQ AI Copilot"
      description="Conversational intelligence over fleet health, failure predictions, and maintenance planning"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Chat Area (3 Columns) */}
        <Card className="flex flex-col h-[750px] lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="size-5" />
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  Fleet Assistant
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-500">
                    Online · Connected to Live Fleet DB
                  </span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Answers powered by real-time vehicle telemetry and risk engines
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMessages(INITIAL_MESSAGES)}
              className="text-xs gap-1.5 h-8"
            >
              <RotateCcw className="size-3.5" />
              Reset Chat
            </Button>
          </CardHeader>

          {/* Messages scroll area */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary mt-0.5">
                    <Bot className="size-4" />
                  </div>
                )}

                <div
                  className={`flex flex-col gap-2 max-w-[85%] rounded-xl p-4 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground ml-12"
                      : "bg-secondary/60 text-foreground border border-border"
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {msg.text.split("\n").map((line, idx) => {
                      // Basic markdown rendering
                      if (line.startsWith("### ")) {
                        return <h4 key={idx} className="font-bold text-base my-1">{line.replace("### ", "")}</h4>;
                      }
                      if (line.startsWith("• ")) {
                        return <div key={idx} className="pl-2 my-0.5">{line}</div>;
                      }
                      return <p key={idx} className={line === "" ? "h-2" : ""}>{line}</p>;
                    })}
                  </div>

                  {/* Render referenced vehicle cards if any */}
                  {msg.vehicleCards && msg.vehicleCards.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 pt-2 border-t border-border/60">
                      {msg.vehicleCards.map((v) => (
                        <div
                          key={v.id}
                          className="bg-background/80 rounded-lg p-3 border border-border flex flex-col justify-between gap-2 text-xs"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <span className="font-semibold text-foreground">{v.id}</span>
                              <p className="text-[11px] text-muted-foreground truncate">{v.name}</p>
                            </div>
                            <RiskBadge level={v.riskLevel} />
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-border/40">
                            <span className="text-muted-foreground">{v.depot}</span>
                            <Button variant="ghost" size="sm" asChild className="h-6 px-2 text-[11px]">
                              <Link to={`/vehicles/${v.id}`}>
                                View <ArrowRight className="size-3 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] opacity-60 self-end mt-1">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.role === "user" && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground mt-0.5">
                    <User className="size-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Bot className="size-4" />
                </div>
                <div className="bg-secondary/60 rounded-xl px-4 py-3 border border-border text-sm flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary animate-pulse" />
                  <div className="size-2 rounded-full bg-primary animate-pulse delay-150" />
                  <div className="size-2 rounded-full bg-primary animate-pulse delay-300" />
                  <span className="text-xs text-muted-foreground ml-1">Analyzing fleet telemetry...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input form */}
          <div className="p-4 border-t bg-card">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about vehicle health, failure risks, costs, or maintenance..."
                className="flex-1 text-sm h-11"
                disabled={loading}
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="h-11 px-5 gap-2"
              >
                <Send className="size-4" />
                <span className="hidden sm:inline">Ask</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Sidebar Prompts / Capabilities (1 Column) */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <HelpCircle className="size-4 text-primary" />
                Quick Inquiries
              </CardTitle>
              <CardDescription className="text-xs">
                Click any prompt to ask the Copilot directly
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {SUGGESTIONS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="text-left text-xs p-2.5 rounded-lg border border-border bg-secondary/40 hover:bg-secondary transition text-foreground hover:border-primary/40 leading-relaxed cursor-pointer"
                >
                  "{prompt}"
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                Copilot Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <ShieldAlert className="size-4 text-destructive shrink-0 mt-0.5" />
                <span><strong>Failure Risk Triage:</strong> Queries real-time risk scores and component flags.</span>
              </div>
              <div className="flex items-start gap-2">
                <Wrench className="size-4 text-warning shrink-0 mt-0.5" />
                <span><strong>Maintenance Advice:</strong> Explains specific repair steps and workshop bay windows.</span>
              </div>
              <div className="flex items-start gap-2">
                <Fuel className="size-4 text-primary shrink-0 mt-0.5" />
                <span><strong>Depot & Fleet Scope:</strong> Filters vehicles by regional hubs and route load.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
