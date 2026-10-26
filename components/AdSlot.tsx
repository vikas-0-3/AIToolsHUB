// Renders nothing until publisher ID + slot ID are configured. Never shows fake ads.
export default function AdSlot({ slot }: { slot?: string }) {
  const pub = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  if (!pub || !slot) return null;
  return (
    <aside aria-label="Advertisement" className="my-6 min-h-[100px]">
      <ins className="adsbygoogle block" data-ad-client={pub} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
    </aside>
  );
}
