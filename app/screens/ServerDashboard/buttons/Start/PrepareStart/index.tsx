import { useEffect, useState } from 'react'
import { HeaderBackButton } from '@react-navigation/elements'
import CheckStreamDetails from './CheckStreamDetails'
import StartCountdown from './StartCountdown'
import Checklist from './Checklist'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { ServerDashboardStackParamList } from '../../..'

export interface StepProps {
  nextStep: () => any
  navigation: NavigationProp<ServerDashboardStackParamList>
}

const steps = [CheckStreamDetails, StartCountdown, Checklist] as const

const PrepareStart = () => {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const nextStep = () => setCurrentStep(currentStep + 1)
  const previousStep = () => setCurrentStep(currentStep - 1)
  const CurrentStep = steps[currentStep]
  const navigation = useNavigation<StepProps['navigation']>()

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        currentStep != 0 && <HeaderBackButton onPress={previousStep} />,
    })
  }, [currentStep])

  return <CurrentStep navigation={navigation} nextStep={nextStep} />
}

export default PrepareStart
