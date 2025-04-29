import { Prisma } from "@prisma/client";

export type LockoutWithUsers = Prisma.LockoutGetPayload<{
  include: { host: true; invitee: true; winner: true };
}>;

export type LockoutWithUsersAndSubmissions = Prisma.LockoutGetPayload<{
  include: {
    host: true;
    invitee: true;
    winner: true;
    LockoutSubmissions: {
      include: { submission: { include: { problem: true } } };
    };
  };
}>;
