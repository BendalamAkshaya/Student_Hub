import { motion } from "framer-motion";
import { Construction } from "lucide-react";

const ComingSoon = ({ title }: { title: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-primary-foreground" />
      </div>
      <h2 className="text-2xl font-bold font-display mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md">
        This module is coming soon. We're building something amazing for you!
      </p>
    </motion.div>
  );
};

export default ComingSoon;
