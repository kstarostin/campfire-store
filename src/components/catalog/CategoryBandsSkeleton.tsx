interface CategoryBandsSkeletonProps {
  count?: number
}

export function CategoryBandsSkeleton({ count = 3 }: CategoryBandsSkeletonProps) {
  return (
    <div className="category-bands-stack" aria-busy="true" aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={`category-band category-band--skeleton${index % 2 === 1 ? ' category-band--flip' : ''}`}
        >
          <div className="category-band__canvas" aria-hidden />
          <div className="category-band__inner">
            <div className="category-band__copy">
              <span className="skeleton category-band__eyebrow-skeleton" />
              <span className="skeleton category-band__title-skeleton" />
              <span className="skeleton category-band__description-skeleton" />
              <span className="skeleton category-band__browse-skeleton" />
            </div>
            <div className="category-leaf-grid">
              {Array.from({ length: 4 }, (_, tileIndex) => (
                <span key={tileIndex} className="skeleton category-leaf-tile-skeleton" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
