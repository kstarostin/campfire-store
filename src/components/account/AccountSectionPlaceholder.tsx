interface AccountSectionPlaceholderProps {
  id: string
  headingId: string
  title: string
  description: string
}

export function AccountSectionPlaceholder({
  id,
  headingId,
  title,
  description,
}: AccountSectionPlaceholderProps) {
  return (
    <section className="account-panel is-active" id={id} aria-labelledby={headingId}>
      <header className="account-panel__head">
        <div>
          <h2 id={headingId}>{title}</h2>
          <p>{description}</p>
        </div>
      </header>
    </section>
  )
}
