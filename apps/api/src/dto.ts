import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}
export class AnimationSlug {
  @Matches(/^[a-z0-9-]{1,80}$/)
  slug!: string;
}
export class AnimationQuery {
  @ApiPropertyOptional({ type: String, maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  q?: string;
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Matches(/^[a-z0-9-]{1,80}$/)
  category?: string;
  @ApiPropertyOptional({ enum: Difficulty })
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;
  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1, maximum: 10000 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10000)
  page = 1;
  @ApiPropertyOptional({ type: Number, default: 12, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 12;
}
export class Category {
  @ApiProperty({ type: String }) slug!: string;
  @ApiProperty({ type: String }) name!: string;
}
export class Animation {
  @ApiProperty({ type: String }) id!: string;
  @ApiProperty({ type: String }) slug!: string;
  @ApiProperty({ type: String }) technicalName!: string;
  @ApiProperty({ type: String }) indonesianName!: string;
  @ApiProperty({ type: String }) shortDescription!: string;
  @ApiProperty({ type: String }) explanation!: string;
  @ApiProperty({ enum: Difficulty }) difficulty!: Difficulty;
  @ApiProperty({ type: () => Category }) category!: Category;
  @ApiProperty({ type: [String] }) tags!: string[];
  @ApiProperty({ type: [String] }) keywords!: string[];
  @ApiProperty({ type: [String] }) libraries!: string[];
  @ApiProperty({ type: String }) demoId!: string;
  @ApiProperty({ type: String }) codeExampleId!: string;
  @ApiProperty({ type: String }) aiPrompt!: string;
  @ApiProperty({ type: Boolean }) published!: boolean;
  @ApiProperty({ type: String, format: 'date-time' }) createdAt!: string;
  @ApiProperty({ type: String, format: 'date-time' }) updatedAt!: string;
}
export class AnimationPage {
  @ApiProperty({ type: [Animation] }) items!: Animation[];
  @ApiProperty({ type: Number }) total!: number;
  @ApiProperty({ type: Number }) page!: number;
  @ApiProperty({ type: Number }) limit!: number;
}
export class ApiError {
  @ApiProperty({ type: Number }) statusCode!: number;
  @ApiProperty({ type: String }) message!: string;
}
export class Health {
  @ApiProperty({ type: String, enum: ['ok'] }) status!: string;
}
