import './Tabs.scss'

export interface TabOption<T extends string> {
  value: T
  label: string
  count?: number
}

export interface TabsProps<T extends string> {
  options: readonly TabOption<T>[]
  value: T
  onChange: (value: T) => void
  label: string
}

export const Tabs = <T extends string>({ options, value, onChange, label }: TabsProps<T>) => {
  return (
    <div className="tabs" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="tabs__item"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          {option.count !== undefined && <span className="tabs__count">{option.count}</span>}
        </button>
      ))}
    </div>
  )
}
