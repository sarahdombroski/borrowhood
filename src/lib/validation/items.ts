export interface CreateItemInput {
  ownerId: string;
  name: string;
  description?: string;
  conditionNotes?: string;
  replacementValue?: string;
  photoUrl?: string;
  category?: string;
}

export interface UpdateItemInput {
  name: string;
  description?: string;
}

// setVisibilitySchema(groupIds: string[])

// photoUploadSchema