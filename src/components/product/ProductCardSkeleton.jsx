const ProductCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="relative aspect-3/4 rounded-2xl bg-slate-200/70 mb-3" />
      <div className="px-0.5 space-y-2.5">
        <div className="h-4 bg-slate-200/70 rounded w-3/4" />
        <div className="h-5 bg-slate-200/70 rounded w-1/3" />
        <div className="h-10 bg-slate-200/70 rounded-xl w-full" />
      </div>
    </div>
  )
}

export default ProductCardSkeleton