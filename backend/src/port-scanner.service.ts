import { PortScannerResult } from './port-scanner.object'
import EvilScan from 'evilscan'
import { Injectable } from '@nestjs/common'

interface EvilScanResult {
  status: string
  ip: string
  port: string
  reverse: string
}

@Injectable()
export class PortScannerService {
  async list(port: number, target = '192.168.1.0/24') {
    const results: PortScannerResult[] = []
    return await new Promise((resolve, reject) => {
      const scan = new EvilScan({
        port,
        target,
        status: 'O',
        reverse: true,
      })
      scan.on('result', this.onResult(results))
      scan.on('error', (err: object) => reject(err.toString()))
      scan.on('done', () => resolve(results))
      scan.run()
    })
  }

  private onResult =
    (results: PortScannerResult[]) => (data: EvilScanResult) => {
      if (data.status == 'open')
        results.push(
          Object.assign(new PortScannerResult(), {
            ip: data.ip,
            port: data.port,
            hostname: data.reverse,
          }),
        )
    }
}
