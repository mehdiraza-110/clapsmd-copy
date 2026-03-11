export default function CircularLoader({ size = "md", label = "Loading..." }) {
  const sizeClass = size === "sm" ? "w-5 h-5 border-2" : "w-9 h-9 border-[3px]";

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-4">
      <span
        className={`${sizeClass} rounded-full border-primary/30 border-t-primary animate-spin`}
        aria-hidden="true"
      />
      <p className="text-sm font-semibold text-secondary">{label}</p>
    </div>
  );
}
