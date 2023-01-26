import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { ProjectService } from 'src/project/project.service';
import { CONTACTS_SERVICE } from 'src/shared/constants/broker';
import { FindAllContactsAssignedToArgs } from './dto/find-all-contacts-assigned-to.args';
import { Contact } from './entities/contact.entity';
import { CountAllContactsAssignedTo } from './entities/count-all-contacts-assigned-to.entity';
import { AssigneeType } from './enums/assignee-type.enum';

@Injectable()
export class ContactAssignedToService {
  constructor(
    @Inject(CONTACTS_SERVICE) private readonly client: ClientProxy,
    private readonly projectService: ProjectService,
  ) {}

  async findAll(
    projectId: number,
    findAllContactsAssignedToArgs: FindAllContactsAssignedToArgs,
  ): Promise<Contact[]> {
    const contacts = await lastValueFrom(
      this.client.send<Contact[]>('findAllContactsAssignedTo', {
        projectId,
        ...findAllContactsAssignedToArgs,
      }),
    );

    return this.forContact(projectId, ...contacts);
  }

  countAll(
    projectId: number,
    id: number,
    type: AssigneeType = AssigneeType.User,
  ): Observable<CountAllContactsAssignedTo> {
    return this.client.send<CountAllContactsAssignedTo>(
      'countAllContactsAssignedTo',
      {
        projectId,
        assignedTo: {
          id,
          type,
        },
      },
    );
  }

  async forContact(
    projectId: number,
    ...contacts: Contact[]
  ): Promise<Contact[]> {
    const assignedTo = contacts
      .filter(({ assignedTo }) => assignedTo?.type === AssigneeType.User)
      .map(({ assignedTo }) => assignedTo.id);

    if (assignedTo.length > 0) {
      const users = await lastValueFrom(
        this.projectService.findAllUsers(projectId, ...assignedTo),
      );

      for (const contact of contacts) {
        switch (contact.assignedTo?.type) {
          case AssigneeType.User:
            contact.assignedTo = users.find(
              ({ id }) => id === contact.assignedTo.id,
            );
            break;

          case AssigneeType.Chatbot:
            // TODO: chatbots
            contact.assignedTo = {
              id: contact.assignedTo.id,
              avatarUrl: null,
              confirmed: true,
              createdAt: '1970-01-01T00:00:00.000Z',
              email: '',
              name: '',
              updatedAt: '1970-01-01T00:00:00.000Z',
            };
            break;

          default:
            break;
        }
      }
    }

    return contacts;
  }
}
