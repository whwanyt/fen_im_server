import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { ListDTO } from "src/utils/dto";

export class RoleCreateDTO {

  @ApiProperty({default: '基础', description: '名称'})
  @IsNotEmpty()
  name: string;
  
  @ApiProperty({default:"基础会员",description:"备注"})
  @IsNotEmpty()
  extra: string;

}

export class RoleUpdateDTO extends RoleCreateDTO{
  @ApiProperty({default:"1"})
  @IsNumber()
  id: number;
}

export class RoleListDTO extends ListDTO{

}