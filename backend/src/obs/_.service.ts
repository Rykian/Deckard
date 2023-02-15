import { Injectable } from '@nestjs/common'
import OBSWebSocket from 'obs-websocket-js'

@Injectable()
export class OBSAPI extends OBSWebSocket {}
