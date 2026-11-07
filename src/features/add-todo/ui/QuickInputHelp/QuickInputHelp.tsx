import './QuickInputHelp.scss'
import { useCallback, useRef, useState } from 'react'
import { HelpIcon } from '@/shared/assets'
import { cn } from '@/shared/lib'
import { Button, Popover } from '@/shared/ui'
import { QUICK_INPUT_EXAMPLES, QUICK_INPUT_GROUPS } from '../../config/constants'

export interface QuickInputHelpProps {
  onPick: (example: string) => void
}

export const QuickInputHelp = ({ onPick }: QuickInputHelpProps) => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <Button
        ref={anchorRef}
        variant="tool"
        className={cn('quick-help__button', open && 'quick-help__button--open')}
        aria-label="Как работает быстрый ввод"
        title="Быстрый ввод"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <HelpIcon width={18} height={18} />
      </Button>
      <Popover open={open} anchorRef={anchorRef} label="Быстрый ввод" onClose={close}>
        <div className="quick-help">
          <h3 className="quick-help__title">Быстрый ввод</h3>
          <p className="quick-help__text">
            Напишите срок и приоритет прямо в названии: они распознаются и убираются из текста.
          </p>
          {QUICK_INPUT_GROUPS.map((group) => (
            <div key={group.title} className="quick-help__group">
              <span className="quick-help__label">{group.title}</span>
              <span className="quick-help__tokens">
                {group.tokens.map((token) => (
                  <code key={token} className="quick-help__token">
                    {token}
                  </code>
                ))}
              </span>
            </div>
          ))}
          <div className="quick-help__examples">
            <span className="quick-help__label">Примеры, нажмите чтобы вставить</span>
            {QUICK_INPUT_EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                className="quick-help__example"
                onClick={() => {
                  onPick(example)
                  close()
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </Popover>
    </>
  )
}
