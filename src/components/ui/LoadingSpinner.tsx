'use client';

type LoadingSpinnerProps = {
  size?: 'small' | 'medium' | 'large';
  color?: string;
};

export default function LoadingSpinner({ 
  size = 'medium', 
  color = 'currentColor'
}: LoadingSpinnerProps) {
  const sizeClass = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`${sizeClass[size]} animate-spin rounded-full border-4 border-solid border-t-transparent`}
        style={{ borderColor: `${color} transparent transparent transparent` }}
      />
    </div>
  );
}