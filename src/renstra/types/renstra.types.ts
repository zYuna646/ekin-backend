import { Prisma } from '@prisma/client';

export type RenstraWithMisis = Prisma.RenstraGetPayload<{
  include: {
    renstraMisis: {
      include: {
        misi: true;
      };
    };
  };
}>;
