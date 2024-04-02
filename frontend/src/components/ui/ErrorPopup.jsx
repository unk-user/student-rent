import { useActionData } from 'react-router-dom';
import { AnimatePresence, backInOut, motion } from 'framer-motion';

function ErrorPopup() {
  const actionData = useActionData();

  return (
    <AnimatePresence mode="wait">
      {actionData?.error && (
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ ease: backInOut }}
          className="absolute -z-10 -top-12 rounded-md bg-slate-600 w-full text-center p-2"
        >
          {actionData.error}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ErrorPopup;
