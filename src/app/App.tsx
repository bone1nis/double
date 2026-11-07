import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { HomePage } from '@/pages/home'

const App = () => {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <HomePage />
      </MotionConfig>
    </LazyMotion>
  )
}

export default App
