import { Injectable, Logger } from '@nestjs/common'
import { watch } from 'chokidar'
import { EventEmitter } from 'events'
import { Tail } from 'tail'
import TypedEmitter from 'typed-emitter'
import { RegExCaptureResult, TypedRegEx } from 'typed-regex'

interface MythicDungeonStart {
  zone: string
  instanceID: string
  challengeModeID: string
  keystoneLevel: string
  affixIds: string[]
}

interface MyhthicDungeonEnd {
  instanceID: string
  success: string
  keystoneLevel: string
  totalTime: string
}
type Events = {
  mythicDungeonStart: (event: MythicDungeonStart) => void
  mythicDungeonEnd: (event: MyhthicDungeonEnd) => void
}

const createHandler = <E extends keyof Events, R extends string>(
  name: E,
  regex: R,
  transformer?: (
    data: RegExCaptureResult<`${typeof regex}`>,
  ) => Parameters<Events[E]>[0] | undefined,
) => ({
  name,
  regex: TypedRegEx(regex),
  transformer,
})
;`/^([0-9/:. ]*)  CHALLENGE_MODE_START,"(?<zone>.*)",(?<instanceID>\d+),(?<challengeModeID>\d+),(?<keystoneLevel>\d+),[(?<affixIds>[0-9,]{0,})]/`
const handlers = [
  createHandler(
    'mythicDungeonStart',
    '^([0-9/:. ]*)  CHALLENGE_MODE_START,"(?<zone>.*)",(?<instanceID>\\d+),(?<challengeModeID>\\d+),(?<keystoneLevel>\\d+),\\[(?<affixIds>[0-9,]{0,})\\]',
    (data) => {
      return { ...data, affixIds: data.affixIds.split(',') }
    },
  ),
  createHandler(
    'mythicDungeonEnd',
    '^([0-9/:. ]*)  CHALLENGE_MODE_END,(?<instanceID>\\d+),(?<success>\\d),(?<keystoneLevel>\\d+),(?<totalTime>\\d+)',
    (data) => (data.keystoneLevel == '0' ? undefined : data),
  ),
] as const

@Injectable()
export class WoWLogEventService extends (EventEmitter as new () => TypedEmitter<Events>) {
  logger = new Logger(WoWLogEventService.name)
  LOG_PATH = '/Applications/World of Warcraft/_retail_/Logs/WoWCombatLog*.txt'
  tail?: Tail

  constructor() {
    super()
  }

  start() {
    watch(this.LOG_PATH).on('add', (file) => {
      this.stop()
      this.startTail(file)
    })
  }

  stop() {
    if (this.tail) this.tail.unwatch()
  }

  startTail(file: string) {
    this.logger.log(`Start tailing "${file}"`)
    this.tail = new Tail(file, {
      follow: true,
      fromBeginning: true,
    })

    this.tail.on('line', (data) => {
      if (typeof data != 'string') return

      handlers.find((handler) => {
        const match = handler.regex.captures(data)
        if (!match) return false

        const eventData = handler.transformer
          ? handler.transformer(match as any)
          : match
        if (!eventData) return false

        this.logger.debug(handler.name, eventData)
        this.emit(handler.name, eventData as any)
        return true
      })
    })

    this.tail.on('error', (err) => {
      if (err.code == 'ENOENT')
        return this.logger.log('Combat log deleted or moved.')
      this.logger.error(err)
    })
  }
}
