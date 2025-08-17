/**
 * Access Role Constants
 * 
 * This file defines the integer constants for user access roles.
 * These values correspond to the type_role table in the database.
 * 
 * IMPORTANT: This is a relationship documentation table with no foreign keys.
 * The integers are used directly in the users.access_role field.
 * 
 * # Last checked: 2025-07-15 03:27:24 UTC by tcotten
 */

export const ACCESS_ROLES = {
  USER: 1,
  TEST: 2,
  ADMIN: 3,
} as const;

export type AccessRoleId = typeof ACCESS_ROLES[keyof typeof ACCESS_ROLES];

export const ACCESS_ROLE_LABELS: Record<AccessRoleId, string> = {
  [ACCESS_ROLES.USER]: 'User',
  [ACCESS_ROLES.TEST]: 'Test',
  [ACCESS_ROLES.ADMIN]: 'Admin',
} as const;

/**
 * Get the human-readable label for an access role ID
 */
export function getAccessRoleLabel(roleId: AccessRoleId): string {
  return ACCESS_ROLE_LABELS[roleId];
}

/**
 * Check if a role ID is valid
 */
export function isValidAccessRole(roleId: number): roleId is AccessRoleId {
  return Object.values(ACCESS_ROLES).includes(roleId as AccessRoleId);
}

/**
 * Get all valid access role IDs
 */
export function getAllAccessRoleIds(): AccessRoleId[] {
  return Object.values(ACCESS_ROLES);
}

/**
 * Get all access role labels
 */
export function getAllAccessRoleLabels(): string[] {
  return Object.values(ACCESS_ROLE_LABELS);
}

/**
 * Get access role ID by label (case-insensitive)
 */
export function getAccessRoleIdByLabel(label: string): AccessRoleId | null {
  const normalizedLabel = label.toLowerCase();
  for (const [id, roleLabel] of Object.entries(ACCESS_ROLE_LABELS)) {
    if (roleLabel.toLowerCase() === normalizedLabel) {
      return parseInt(id) as AccessRoleId;
    }
  }
  return null;
} 