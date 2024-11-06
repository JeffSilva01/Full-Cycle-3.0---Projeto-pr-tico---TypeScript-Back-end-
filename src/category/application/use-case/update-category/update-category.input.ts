import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from "class-validator";

export type UpdateCategoryInputConstructorProps = {
  id: string;
  name?: string;
  description?: string | null;
  isActive?: boolean;
};

export class UpdateCategoryInput {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  constructor(props: UpdateCategoryInputConstructorProps) {
    if (!props) return;

    this.id = props.id;

    props.name && (this.name = props.name);
    props.description && (this.description = props.description);
    props.isActive !== null &&
      props.isActive !== undefined &&
      (this.isActive = props.isActive);
  }
}

export class ValidateUpdateCategoryInput {
  public static validate(input: UpdateCategoryInput) {
    return validateSync(input);
  }
}
