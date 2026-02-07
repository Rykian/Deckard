# Deckard

Application pour controller les scènes de OBS depuis un périphérique mobile, à la manière des Streamdeck de Elgato.

Composé de 3 applications différente.

- Une application React Native pour iPad/iPhone (mobile).
- Une application React servant les overlays OBS (overlays).
- Une application Node.js orchestrant l'ensemble des des composants (backend).

## Backend

C'est une application [NestJS](https://nestjs.com) utilisant une base de donnée Redis qui surveille les I/O de différent services :

- OBS via [`obs-websocket-js`](https://www.npmjs.com/package/obs-websocket-js) qui permet d'écouter les évènements et d'envoyer des commandes de changement de scènes.
- Spotify pour afficher la piste en cours sur les scènes qui la nécessite via [`spotify-web-api-node`](https://www.npmjs.com/package/spotify-web-api-node)
- Contrôle la lumière de la pièce via [LedFX](https://ledfx.app) (permet de faire réagir des bandes lumineuses WLED au son d'un périphérique audio) et Home-Assistant (changement de [scènes](https://www.home-assistant.io/docs/scene/))
- Réagis aux informations envoyées sur son API GraphQL par l'application React Native et les overlays React
- Réagis aux évènements Twitch via [`twurple`](https://github.com/twurple/twurple)
- Réagis aux évènements de certains jeux pour changer les informations du stream

## Overlays

Les overlays sont simplement distribués via une application [Vite](https://vitejs.dev), chaque composant a sa propre route, les composants sont _lazy-loadé_ pour éviter de surcharger les instances ouvertes sur OBS.

Le déclenchement de certaines animations ou les informations nécessaires à l'affichage sont obtenues via des _subscriptions_ GraphQL.

## Mobile

L'application mobile est l'interface graphique du projet. Elle permet de s'authentifier auprès de Twitch et Spotify, de changer de scènes, de contrôler des effets, de surveiller les évènements du stream en communiquant exclusivement avec le backend via GraphQL.

## Buts

Le projet était un prétexte pour piloter de nombreux services de manière asynchrone, d'où l'utilisation de Node.js comme backend.

L'approche modulaire (je ne garde pas que de mauvais souvenirs de Symfony) et orienté DDD de NestJS, m'intéressait depuis un moment.

Pour le choix de React Native, j'ai eu l'occasion de travailler avec pendant quelques mois mais je n'avais jamais véritablement tester Expo. L'idée de pouvoir avoir 3 versions (Android, iOS et Web) à partir du même code était séduisante.
