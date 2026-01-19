import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Audit Logs')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Get all audit logs (last 100)' })
  @ApiResponse({ status: 200, description: 'Return audit logs' })
  findAll() {
    return this.auditService.findAll();
  }

  @Get(':entity/:entityId')
  @ApiOperation({ summary: 'Get audit logs for specific entity' })
  @ApiResponse({ status: 200, description: 'Return audit logs for entity' })
  findByEntity(@Param('entity') entity: string, @Param('entityId') entityId: string) {
    return this.auditService.findByEntity(entity, entityId);
  }
}
