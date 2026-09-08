export default function PlaceholderScreen({ title, subtitle }) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-transparent px-8 text-center font-nunito">
      <p className="type-label text-[#9AA19B]">Coming soon</p>
      <h1 className="type-title mt-2 text-dark">{title}</h1>
      <p className="type-body mt-2 max-w-[260px] text-muted">{subtitle}</p>
    </div>
  )
}
