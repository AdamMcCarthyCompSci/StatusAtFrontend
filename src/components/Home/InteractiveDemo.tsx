import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Bell,
  Mail,
  Settings,
  Check,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface InteractiveDemoProps {
  autoStart?: boolean;
}

const InteractiveDemo = ({ autoStart = false }: InteractiveDemoProps) => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [builtNodes, setBuiltNodes] = useState<number[]>([]);
  const [flowBuildingComplete, setFlowBuildingComplete] = useState(false);
  const hasAutoStarted = useRef(false);

  const demoSteps = [
    {
      id: 1,
      title: t('home.demo.demoSteps.applicationSubmission.title'),
      description: t('home.demo.demoSteps.applicationSubmission.description'),
      status: 'completed',
      timestamp: t('home.demo.timestamps.twoMinutesAgo'),
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      id: 2,
      title: t('home.demo.demoSteps.documentReview.title'),
      description: t('home.demo.demoSteps.documentReview.description'),
      status: 'in-progress',
      timestamp: t('home.demo.timestamps.oneMinuteAgo'),
      icon: Clock,
      color: 'text-blue-500',
    },
    {
      id: 3,
      title: t('home.demo.demoSteps.creditCheck.title'),
      description: t('home.demo.demoSteps.creditCheck.description'),
      status: 'pending',
      timestamp: t('home.demo.timestamps.justNow'),
      icon: AlertCircle,
      color: 'text-yellow-500',
    },
    {
      id: 4,
      title: t('home.demo.demoSteps.approvalDecision.title'),
      description: t('home.demo.demoSteps.approvalDecision.description'),
      status: 'pending',
      timestamp: t('home.demo.timestamps.pending'),
      icon: Clock,
      color: 'text-gray-400',
    },
    {
      id: 5,
      title: t('home.demo.demoSteps.loanDisbursed.title'),
      description: t('home.demo.demoSteps.loanDisbursed.description'),
      status: 'pending',
      timestamp: t('home.demo.timestamps.pending'),
      icon: Clock,
      color: 'text-gray-400',
    },
  ];

  // Auto-start demo when it scrolls into view
  useEffect(() => {
    if (autoStart && !hasAutoStarted.current && !isPlaying) {
      hasAutoStarted.current = true;
      setIsPlaying(true);
    }
  }, [autoStart, isPlaying]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isPlaying) {
      // Phase 1: Build the flow (create nodes one by one)
      if (builtNodes.length < demoSteps.length) {
        interval = setInterval(() => {
          setBuiltNodes(prev => [...prev, prev.length]);
        }, 1000);
      }
      // Phase 2: Flow building complete, admin starts advancing customers
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
  }, [
    isPlaying,
    builtNodes.length,
    flowBuildingComplete,
    currentStep,
    demoSteps.length,
  ]);

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
    if (completedSteps.includes(index)) return 'completed';
    if (index === currentStep && isPlaying) return 'in-progress';
    return 'pending';
  };

  const getStepIcon = (index: number) => {
    const status = getStepStatus(index);
    if (status === 'completed') return CheckCircle;
    if (status === 'in-progress') return Clock;
    return AlertCircle;
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 text-center">
        <h3 className="mb-4 text-2xl font-bold">
          {t('home.demo.seeInAction')}
        </h3>
        <p className="mb-6 text-muted-foreground">{t('home.demo.watchHow')}</p>
        <div className="flex justify-center gap-4">
          <Button onClick={handlePlay} className="flex items-center gap-2">
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isPlaying
              ? t('home.demo.pauseDemo')
              : currentStep >= demoSteps.length
                ? t('home.demo.restartDemo')
                : t('home.demo.startDemo')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Flow Builder View */}
        <Card className="h-fit p-6">
          <div className="mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">{t('home.demo.adminFlowBuilder')}</h4>
            <Badge variant="outline" className="text-xs">
              {!flowBuildingComplete
                ? t('home.demo.building')
                : t('home.demo.complete')}
            </Badge>
          </div>

          {/* Visual Flow Canvas */}
          <div className="relative h-80 overflow-x-auto overflow-y-hidden rounded-lg bg-muted/20">
            <div className="relative h-full w-[320px] p-4 md:w-auto">
              {/* Grid Background - Dots */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle, #9ca3af 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* SVG for connections */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                style={{ zIndex: 1 }}
              >
                {/* Connection lines between nodes - appear after nodes are built */}
                {(() => {
                  // Node positions and dimensions
                  const nodeWidth = 80;
                  const nodeHeight = 48;
                  const positions = [
                    { x: 20, y: 20 }, // Application Submitted
                    { x: 20, y: 80 }, // Document Review
                    { x: 20, y: 140 }, // Credit Check
                    { x: 120, y: 140 }, // Approval Decision
                    { x: 220, y: 100 }, // Loan Disbursed
                  ];

                  // Calculate connection points between nodes
                  const connections = [
                    // Application → Document Review (vertical, bottom to top)
                    {
                      from: {
                        x: positions[0].x + nodeWidth * 0.7,
                        y: positions[0].y + nodeHeight * 1.3,
                      },
                      to: {
                        x: positions[1].x + nodeWidth * 0.7,
                        y: positions[1].y + nodeHeight * 0.35,
                      },
                    },
                    // Document Review → Credit Check (vertical, bottom to top)
                    {
                      from: {
                        x: positions[1].x + nodeWidth * 0.7,
                        y: positions[1].y + nodeHeight * 1.3,
                      },
                      to: {
                        x: positions[2].x + nodeWidth * 0.7,
                        y: positions[2].y + nodeHeight * 0.35,
                      },
                    },
                    // Credit Check → Approval Decision (horizontal, right to left)
                    {
                      from: {
                        x: positions[2].x + nodeWidth * 1.2,
                        y: positions[2].y + nodeHeight * 0.8,
                      },
                      to: {
                        x: positions[3].x + nodeWidth * 0.2,
                        y: positions[3].y + nodeHeight * 0.8,
                      },
                    },
                    // Approval Decision → Loan Disbursed (diagonal, right to left)
                    {
                      from: {
                        x: positions[3].x + nodeWidth * 1.2,
                        y: positions[3].y + nodeHeight * 0.8,
                      },
                      to: {
                        x: positions[4].x + nodeWidth * 0.2,
                        y: positions[4].y + nodeHeight * 0.8,
                      },
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
                    { x: 20, y: 20 }, // Application Submitted
                    { x: 20, y: 80 }, // Document Review
                    { x: 20, y: 140 }, // Credit Check
                    { x: 120, y: 140 }, // Approval Decision
                    { x: 220, y: 100 }, // Loan Disbursed
                  ];

                  const position = positions[index];

                  if (!isBuilt) return null;

                  return (
                    <motion.div
                      key={step.id}
                      className="absolute flex h-12 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-blue-500 bg-background bg-blue-50 shadow-sm dark:bg-blue-950/30"
                      style={{
                        left: position.x,
                        top: position.y,
                      }}
                      initial={{
                        scale: 0,
                        opacity: 0,
                        x: 150, // Start from center-right (like dragging from toolbar)
                        y: 50,
                      }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        x: 0,
                        y: 0,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 20,
                        duration: 0.8,
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="px-1 text-center text-xs font-medium leading-tight text-blue-700 dark:text-blue-300">
                        {step.title.split(' ')[0]}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Flow Info */}
          <div className="mt-4 rounded-lg bg-muted/30 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {t('home.demo.customStatusFlow')}
              </span>
              <Badge variant="secondary" className="text-xs">
                {t('home.demo.nodesBuilt', {
                  count: builtNodes.length,
                  total: demoSteps.length,
                })}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {!flowBuildingComplete
                ? t('home.demo.adminBuilding')
                : t('home.demo.flowReady')}
            </p>
            <p className="mt-2 text-xs text-muted-foreground opacity-75">
              {t('home.demo.adminsCanCreate')}
            </p>
          </div>
        </Card>

        {/* Customer Flow Viewer */}
        <Card className="h-fit p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            <h4 className="font-semibold">
              {t('home.demo.customerFlowViewer')}
            </h4>
            <Badge variant="outline" className="text-xs">
              {!flowBuildingComplete
                ? t('home.demo.waiting')
                : t('home.demo.active')}
            </Badge>
          </div>

          {/* Customer's Visual Flow Canvas */}
          <div className="relative h-80 overflow-x-auto overflow-y-hidden rounded-lg bg-muted/20">
            <div className="relative h-full w-[320px] p-4 md:w-auto">
              {/* Grid Background - Dots */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle, #9ca3af 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* SVG for connections */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                style={{ zIndex: 1 }}
              >
                {/* Connection lines - same positions but grayed out for customer */}
                {(() => {
                  // Same node positions and dimensions as admin view
                  const nodeWidth = 80;
                  const nodeHeight = 48;
                  const positions = [
                    { x: 20, y: 20 }, // Application Submitted
                    { x: 20, y: 80 }, // Document Review
                    { x: 20, y: 140 }, // Credit Check
                    { x: 120, y: 140 }, // Approval Decision
                    { x: 220, y: 100 }, // Loan Disbursed
                  ];

                  // Calculate connection points between nodes
                  const connections = [
                    // Application → Document Review (vertical, bottom to top)
                    // Application → Document Review (vertical, bottom to top)
                    {
                      from: {
                        x: positions[0].x + nodeWidth * 0.7,
                        y: positions[0].y + nodeHeight * 1.3,
                      },
                      to: {
                        x: positions[1].x + nodeWidth * 0.7,
                        y: positions[1].y + nodeHeight * 0.35,
                      },
                    },
                    // Document Review → Credit Check (vertical, bottom to top)
                    {
                      from: {
                        x: positions[1].x + nodeWidth * 0.7,
                        y: positions[1].y + nodeHeight * 1.3,
                      },
                      to: {
                        x: positions[2].x + nodeWidth * 0.7,
                        y: positions[2].y + nodeHeight * 0.35,
                      },
                    },
                    // Credit Check → Approval Decision (horizontal, right to left)
                    {
                      from: {
                        x: positions[2].x + nodeWidth * 1.2,
                        y: positions[2].y + nodeHeight * 0.8,
                      },
                      to: {
                        x: positions[3].x + nodeWidth * 0.2,
                        y: positions[3].y + nodeHeight * 0.8,
                      },
                    },
                    // Approval Decision → Loan Disbursed (diagonal, right to left)
                    {
                      from: {
                        x: positions[3].x + nodeWidth * 1.2,
                        y: positions[3].y + nodeHeight * 0.8,
                      },
                      to: {
                        x: positions[4].x + nodeWidth * 0.2,
                        y: positions[4].y + nodeHeight * 0.8,
                      },
                    },
                  ];

                  return connections.map((connection, index) => {
                    const shouldShow =
                      flowBuildingComplete && completedSteps.length > index;
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
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Clock className="mx-auto mb-4 h-12 w-12 animate-pulse opacity-50" />
                      <p className="text-sm">
                        {t('home.demo.waitingForAdmin')}
                      </p>
                      <p className="mt-2 text-xs opacity-75">
                        {t('home.demo.statusStepsCreated', {
                          count: builtNodes.length,
                          total: demoSteps.length,
                        })}
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
                    const isVisible =
                      status === 'completed' || status === 'in-progress';

                    return (
                      <motion.div
                        key={step.id}
                        className={`absolute flex h-12 w-20 flex-col items-center justify-center rounded-lg border-2 bg-background shadow-sm transition-all duration-300 ${
                          status === 'completed'
                            ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                            : status === 'in-progress'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                              : 'border-gray-200 bg-gray-50 opacity-40 dark:bg-gray-800'
                        }`}
                        style={{
                          left: position.x,
                          top: position.y,
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: isVisible ? 1 : 0.4,
                          scale: status === 'in-progress' ? 1.02 : 1,
                        }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {status === 'completed' ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <motion.div
                            animate={{
                              rotate: status === 'in-progress' ? 360 : 0,
                            }}
                            transition={{
                              rotate: {
                                duration: 3,
                                repeat: status === 'in-progress' ? Infinity : 0,
                                ease: 'linear',
                              },
                            }}
                          >
                            <StepIcon
                              className={`h-4 w-4 ${
                                status === 'in-progress'
                                  ? 'text-blue-500'
                                  : 'text-gray-400'
                              }`}
                            />
                          </motion.div>
                        )}
                        <span className="mt-1 px-1 text-center text-xs font-medium leading-tight">
                          {step.title.split(' ')[0]}
                        </span>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Customer Flow Info */}
          <div className="mt-4 rounded-lg bg-muted/30 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{t('home.demo.yourProgress')}</span>
              <Badge variant="secondary" className="text-xs">
                {!flowBuildingComplete
                  ? t('home.demo.settingUp')
                  : t('home.demo.stepCount', {
                      current: Math.max(1, completedSteps.length),
                      total: demoSteps.length,
                    })}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {!flowBuildingComplete
                ? t('home.demo.customFlowPreparing')
                : t('home.demo.trackProgress')}
            </p>
          </div>
        </Card>

        {/* Notifications Panel */}
        <Card className="h-fit p-6">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" />
            <h4 className="font-semibold">
              {t('home.demo.liveNotifications')}
            </h4>
            <Badge variant="outline" className="text-xs">
              {t('home.demo.autoSent')}
            </Badge>
          </div>
          <div className="min-h-[300px] space-y-3">
            <AnimatePresence>
              {completedSteps.map(stepIndex => {
                const step = demoSteps[stepIndex];
                return (
                  <motion.div
                    key={`notification-${step.id}`}
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                    className="flex items-start gap-3 rounded-lg border-l-4 border-green-500 bg-green-50 p-4 dark:bg-green-950/30"
                  >
                    <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        {t('home.demo.notificationSent')}
                      </p>
                      <p className="mt-1 text-xs text-green-700 dark:text-green-300">
                        "
                        {t('home.demo.completedMessage', {
                          title: step.title.toLowerCase(),
                        })}
                        "
                      </p>
                      <p className="mt-2 text-xs font-medium text-green-600">
                        {t('home.demo.channels')}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {completedSteps.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <Bell className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p className="text-sm">
                  {!flowBuildingComplete
                    ? t('home.demo.notificationsWillAppear')
                    : t('home.demo.readyToSend')}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <div className="mt-8">
        <div className="mb-4 text-center">
          <h4 className="mb-2 font-semibold">{t('home.demo.loanProgress')}</h4>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">
              {t('home.demo.customerJourney')}
            </span>
            <span className="text-sm text-muted-foreground">
              {t('home.demo.stepsCompleted', {
                count: completedSteps.length,
                total: demoSteps.length,
              })}
            </span>
          </div>
        </div>
        <div className="mb-4 h-6 w-full rounded-full bg-muted">
          <motion.div
            className="flex h-6 items-center justify-end rounded-full bg-gradient-to-r from-primary to-blue-600 pr-2"
            animate={{
              width: `${(completedSteps.length / demoSteps.length) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {completedSteps.length > 0 && (
              <span className="text-xs font-medium text-white">
                {Math.round((completedSteps.length / demoSteps.length) * 100)}%
              </span>
            )}
          </motion.div>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {!flowBuildingComplete
              ? t('home.demo.firstBuild')
              : t('home.demo.nowAdvance')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;
