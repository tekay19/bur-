// Özellik kartları — statik, responsive grid (eski oto-kayan şeridin yerine).
// Mobilde 1, küçük ekranda 2, masaüstünde 3 sütun.
export function FeatureCarousel({ children }: { children: React.ReactNode }) {
  return (
    <div className="container grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}
