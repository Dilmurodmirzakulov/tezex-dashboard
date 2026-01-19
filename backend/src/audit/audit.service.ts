import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async log(
    userId: string,
    userEmail: string,
    action: string,
    entity: string,
    entityId: string,
    changes: any,
    ipAddress?: string,
  ): Promise<void> {
    const auditLog = this.auditRepository.create({
      userId,
      userEmail,
      action,
      entity,
      entityId,
      changes,
      ipAddress,
    });

    await this.auditRepository.save(auditLog);
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditRepository.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async findByEntity(entity: string, entityId: string): Promise<AuditLog[]> {
    return this.auditRepository.find({
      where: { entity, entityId },
      order: { createdAt: 'DESC' },
    });
  }
}
