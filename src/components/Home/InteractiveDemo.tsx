import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, CheckCircle, Clock, AlertCircle, User, Bell, Mail, Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const InteractiveDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [builtNodes, setBuiltNodes] = useState<number[]>([]);
  const [flowBuildingComplete, setFlowBuildingComplete] = useState(false);

  const demoSteps = [
    {
      id: 1,
      title: "Application Submitted",
      description: "Customer Sarah Chen submitted loan application",
      status: "completed",
      timestamp: "2 minutes ago",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      id: 2,
      title: "Document Review",
      description: "Admin reviewing submitted documents",
      status: "in-progress",
      timestamp: "1 minute ago",
      icon: Clock,
      color: "text-blue-500"
    },
    {
      id: 3,
      title: "Credit Check",
      description: "Running background credit verification",
      status: "pending",
      timestamp: "Just now",
      icon: AlertCircle,
      color: "text-yellow-500"
    },
    {
      id: 4,
      title: "Approval Decision",
      description: "Final approval decision and terms",
      status: "pending",
      timestamp: "Pending",
      icon: Clock,
      color: "text-gray-400"
    },
    {
      id: 5,
      title: "Loan Disbursed",
      description: "Funds transferred to customer account",
      status: "pending",
      timestamp: "Pending",
      icon: Clock,
      color: "text-gray-400"
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      // Phase 1: Build the flow (create nodes one by one)
      if (builtNodes.length < demoSteps.length) {
        interval = setInterval(() => {
          setBuiltNodes(prev => [...prev, prev.length]);
        }, 1000);
      }
      // Phase 2: Flow building complete, start customer progression
      else if (!flowBuildingComplete) {
        setTimeout(() => {
          setFlowBuildingComplete(true);
        }, 500);
      }
      // Phase 3: Customer advances through the built flow
      else if (currentStep < demoSteps.length) {
        interval = setInterval(() => {
          setCompletedSteps(prev => {
            const newCompleted = [...prev, currentStep];
            return newCompleted;
          });
          setCurrentStep(prev => prev + 1);
        }, 2000);
      } else {
        setIsPlaying(false);
      }
    }

    return () => clearInterval(interval);
  }, [isPlaying, builtNodes.length, flowBuildingComplete, currentStep, demoSteps.length]);

  const handlePlay = () => {
    if (currentStep >= demoSteps.length && flowBuildingComplete) {
      // Reset demo
      setCurrentStep(0);
      setCompletedSteps([]);
      setBuiltNodes([]);
      setFlowBuildingComplete(false);
    }
    setIsPlaying(!isPlaying);
  };


  const getStepStatus = (index: number) => {
    if (completedSteps.includes(index)) return "completed";
    if (index === currentStep && isPlaying) return "in-progress";
    return "pending";
  };

  const getStepIcon = (index: number) => {
    const status = getStepStatus(index);
    if (status === "completed") return CheckCircle;
    if (status === "in-progress") return Clock;
    return AlertCircle;
  };


  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-4">See StatusAt in Action</h3>
        <p className="text-muted-foreground mb-6">
          Watch how you build a custom flow step-by-step, then see customers progress through it with automatic notifications
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={handlePlay} className="flex items-center gap-2">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? "Pause Demo" : currentStep >= demoSteps.length ? "Restart Demo" : "Start Demo"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Flow Builder View */}
        <Card className="p-6 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Flow Builder</h4>
            <Badge variant="outline" className="text-xs">
              {!flowBuildingComplete ? "Building..." : "Complete"}
            </Badge>
          </div>
          
          {/* Visual Flow Canvas */}
          <div className="relative bg-muted/20 rounded-lg p-4 h-80 overflow-hidden">
            {/* Grid Background */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
            
            {/* SVG for connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              
              {/* Connection lines between nodes - appear after nodes are built */}
              {(() => {
                // Node positions and dimensions
                const nodeWidth = 80;
                const nodeHeight = 48;
                const positions = [
                  { x: 20, y: 20 },   // Application Submitted
                  { x: 20, y: 80 },   // Document Review  
                  { x: 20, y: 140 },  // Credit Check
                  { x: 120, y: 140 }, // Approval Decision
                  { x: 220, y: 100 }, // Loan Disbursed
                ];
                
                // Calculate connection points between nodes
                const connections = [
                  // Application → Document Review (vertical, bottom to top)
                  { 
                    from: { x: positions[0].x + nodeWidth*0.7, y: positions[0].y + nodeHeight }, 
                    to: { x: positions[1].x + nodeWidth*0.7, y: positions[1].y + nodeHeight*0.4 } 
                  },
                  // Document Review → Credit Check (vertical, bottom to top)
                  { 
                    from: { x: positions[1].x + nodeWidth*0.7, y: positions[1].y + nodeHeight }, 
                    to: { x: positions[2].x + nodeWidth*0.7, y: positions[2].y + nodeHeight*0.4 } 
                  },
                  // Credit Check → Approval Decision (horizontal, right to left)
                  { 
                    from: { x: positions[2].x + nodeWidth, y: positions[2].y + nodeHeight*0.8 }, 
                    to: { x: positions[3].x + nodeWidth*0.2, y: positions[3].y + nodeHeight*0.8 } 
                  },
                  // Approval Decision → Loan Disbursed (diagonal, right to left)
                  { 
                    from: { x: positions[3].x + nodeWidth*1.2, y: positions[3].y + nodeHeight*0.8 }, 
                    to: { x: positions[4].x + nodeWidth*0.2, y: positions[4].y + nodeHeight*0.8 } 
                  },
                ];
                
                return connections.map((connection, index) => {
                  const shouldShow = builtNodes.length > index + 1; // Show connection after both nodes exist
                  return (
                    <motion.path
                      key={index}
                      d={`M ${connection.from.x} ${connection.from.y} L ${connection.to.x} ${connection.to.y}`}
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: shouldShow ? 1 : 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  );
                });
              })()}
            </svg>
            
            {/* Flow Nodes - appear one by one during building */}
            <div className="relative" style={{ zIndex: 2 }}>
              {demoSteps.map((step, index) => {
                const isBuilt = builtNodes.includes(index);
                
                // Position nodes in a flow layout
                const positions = [
                  { x: 20, y: 20 },   // Application Submitted
                  { x: 20, y: 80 },   // Document Review  
                  { x: 20, y: 140 },  // Credit Check
                  { x: 120, y: 140 }, // Approval Decision
                  { x: 220, y: 100 }, // Loan Disbursed
                ];
                
                const position = positions[index];
                
                if (!isBuilt) return null;
                
                return (
                  <motion.div
                    key={step.id}
                    className="absolute w-20 h-12 rounded-lg border-2 bg-background shadow-sm flex flex-col items-center justify-center cursor-pointer border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                    style={{
                      left: position.x,
                      top: position.y,
                    }}
                    initial={{ 
                      scale: 0, 
                      opacity: 0,
                      x: 150, // Start from center-right (like dragging from toolbar)
                      y: 50
                    }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      x: 0,
                      y: 0
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      duration: 0.8
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-xs font-medium text-center leading-tight px-1 text-blue-700 dark:text-blue-300">
                      {step.title.split(' ')[0]}
                    </span>
                  </motion.div>
                );
              })}
            </div>
            
          </div>
          
          {/* Flow Info */}
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Loan Application Flow</span>
              <Badge variant="secondary" className="text-xs">
                {builtNodes.length}/{demoSteps.length} Nodes Built
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {!flowBuildingComplete 
                ? "Building flow step by step..." 
                : "Flow ready for customers to use!"
              }
            </p>
          </div>
        </Card>

        {/* Customer Flow Viewer */}
        <Card className="p-6 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-blue-500" />
            <h4 className="font-semibold">Customer Flow Viewer</h4>
            <Badge variant="outline" className="text-xs">
              {!flowBuildingComplete ? "Waiting..." : "Active"}
            </Badge>
          </div>
          
          {/* Customer's Visual Flow Canvas */}
          <div className="relative bg-muted/20 rounded-lg p-4 h-80 overflow-hidden">
            {/* Grid Background */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
            
            {/* SVG for connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              
              {/* Connection lines - same positions but grayed out for customer */}
              {(() => {
                // Same node positions and dimensions as admin view
                const nodeWidth = 80;
                const nodeHeight = 48;
                const positions = [
                  { x: 20, y: 20 },   // Application Submitted
                  { x: 20, y: 80 },   // Document Review  
                  { x: 20, y: 140 },  // Credit Check
                  { x: 120, y: 140 }, // Approval Decision
                  { x: 220, y: 100 }, // Loan Disbursed
                ];
                
                // Calculate connection points between nodes
                const connections = [
                  // Application → Document Review (vertical, bottom to top)
                  { 
                    from: { x: positions[0].x + nodeWidth*0.7, y: positions[0].y + nodeHeight }, 
                    to: { x: positions[1].x + nodeWidth*0.7, y: positions[1].y + nodeHeight*0.4 } 
                  },
                  // Document Review → Credit Check (vertical, bottom to top)
                  { 
                    from: { x: positions[1].x + nodeWidth*0.7, y: positions[1].y + nodeHeight }, 
                    to: { x: positions[2].x + nodeWidth*0.7, y: positions[2].y + nodeHeight*0.4 } 
                  },
                  // Credit Check → Approval Decision (horizontal, right to left)
                  { 
                    from: { x: positions[2].x + nodeWidth, y: positions[2].y + nodeHeight*0.8 }, 
                    to: { x: positions[3].x + nodeWidth*0.2, y: positions[3].y + nodeHeight*0.8 } 
                  },
                  // Approval Decision → Loan Disbursed (diagonal, right to left)
                  { 
                    from: { x: positions[3].x + nodeWidth*1.2, y: positions[3].y + nodeHeight*0.8 }, 
                    to: { x: positions[4].x + nodeWidth*0.2, y: positions[4].y + nodeHeight*0.8 } 
                  },
                ];
                
                return connections.map((connection, index) => {
                  const shouldShow = flowBuildingComplete && completedSteps.length > index;
                  return (
                    <motion.path
                      key={index}
                      d={`M ${connection.from.x} ${connection.from.y} L ${connection.to.x} ${connection.to.y}`}
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: shouldShow ? 1 : 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    />
                  );
                });
              })()}
            </svg>
            
            {/* Flow Nodes - Customer View */}
            <div className="relative" style={{ zIndex: 2 }}>
              {!flowBuildingComplete ? (
                // Show waiting state while flow is being built
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
                    <p className="text-sm">Waiting for flow to be built...</p>
                    <p className="text-xs mt-2 opacity-75">
                      {builtNodes.length}/{demoSteps.length} steps created
                    </p>
                  </div>
                </div>
              ) : (
                // Show actual flow once built
                demoSteps.map((step, index) => {
                  const status = getStepStatus(index);
                  const StepIcon = getStepIcon(index);
                  
                  // Same positions as admin view
                  const positions = [
                    { x: 20, y: 20 },
                    { x: 20, y: 80 },
                    { x: 20, y: 140 },
                    { x: 120, y: 140 },
                    { x: 220, y: 100 },
                  ];
                  
                  const position = positions[index];
                  const isVisible = status === "completed" || status === "in-progress";
                  
                  return (
                    <motion.div
                      key={step.id}
                      className={`absolute w-20 h-12 rounded-lg border-2 bg-background shadow-sm flex flex-col items-center justify-center transition-all duration-300 ${
                        status === "completed" ? "border-green-500 bg-green-50 dark:bg-green-950/30" :
                        status === "in-progress" ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" :
                        "border-gray-200 bg-gray-50 dark:bg-gray-800 opacity-40"
                      }`}
                      style={{
                        left: position.x,
                        top: position.y,
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: isVisible ? 1 : 0.4,
                        scale: status === "in-progress" ? 1.02 : 1,
                      }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {status === "completed" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <motion.div
                          animate={{
                            rotate: status === "in-progress" ? 360 : 0,
                          }}
                          transition={{
                            rotate: { duration: 3, repeat: status === "in-progress" ? Infinity : 0, ease: "linear" }
                          }}
                        >
                          <StepIcon className={`h-4 w-4 ${
                            status === "in-progress" ? "text-blue-500" :
                            "text-gray-400"
                          }`} />
                        </motion.div>
                      )}
                      <span className="text-xs font-medium text-center leading-tight mt-1 px-1">
                        {step.title.split(' ')[0]}
                      </span>
                    </motion.div>
                  );
                })
              )}
            </div>
            
          </div>
          
          {/* Customer Flow Info */}
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Your Application Progress</span>
              <Badge variant="secondary" className="text-xs">
                {!flowBuildingComplete 
                  ? "Setting up..." 
                  : `Step ${Math.max(1, completedSteps.length)} of ${demoSteps.length}`
                }
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {!flowBuildingComplete 
                ? "Your custom flow is being prepared..." 
                : "Track your progress through each step"
              }
            </p>
          </div>
        </Card>

        {/* Notifications Panel */}
        <Card className="p-6 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-orange-500" />
            <h4 className="font-semibold">Live Notifications</h4>
            <Badge variant="outline" className="text-xs">Auto-sent</Badge>
          </div>
          <div className="space-y-3 min-h-[300px]">
            <AnimatePresence>
              {completedSteps.map((stepIndex) => {
                const step = demoSteps[stepIndex];
                return (
                  <motion.div
                    key={`notification-${step.id}`}
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                    className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border-l-4 border-green-500"
                  >
                    <Mail className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-green-800 dark:text-green-200">
                        Notification Sent
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        "Your {step.title.toLowerCase()} has been completed"
                      </p>
                      <p className="text-xs text-green-600 mt-2 font-medium">
                        📧 Email • 📱 SMS • 🔔 In-app
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {completedSteps.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">
                  {!flowBuildingComplete 
                    ? "Notifications will appear once customers use the flow" 
                    : "Ready to send notifications as customer progresses"
                  }
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <div className="mt-8">
        <div className="text-center mb-4">
          <h4 className="font-semibold mb-2">Loan Application Progress</h4>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Customer Journey</span>
            <span className="text-sm text-muted-foreground">
              {completedSteps.length} of {demoSteps.length} steps completed
            </span>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-3 mb-4">
          <motion.div
            className="bg-gradient-to-r from-primary to-blue-600 h-3 rounded-full flex items-center justify-end pr-2"
            animate={{
              width: `${(completedSteps.length / demoSteps.length) * 100}%`
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {completedSteps.length > 0 && (
              <span className="text-xs text-white font-medium">
                {Math.round((completedSteps.length / demoSteps.length) * 100)}%
              </span>
            )}
          </motion.div>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {!flowBuildingComplete 
              ? "First, build your custom flow by adding and connecting steps..."
              : "Now customers can progress through your completed flow with automatic notifications!"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;
