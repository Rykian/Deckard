import { Module } from '@nestjs/common'
import { PortScannerService } from './port-scanner.service'

@Module({ providers: [PortScannerService], exports: [PortScannerService] })
export class PortScannerModule {}
