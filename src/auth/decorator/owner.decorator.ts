import { SetMetadata } from '@nestjs/common';

export const OWNER_METADATA_KEY = 'owner';

export interface OwnerMetadata {
  model: string;
  field: string;
  paramKey?: string;
  userField?: string;
}

export const Owner = (
  model: string,
  field: string,
  options?: Omit<OwnerMetadata, 'model' | 'field'>,
) =>
  SetMetadata(OWNER_METADATA_KEY, {
    model,
    field,
    paramKey: options?.paramKey ?? 'id',
    userField: options?.userField ?? 'nipBaru',
  } satisfies OwnerMetadata);
