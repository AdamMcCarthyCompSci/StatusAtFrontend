import { Link as RouterLink } from "react-router-dom";
import { 
  ArrowRight, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  Clock, 
  CheckCircle,
  Globe,
  Smartphone,
  MessageCircle,
  Headphones,
  Workflow
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useCurrentUser } from "@/hooks/useUserQuery";
import Footer from "../layout/Footer";
import InteractiveDemo from "./InteractiveDemo";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const HomeShell = () => {
  const { data: user, isLoading } = useCurrentUser();
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [demoRef, demoInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [pricingRef, pricingInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <div className="flex-1">
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-6 relative z-10"
        >
          <div className="flex justify-between items-center">
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              StatusAt
            </motion.h1>
            {!user && <ThemeToggle />}
          </div>
        </motion.div>
        
        {/* Hero Section with Gradient Background */}
        <section ref={heroRef} className="relative py-20 lg:py-32 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5"></div>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-5xl mx-auto text-center space-y-8"
              variants={staggerContainer}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
            >
              <motion.div variants={fadeInUp} className="space-y-6">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                  Track Status,
                  <br />
                  <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Deliver Results
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Keep your customers informed and your business organized. 
                  No more 'where's my order?' calls - just happy customers who know exactly where they stand.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-6">
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-14 bg-muted rounded-lg w-64 mx-auto"></div>
                  </div>
                ) : user ? (
                  <div className="space-y-4">
                    <p className="text-xl text-foreground">
                      Welcome back, <span className="font-semibold text-primary">{user.name || user.email}</span>!
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button asChild size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300">
                        <RouterLink to="/dashboard">
                          Go to Dashboard
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </RouterLink>
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button asChild size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300">
                          <RouterLink to="/sign-up">
                            Start 7-Day Trial
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </RouterLink>
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button asChild variant="outline" size="lg" className="text-lg px-10 py-7 border-2 hover:bg-muted/50 transition-all duration-300">
                          <RouterLink to="/sign-in">
                            Sign In
                          </RouterLink>
                        </Button>
                      </motion.div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ✨ No credit card required • 14-day free trial • Cancel anytime
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
            >
              {[
                { number: "WhatsApp", label: "& Email Updates", icon: MessageCircle },
                { number: "24/7", label: "Support", icon: Headphones },
                { number: "Custom", label: "Status Flows", icon: Workflow },
                { number: "Same Day", label: "Setup", icon: Clock }
              ].map((stat, index) => (
                <motion.div key={index} variants={scaleIn} className="text-center space-y-2">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section ref={featuresRef} className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-6xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
            >
              <motion.div variants={fadeInUp} className="text-center space-y-4 mb-16">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Everything your business
                  <span className="text-primary"> needs</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Simple tools that help you keep customers happy and your business running smoothly
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: BarChart3,
                    title: "Track Your Business",
                    description: "See exactly where your customers are in their journey. Know what's working and what needs attention.",
                    gradient: "from-blue-500 to-cyan-500"
                  },
                  {
                    icon: Users,
                    title: "Keep Your Team Aligned",
                    description: "Everyone knows who's handling what. No more confusion about customer status or next steps.",
                    gradient: "from-purple-500 to-pink-500"
                  },
                  {
                    icon: Zap,
                    title: "Save Time Every Day",
                    description: "Stop the constant WhatsApp messages and emails asking 'what's my status?'. Customers see their progress automatically.",
                    gradient: "from-yellow-500 to-orange-500"
                  },
                  {
                    icon: Shield,
                    title: "Keep Customer Data Safe",
                    description: "Your customer information is protected with the same security standards used by banks and financial institutions.",
                    gradient: "from-green-500 to-emerald-500"
                  },
                  {
                    icon: Smartphone,
                    title: "Work From Anywhere",
                    description: "Update customer statuses from your phone, tablet, or computer. Perfect for busy business owners on the go.",
                    gradient: "from-indigo-500 to-blue-500"
                  },
                  {
                    icon: Globe,
                    title: "Grows With Your Business",
                    description: "Whether you have 10 customers or 10,000, StatusAt scales with your business without breaking the bank.",
                    gradient: "from-red-500 to-pink-500"
                  }
                ].map((feature, index) => (
                  <motion.div key={index} variants={scaleIn}>
                    <Card className="p-8 h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/30 group hover:scale-105">
                      <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section ref={demoRef} className="py-20 lg:py-32 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-6xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              animate={demoInView ? "visible" : "hidden"}
            >
              <motion.div variants={fadeInUp} className="text-center space-y-4 mb-16">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Experience the <span className="text-primary">power</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  See how StatusAt transforms your workflow with real-time tracking and seamless automation
                </p>
              </motion.div>

              <motion.div variants={scaleIn}>
                <InteractiveDemo />
              </motion.div>
            </motion.div>
          </div>
        </section>


        {/* Pricing Section */}
        <section ref={pricingRef} className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-6xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              animate={pricingInView ? "visible" : "hidden"}
            >
              <motion.div variants={fadeInUp} className="text-center space-y-4 mb-16">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Simple, <span className="text-primary">transparent</span> pricing
                </h2>
                <p className="text-xl text-muted-foreground">
                  Choose the plan that's right for your business
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {[
                  {
                    name: "Starter",
                    price: "€49",
                    period: "/month",
                    description: "Perfect for small businesses getting started",
                    features: [
                      "25 active cases",
                      "100 status updates/month",
                      "1 staff user",
                      "statusat.com/YOUR_COMPANY",
                      "Email support (24h response)",
                      "7-day free trial"
                    ],
                    popular: false,
                    trial: "7-day free trial"
                  },
                  {
                    name: "Professional",
                    price: "€99",
                    period: "/month",
                    description: "For growing businesses with more customers",
                    features: [
                      "100 active cases",
                      "500 status updates/month",
                      "5 staff users",
                      "statusat.com/YOUR_COMPANY",
                      "Email support (24h response)",
                      "7-day free trial"
                    ],
                    popular: true,
                    trial: "7-day free trial"
                  },
                  {
                    name: "Enterprise",
                    price: "Contact Us",
                    period: "",
                    description: "For established businesses with custom needs",
                    features: [
                      "Unlimited active cases",
                      "Unlimited status updates",
                      "Unlimited staff users",
                      "YOUR_COMPANY.statusat.com",
                      "Brand colors & logo upload",
                      "Dedicated account manager"
                    ],
                    popular: false,
                    trial: "Custom demo"
                  }
                ].map((plan, index) => (
                  <motion.div key={index} variants={scaleIn}>
                    <Card className={`p-8 h-full relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                      plan.popular 
                        ? 'border-primary shadow-xl bg-gradient-to-b from-primary/5 to-background' 
                        : 'border-border hover:shadow-lg'
                    }`}>
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                          Most Popular
                        </div>
                      )}
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <div className="mb-2">
                          <span className="text-4xl font-bold">{plan.price}</span>
                          <span className="text-muted-foreground">{plan.period}</span>
                        </div>
                        <p className="text-muted-foreground">{plan.description}</p>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, featureIndex) => {
                          const isDomain = feature.includes('.com') || feature.includes('statusat.com');
                          return (
                            <li key={featureIndex} className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                              {isDomain ? (
                                <span className="font-mono text-sm bg-muted/50 px-2 py-1 rounded border">
                                  {feature}
                                </span>
                              ) : (
                                <span>{feature}</span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                      <Button 
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90' 
                            : ''
                        }`}
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        {plan.name === 'Enterprise' ? 'Get Custom Demo' : 'Start 7-Day Trial'}
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

      </div>
      
      <Footer />
    </div>
  );
};

export default HomeShell;
