'use client';

export default function BookingButton({ className, children }) {
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-booking'));
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children || 'Book Appointment'}
    </button>
  );
}
