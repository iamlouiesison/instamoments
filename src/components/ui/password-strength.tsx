'use client';

import { cn } from '@/utils/cn';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const getStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const feedback = [];

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Lowercase letter');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Uppercase letter');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Number');

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('Special character');

    // Determine strength level
    let label = '';
    let color = '';

    if (score <= 1) {
      label = 'Very Weak';
      color = 'bg-red-500';
    } else if (score === 2) {
      label = 'Weak';
      color = 'bg-orange-500';
    } else if (score === 3) {
      label = 'Fair';
      color = 'bg-yellow-500';
    } else if (score === 4) {
      label = 'Good';
      color = 'bg-blue-500';
    } else {
      label = 'Strong';
      color = 'bg-green-500';
    }

    return { score, label, color, feedback };
  };

  const { score, label, color, feedback } = getStrength(password);

  if (!password) return null;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Password strength:</span>
        <span className={cn(
          'font-medium',
          score <= 1 ? 'text-red-600' : '',
          score === 2 ? 'text-orange-600' : '',
          score === 3 ? 'text-yellow-600' : '',
          score === 4 ? 'text-blue-600' : '',
          score >= 5 ? 'text-green-600' : '',
        )}>
          {label}
        </span>
      </div>
      
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              'h-2 flex-1 rounded-full transition-all duration-200',
              level <= score ? color : 'bg-gray-200'
            )}
          />
        ))}
      </div>
      
      {feedback && feedback.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <p>Add: {feedback.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
