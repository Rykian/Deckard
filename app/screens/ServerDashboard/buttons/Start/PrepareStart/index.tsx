import { useEffect, useState } from 'react'
import { HeaderBackButton } from '@react-navigation/elements'
import CheckStreamDetails from './CheckStreamDetails'
import StartCountdown from './StartCountdown'
import Checklist from './Checklist'
import { StartButtonRouteProps } from '../routes'

export interface StepProps extends StartButtonRouteProps {
  nextStep: () => any
}

const steps = [CheckStreamDetails, StartCountdown, Checklist] as const

const PrepareStart = (props: StartButtonRouteProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const nextStep = () => setCurrentStep(currentStep + 1)
  const previousStep = () => setCurrentStep(currentStep - 1)
  const CurrentStep = steps[currentStep]

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () =>
        currentStep != 0 && <HeaderBackButton onPress={previousStep} />,
    })
  }, [currentStep])

  return <CurrentStep {...props} nextStep={nextStep} />
}

export default PrepareStart
