import {
    Controller, Post, Body,
    Header, Param, Queries,
    Get, Query, Put, Delete
} from "@cmmv/http";

import {
    Auth
} from "@cmmv/auth";

import {
    Application
} from "@cmmv/core";

import {
    CommentsPublicService
} from "./comments.service";

@Controller()
export class CommentsAdminController {
    constructor(private readonly commentsService: CommentsPublicService){}

    @Get("comments-with-details", {
        summary: "Get comments with details for admin panel",
        exposeFilters: true
    })
    @Auth({ rootOnly: true })
    async getCommentsForAdmin(
        @Queries() queries: any
    ) {
        return await this.commentsService.findWithDetails(queries);
    }

    @Put("comments/:commentId/approve", {
        summary: "Approve a comment",
        exposeFilters: true
    })
    @Auth({ rootOnly: true })
    async approveComment(@Param("commentId") commentId: string) {
        return await this.commentsService.approveComment(commentId);
    }

    @Put("comments/:commentId/reject", {
        summary: "Reject a comment",
        exposeFilters: true
    })
    @Auth({ rootOnly: true })
    async rejectComment(@Param("commentId") commentId: string) {
        return await this.commentsService.rejectComment(commentId);
    }
}

@Controller("blog")
export class CommentsPublicController {
    constructor(private readonly commentsService: CommentsPublicService){}

    @Post("comments/:slug", {
        contract: Application.getContract("CommentsContract"),
        summary: "Create a new comment",
        exposeFilters: true,
        exclude: true
    })
    async createComment(
        @Body() body: string,
        @Param("slug") slug: string,
        @Header("Authorization") token: string,
        @Queries() queries: any
    ) {
        return this.commentsService.createComment(token, slug, body, queries);
    }

    @Get("comments/:slug")
    async getComments(
        @Param("slug") slug: string,
        @Query("offset") offset: number = 0,
        @Query("sortBy") sortBy: string = "recent"
    ): Promise<{ comments: any[]; total: number; hasMore: boolean }> {
        return await this.commentsService.getCommentsByPostId(
            slug,
            Number(offset),
            sortBy as 'recent' | 'relevant'
        );
    }

    @Get("comments/:commentId/replies", {
        summary: "Get replies for a comment",
        exposeFilters: true
    })
    async getReplies(
        @Param("commentId") commentId: string,
        @Query("offset") offset: number = 0
    ): Promise<{ replies: any[]; total: number; hasMore: boolean }> {
        return await this.commentsService.getCommentReplies(commentId, Number(offset));
    }

    @Post("comments/:commentId/like", {
        summary: "Like a comment",
        exposeFilters: true
    })
    async likeComment(
        @Param("commentId") commentId: string,
        @Header("Authorization") token: string
    ) {
        return await this.commentsService.likeComment(commentId, token);
    }

    @Post("comments/:commentId/unlike", {
        summary: "Unlike a comment",
        exposeFilters: true
    })
    async unlikeComment(
        @Param("commentId") commentId: string,
        @Header("Authorization") token: string
    ) {
        return await this.commentsService.unlikeComment(commentId, token);
    }

    @Put("comments/:commentId", {
        summary: "Edit a comment",
        exposeFilters: true
    })
    async editComment(
        @Param("commentId") commentId: string,
        @Body() body: any,
        @Header("Authorization") token: string
    ): Promise<any> {
        return await this.commentsService.editComment(token, commentId, body.content);
    }

    @Delete("comments/:commentId", {
        summary: "Delete a comment",
        exposeFilters: true
    })
    async deleteComment(
        @Param("commentId") commentId: string,
        @Header("Authorization") token: string
    ) {
        return await this.commentsService.deleteComment(token, commentId);
    }

    @Get("comments/:commentId/hasLike", {
        summary: "Check if a comment has a like",
        exposeFilters: true
    })
    async commentHasLike(
        @Param("commentId") commentId: string,
        @Header("Authorization") token: string
    ) {
        return await this.commentsService.commentHasLike(commentId, token);
    }

    @Get("comments/hasLikeBulk", {
        summary: "Check if multiple comments have a like",
        exposeFilters: true
    })
    async commentsHasLikeBulk(
        @Query("commentIds") commentIds: string[],
        @Header("Authorization") token: string
    ) {
        return await this.commentsService.commentsHasLikeBulk(commentIds, token);
    }



}
