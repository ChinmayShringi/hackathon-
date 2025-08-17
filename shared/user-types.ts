/**
 * User Type Constants
 * 
 * This file defines the integer constants for user account types.
 * These values correspond to the type_user table in the database.
 * 
 * IMPORTANT: This is a relationship documentation table with no foreign keys.
 * The integers are used directly in the users.account_type field.
 * 
 * # Last checked: 2025-07-15 03:27:24 UTC by tcotten
 */

export const USER_TYPES = {
  SYSTEM: 1,
  GUEST: 2,
  REGISTERED: 3,
} as const;

export type UserTypeId = typeof USER_TYPES[keyof typeof USER_TYPES];

export const USER_TYPE_LABELS: Record<UserTypeId, string> = {
  [USER_TYPES.SYSTEM]: 'System',
  [USER_TYPES.GUEST]: 'Guest',
  [USER_TYPES.REGISTERED]: 'Registered',
} as const;

/**
 * Get the human-readable label for a user type ID
 */
export function getUserTypeLabel(typeId: UserTypeId): string {
  return USER_TYPE_LABELS[typeId] || 'Unknown';
}

/**
 * Check if a user type ID is valid
 */
export function isValidUserType(typeId: number): typeId is UserTypeId {
  return Object.values(USER_TYPES).includes(typeId as UserTypeId);
}

/**
 * Get all valid user type IDs
 */
export function getAllUserTypeIds(): UserTypeId[] {
  return Object.values(USER_TYPES);
}

/**
 * Get all user type mappings (id -> label)
 */
export function getAllUserTypes(): Record<UserTypeId, string> {
  return { ...USER_TYPE_LABELS };
} 