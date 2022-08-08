import { Billing } from 'src/project/entities/billing.entity';
import { Role } from 'src/project/entities/role.entity';

export class TokenPayload {
  id: number;
  project?: {
    id: number;
    billing: Billing;
    roles: Role[];
  };
}
