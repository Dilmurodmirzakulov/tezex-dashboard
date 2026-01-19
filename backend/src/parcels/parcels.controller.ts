import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ParcelsService } from './parcels.service';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { UpdateParcelDto } from './dto/update-parcel.dto';
import { UpdateParcelStatusDto } from './dto/update-parcel-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Parcels')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('parcels')
export class ParcelsController {
  constructor(private readonly parcelsService: ParcelsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new parcel with automatic tracking number generation' })
  @ApiResponse({ status: 201, description: 'Parcel successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createParcelDto: CreateParcelDto) {
    return this.parcelsService.create(createParcelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all parcels with optional filtering' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by tracking number' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiResponse({ status: 200, description: 'Return all parcels' })
  findAll(@Query('search') search?: string, @Query('status') status?: string) {
    return this.parcelsService.findAll(search, status);
  }

  @Get('tracking/:trackingNumber')
  @ApiOperation({ summary: 'Track a parcel by tracking number' })
  @ApiResponse({ status: 200, description: 'Return the parcel' })
  @ApiResponse({ status: 404, description: 'Parcel not found' })
  findByTracking(@Param('trackingNumber') trackingNumber: string) {
    return this.parcelsService.findByTracking(trackingNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a parcel by ID' })
  @ApiResponse({ status: 200, description: 'Return the parcel' })
  @ApiResponse({ status: 404, description: 'Parcel not found' })
  findOne(@Param('id') id: string) {
    return this.parcelsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a parcel' })
  @ApiResponse({ status: 200, description: 'Parcel successfully updated' })
  @ApiResponse({ status: 404, description: 'Parcel not found' })
  update(@Param('id') id: string, @Body() updateParcelDto: UpdateParcelDto) {
    return this.parcelsService.update(id, updateParcelDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update parcel status' })
  @ApiResponse({ status: 200, description: 'Parcel status successfully updated' })
  @ApiResponse({ status: 404, description: 'Parcel not found' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateParcelStatusDto) {
    return this.parcelsService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a parcel' })
  @ApiResponse({ status: 200, description: 'Parcel successfully deleted' })
  @ApiResponse({ status: 404, description: 'Parcel not found' })
  remove(@Param('id') id: string) {
    return this.parcelsService.remove(id);
  }
}
