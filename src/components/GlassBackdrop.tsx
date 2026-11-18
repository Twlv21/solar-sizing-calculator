const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=60";

export function GlassBackdrop({ src = DEFAULT_PHOTO }: { src?: string }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <img src={src} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-background/85 backdrop-blur-[2px]" />
    </div>
  );
}
