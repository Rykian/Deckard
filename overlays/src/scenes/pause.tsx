import FullScene from '../components/FullScene'

const Pause = () => {
  const lateMessages = [
    'Oops...',
    "J'arrive bientôt, promis !",
    "J'ai dû oublier un truc sur le feu.",
    "C'est où déjà le bouton pour commencer ?",
    "C'est quoi déjà le numéro des secours ?",
    'Alerte enlèvement : un barbu a disparu.',
    'Tant pis hein. Amusez-vous sans moi !',
  ]
  const message = `C'est l'heure de la tisane.`

  return (
    <FullScene
      lateMessages={lateMessages}
      message={message}
      sceneName="campfire"
      name="pause"
    />
  )
}

export default Pause
