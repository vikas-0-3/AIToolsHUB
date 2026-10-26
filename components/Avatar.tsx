export default function Avatar({ url, name, size = 28 }: { url?: string | null; name: string; size?: number }) {
  const s = { width: size, height: size };
  // eslint-disable-next-line @next/next/no-img-element
  return url ? <img src={url} alt="" style={s} referrerPolicy="no-referrer" className="shrink-0 rounded-full object-cover" />
    : <span aria-hidden style={s} className="grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-pink text-xs font-bold text-white">{name[0]?.toUpperCase()}</span>;
}
