import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background official-hero-bg border-b">
      <div className="container relative z-10 px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-card/50 text-primary mb-8"
          >
            <span className="text-xs font-semibold tracking-wider uppercase">Institutional Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight mb-6"
          >
            Unified Academic <br /> 
            <span className="text-primary">Management Hub</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A comprehensive ecosystem designed for modern educational institutions. 
            Streamlining attendance, assignments, and campus collaboration in one secure workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:row gap-4 justify-center"
          >
            <Link to="/dashboard">
              <Button size="lg" className="bg-primary text-primary-foreground px-8 h-12 rounded-md shadow-sm hover:bg-primary/90 transition-all">
                Access Dashboard <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 h-12 rounded-md bg-transparent border-border hover:bg-secondary/50">
              Platform Overview
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
