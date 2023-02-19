import { Module } from '@nestjs/common'
import { EnvironmentModule } from 'src/env.module'
import { OBSModule } from 'src/obs/_.module'
import { PubSubModule } from 'src/pubsub.module'
import { StreamCountdownResolver } from './countdown.resolver'
import { StreamCountdownService } from './countdown.service'
import { StreamSequencesPauseResolver } from './sequences/pause.resolver'
import { StreamSequencesPauseService } from './sequences/pause.service'
import { StreamSequencesStartResolver } from './sequences/start.resolver'
import { StreamSequencesStartService } from './sequences/start.service'
import { StreamSequencesStopResolver } from './sequences/stop.resolver'
import { StreamSequencesStopService } from './sequences/stop.service'
import { StreamStateResolver } from './state.resolver'
import { StreamStateService } from './state.service'
import { StreamWebcamResolver } from './webcam.resolver'
import { StreamWebcamService } from './webcam.service'

@Module({
  imports: [OBSModule, PubSubModule, EnvironmentModule],
  providers: [
    StreamCountdownService,
    StreamCountdownResolver,
    StreamStateService,
    StreamStateResolver,
    StreamWebcamService,
    StreamWebcamResolver,
    StreamSequencesStartService,
    StreamSequencesStartResolver,
    StreamSequencesPauseService,
    StreamSequencesPauseResolver,
    StreamSequencesStopService,
    StreamSequencesStopResolver,
  ],
})
export class StreamModule {}
