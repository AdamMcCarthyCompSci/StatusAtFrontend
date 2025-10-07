import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const InteractiveDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const demoSteps = [
    {
      id: 1,
      title: "Order Received",
      description: "New customer order #12345 has been received",
      status: "completed",
      timestamp: "2 minutes ago",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      id: 2,
      title: "Payment Processing",
      description: "Payment verification in progress",
      status: "in-progress",
      timestamp: "1 minute ago",
      icon: Clock,
      color: "text-blue-500"
    },
    {
      id: 3,
      title: "Inventory Check",
      description: "Checking product availability",
      status: "pending",
      timestamp: "Just now",
      icon: AlertCircle,
      color: "text-yellow-500"
    },
    {
      id: 4,
      title: "Order Fulfillment",
      description: "Preparing order for shipment",
      status: "pending",
      timestamp: "Pending",
      icon: Clock,
      color: "text-gray-400"
    },
    {
      id: 5,
      title: "Shipped",
      description: "Order shipped to customer",
      status: "pending",
      timestamp: "Pending",
      icon: Clock,
      color: "text-gray-400"
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentStep < demoSteps.length) {
      interval = setInterval(() => {
        setCompletedSteps(prev => {
          const newCompleted = [...prev, currentStep];
          return newCompleted;
        });
        setCurrentStep(prev => prev + 1);
      }, 2000);
    } else if (currentStep >= demoSteps.length) {
      setIsPlaying(false);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, demoSteps.length]);

  const handlePlay = () => {
    if (currentStep >= demoSteps.length) {
      // Reset demo
      setCurrentStep(0);
      setCompletedSteps([]);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setCompletedSteps([]);
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

  const getStepColor = (index: number) => {
    const status = getStepStatus(index);
    if (status === "completed") return "text-green-500";
    if (status === "in-progress") return "text-blue-500";
    return "text-gray-400";
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-4">See StatusAt in Action</h3>
        <p className="text-muted-foreground mb-6">
          Watch how StatusAt tracks a customer order through your workflow in real-time
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={handlePlay} className="flex items-center gap-2">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? "Pause Demo" : currentStep >= demoSteps.length ? "Restart Demo" : "Start Demo"}
          </Button>
          <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Flow Visualization */}
        <Card className="p-6 h-fit">
          <h4 className="font-semibold mb-4">Workflow Progress</h4>
          <div className="space-y-4">
            {demoSteps.map((step, index) => {
              const StepIcon = getStepIcon(index);
              const stepColor = getStepColor(index);
              const status = getStepStatus(index);
              
              return (
                <motion.div
                  key={step.id}
                  className="flex items-center gap-4 p-3 rounded-lg transition-all duration-300"
                  animate={{
                    backgroundColor: status === "in-progress" ? "rgba(59, 130, 246, 0.1)" : "transparent"
                  }}
                >
                  <motion.div
                    animate={{
                      scale: status === "in-progress" ? 1.1 : 1,
                      rotate: status === "in-progress" ? 360 : 0
                    }}
                    transition={{
                      rotate: { duration: 2, repeat: status === "in-progress" ? Infinity : 0, ease: "linear" }
                    }}
                  >
                    <StepIcon className={`h-6 w-6 ${stepColor}`} />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h5 className="font-medium text-sm">{step.title}</h5>
                      <AnimatePresence>
                        {status === "completed" && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                          >
                            <Badge variant="secondary" className="text-xs">
                              Complete
                            </Badge>
                          </motion.div>
                        )}
                        {status === "in-progress" && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                          >
                            <Badge className="text-xs">
                              Processing...
                            </Badge>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground flex-shrink-0">
                    {status === "completed" ? "✓ Done" : 
                     status === "in-progress" ? "Processing..." : 
                     "Pending"}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Real-time Updates */}
        <Card className="p-6 h-fit">
          <h4 className="font-semibold mb-4">Live Activity Feed</h4>
          <div className="space-y-3 min-h-[300px]">
            <AnimatePresence>
              {completedSteps.map((stepIndex) => {
                const step = demoSteps[stepIndex];
                return (
                  <motion.div
                    key={`activity-${step.id}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border-l-4 border-green-500"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
                      <p className="text-xs text-green-600 mt-2 font-medium">✓ Completed just now</p>
                    </div>
                  </motion.div>
                );
              })}
              {currentStep < demoSteps.length && isPlaying && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-l-4 border-blue-500"
                >
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0 animate-spin" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{demoSteps[currentStep].title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{demoSteps[currentStep].description}</p>
                    <p className="text-xs text-blue-600 mt-2 font-medium">⏳ Processing...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {!isPlaying && completedSteps.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Click "Start Demo" to see live updates</p>
                <p className="text-xs mt-2 opacity-75">Watch as each step completes in real-time</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Demo Progress</span>
          <span className="text-sm text-muted-foreground">
            {completedSteps.length} of {demoSteps.length} steps completed
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full"
            animate={{
              width: `${(completedSteps.length / demoSteps.length) * 100}%`
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;
