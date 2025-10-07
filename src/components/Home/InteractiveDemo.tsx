import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle, Clock, AlertCircle, User, UserCheck, Bell, Mail, Settings } from "lucide-react";
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
      title: "Application Submitted",
      description: "Customer Sarah Chen submitted loan application",
      status: "completed",
      timestamp: "2 minutes ago",
      icon: CheckCircle,
      color: "text-green-500",
      customerAction: true
    },
    {
      id: 2,
      title: "Document Review",
      description: "Admin reviewing submitted documents",
      status: "in-progress",
      timestamp: "1 minute ago",
      icon: Clock,
      color: "text-blue-500",
      customerAction: false
    },
    {
      id: 3,
      title: "Credit Check",
      description: "Running background credit verification",
      status: "pending",
      timestamp: "Just now",
      icon: AlertCircle,
      color: "text-yellow-500",
      customerAction: false
    },
    {
      id: 4,
      title: "Approval Decision",
      description: "Final approval decision and terms",
      status: "pending",
      timestamp: "Pending",
      icon: Clock,
      color: "text-gray-400",
      customerAction: false
    },
    {
      id: 5,
      title: "Loan Disbursed",
      description: "Funds transferred to customer account",
      status: "pending",
      timestamp: "Pending",
      icon: Clock,
      color: "text-gray-400",
      customerAction: false
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
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-4">See StatusAt in Action</h3>
        <p className="text-muted-foreground mb-6">
          Watch how StatusAt enables you to build custom flows, invite customers, and advance them through each step with automatic notifications
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Flow Builder View */}
        <Card className="p-6 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Flow Builder</h4>
            <Badge variant="outline" className="text-xs">Admin View</Badge>
          </div>
          <div className="space-y-3">
            {demoSteps.map((step, index) => {
              const StepIcon = getStepIcon(index);
              const stepColor = getStepColor(index);
              const status = getStepStatus(index);
              
              return (
                <motion.div
                  key={step.id}
                  className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-300"
                  animate={{
                    borderColor: status === "in-progress" ? "rgb(59, 130, 246)" : "transparent",
                    backgroundColor: status === "in-progress" ? "rgba(59, 130, 246, 0.05)" : "transparent"
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <motion.div
                      animate={{
                        scale: status === "in-progress" ? 1.1 : 1,
                      }}
                    >
                      <StepIcon className={`h-4 w-4 ${stepColor}`} />
                    </motion.div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-sm">{step.title}</h5>
                      {step.customerAction && (
                        <Badge variant="secondary" className="text-xs">
                          Customer Action
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {status === "in-progress" && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Clock className="h-4 w-4 text-blue-500" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Customer Experience */}
        <Card className="p-6 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-blue-500" />
            <h4 className="font-semibold">Customer View</h4>
            <Badge variant="outline" className="text-xs">Sarah Chen</Badge>
          </div>
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <UserCheck className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Loan Application Status</p>
              <p className="text-xs text-muted-foreground mt-1">Track your application progress</p>
            </div>
            
            <div className="space-y-3">
              {demoSteps.map((step, index) => {
                const status = getStepStatus(index);
                const isVisible = status === "completed" || status === "in-progress";
                
                if (!isVisible) return null;
                
                return (
                  <motion.div
                    key={`customer-${step.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-3 bg-background border rounded-lg"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-blue-500 animate-spin" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {status === "completed" ? "Completed" : "In progress..."}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
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
              {currentStep < demoSteps.length && isPlaying && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-l-4 border-blue-500"
                >
                  <Bell className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-blue-800 dark:text-blue-200">
                      Preparing Notification...
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Step "{demoSteps[currentStep].title}" in progress
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {!isPlaying && completedSteps.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Start demo to see notifications</p>
                <p className="text-xs mt-2 opacity-75">Customers get notified automatically</p>
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
            This demo shows how StatusAt enables you to create custom workflows, 
            automatically advance customers through steps, and send notifications at each stage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;
