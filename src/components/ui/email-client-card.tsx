import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ShadCN UI Primitives
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const cardVariants = cva(
  'w-full max-w-5xl mx-auto rounded-xl border border-white/10 bg-black/80 backdrop-blur-md text-white shadow-2xl flex flex-col transition-colors min-h-[300px]',
  {
    variants: {
      isExpanded: {
        true: 'h-auto',
        false: 'h-auto', // Placeholder for potential collapsed styles
      },
    },
    defaultVariants: {
      isExpanded: true,
    },
  },
);

export interface EmailClientCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  avatarSrc: string;
  avatarFallback: string;
  senderName: string;
  senderEmail: string;
  timestamp: string;
  message: string;
  actions?: React.ReactNode[];
  reactions?: string[];
  onReactionClick?: (reaction: string) => void;
  onActionClick?: (index: number) => void;
}

const EmailClientCard = React.forwardRef<HTMLDivElement, EmailClientCardProps>(
  (
    {
      className,
      avatarSrc,
      avatarFallback,
      senderName,
      senderEmail,
      timestamp,
      message,
      actions = [],
      reactions = [],
      onReactionClick,
      onActionClick,
      isExpanded,
      ...props
    },
    ref,
  ) => {
    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          staggerChildren: 0.05,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(cardVariants({ isExpanded }), className)}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onClick={props.onClick}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        style={props.style}
      >
        {/* Card Header */}
        <motion.div
          className="p-6 sm:p-8 flex items-start gap-4 border-b border-white/20"
          variants={itemVariants}
        >
          <Avatar className="w-12 h-12 border border-orange-500/50">
            <AvatarImage src={avatarSrc} alt={senderName} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <p className="font-semibold text-white text-lg">{senderName}</p>
            <p className="text-sm text-gray-400">{senderEmail}</p>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <span className="text-sm hidden sm:inline">{timestamp}</span>
            {actions.map((action, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 text-gray-300 hover:text-white hover:bg-white/10"
                  onClick={() => onActionClick?.(index)}
                  aria-label={`Action ${index + 1}`}
                >
                  {action}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Card Body */}
        <motion.div
          className="p-6 sm:p-8 text-base text-gray-200 leading-relaxed flex-grow"
          variants={itemVariants}
        >
          <p className="font-mono">{message}</p>
        </motion.div>

        {/* Card Footer with Reactions */}
        <motion.div
          className="p-4 sm:p-6 mt-auto border-t border-white/20 bg-black/40"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2 justify-center">
            {reactions.map((reaction, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 text-2xl hover:bg-white/10"
                  onClick={() => onReactionClick?.(reaction)}
                  aria-label={`React with ${reaction}`}
                >
                  {reaction}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  },
);

EmailClientCard.displayName = 'EmailClientCard';

export { EmailClientCard, cardVariants };
