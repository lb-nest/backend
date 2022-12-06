import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ProjectService } from 'src/project/project.service';
import { Contact } from './entities/contact.entity';
import { AssigneeType } from './enums/assignee-type.enum';

@Injectable()
export class ContactAssignedToService {
  constructor(private readonly projectService: ProjectService) {}

  async forContact(
    authorization: string,
    ...contacts: Contact[]
  ): Promise<Contact[]> {
    const assignedTo = contacts
      .filter(({ assignedTo }) => assignedTo?.type === AssigneeType.User)
      .map(({ assignedTo }) => assignedTo.id);

    if (assignedTo.length > 0) {
      const users = await lastValueFrom(
        this.projectService.findAllUsers(authorization, ...assignedTo),
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
