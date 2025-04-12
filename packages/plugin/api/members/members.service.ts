import {
    Service
} from "@cmmv/core";

import {
    Repository
} from "@cmmv/repository";

@Service('blog_members_public')
export class MembersPublicService {
    /**
     * Create a new member
     * @param payload Member data
     * @returns Created member
     */
    async createMember(payload: any) {
        const MembersEntity = Repository.getEntity('MembersEntity');

        // Check if member with this email already exists
        const existingMember = await Repository.findOne(MembersEntity, Repository.queryBuilder({
            email: payload.email
        }));

        if (existingMember) {
            throw new Error('Member with this email already exists');
        }

        // Create the member
        const member = await Repository.insert(MembersEntity, {
            email: payload.email,
            name: payload.name,
            note: payload.note || null,
            getLocation: payload.getLocation || null,
            emailCount: 0,
            emailOpenedCount: 0,
            emailOpenRate: 0,
            emailDisabled: false
        });

        return member;
    }

    /**
     * Get a member profile by ID
     * @param id Member ID
     * @param currentUserId The ID of the currently authenticated user
     * @returns Member profile data
     */
    async getProfile(id: string, currentUserId: string) {
        const MembersEntity = Repository.getEntity('MembersEntity');

        // Check if the member exists
        const member = await Repository.findOne(MembersEntity, Repository.queryBuilder({
            id
        }), {
            select: ["id", "email", "name", "note", "getLocation", "emailDisabled", "lastSeenAt", "lastCommentedAt"]
        });

        if (!member) {
            throw new Error('Member not found');
        }

        // Security check: only allow members to view their own profile
        if (id !== currentUserId) {
            // Return limited public information
            return {
                id: member.id,
                name: member.name
            };
        }

        // Return full profile for the owner
        return member;
    }

    /**
     * Update a member profile
     * @param id Member ID
     * @param payload Profile update data
     * @param currentUserId The ID of the currently authenticated user
     * @returns Updated member profile
     */
    async updateProfile(id: string, payload: any, currentUserId: string) {
        const MembersEntity = Repository.getEntity('MembersEntity');

        // Check if the member exists
        const member = await Repository.findOne(MembersEntity, Repository.queryBuilder({
            id
        }));

        if (!member) {
            throw new Error('Member not found');
        }

        // Security check: only allow members to update their own profile
        if (id !== currentUserId) {
            throw new Error('Unauthorized: You can only update your own profile');
        }

        // Prepare update data
        const updateData: any = {};

        // Only allow updating specific fields
        if (payload.name) updateData.name = payload.name;
        if (payload.note !== undefined) updateData.note = payload.note;
        if (payload.getLocation !== undefined) updateData.getLocation = payload.getLocation;
        if (payload.emailDisabled !== undefined) updateData.emailDisabled = payload.emailDisabled;

        // Update the member profile
        const updatedMember = await Repository.update(MembersEntity, { id }, updateData);

        return this.getProfile(id, currentUserId);
    }
}
