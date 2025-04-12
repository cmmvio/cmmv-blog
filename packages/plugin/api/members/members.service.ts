import * as crypto from 'node:crypto';
import * as jwt from 'jsonwebtoken';

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
        const MemberEntity = Repository.getEntity('MemberEntity');
        const existingMember = await Repository.findOne(MemberEntity, Repository.queryBuilder({
            email: payload.email
        }));

        if (existingMember)
            throw new Error('Member with this email already exists');

        const hashedPassword = crypto.createHash('sha256').update(payload.password).digest('hex');

        const member = await Repository.insert(MemberEntity, {
            email: payload.email,
            password: hashedPassword,
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
     * Login a member
     * @param payload Login data
     * @returns Login response
     */
    async login(payload: any) {
        const MemberEntity = Repository.getEntity('MemberEntity');
        const hashedPassword = crypto.createHash('sha256').update(payload.password).digest('hex');

        const existingMember = await Repository.findOne(MemberEntity, Repository.queryBuilder({
            email: payload.email,
            password: hashedPassword
        }));

        if (!existingMember)
            throw new Error('Invalid username or password');

        // Generate a JWT token
        const token = jwt.sign({
            id: existingMember.id
        }, process.env.JWT_SECRET || "member-secret", { expiresIn: '24h' });

        return {
            token,
            member: existingMember,
            message: 'Login successful'
        };
    }

    /**
     * Get a member profile by ID
     * @param token JWT token
     * @returns Member profile data
     */
    async getProfile(token: string) {
        const MemberEntity = Repository.getEntity('MemberEntity');
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || "member-secret");
        const id: string = (decoded as any).id;

        const member = await Repository.findOne(MemberEntity, Repository.queryBuilder({
            id
        }), {
            select: ["id", "email", "name", "note", "getLocation", "emailDisabled", "lastSeenAt", "lastCommentedAt"]
        });

        if (!member)
            throw new Error('Member not found');

        if (id !== member.id) {
            return {
                id: member.id,
                name: member.name
            };
        }

        return member;
    }

    /**
     * Get a member profile by ID
     * @param id Member ID
     * @returns Member profile data
     */
    async getProfileByID(id: string) {
        const MemberEntity = Repository.getEntity('MemberEntity');
        const member = await Repository.findOne(MemberEntity, Repository.queryBuilder({
            id
        }));

        if (!member)
            throw new Error('Member not found');

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
        const MemberEntity = Repository.getEntity('MemberEntity');

        const member = await Repository.findOne(MemberEntity, Repository.queryBuilder({
            id
        }));

        if (!member)
            throw new Error('Member not found');

        if (id !== currentUserId)
            throw new Error('Unauthorized: You can only update your own profile');

        const updateData: any = {};

        if (payload.name) updateData.name = payload.name;
        if (payload.note !== undefined) updateData.note = payload.note;
        if (payload.getLocation !== undefined) updateData.getLocation = payload.getLocation;
        if (payload.emailDisabled !== undefined) updateData.emailDisabled = payload.emailDisabled;

        await Repository.update(MemberEntity, { id }, updateData);

        return this.getProfileByID(id);
    }
}
