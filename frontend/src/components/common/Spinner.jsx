import { ClipLoader } from 'react-spinners';

const Spinner = ({ 
  size = 40, 
  color = '#3b82f6', 
  loading = true,
  className = '' 
}) => {
  if (!loading) return null;

  return (
    <div className={`flex justify-center items-center py-8 ${className}`}>
      <ClipLoader 
        size={size} 
        color={color} 
        speedMultiplier={1} 
        aria-label="Loading spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Spinner;