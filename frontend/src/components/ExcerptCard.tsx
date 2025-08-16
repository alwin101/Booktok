import { Heart, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Excerpt } from '../types/Excerpt';

interface ExcerptCardProps {
  excerpt: Excerpt;
  isLiked: boolean;
  onLike: () => void;
}

export function ExcerptCard({ excerpt, isLiked, onLike }: ExcerptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 500; // Maximum characters to show before truncating
  
  // Truncate text if it's too long and not expanded
  const displayText = isExpanded || excerpt.text.length <= maxLength 
    ? excerpt.text 
    : `${excerpt.text.substring(0, maxLength)}...`;
    
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Excerpt #${excerpt.id}`,
          text: excerpt.text,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(excerpt.text);
        alert('Excerpt copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing excerpt:', error);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-4 snap-start">
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Excerpt #{excerpt.id}</h2>
          <div className="flex gap-4">
            <button 
              onClick={onLike}
              className={`p-2 rounded-full ${isLiked ? 'text-red-500' : 'text-white/70 hover:text-red-500'} transition-colors`}
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={handleShare}
              className="p-2 rounded-full text-white/70 hover:text-blue-400 transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-line">{displayText}</p>
          
          {excerpt.text.length > maxLength && (
            <button 
              onClick={toggleExpanded}
              className="mt-4 text-blue-400 hover:underline focus:outline-none"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/10 text-sm text-white/50">
          <p>Scroll down for more excerpts</p>
        </div>
      </div>
    </div>
  );
}
