import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  text: string;
  isVisible: boolean;
}

const Tooltip = ({ text, isVisible }: TooltipProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded shadow-lg whitespace-nowrap z-50"
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Tooltip;