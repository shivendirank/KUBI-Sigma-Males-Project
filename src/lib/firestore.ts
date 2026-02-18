import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';

export interface Reply {
  id: string;
  text: string;
  timestamp: Date;
  replies: Reply[];
}

export interface Confession {
  id: string;
  text: string;
  timestamp: Date;
  upvotes: number;
  downvotes: number;
  replies: Reply[];
  userVote: 'up' | 'down' | null;
  authorId?: string;
}

// Helper to convert Firestore timestamp to Date
const convertTimestamps = (data: DocumentData): any => {
  if (!data) return data;
  
  if (data.timestamp instanceof Timestamp) {
    return {
      ...data,
      timestamp: data.timestamp.toDate(),
      replies: data.replies?.map((reply: any) => convertTimestamps(reply)) || []
    };
  }
  
  if (data.replies) {
    return {
      ...data,
      replies: data.replies.map((reply: any) => convertTimestamps(reply))
    };
  }
  
  return data;
};

// Listen to all confessions in real-time
export const listenToConfessions = (
  callback: (confessions: Confession[]) => void
): (() => void) => {
  const q = query(
    collection(db, 'confessions'),
    orderBy('timestamp', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const confessions: Confession[] = [];
    snapshot.forEach((doc) => {
      const data = convertTimestamps(doc.data());
      confessions.push({
        id: doc.id,
        ...data,
        userVote: null, // User-specific, handle client-side
      } as Confession);
    });
    callback(confessions);
  }, (error) => {
    console.error('Error listening to confessions:', error);
  });

  return unsubscribe;
};

// Add a new confession
export const addConfession = async (text: string, authorId: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'confessions'), {
      text,
      timestamp: serverTimestamp(),
      upvotes: 0,
      downvotes: 0,
      replies: [],
      authorId,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding confession:', error);
    throw error;
  }
};

// Update votes for a confession
export const updateConfessionVotes = async (
  confessionId: string,
  upvotes: number,
  downvotes: number
): Promise<void> => {
  try {
    const confessionRef = doc(db, 'confessions', confessionId);
    await updateDoc(confessionRef, {
      upvotes,
      downvotes,
    });
  } catch (error) {
    console.error('Error updating votes:', error);
    throw error;
  }
};

// Add a reply to a confession
export const addReplyToConfession = async (
  confessionId: string,
  replyText: string,
  currentReplies: Reply[]
): Promise<void> => {
  try {
    const confessionRef = doc(db, 'confessions', confessionId);
    const newReply: Reply = {
      id: Date.now().toString(),
      text: replyText,
      timestamp: new Date(),
      replies: [],
    };
    
    await updateDoc(confessionRef, {
      replies: [newReply, ...currentReplies],
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    throw error;
  }
};

// Add a nested reply
export const addNestedReply = async (
  confessionId: string,
  replyId: string,
  replyText: string,
  currentReplies: Reply[]
): Promise<void> => {
  try {
    const addToNestedReplies = (replies: Reply[]): Reply[] => {
      return replies.map((reply) => {
        if (reply.id === replyId) {
          return {
            ...reply,
            replies: [
              {
                id: Date.now().toString(),
                text: replyText,
                timestamp: new Date(),
                replies: [],
              },
              ...reply.replies,
            ],
          };
        }
        if (reply.replies.length > 0) {
          return {
            ...reply,
            replies: addToNestedReplies(reply.replies),
          };
        }
        return reply;
      });
    };

    const confessionRef = doc(db, 'confessions', confessionId);
    await updateDoc(confessionRef, {
      replies: addToNestedReplies(currentReplies),
    });
  } catch (error) {
    console.error('Error adding nested reply:', error);
    throw error;
  }
};

// Get user's pizza tokens from localStorage (or could be Firestore)
export const getUserPizzaTokens = (): number => {
  const saved = localStorage.getItem('pizzaTokens');
  return saved ? parseInt(saved) : 10;
};

// Update user's pizza tokens
export const updateUserPizzaTokens = (tokens: number): void => {
  localStorage.setItem('pizzaTokens', tokens.toString());
};

// Get user's votes from localStorage
export const getUserVotes = (): Record<string, 'up' | 'down'> => {
  const saved = localStorage.getItem('userVotes');
  return saved ? JSON.parse(saved) : {};
};

// Update user's vote
export const updateUserVote = (confessionId: string, vote: 'up' | 'down'): void => {
  const votes = getUserVotes();
  votes[confessionId] = vote;
  localStorage.setItem('userVotes', JSON.stringify(votes));
};

// Get or create unique user ID
export const getUserId = (): string => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
};

// Calculate engagement rewards for top authors
export const calculateEngagementRewards = (confessions: Confession[]): Map<string, number> => {
  // Calculate total engagement per author
  const authorEngagement = new Map<string, number>();
  
  const countReplies = (replies: Reply[]): number => {
    return replies.reduce((acc, reply) => acc + 1 + countReplies(reply.replies), 0);
  };
  
  confessions.forEach(confession => {
    if (confession.authorId) {
      const engagement = confession.upvotes + confession.downvotes + countReplies(confession.replies);
      const currentTotal = authorEngagement.get(confession.authorId) || 0;
      authorEngagement.set(confession.authorId, currentTotal + engagement);
    }
  });
  
  // Sort authors by engagement
  const sortedAuthors = Array.from(authorEngagement.entries())
    .sort((a, b) => b[1] - a[1]);
  
  // Award tokens: #1 gets 3, #2 gets 2, #3 gets 1
  const rewards = new Map<string, number>();
  if (sortedAuthors[0]) rewards.set(sortedAuthors[0][0], 3);
  if (sortedAuthors[1]) rewards.set(sortedAuthors[1][0], 2);
  if (sortedAuthors[2]) rewards.set(sortedAuthors[2][0], 1);
  
  return rewards;
};
