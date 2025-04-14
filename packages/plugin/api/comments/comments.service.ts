import {
    Service,
} from "@cmmv/core";

import {
    Repository
} from "@cmmv/repository";

import {
    MembersPublicService
} from "../members/members.service";

import {
    PostsPublicService
} from "../posts/posts.service";

import {
    SettingsService
} from "../settings/settings.service";

// Interface para comentários para melhorar a tipagem
export interface Comment {
    id: string;
    member: string;
    post: string;
    content: string;
    parentId?: string;
    inReplyTo?: string;
    createdAt: Date;
    updatedAt: Date;
    likes: number;
    replies?: Comment[];
    replyCount?: number;
    hasMoreReplies?: boolean;
    memberInfo?: any;
    postInfo?: any;
    status?: string;
}

@Service('blog_comments_public')
export class CommentsPublicService {
    constructor(
        private readonly membersService: MembersPublicService,
        private readonly postsService: PostsPublicService,
        private readonly settingsService: SettingsService
    ) {}

    /**
     * Create a new comment
     * @param token - The token of the member
     * @param postId - The id of the post
     * @param commentContent - The content of the comment
     * @param queries - The queries
     * @returns The comment
     */
    public async createComment(
        token: string,
        slug: string,
        commentContent: any,
        queries: any
    ) {
        const member = await this.membersService.getProfile(token);
        const approveComment = await this.settingsService.getSetting("blog.approveComments");

        let status = "published";

        if(approveComment && approveComment.value === "true")
            status = "pending";

        if (!member)
            throw new Error('Member not found');

        const postId = await this.postsService.getPostIdBySlug(slug);
        const CommentsEntity = Repository.getEntity("CommentsEntity");
        const PostsEntity = Repository.getEntity("PostsEntity");

        let insertData: any = {
            member: member.id,
            post: postId,
            content: commentContent.content,
            status: status
        };

        if(queries.parentId)
            insertData.parentId = queries.parentId;

        if(queries.inReplyTo)
            insertData.inReplyTo = queries.inReplyTo;

        const comment = await Repository.insert(CommentsEntity, insertData);
        const post = await Repository.findOne(PostsEntity, { id: postId }, {
            select: [ "id", "comments" ]
        });

        if(post)
            await Repository.update(PostsEntity, { id: postId }, { comments: post.comments + 1 });

        return comment;
    }

    /**
     * Get comments for a post with pagination and sorting options
     * @param postId - The id of the post
     * @param offset - The offset for pagination (default: 0)
     * @param sortBy - Sort by 'recent' or 'relevant' (default: 'recent')
     * @returns Object containing comments, total count, and hasMore flag
     */
    public async getCommentsByPostId(
        postId: string,
        offset: number = 0,
        sortBy: 'recent' | 'relevant' = 'recent'
    ) {
        const CommentsEntity = Repository.getEntity("CommentsEntity");
        const limit = 10;

        const ordering = {
            sortBy: sortBy === 'recent' ? 'createdAt' : 'likes',
            sort: 'DESC'
        };

        const parentCommentsResult = await Repository.findAll(CommentsEntity, {
            post: postId,
            parentId: null,
            limit,
            offset,
            deleted: false,
            status: 'published',
            ...ordering
        });

        if (!parentCommentsResult || !parentCommentsResult.data || !parentCommentsResult.count) {
            return {
                comments: [],
                total: 0,
                hasMore: false
            };
        }

        const parentComments = parentCommentsResult.data;
        const totalComments = parentCommentsResult.count;

        if (parentComments.length > 0) {
            const parentIds = parentComments.map((comment: any) => comment.id);

            for (const comment of parentComments as Comment[]) {
                const repliesResult = await Repository.findAll(CommentsEntity, {
                    parentId: comment.id,
                    deleted: false,
                    sortBy: 'createdAt',
                    sort: 'DESC',
                    limit: 3,
                    offset: 0
                });

                if (repliesResult && repliesResult.data) {
                    comment.replies = repliesResult.data;
                    const replyCount = repliesResult.count || 0;
                    comment.replyCount = replyCount;
                    comment.hasMoreReplies = replyCount > (comment.replies?.length || 0);
                } else {
                    comment.replies = [];
                    comment.replyCount = 0;
                    comment.hasMoreReplies = false;
                }
            }
        }

        const comments = await this.enrichCommentsWithMemberInfo(parentComments);

        return {
            comments,
            total: totalComments,
            hasMore: offset + parentComments.length < totalComments
        };
    }

    /**
     * Get more replies for a specific comment
     * @param commentId - The id of the parent comment
     * @param offset - The offset for pagination (default: 0)
     * @returns Object containing replies, total count, and hasMore flag
     */
    public async getCommentReplies(commentId: string, offset: number = 0) {
        const CommentsEntity = Repository.getEntity("CommentsEntity");
        const limit = 10;

        const comment = await Repository.findOne(CommentsEntity, { id: commentId });

        if (!comment)
            throw new Error('Comment not found');

        const repliesResult = await Repository.findAll(CommentsEntity, {
            parentId: commentId,
            sortBy: 'createdAt',
            sort: 'DESC',
            limit,
            offset,
            deleted: false,
            status: 'published'
        });

        if (!repliesResult || !repliesResult.data) {
            return {
                replies: [],
                total: 0,
                hasMore: false
            };
        }

        const replies = repliesResult.data;
        const totalReplies = repliesResult.count || 0;
        const enrichedReplies = await this.enrichCommentsWithMemberInfo(replies);

        return {
            replies: enrichedReplies,
            total: totalReplies,
            hasMore: offset + replies.length < totalReplies
        };
    }

    /**
     * Enrich comments with member information
     * @param comments - Array of comments to enrich
     * @returns Enriched comments with member information
     */
    public async enrichCommentsWithMemberInfo(comments: Comment[]) {
        if (!comments || comments.length === 0)
            return [];

        const memberIds = new Set<string>();

        for (const comment of comments) {
            if (comment.member)
                memberIds.add(comment.member);

            if (comment.replies && comment.replies.length > 0) {
                for (const reply of comment.replies) {
                    if (reply.member) {
                        memberIds.add(reply.member);
                    }
                }
            }
        }

        const memberIdsArray = Array.from(memberIds);
        const memberInfo = [];

        for (const memberId of memberIdsArray) {
            try {
                const member = await this.membersService.getProfileByID(memberId);

                if (member)
                    memberInfo.push(member);
            } catch (error) {
                console.error(`Error fetching member info for ID ${memberId}:`, error);
            }
        }

        const memberMap = memberInfo.reduce((acc: Record<string, any>, member: any) => {
            acc[member.id] = member;
            return acc;
        }, {});

        const enrichedComments = comments.map(comment => {
            const enrichedComment = {
                ...comment,
                memberInfo: memberMap[comment.member] || null
            };

            if (comment.replies && comment.replies.length > 0) {
                enrichedComment.replies = comment.replies.map((reply: Comment) => ({
                    ...reply,
                    memberInfo: memberMap[reply.member] || null
                }));
            }

            return enrichedComment;
        });

        return enrichedComments;
    }

    /**
     * Edit a comment - only the author can edit their comment
     * @param token - The token of the member
     * @param commentId - The id of the comment to edit
     * @param content - The new content for the comment
     * @returns The updated comment
     */
    public async editComment(token: string, commentId: string, content: string) {
        const member = await this.membersService.getProfile(token);

        if (!member)
            throw new Error('Member not found');

        const CommentsEntity = Repository.getEntity("CommentsEntity");
        const comment = await Repository.findOne(CommentsEntity, {
            id: commentId,
            deleted: false,
            status: 'published'
        });

        if (!comment)
            throw new Error('Comment not found');

        if (comment.member !== member.id)
            throw new Error('You can only edit your own comments');

        const updatedComment = await Repository.update(CommentsEntity,
            { id: commentId },
            {
                content: content,
                editedAt: new Date()
            }
        );

        const result = await Repository.findOne(CommentsEntity, { id: commentId });
        const enriched = await this.enrichCommentsWithMemberInfo([result]);

        return enriched[0];
    }

    /**
     * Delete a comment - only the author can delete their comment
     * @param token - The token of the member
     * @param commentId - The id of the comment to delete
     * @returns Success message
     */
    public async deleteComment(token: string, commentId: string) {
        const member = await this.membersService.getProfile(token);

        if (!member)
            throw new Error('Member not found');

        const CommentsEntity = Repository.getEntity("CommentsEntity");
        const PostsEntity = Repository.getEntity("PostsEntity");
        const comment = await Repository.findOne(CommentsEntity, { id: commentId });
        const post = await Repository.findOne(PostsEntity, { id: comment.post }, { select: [ "id", "comments" ] });

        if (!comment)
            throw new Error('Comment not found');

        if (comment.member !== member.id)
            throw new Error('You can only delete your own comments');

        await Repository.update(CommentsEntity,
            { id: commentId },
            {
                deleted: true,
                deletedAt: new Date(),
                status: 'deleted'
            }
        );

        await Repository.update(PostsEntity,
            { id: post.id },
            {
                comments: post.comments - 1
            }
        );

        return {
            success: true,
            message: 'Comment deleted successfully'
        };
    }

    /**
     * Like a comment
     * @param commentId - The id of the comment to like
     * @param token - The token of the member
     * @returns The updated comment
     */
    public async likeComment(commentId: string, token: string) {
        const member = await this.membersService.getProfile(token);

        if (!member)
            throw new Error('Member not found');

        const CommentsEntity = Repository.getEntity("CommentsEntity");
        const CommentsLikesEntity = Repository.getEntity("CommentsLikesEntity");

        const comment = await Repository.findOne(CommentsEntity, { id: commentId });
        const like = await Repository.findOne(CommentsLikesEntity, { comment: commentId, member: member.id });

        if (like)
            throw new Error('You already liked this comment');

        if (!comment)
            throw new Error('Comment not found');

        if (comment.member !== member.id)
            throw new Error('You can only like your own comments');

        await Repository.update(CommentsEntity, { id: commentId }, { likes: comment.likes + 1 });
        await Repository.insert(CommentsLikesEntity, { comment: commentId, member: member.id });
        return { success: true };
    }

    /**
     * Unlike a comment
     * @param commentId - The id of the comment to unlike
     * @param token - The token of the member
     * @returns The updated comment
     */
    public async unlikeComment(commentId: string, token: string) {
        const member = await this.membersService.getProfile(token);

        if (!member)
            throw new Error('Member not found');

        const CommentsEntity = Repository.getEntity("CommentsEntity");
        const CommentsLikesEntity = Repository.getEntity("CommentsLikesEntity");

        const like = await Repository.findOne(CommentsLikesEntity, { comment: commentId, member: member.id });

        if (!like)
            throw new Error('You have not liked this comment');

        const comment = await Repository.findOne(CommentsEntity, { id: commentId });

        if (!comment)
            throw new Error('Comment not found');

        if (comment.member !== member.id)
            throw new Error('You can only unlike your own comments');

        await Repository.update(CommentsEntity, { id: commentId }, { likes: comment.likes - 1 });
        await Repository.delete(CommentsLikesEntity, { id: like.id });
        return { success: true };
    }

    /**
     * Check if a comment has a like
     * @param commentId - The id of the comment
     * @param token - The token of the member
     * @returns The comment
     */
    public async commentHasLike(commentId: string, token: string) {
        const member = await this.membersService.getProfile(token);

        if (!member)
            throw new Error('Member not found');

        const CommentsLikesEntity = Repository.getEntity("CommentsLikesEntity");
        const like = await Repository.findOne(CommentsLikesEntity, { comment: commentId, member: member.id });

        return { hasLike: like ? true : false };
    }

    /**
     * Check if a comment has a like
     * @param commentIds - The ids of the comments
     * @param token - The token of the member
     * @returns The comments
     */
    public async commentsHasLikeBulk(commentIds: string[], token: string) {
        const member = await this.membersService.getProfile(token);

        if (!member)
            throw new Error('Member not found');

        const CommentsLikesEntity = Repository.getEntity("CommentsLikesEntity");
        const likes = await Repository.findAll(CommentsLikesEntity, { comment: { in: commentIds }, member: member.id });

        if (!likes || !likes.data)
            return [];

        return likes.data.map((like: any) => like.comment);
    }

    /**
     * Find comments with detailed information for admin panel
     * @param queries - Filter and pagination options
     * @returns Object containing enriched comments with member and post info
     */
    public async findWithDetails(queries: any) {
        try {
            const CommentsEntity = Repository.getEntity("CommentsEntity");

            const limit = queries.limit ? parseInt(queries.limit) : 10;
            const offset = queries.offset ? parseInt(queries.offset) : 0;
            const filter: any = {};

            if (queries.search && queries.searchField === 'content')
                filter.content = { contains: queries.search };

            if (queries.status)
                filter.status = queries.status;

            const sortBy = queries.sortBy || 'createdAt';
            const sort = queries.sort || 'DESC';

            const commentsResult = await Repository.findAll(CommentsEntity, {
                ...filter,
                limit,
                offset,
                sortBy,
                sort,
                deleted: false
            });

            if (!commentsResult || !commentsResult.data || !commentsResult.data.length) {
                console.log("No comments found");
                return {
                    data: [],
                    count: 0,
                    pagination: { limit, offset }
                };
            }

            const comments = commentsResult.data;
            const totalCount = commentsResult.count || 0;
            const enrichedComments = [];

            for (const comment of comments) {
                try {
                    let memberInfo = null;
                    if (comment.member) {
                        try {
                            const memberData = await this.membersService.getProfileByID(comment.member);
                            if (memberData) {
                                memberInfo = {
                                    id: memberData.id,
                                    name: memberData.name,
                                    email: memberData.email,
                                    avatar: memberData.avatar
                                };
                            }
                        } catch (memberError) {
                            console.error(`Error fetching member ${comment.member}:`, memberError);
                        }
                    }

                    let postInfo = null;

                    if (comment.post) {
                        try {
                            const PostsEntity = Repository.getEntity("PostsEntity");
                            const post = await Repository.findOne(PostsEntity, { id: comment.post });
                            if (post) {
                                postInfo = {
                                    id: post.id,
                                    title: post.title,
                                    slug: post.slug
                                };
                            }
                        } catch (postError) {
                            console.error(`Error fetching post ${comment.post}:`, postError);
                        }
                    }

                    enrichedComments.push({
                        ...comment,
                        memberInfo,
                        postInfo
                    });
                } catch (itemError) {
                    console.error("Error processing comment:", itemError);
                    enrichedComments.push(comment);
                }
            }

            return {
                data: enrichedComments,
                count: totalCount,
                pagination: { limit, offset }
            };
        } catch (error: any) {
            console.error("Error in findWithDetails:", error);
            throw new Error("Failed to get comments with details: " + (error.message || "Unknown error"));
        }
    }

    /**
     * Approve a comment
     * @param commentId - The id of the comment to approve
     * @returns The updated comment
     */
    public async approveComment(commentId: string) {
        const CommentsEntity = Repository.getEntity("CommentsEntity");
        const comment = await Repository.findOne(CommentsEntity, {
            id: commentId,
            deleted: false,
            status: 'pending'
        });

        if (!comment)
            throw new Error('Comment not found');

        await Repository.update(CommentsEntity, { id: commentId }, { status: 'published' });
        return { success: true };
    }

    /**
     * Reject a comment
     * @param commentId - The id of the comment to reject
     * @returns The updated comment
     */
    public async rejectComment(commentId: string) {
        const CommentsEntity = Repository.getEntity("CommentsEntity");
        const comment = await Repository.findOne(CommentsEntity, {
            id: commentId,
            deleted: false,
            status: 'pending'
        });

        if (!comment)
            throw new Error('Comment not found');

        await Repository.update(CommentsEntity, { id: commentId }, { status: 'rejected' });
        return { success: true };
    }

    /**
     * Get comments pending
     * @param queries - Filter and pagination options
     * @returns The comments
     */
    public async getCommentsPending(queries: any) {
        const CommentsEntity = Repository.getEntity("CommentsEntity");
        const limit = queries.limit ? parseInt(queries.limit) : 10;
        const offset = queries.offset ? parseInt(queries.offset) : 0;
        const filter: any = {};

        if (queries.search && queries.searchField === 'content')
            filter.content = { contains: queries.search };

        const comments = await Repository.findAll(CommentsEntity, {
            status: 'pending',
            limit,
            offset,
            sortBy: 'createdAt',
            sort: 'DESC'
        });

        return comments;
    }
}
