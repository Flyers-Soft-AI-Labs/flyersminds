import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function Background() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Define colors based on theme
    // Dark mode: Deep space colors (cyan, purple, blue)
    // Light mode: Soft pastels (cyan, blue, purple) but very light/subtle
    const colors = theme === 'dark'
        ? ['#06b6d4', '#7c3aed', '#2563eb'] // Cyan-500, Purple-600, Blue-600
        : ['#a5f3fc', '#ddd6fe', '#bfdbfe']; // Cyan-200, Violet-200, Blue-200

    // Animation variants for the orbs - Increased intensity
    const orbVariants = {
        animate: (i) => ({
            x: [0, Math.random() * 600 - 300, Math.random() * 600 - 300, 0],
            y: [0, Math.random() * 600 - 300, Math.random() * 600 - 300, 0],
            scale: [1, 1.5, 0.8, 1.2, 1],
            opacity: theme === 'dark' ? [0.4, 0.7, 0.4] : [0.5, 0.8, 0.5],
            transition: {
                // Faster duration for more noticeable movement
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1,
            },
        }),
    };

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
            {/* Base Background Color */}
            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-500" />

            {/* Mesh Gradient Overlay */}
            <div
                className="absolute inset-0 opacity-40 dark:opacity-20"
                style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, ${theme === 'dark' ? '#1e293b' : '#e2e8f0'} 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Animated Orbs */}
            <motion.div
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
                style={{ backgroundColor: colors[0] }}
                custom={0}
                variants={orbVariants}
                animate="animate"
            />

            <motion.div
                className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
                style={{ backgroundColor: colors[1] }}
                custom={1}
                variants={orbVariants}
                animate="animate"
            />

            <motion.div
                className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
                style={{ backgroundColor: colors[2] }}
                custom={2}
                variants={orbVariants}
                animate="animate"
            />

            {/* Vignette Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50/80 via-transparent to-slate-50/80 dark:from-slate-950/80 dark:via-transparent dark:to-slate-950/80 pointer-events-none" />
        </div>
    );
}
