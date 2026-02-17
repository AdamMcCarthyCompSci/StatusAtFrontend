import { messageApi } from '@/lib/api';
import { User } from '@/types/user';
import { logger } from '@/lib/logger';

/**
 * Auto-accept pending invite messages for flows the user is already enrolled in.
 * This handles the case where a user signs up via email invite and is auto-enrolled,
 * but still has a pending invite message in their inbox.
 */
export async function autoAcceptPendingInvites(userData: User): Promise<void> {
  try {
    const messages = await messageApi.getMessages({
      requires_action: true,
      page: 1,
      page_size: 50,
    });

    const flowInviteMessages = messages.results.filter(
      msg => msg.message_type === 'flow_invite' && msg.action_accepted === null
    );

    if (flowInviteMessages.length > 0 && userData.enrollments) {
      for (const inviteMsg of flowInviteMessages) {
        const alreadyEnrolled = userData.enrollments.some(
          enrollment => enrollment.flow_name === inviteMsg.flow_name
        );

        if (alreadyEnrolled) {
          logger.info(
            `Auto-accepting pending invite for ${inviteMsg.flow_name} (user already enrolled)`
          );
          await messageApi.takeMessageAction(inviteMsg.uuid, {
            action: 'accept',
          });
        }
      }
    }
  } catch (messageError) {
    logger.error(
      'Failed to auto-accept pending invite messages:',
      messageError
    );
  }
}

/**
 * Checks if a Google user should be prompted to complete their profile.
 * Shows the modal if they have no phone number set. This means returning
 * users who previously skipped will see it again — which is fine UX since
 * they still haven't configured their number.
 */
export function shouldPromptGoogleProfile(userData: User): boolean {
  return !userData.whatsapp_phone_number;
}
