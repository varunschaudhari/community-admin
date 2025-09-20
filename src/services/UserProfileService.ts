import { apiService } from './ApiService';

export interface UserProfile {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: {
    _id: string;
    name: string;
    description: string;
    permissions: string[];
    isActive: boolean;
  };
  isVerified: boolean;
  isActive: boolean;
  familyId?: {
    _id: string;
    familyName: string;
  };
  addedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  fatherDetails?: {
    fatherName: string;
    fatherPhone?: string;
    fatherOccupation?: string;
  };
  motherDetails?: {
    motherName: string;
    motherPhone?: string;
    motherOccupation?: string;
  };
  marriages?: Array<{
    spouseName: string;
    spousePhone?: string;
    marriageDate: string;
    marriageStatus: string;
    isCurrentSpouse: boolean;
    marriageOrder: number;
  }>;
  children?: Array<{
    childName: string;
    relationshipType: string;
    birthDate?: string;
    fromWhichMarriage: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyTree {
  user: UserProfile;
  familyMembers: UserProfile[];
  relationships: {
    parents: {
      father?: any;
      mother?: any;
    };
    spouse?: any;
    children: any[];
    marriages: any[];
  };
}

export interface UserAnalytics {
  user: {
    name: string;
    role: string;
    memberSince: string;
  };
  family: {
    totalFamilyMembers: number;
    verifiedMembers: number;
    activeMembers: number;
  };
  role: {
    totalUsersWithSameRole: number;
  };
}

export interface UserSuggestion {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role?: {
    name: string;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface FamilyRelationshipData {
  relationshipType: 'child' | 'marriage';
  relatedUserId?: string;
  relationshipData: {
    childName?: string;
    relationshipType?: string;
    birthDate?: string;
    fromWhichMarriage?: number;
    otherParentId?: string;
    otherParentName?: string;
    spouseDetails?: any;
    marriageDate?: string;
    marriageOrder?: number;
  };
}

class UserProfileService {
  private baseUrl = '/api/users';

  /**
   * Get user profile with full details
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await apiService.get<UserProfile>(`${this.baseUrl}/profile/${userId}`);
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await apiService.put<UserProfile>(`${this.baseUrl}/profile/${userId}`, profileData);
    return response.data;
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, passwordData: ChangePasswordData): Promise<void> {
    await apiService.put(`${this.baseUrl}/change-password/${userId}`, passwordData);
  }

  /**
   * Get user family tree
   */
  async getUserFamilyTree(userId: string): Promise<FamilyTree> {
    const response = await apiService.get<FamilyTree>(`${this.baseUrl}/family-tree/${userId}`);
    return response.data;
  }

  /**
   * Search users by name
   */
  async searchUsers(query: string, excludeIds: string[] = []): Promise<UserSuggestion[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    if (excludeIds.length > 0) {
      params.append('excludeIds', excludeIds.join(','));
    }

    const response = await apiService.get<UserSuggestion[]>(`${this.baseUrl}/search?${params.toString()}`);
    return response.data;
  }

  /**
   * Get user suggestions for relationships
   */
  async getUserSuggestions(
    type: 'father' | 'mother' | 'spouse' | 'children',
    query: string,
    excludeIds: string[] = []
  ): Promise<UserSuggestion[]> {
    const params = new URLSearchParams();
    params.append('type', type);
    params.append('q', query);
    if (excludeIds.length > 0) {
      params.append('excludeIds', excludeIds.join(','));
    }

    const response = await apiService.get<UserSuggestion[]>(`${this.baseUrl}/suggestions?${params.toString()}`);
    return response.data;
  }

  /**
   * Add family relationship
   */
  async addFamilyRelationship(
    userId: string,
    relationshipData: FamilyRelationshipData
  ): Promise<any> {
    const response = await apiService.post<any>(
      `${this.baseUrl}/family-relationship/${userId}`,
      relationshipData
    );
    return response.data;
  }

  /**
   * Get user analytics
   */
  async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    const response = await apiService.get<UserAnalytics>(`${this.baseUrl}/analytics/${userId}`);
    return response.data;
  }

  /**
   * Verify user account
   */
  async verifyUser(userId: string, isVerified: boolean): Promise<UserProfile> {
    const response = await apiService.put<UserProfile>(`${this.baseUrl}/verify/${userId}`, { isVerified });
    return response.data;
  }

  /**
   * Toggle user status (activate/deactivate)
   */
  async toggleUserStatus(userId: string, isActive: boolean): Promise<UserProfile> {
    const response = await apiService.put<UserProfile>(`${this.baseUrl}/status/${userId}`, { isActive });
    return response.data;
  }

  /**
   * Get user's current spouse
   */
  getCurrentSpouse(user: UserProfile): any {
    return user.marriages?.find(marriage =>
      marriage.isCurrentSpouse && marriage.marriageStatus === 'current'
    );
  }

  /**
   * Get user's children
   */
  getChildren(user: UserProfile): any[] {
    return user.children || [];
  }

  /**
   * Get user's marriage history
   */
  getMarriageHistory(user: UserProfile): any[] {
    return user.marriages?.sort((a, b) => a.marriageOrder - b.marriageOrder) || [];
  }

  /**
   * Format user full name
   */
  getFullName(user: UserProfile): string {
    const parts = [user.firstName];
    if (user.middleName) parts.push(user.middleName);
    parts.push(user.lastName);
    return parts.join(' ');
  }

  /**
   * Get user display name (first name + last name)
   */
  getDisplayName(user: UserProfile): string {
    return `${user.firstName} ${user.lastName}`;
  }

  /**
   * Check if user is verified
   */
  isVerified(user: UserProfile): boolean {
    return user.isVerified;
  }

  /**
   * Check if user is active
   */
  isActive(user: UserProfile): boolean {
    return user.isActive;
  }

  /**
   * Get user role name
   */
  getRoleName(user: UserProfile): string {
    return user.role?.name || 'Unknown';
  }

  /**
   * Get user permissions
   */
  getPermissions(user: UserProfile): string[] {
    return user.role?.permissions || [];
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(user: UserProfile, permission: string): boolean {
    return this.getPermissions(user).includes(permission);
  }

  /**
   * Get user's family size
   */
  getFamilySize(familyTree: FamilyTree): number {
    return familyTree.familyMembers.length;
  }

  /**
   * Get user's children count
   */
  getChildrenCount(user: UserProfile): number {
    return this.getChildren(user).length;
  }

  /**
   * Get user's marriage count
   */
  getMarriageCount(user: UserProfile): number {
    return this.getMarriageHistory(user).length;
  }
}

export const userProfileService = new UserProfileService();
