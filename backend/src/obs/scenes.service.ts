import { OBSWebSocketError } from 'obs-websocket-js';
import { CheckScenesReport, ItemReport } from './scenes.object';
import { OBSAPI } from './_.service';

const REQUIRED_OBJECTS = {
  main: ['webcam', 'capture'],
  chatting: ['webcam'],
};

export class OBSScenesService {
  constructor(private api: OBSAPI) {}

  async checkScenes() {
    const report = new CheckScenesReport();

    await Promise.all(
      Object.entries(REQUIRED_OBJECTS).map(async ([scene, sources]) => {
        try {
          const items = await this.api.call('GetSceneItemList', {
            sceneName: scene,
          });
          const sourcesNames = items.sceneItems.map(
            (item) => item['sourceName'],
          );

          const missingSources = sources.filter(
            (source) => !sourcesNames.includes(source),
          );

          if (missingSources.length) {
            const itemReport = new ItemReport();
            itemReport.items = missingSources;
            itemReport.scene = scene;
            report.missingItems ||= [];
            report.missingItems.push(itemReport);
            console.error(
              `Missing sources on scene "${scene}":`,
              ...missingSources,
            );
          }
        } catch (err) {
          if (err instanceof OBSWebSocketError) {
            if (err.code == 600) {
              // Source not found
              report.missingScenes ||= [];
              report.missingScenes.push(scene);
              console.error(err.message);
            } else throw err;
          }
        }
      }),
    );

    return report;
  }
}
