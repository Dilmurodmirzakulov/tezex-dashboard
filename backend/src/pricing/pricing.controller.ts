import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, UseInterceptors, UploadedFile, BadRequestException 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { PricingService } from './pricing.service';
import { CreatePricingDto } from './dto/create-pricing.dto';
import { UpdatePricingDto } from './dto/update-pricing.dto';
import { CalculatePriceDto } from './dto/calculate-price.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Pricing')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post()
  @ApiOperation({ summary: 'Create pricing for a country' })
  @ApiResponse({ status: 201, description: 'Pricing successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createPricingDto: CreatePricingDto) {
    return this.pricingService.create(createPricingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all country pricing' })
  @ApiResponse({ status: 200, description: 'Return all pricing' })
  findAll() {
    return this.pricingService.findAll();
  }

  @Get('country/:country')
  @ApiOperation({ summary: 'Get pricing by country name' })
  @ApiResponse({ status: 200, description: 'Return country pricing' })
  @ApiResponse({ status: 404, description: 'Pricing not found' })
  findByCountry(@Param('country') country: string) {
    return this.pricingService.findByCountry(country);
  }

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate price for given country and weight' })
  @ApiResponse({ status: 200, description: 'Return calculated price' })
  @ApiResponse({ status: 404, description: 'Pricing not found for country' })
  async calculatePrice(@Body() calculatePriceDto: CalculatePriceDto) {
    const price = await this.pricingService.calculatePrice(
      calculatePriceDto.country,
      calculatePriceDto.weight,
    );
    return { country: calculatePriceDto.country, weight: calculatePriceDto.weight, price };
  }

  @Post('import/csv')
  @ApiOperation({ summary: 'Import pricing from CSV file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'CSV imported successfully' })
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.pricingService.importFromCsv(file.buffer);
  }

  @Post('import/excel')
  @ApiOperation({ summary: 'Import pricing from Excel file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Excel imported successfully' })
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.pricingService.importFromExcel(file.buffer);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pricing by ID' })
  @ApiResponse({ status: 200, description: 'Return the pricing' })
  @ApiResponse({ status: 404, description: 'Pricing not found' })
  findOne(@Param('id') id: string) {
    return this.pricingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update pricing' })
  @ApiResponse({ status: 200, description: 'Pricing successfully updated' })
  @ApiResponse({ status: 404, description: 'Pricing not found' })
  update(@Param('id') id: string, @Body() updatePricingDto: UpdatePricingDto) {
    return this.pricingService.update(id, updatePricingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete pricing' })
  @ApiResponse({ status: 200, description: 'Pricing successfully deleted' })
  @ApiResponse({ status: 404, description: 'Pricing not found' })
  remove(@Param('id') id: string) {
    return this.pricingService.remove(id);
  }
}
