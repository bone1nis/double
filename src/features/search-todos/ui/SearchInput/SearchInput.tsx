import './SearchInput.scss'
import type { Ref } from 'react'
import { CloseIcon, SearchIcon } from '@/shared/assets'
import { Button, Input, Kbd } from '@/shared/ui'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  inputRef?: Ref<HTMLInputElement>
}

export const SearchInput = ({ value, onChange, inputRef }: SearchInputProps) => (
  <div className="search-input">
    <SearchIcon width={16} height={16} className="search-input__icon" />
    <Input
      type="search"
      label="Поиск задач"
      placeholder="Поиск задач"
      value={value}
      inputRef={inputRef}
      autoComplete="off"
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return
        event.stopPropagation()
        onChange('')
        event.currentTarget.blur()
      }}
    />
    {value ? (
      <Button
        variant="icon"
        className="search-input__clear"
        aria-label="Очистить поиск"
        onClick={() => onChange('')}
      >
        <CloseIcon width={16} height={16} />
      </Button>
    ) : (
      <span className="search-input__kbd">
        <Kbd>/</Kbd>
      </span>
    )}
  </div>
)
