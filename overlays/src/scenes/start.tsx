import FullScene from '../components/FullScene'

const Start = () => {
  const lateMessages = [
    'Oops...',
    "J'arrive bientôt, promis !",
    "J'ai dû oublier un truc sur le feu.",
    "C'est où déjà le bouton pour commencer ?",
    "C'est quoi déjà le numéro des secours ?",
    'Alerte enlèvement : un barbu a disparu.',
    'Tant pis hein. Amusez-vous sans moi !',
  ]
  const message = `J'arrive bientôt !`

  return (
    <FullScene
      lateMessages={lateMessages}
      message={message}
      name="start"
      sceneName="campfire"
    />
  )
}

export default Start
