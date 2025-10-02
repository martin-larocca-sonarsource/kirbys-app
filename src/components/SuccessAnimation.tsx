import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';
import './SuccessAnimation.css';

interface SuccessAnimationProps {
  message: string;
  show: boolean;
  onComplete?: () => void;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ 
  message, 
  show, 
  onComplete 
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="success-animation">
      <div className="success-content">
        <div className="success-icon-container">
          <CheckCircle className="success-icon" />
          <Sparkles className="sparkle sparkle-1" />
          <Sparkles className="sparkle sparkle-2" />
          <Sparkles className="sparkle sparkle-3" />
          <Sparkles className="sparkle sparkle-4" />
        </div>
        <p className="success-message">{message}</p>
      </div>
      <div className="confetti">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`confetti-piece confetti-${i % 5}`}></div>
        ))}
      </div>
    </div>
  );
};

export default SuccessAnimation;
