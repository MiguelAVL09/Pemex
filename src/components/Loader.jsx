import { motion } from 'framer-motion';

export default function Loader() {
    return (
        <motion.div
            className="loader-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="spinner"></div>
        </motion.div>
    );
}