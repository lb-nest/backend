import { Query, Resolver } from '@nestjs/graphql';
import { AdminService } from './admin.service';

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Query(() => Boolean)
  admin__test(): boolean {
    return this.adminService.test();
  }
}
