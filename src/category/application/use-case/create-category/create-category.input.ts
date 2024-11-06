import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from "class-validator";

export type CreateCategoryInputConstructorProps = {
  name: string;
  description?: string | null;
  isActive?: boolean;
};

export class CreateCategoryInput {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  constructor(props: CreateCategoryInputConstructorProps) {
    if (!props) return;

    this.name = props.name;
    this.description = props.description;
    this.isActive = props.isActive;
  }
}

export class ValidateCreateCategoryInput {
  public static validate(input: CreateCategoryInput) {
    return validateSync(input);
  }
}
