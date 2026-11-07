import './ProgressRing.scss'

export interface ProgressRingProps {
  done: number
  total: number
}

const RADIUS = 16
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export const ProgressRing = ({ done, total }: ProgressRingProps) => {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)
  const filled = (CIRCUMFERENCE * percent) / 100

  return (
    <div
      className="progress-ring"
      role="img"
      aria-label={`Выполнено ${done} из ${total}, ${percent}%`}
    >
      <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
        <circle className="progress-ring__track" cx="20" cy="20" r={RADIUS} />
        <circle
          className="progress-ring__bar"
          cx="20"
          cy="20"
          r={RADIUS}
          strokeDasharray={`${filled.toFixed(1)} ${CIRCUMFERENCE.toFixed(1)}`}
          strokeOpacity={percent === 0 ? 0 : 1}
        />
      </svg>
      <div className="progress-ring__text" aria-hidden="true">
        <span className="progress-ring__percent">{percent}%</span>
        <span className="progress-ring__caption">
          {done} из {total}
        </span>
      </div>
    </div>
  )
}
