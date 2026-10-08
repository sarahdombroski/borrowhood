// each action does: requireUser, parse with Zod, authz, query, revalidatepath

// createItemAction
// updateItemAction
// setItemVisibilityAction
// archiveItemAction
// toggleAvailabilityAction
// requestPhotoUploadAction(itemId)
  // owner check, returns signed upload url and key
// confirmPhotoUploadAction(itemId, key)
  // verifies upload, saves photo_key, deletes old photo