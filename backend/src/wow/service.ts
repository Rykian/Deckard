import { Injectable, Logger } from '@nestjs/common'
import { TwitchService } from 'src/twitch/service'
import {
  EncounterEndEvent,
  EncounterStartEvent,
  WoWLogEventService,
} from './logevent.service'

const DIFFICULTIES = Object.entries({
  LFR: [7, 17, 151],
  Normal: [1, 3, 4, 9, 12, 14, 38, 147, 150],
  Heroic: [2, 5, 6, 11, 15, 39, 149],
  Mythic: [8, 16, 23, 40],
  Timewalking: [24, 33],
}).reduce(
  (acc, [difficulty, ids]) => {
    ids.forEach((id) => {
      acc[id] = difficulty
    })
    return acc
  },
  {} as Record<
    /** Difficulty ID */
    string,
    /** Difficulty name */
    string
  >,
)

@Injectable()
export class WoWService {
  previousTitle?: string
  private logger = new Logger(WoWService.name)

  #raid: {
    name: string
    difficulty: string
    boss?: string
  }

  #key?: {
    name: string
    level: string
  }

  constructor(private twitch: TwitchService, private logs: WoWLogEventService) {
    this.handleCategoryChange()
    twitch.on('CategoryUpdated', this.handleCategoryChange)
  }

  handleCategoryChange = async () => {
    if (this.twitch?.infos?.category?.name == 'World of Warcraft') {
      this.logs.start()
      this.logs.on('mythicDungeonStart', (event) =>
        this.dungeonStart(event.zone, event.keystoneLevel),
      )
      this.logs.on('mythicDungeonEnd', this.dungeonEnd)

      this.logs.on('zoneChanged', async (event) => {
        if (event.zoneName == 'Vault of the Incarnates') {
          this.raidStart(event.zoneName, DIFFICULTIES[event.difficultyID])
        } else if (this.previousTitle) {
          this.raidEnd()
        }
      })
    } else {
      this.logs.removeAllListeners()
      this.logs.stop()
    }
  }

  dungeonStart = (name: string, level: string) => {
    if (!this.twitch.infos)
      throw new WoWServiceError('Twitch infos not available')

    this.#key = { name, level }
    this.previousTitle = this.twitch.infos.title
    return this.updateTitle(`${name} +${level}`)
  }
  dungeonEnd = async () => {
    this.#key = undefined
    await this.updateTitle(this.previousTitle || 'Chill')
    this.previousTitle = undefined
  }

  raidStart = async (name: string, difficulty: string) => {
    if (!this.twitch.infos)
      throw new WoWServiceError('Twitch infos not available')

    this.#raid = { name: name, difficulty: difficulty }
    this.previousTitle = this.twitch.infos.title
    await this.updateTitle(`${name} ${difficulty}`)
    this.logs.on('encounterStart', this.raidEncounterStartHandler)
    this.logs.on('encounterEnd', this.raidEncounterEndHandler)
  }
  raidEncounterStartHandler = async (event: EncounterStartEvent) => {
    if (this.#raid.boss == event.encounterName) return

    this.#raid.boss = event.encounterName
    await this.updateTitle(
      `${this.#raid.name} ${this.#raid.boss} ${this.#raid.difficulty}`,
    )
  }
  raidEncounterEndHandler = async (event: EncounterEndEvent) => {
    if (event.success) {
      this.#raid.boss = undefined
      this.updateTitle(`${this.#raid.name} ${this.#raid.difficulty}`)
    } else {
      this.twitch.createMarker(`Wipe ${this.#raid.boss}`)
    }
  }
  raidEnd = async () => {
    if (!this.previousTitle)
      throw new WoWServiceError("Title wasn't set at raid start event")
    await this.updateTitle(this.previousTitle)
    this.previousTitle = undefined
    this.logs.off('encounterStart', this.raidEncounterStartHandler)
    this.logs.off('encounterEnd', this.raidEncounterEndHandler)
  }

  updateTitle = async (title: string) => {
    await this.twitch.updateTitle(title)
    await this.twitch.createMarker(title)
  }
}

class WoWServiceError extends Error {}
