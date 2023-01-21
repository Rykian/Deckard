import { Injectable } from '@nestjs/common';
import OBSWebSocket, { OBSWebSocketError } from 'obs-websocket-js';
import { CheckScenesReport, ItemReport } from './report.object';

const REQUIRED_OBJECTS = {
  main: ['webcam', 'capture'],
  chatting: ['webcam'],
};

@Injectable()
export class OBSService extends OBSWebSocket {
  currentURL: string;
  currentPassword: string;
  async connect(url?: string, password?: string, identificationParams?: any) {
    this.once('ConnectionOpened', () => {
      this.currentURL = url;
      this.currentPassword = password;
    });

    this.once('ConnectionClosed', (error) => {
      console.error(error);
    });

    return super.connect(url, password, identificationParams);
  }

  async checkScenes() {
    const report = new CheckScenesReport();

    await Promise.all(
      Object.entries(REQUIRED_OBJECTS).map(async ([scene, sources]) => {
        try {
          const items = await this.call('GetSceneItemList', {
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
