import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pizza, ChevronDown, ThumbsUp, ThumbsDown, MessageCircle, Trophy, Send, X } from 'lucide-react';
import { GLSLHills } from '@/components/ui/glsl-hills';
import { EmailClientCard } from '@/components/ui/email-client-card';
import {
  listenToConfessions,
  addConfession,
  updateConfessionVotes,
  addReplyToConfession,
  addNestedReply,
  getUserPizzaTokens,
  updateUserPizzaTokens,
  getUserVotes,
  updateUserVote,
  getUserId,
  calculateEngagementRewards,
} from '@/lib/firestore';
import type { Confession, Reply } from '@/lib/firestore';

const TEAMS = [
  'My Pen Is Long',
  'Thousand Monkeys Thousand Typewriters',
  'Wrapsynth',
  'Bebop',
  'Golti Bros',
  'KUBI Sigma Males',
  'PizzaBlitz',
  'Sergei Chain.Love',
  'MarcoPolo',
  'moonmono',
  'Arrive',
  'Trust Me Bro',
  'Tharun Ekambaram',
  'CPL',
  'EthKiller',
  'Pizza Rush',
  'sexy',
  '$BLUFF',
  'BuzzBallz Enjoyers',
  'DVB HyperStream',
  'The Last Slice',
  'Solo',
  'Formula Zero',
  'upsilon',
  'Team Boston',
  'Friday',
  'Mace',
  'Spaceman',
  'Agentic Builder',
  'pinnacle echelon',
  'axiom',
  'BabyShark',
  'nadchad',
];

const DEMO_PIZZA_ADDRESS = '0x1234...5678';

const PizzaSliceIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="currentColor"
  >
    <path d="M50 50 L50 10 A40 40 0 0 1 78.28 28.28 Z" fill="#FFA500" />
    <circle cx="60" cy="25" r="3" fill="#FF0000" />
    <circle cx="70" cy="35" r="3" fill="#FF0000" />
    <circle cx="58" cy="35" r="2.5" fill="#FFFF00" />
    <path d="M50 50 L50 10 A40 40 0 0 1 78.28 28.28 Z" fill="none" stroke="#D2691E" strokeWidth="2" />
  </svg>
);

// Reply Thread Component
const ReplyThread: React.FC<{
  reply: Reply;
  parentId: string;
  onReply: (parentId: string, replyId: string, text: string) => void;
  depth?: number;
}> = ({ reply, parentId, onReply, depth = 0 }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(parentId, reply.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`mt-3 pl-6 border-l-4 border-orange-500/50 ${depth > 3 ? 'text-xs' : 'text-sm'}`}
      style={{
        borderLeftColor: `rgba(249, 115, 22, ${Math.max(0.5 - depth * 0.1, 0.2)})`,
      }}
    >
      <div className="bg-gradient-to-r from-orange-500/10 to-transparent backdrop-blur-sm rounded-lg p-3 border border-orange-500/20 relative">
        {/* Connection line to parent */}
        <div className="absolute -left-6 top-1/2 w-4 h-0.5 bg-orange-500/50" />
        
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center border border-orange-500/40">
            <MessageCircle className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex-1">
            <p className="text-gray-200 mb-2">{reply.text}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{new Date(reply.timestamp).toLocaleTimeString()}</span>
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="flex items-center gap-1 hover:text-orange-400 transition-colors"
              >
                <MessageCircle className="w-3 h-3" />
                Reply Back
              </button>
            </div>
          </div>
        </div>

        {showReplyInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 flex gap-2"
          >
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="flex-1 bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              onKeyDown={(e) => e.key === 'Enter' && handleReply()}
            />
            <button
              onClick={handleReply}
              className="px-3 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

      {reply.replies.map((nestedReply) => (
        <ReplyThread
          key={nestedReply.id}
          reply={nestedReply}
          parentId={reply.id}
          onReply={onReply}
          depth={depth + 1}
        />
      ))}
    </motion.div>
  );
};

// Confession Card Component using EmailClientCard
const ConfessionCard: React.FC<{
  confession: Confession;
  onVote: (id: string, voteType: 'up' | 'down') => void;
  onReply: (confessionId: string, replyId: string | null, text: string) => void;
}> = ({ confession, onVote, onReply }) => {
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(confession.id, null, replyText);
      setReplyText('');
    }
  };

  const handleReaction = (reaction: string) => {
    // Map reactions to votes
    if (reaction === '👍' || reaction === '🔥' || reaction === '❤️') {
      onVote(confession.id, 'up');
    } else if (reaction === '👎') {
      onVote(confession.id, 'down');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <EmailClientCard
        avatarSrc={`https://api.dicebear.com/7.x/avataaars/svg?seed=${confession.id}`}
        avatarFallback="AN"
        senderName="Anonymous Confessor"
        senderEmail="anonymous@confessionslice.app"
        timestamp={new Date(confession.timestamp).toLocaleString()}
        message={confession.text}
        reactions={['👍', '❤️', '🔥', '👎', '😱']}
        onReactionClick={handleReaction}
        actions={[
          <ThumbsUp key="up" className={`w-4 h-4 ${confession.userVote === 'up' ? 'text-green-500' : ''}`} />,
          <ThumbsDown key="down" className={`w-4 h-4 ${confession.userVote === 'down' ? 'text-red-500' : ''}`} />,
        ]}
        onActionClick={(index) => {
          if (index === 0) onVote(confession.id, 'up');
          if (index === 1) onVote(confession.id, 'down');
        }}
        className="mb-4"
      />

      {/* Vote Stats */}
      <div className="flex items-center gap-4 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 mb-4">
        <span className="flex items-center gap-1 text-green-400">
          <ThumbsUp className="w-4 h-4" />
          {confession.upvotes}
        </span>
        <span className="flex items-center gap-1 text-red-400">
          <ThumbsDown className="w-4 h-4" />
          {confession.downvotes}
        </span>
        <span className="flex items-center gap-1 text-orange-400 ml-auto">
          <MessageCircle className="w-4 h-4" />
          {confession.replies.length} Roasts
        </span>
      </div>

      {/* Reply input */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="mt-4 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="🔥 Roast this confession..."
            className="flex-1 bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit()}
          />
          <button
            onClick={handleReplySubmit}
            className="px-4 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Replies Section */}
      {confession.replies.length > 0 && (
        <div className="mt-6 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500/50 via-orange-500/20 to-transparent rounded-full" />
          <div className="pl-4">
            <div className="text-sm text-orange-400 font-medium mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              {confession.replies.length} Roast{confession.replies.length !== 1 ? 's' : ''}
            </div>
            <div className="space-y-2">
              {confession.replies.map((reply) => (
                <ReplyThread
                  key={reply.id}
                  reply={reply}
                  parentId={confession.id}
                  onReply={onReply}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const DynamicPizzaBackground = () => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showConfessionPlatform, setShowConfessionPlatform] = useState(false);
  const [pizzaTokens, setPizzaTokens] = useState(() => getUserPizzaTokens());
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [newConfession, setNewConfession] = useState('');
  const [showWallOfFame, setShowWallOfFame] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>(() => getUserVotes());
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [userId] = useState(() => getUserId());
  const [engagementBonus, setEngagementBonus] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Real-time Firestore listener
  useEffect(() => {
    console.log('🔥 Connecting to Firebase Firestore...');
    const unsubscribe = listenToConfessions((newConfessions) => {
      console.log(`✅ Received ${newConfessions.length} confessions from Firestore`);
      setIsFirebaseConnected(true);
      
      // Apply user votes to confessions
      const confessionsWithVotes = newConfessions.map(confession => ({
        ...confession,
        userVote: userVotes[confession.id] || null,
      }));
      setConfessions(confessionsWithVotes);
      
      // Calculate engagement rewards for top authors
      const rewards = calculateEngagementRewards(newConfessions);
      const myReward = rewards.get(userId) || 0;
      setEngagementBonus(myReward);
      
      if (myReward > 0) {
        console.log(`🎉 Engagement bonus: +${myReward} pizza tokens!`);
      }
    });

    return () => {
      console.log('🔌 Disconnecting from Firestore');
      unsubscribe();
    };
  }, [userVotes, userId]);

  // Update pizza tokens in localStorage when changed
  useEffect(() => {
    updateUserPizzaTokens(pizzaTokens);
  }, [pizzaTokens]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTeam) {
      setShowConfessionPlatform(true);
    }
  };

  const handleSelectTeam = (team: string) => {
    setSelectedTeam(team);
    setIsDropdownOpen(false);
  };

  const handlePostConfession = async () => {
    const totalTokens = pizzaTokens + engagementBonus;
    if (newConfession.trim() && totalTokens > 0) {
      try {
        await addConfession(newConfession, userId);
        setNewConfession('');
        // Deduct from base tokens first
        setPizzaTokens(Math.max(0, pizzaTokens - 1));
      } catch (error) {
        console.error('Failed to post confession:', error);
        alert('Failed to post confession. Please check your Firebase configuration.');
      }
    }
  };

  const handleVote = async (confessionId: string, voteType: 'up' | 'down') => {
    // Check if user already voted
    if (userVotes[confessionId]) {
      return;
    }

    const confession = confessions.find(c => c.id === confessionId);
    if (!confession) return;

    try {
      const newUpvotes = voteType === 'up' ? confession.upvotes + 1 : confession.upvotes;
      const newDownvotes = voteType === 'down' ? confession.downvotes + 1 : confession.downvotes;
      
      await updateConfessionVotes(confessionId, newUpvotes, newDownvotes);
      
      // Update local user votes
      const newVotes = { ...userVotes, [confessionId]: voteType };
      setUserVotes(newVotes);
      updateUserVote(confessionId, voteType);
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleReply = async (confessionId: string, replyId: string | null, text: string) => {
    const confession = confessions.find(c => c.id === confessionId);
    if (!confession) return;

    try {
      if (replyId === null) {
        // Top-level reply
        await addReplyToConfession(confessionId, text, confession.replies);
      } else {
        // Nested reply
        await addNestedReply(confessionId, replyId, text, confession.replies);
      }
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  };

  const getEngagement = (confession: Confession): number => {
    const countReplies = (replies: Reply[]): number => {
      return replies.reduce((acc, reply) => acc + 1 + countReplies(reply.replies), 0);
    };
    return confession.upvotes + confession.downvotes + countReplies(confession.replies);
  };

  // Calculate top authors (users) by total engagement
  const getTopAuthors = () => {
    const authorStats = new Map<string, { engagement: number; confessions: Confession[] }>();
    
    confessions.forEach(confession => {
      if (confession.authorId) {
        const engagement = getEngagement(confession);
        const current = authorStats.get(confession.authorId) || { engagement: 0, confessions: [] };
        authorStats.set(confession.authorId, {
          engagement: current.engagement + engagement,
          confessions: [...current.confessions, confession]
        });
      }
    });

    return Array.from(authorStats.entries())
      .map(([authorId, stats]) => ({ authorId, ...stats }))
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 3);
  };

  const topAuthors = getTopAuthors();
  const rewards = [3, 2, 1]; // Tokens for positions 1, 2, 3

  return (
    <div className="relative w-full min-h-screen overflow-hidden cursor-none bg-black">
      {/* GLSL Hills Background */}
      <div className="absolute inset-0">
        <GLSLHills speed={0.3} />
      </div>

      {/* Custom Pizza Cursor */}
      <motion.div
        className="fixed pointer-events-none z-50"
        animate={{
          x: cursorPosition.x - 20,
          y: cursorPosition.y - 20,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 300,
          mass: 0.5,
        }}
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <PizzaSliceIcon className="w-10 h-10" />
        </motion.div>
      </motion.div>

      {/* Team Selection Screen */}
      <AnimatePresence mode="wait">
        {!showConfessionPlatform ? (
          <motion.div
            key="team-selection"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex items-center justify-center min-h-screen px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="w-full max-w-3xl text-center"
            >
              {/* Pizza Icon */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                className="mb-6 flex justify-center"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <Pizza className="w-12 h-12 text-orange-500" strokeWidth={1} />
                </motion.div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-5xl md:text-7xl mb-4 text-white"
                style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, letterSpacing: '0.02em' }}
              >
                Confession Slice
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-sm md:text-base text-gray-500 mb-20 font-light tracking-wide uppercase"
                style={{ letterSpacing: '0.2em' }}
              >
                Let out your greatest secrets
              </motion.p>

              {/* Team selector dropdown */}
              <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="relative w-full max-w-xl mx-auto"
                >
                  {/* Trigger button */}
                  <motion.button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="w-full flex items-center justify-center gap-2 bg-transparent border-none outline-none text-2xl md:text-4xl text-center text-white pb-4 pt-2 relative z-10 cursor-pointer"
                    style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, letterSpacing: '0.02em' }}
                  >
                    <span className={selectedTeam ? 'text-white' : 'text-gray-500'}>
                      {selectedTeam ?? 'Select your team'}
                    </span>
                    <motion.span
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-8 h-8 text-orange-500/80 shrink-0" />
                    </motion.span>
                  </motion.button>

                  {/* Underline Effect */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent"
                    animate={{
                      scaleX: isDropdownOpen ? 1 : 0.3,
                      opacity: isDropdownOpen ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Glow when dropdown open */}
                  <motion.div
                    className="absolute -inset-x-20 -inset-y-4 bg-orange-500/20 blur-3xl rounded-full pointer-events-none"
                    animate={{
                      opacity: isDropdownOpen ? 0.6 : 0,
                      scale: isDropdownOpen ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Dropdown panel */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 max-h-[min(60vh,320px)] overflow-y-auto rounded-xl bg-black/90 backdrop-blur-md border border-white/10 py-2 z-50 shadow-xl"
                      >
                        {TEAMS.map((team) => (
                          <motion.button
                            key={team}
                            type="button"
                            onClick={() => handleSelectTeam(team)}
                            className="w-full px-4 py-3 text-left text-white/90 hover:bg-white/10 hover:text-white transition-colors text-sm md:text-base font-light"
                            style={{ fontFamily: 'Raleway, sans-serif', letterSpacing: '0.02em' }}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {team}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Proceed button - only when a team is selected */}
                {selectedTeam && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    type="submit"
                    className="mt-12 px-12 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white hover:bg-white hover:text-black transition-all duration-300 text-sm font-light tracking-wider uppercase relative overflow-hidden group"
                    style={{ letterSpacing: '0.15em' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                    <span className="relative z-10">Proceed</span>
                  </motion.button>
                )}
              </form>

              {/* Help Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="mt-16 text-xs text-gray-600 font-light tracking-wider uppercase"
                style={{ letterSpacing: '0.2em' }}
              >
                Select a team to continue
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="confession-platform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 min-h-screen"
          >
            {/* Header */}
            <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/10">
              <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Pizza className="w-8 h-8 text-orange-500" />
                  <h1 className="text-2xl font-light text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
                    Confession Slice
                  </h1>
                </div>

                <div className="flex items-center gap-6">
                  {/* Firebase Connection Status */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${isFirebaseConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-xs text-gray-400">
                      {isFirebaseConnected ? 'Live' : 'Connecting...'}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowWallOfFame(!showWallOfFame)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-colors"
                  >
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-white font-light">Wall of Fame</span>
                  </button>

                  <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-lg">
                    <Pizza className="w-5 h-5 text-orange-500" />
                    <div className="text-left">
                      <div className="text-xs text-gray-400">Pizza Tokens</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-mono text-white font-bold">{pizzaTokens + engagementBonus}</span>
                        {engagementBonus > 0 && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 500 }}
                            className="text-xs font-bold text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full border border-green-400/30"
                          >
                            +{engagementBonus}🔥
                          </motion.span>
                        )}
                      </div>
                      {engagementBonus > 0 && (
                        <div className="text-[10px] text-green-400 mt-0.5">Top engagement bonus!</div>
                      )}
                    </div>
                  </div>

                  <div className="hidden md:block text-xs">
                    <div className="text-gray-500">Demo Address</div>
                    <div className="text-white font-mono">{DEMO_PIZZA_ADDRESS}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
              {/* Post New Confession */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 max-w-5xl mx-auto bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-white/20 shadow-2xl"
              >
                <h2 className="text-xl font-light text-white mb-4" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  Share Your Confession (1 🍕 token)
                </h2>
                <div className="flex gap-3">
                  <textarea
                    value={newConfession}
                    onChange={(e) => setNewConfession(e.target.value)}
                    placeholder="Type your anonymous confession here..."
                    className="flex-1 bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 min-h-[100px] font-mono"
                    disabled={pizzaTokens + engagementBonus === 0}
                  />
                  <button
                    onClick={handlePostConfession}
                    disabled={!newConfession.trim() || pizzaTokens + engagementBonus === 0}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:opacity-50 rounded-lg transition-colors font-light text-white h-fit"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                {pizzaTokens + engagementBonus === 0 && (
                  <p className="text-red-400 text-sm mt-2">You're out of pizza tokens! Get more by creating engaging confessions!</p>
                )}
              </motion.div>

              {/* Wall of Fame Modal */}
              <AnimatePresence>
                {showWallOfFame && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowWallOfFame(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-gradient-to-br from-yellow-900/90 to-orange-900/90 backdrop-blur-md rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto border-2 border-yellow-500/50"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <Trophy className="w-8 h-8 text-yellow-400" />
                          <h2 className="text-3xl font-light text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
                            Wall of Fame
                          </h2>
                        </div>
                        <button
                          onClick={() => setShowWallOfFame(false)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <X className="w-6 h-6 text-white" />
                        </button>
                      </div>

                      <p className="text-gray-300 mb-2">Top authors by total engagement</p>
                      <p className="text-yellow-200 text-sm mb-6">🏆 Rewards: #1 gets 3 🍕 | #2 gets 2 🍕 | #3 gets 1 🍕</p>

                      <div className="space-y-6">
                        {topAuthors.length === 0 ? (
                          <p className="text-gray-400 text-center py-12">No confessions yet. Be the first!</p>
                        ) : (
                          topAuthors.map((author, index) => {
                            const isCurrentUser = author.authorId === userId;
                            const reward = rewards[index];
                            return (
                              <motion.div
                                key={author.authorId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                              >
                                <div className={`absolute -left-4 -top-4 w-14 h-14 rounded-full flex items-center justify-center font-bold text-black text-xl shadow-lg ${
                                  index === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500' :
                                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                                  'bg-gradient-to-br from-orange-400 to-orange-600'
                                }`}>
                                  #{index + 1}
                                </div>
                                <div className={`rounded-lg p-6 border-2 ml-6 ${
                                  isCurrentUser 
                                    ? 'bg-green-900/40 border-green-400/50 shadow-green-500/20 shadow-xl' 
                                    : 'bg-black/40 border-yellow-500/30'
                                }`}>
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex-grow">
                                      <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-white font-semibold text-lg">
                                          {isCurrentUser ? '👑 YOU' : `User ${author.authorId.slice(-8)}`}
                                        </h3>
                                        <motion.div
                                          initial={{ scale: 0, rotate: -180 }}
                                          animate={{ scale: 1, rotate: 0 }}
                                          transition={{ type: 'spring', stiffness: 300 }}
                                          className="bg-orange-500/30 border-2 border-orange-400 rounded-full px-3 py-1 flex items-center gap-1"
                                        >
                                          <Pizza className="w-4 h-4 text-orange-400" />
                                          <span className="text-orange-200 font-bold text-sm">+{reward}</span>
                                        </motion.div>
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-gray-300">
                                        <span className="text-orange-400 font-semibold text-base">
                                          {author.engagement} total engagement
                                        </span>
                                        <span className="text-gray-400">
                                          {author.confessions.length} confession{author.confessions.length !== 1 ? 's' : ''}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Show top confession from this author */}
                                  <div className="mt-4 pt-4 border-t border-white/10">
                                    <p className="text-xs text-gray-400 mb-2">Top confession:</p>
                                    <p className="text-white text-sm font-mono italic">
                                      "{author.confessions.sort((a, b) => getEngagement(b) - getEngagement(a))[0].text.slice(0, 100)}
                                      {author.confessions[0].text.length > 100 ? '...' : ''}"
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confessions Feed */}
              <div className="space-y-6">
                {confessions.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 text-gray-500"
                  >
                    <p className="text-xl font-light">No confessions yet.</p>
                    <p className="text-sm mt-2">Be the first to share your secret!</p>
                  </motion.div>
                ) : (
                  confessions.map((confession) => (
                    <ConfessionCard
                      key={confession.id}
                      confession={confession}
                      onVote={handleVote}
                      onReply={handleReply}
                    />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DynamicPizzaBackground;
