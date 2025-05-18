import { lockoutSubmissionSerializer } from "./lockoutSubmissionSerializer";
import { userSerializer } from "./userSerializer";
import {
  LockoutWithUsers,
  LockoutWithUsersAndSubmissions,
} from "@/app/types/lockout";

export const lockoutSerializer = (
  lockout: LockoutWithUsersAndSubmissions | LockoutWithUsers
) => {
  if (!lockout) {
    return {};
  }
  const base = {
    id: lockout.id,
    name: lockout.name,
    invitee: userSerializer(lockout.invitee),
    host: userSerializer(lockout.host),
    winner: lockout.winner ? userSerializer(lockout.winner) : {},
    durationSeconds: lockout.durationSeconds,
    startTime: lockout.startTime,
    endTime: lockout.endTime,
    status: lockout.status,
    inviteCode: lockout.inviteCode,
    createdAt: lockout.createdAt,
  };

  if ("LockoutSubmissions" in lockout) {
    return {
      ...base,
      lockoutSubmissions: lockout.LockoutSubmissions.map((sb) =>
        lockoutSubmissionSerializer(sb)
      ),
    };
  }

  return base;
};
