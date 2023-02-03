import { ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { AssigneeType } from '../enums/assignee-type.enum';

@ObjectType()
export class AssignedTo extends User {
  type?: AssigneeType;
}
