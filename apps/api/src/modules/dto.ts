import { IsBooleanString, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateAffiliateLinkDto {
  @IsUrl()
  url!: string;

  @IsOptional()
  @IsString()
  vid?: string;

  @IsOptional()
  @IsString()
  erid?: string;
}

export class CreatePartnerArticleDto {
  @IsOptional()
  @IsString()
  marketArticle?: string;

  @IsOptional()
  @IsUrl()
  marketUrl?: string;

  @IsOptional()
  @IsBooleanString()
  preserveOfferArticle?: string;

  @IsOptional()
  @IsString()
  vid?: string;
}
