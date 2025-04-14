/**
 * CMMV Blog Comments System
 * A vanilla JavaScript implementation of the comment system that can be used with any frontend framework
 */

class CMMVComments {
    constructor(options = {}) {
        // Configuration options with defaults
        this.options = {
            container: options.container || null,
            postId: options.postId || null,
            apiBaseUrl: options.apiBaseUrl || '/api',
            authTokenName: options.authTokenName || 'cmmv_auth_token',
            theme: options.theme || 'light',
            placeholders: {
                commentInput: options.placeholders?.commentInput || 'Write your comment here...',
                emptyComments: options.placeholders?.emptyComments || 'Be the first to comment!',
                signInPrompt: options.placeholders?.signInPrompt || 'You need to be logged in to leave a comment.',
                signInButton: options.placeholders?.signInButton || 'Sign in to comment',
                postButton: options.placeholders?.postButton || 'Post Comment',
                replyButton: options.placeholders?.replyButton || 'Reply',
                editButton: options.placeholders?.editButton || 'Edit',
                deleteButton: options.placeholders?.deleteButton || 'Delete',
                cancelButton: options.placeholders?.cancelButton || 'Cancel',
                updateButton: options.placeholders?.updateButton || 'Update',
                submittingButton: options.placeholders?.submittingButton || 'Submitting...',
                confirmDeleteMessage: options.placeholders?.confirmDeleteMessage || 'Are you sure you want to delete this comment?'
            },
            onSignInClick: options.onSignInClick || this.defaultSignInRedirect.bind(this),
            onCommentSubmit: options.onCommentSubmit || null,
            onCommentLike: options.onCommentLike || null
        };

        // State variables
        this.state = {
            isLoggedIn: false,
            isSubmitting: false,
            currentUser: null,
            comments: [],
            replyingTo: null,
            editingComment: null,
            showMainEmojiPicker: false,  // Para o seletor de emoji do formulário principal
            showReplyEmojiPicker: false, // Para o seletor de emoji das respostas
            activeEmojiCommentId: null,  // ID do comentário com seletor de emoji aberto
            showMentionSuggestions: false,
            currentMention: '',
            mentionStartIndex: -1,
            newComment: {
                content: '',
                parentId: null
            },
            mentionUsers: [],
            filteredMentionUsers: [],
            isLoading: false,
            isLoadingMore: false,
            commentOffset: 0,
            totalComments: 0,
            hasMoreComments: false,
            replyForms: new Set() // Armazena IDs de comentários que têm formulários de resposta abertos
        };

        // Common emojis for the emoji picker
        this.commonEmojis = ['😀', '😊', '👍', '❤️', '🎉', '🔥', '😂', '👏', '🙌', '🤔', '😍', '🙏', '👌', '💯', '🌟', '👀', '🤩', '💪'];

        // Element references
        this.elements = {
            container: null,
            commentForm: null,
            commentTextarea: null,
            emojiPicker: null,
            mentionSuggestions: null
        };

        // Bind methods
        this.init = this.init.bind(this);
        this.checkAuthStatus = this.checkAuthStatus.bind(this);
        this.fetchComments = this.fetchComments.bind(this);
        this.renderCommentSection = this.renderCommentSection.bind(this);
        this.editComment = this.editComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.handleReplySubmit = this.handleReplySubmit.bind(this);

        // Initialize if container is provided
        if (this.options.container && this.options.postId) {
            this.init();
        }
    }

    /**
     * Initialize the comment section
     */
    init() {
        this.handleSubmitComment = this.handleSubmitComment || function() { console.warn('handleSubmitComment not found'); };
        this.handleTextareaInput = this.handleTextareaInput || function() { console.warn('handleTextareaInput not found'); };
        this.toggleEmojiPicker = this.toggleEmojiPicker || function() { console.warn('toggleEmojiPicker not found'); };
        this.cancelReply = this.cancelReply || function() { console.warn('cancelReply not found'); };
        this.loadMoreComments = this.loadMoreComments || function() { console.warn('loadMoreComments not found'); };
        this.loadMoreReplies = this.loadMoreReplies || function() { console.warn('loadMoreReplies not found'); };

        if (typeof this.options.container === 'string') {
            this.elements.container = document.querySelector(this.options.container);
        } else {
            this.elements.container = this.options.container;
        }

        if (!this.elements.container)
            return;

        this.state.isLoading = false;
        this.state.isLoadingMore = false;
        this.state.commentOffset = 0;
        this.state.totalComments = 0;
        this.state.hasMoreComments = false;

        this.checkAuthStatus();
        this.fetchComments();
        this.renderCommentSection();

        document.addEventListener('click', (event) => {
            if (this.state.showEmojiPicker && this.elements.emojiPicker) {
                if (!this.elements.emojiPicker.contains(event.target) &&
                    event.target !== this.elements.emojiButton) {
                    this.state.showEmojiPicker = false;
                    this.updateUI();
                }
            }
        });
    }

    /**
     * Default redirect for sign in
     */
    defaultSignInRedirect() {
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/member/login?redirect=${encodeURIComponent(currentPath)}`;
    }

    /**
     * Check if user is authenticated
     */
    checkAuthStatus() {
        // Try to get auth data from sessionStorage first, then localStorage
        let memberData = null;
        try {
            const sessionData = sessionStorage.getItem('member');
            const localData = localStorage.getItem('member');

            // Use sessionStorage data if available, otherwise use localStorage
            const dataString = sessionData || localData;

            if (dataString) {
                memberData = JSON.parse(dataString);
            }
        } catch (e) {
            console.error('Error parsing auth data:', e);
        }

        // Check if we have valid member data with token and member object
        if (memberData && memberData.token && memberData.member && memberData.member.name) {
            this.state.isLoggedIn = true;
            this.state.currentUser = {
                id: memberData.member.id,
                name: memberData.member.name,
                email: memberData.member.email,
                avatar: memberData.member.avatar || null
            };
        } else {
            this.state.isLoggedIn = false;
            this.state.currentUser = null;
        }

        return this.state.isLoggedIn;
    }

    /**
     * Fetch comments for the current post
     */
    fetchComments() {
        // Mostrar um estado de carregamento ou placeholder se desejado
        this.state.isLoading = true;
        this.updateUI();

        // Construir a URL da API com parâmetros de consulta
        const url = `${this.options.apiBaseUrl}/blog/comments/${this.options.postId}?offset=0&sortBy=recent`;

        // Para depuração
        console.log('Fetching comments from URL:', url);

        // Fazer a requisição à API
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch comments: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                // Para depuração
                console.log('API response:', data);

                // Acessar os dados da resposta aninhada dentro de result
                const result = data.result || {};

                // Processar os dados recebidos
                this.state.comments = result.comments || [];
                this.state.totalComments = result.total || 0;
                this.state.hasMoreComments = result.hasMore || false;
                this.state.commentOffset = this.state.comments.length;

                // Verificar os likes do usuário se estiver logado
                if (this.state.isLoggedIn) {
                    this.checkUserLikes();
                }

                // Atualizar os usuários para menções
                this.updateMentionUsers();

                // Atualizar a UI com os novos comentários
                this.state.isLoading = false;
                this.updateUI();
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
                this.state.isLoading = false;
                this.state.comments = []; // Garantir que o array de comentários está vazio em caso de erro
                this.updateUI();
            });
    }

    /**
     * Verificar quais comentários o usuário atual deu like
     */
    async checkUserLikes() {
        if (!this.state.isLoggedIn || this.state.comments.length === 0) {
            return;
        }

        const token = this.getAuthToken();
        if (!token) return;

        try {
            // Criar um array com todos os IDs de comentários (principais e respostas)
            const commentIds = [];

            // Adicionar comentários principais
            this.state.comments.forEach(comment => {
                commentIds.push(comment.id);

                // Adicionar respostas, se houver
                if (comment.replies && comment.replies.length > 0) {
                    comment.replies.forEach(reply => {
                        commentIds.push(reply.id);
                    });
                }
            });

            if (commentIds.length === 0) return;

            // Usar o endpoint hasLikeBulk para verificar todos os likes de uma vez
            const url = new URL(`${this.options.apiBaseUrl}/blog/comments/hasLikeBulk`);

            // Adicionar os IDs de comentários como parâmetros de consulta
            commentIds.forEach(id => {
                url.searchParams.append('commentIds', id);
            });

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to check likes: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Bulk like check response:', data);

            // Acessar o resultado aninhado
            const result = data.result || {};

            // O resultado deve conter um mapa de IDs de comentários para status de like
            const likesMap = result.likes || {};

            console.log('Likes map from API:', likesMap);

            // Atualizar os comentários com as informações de like
            this.state.comments.forEach(comment => {
                comment.hasLiked = likesMap[comment.id] === true;

                if (comment.replies) {
                    comment.replies.forEach(reply => {
                        reply.hasLiked = likesMap[reply.id] === true;
                    });
                }
            });

            // Atualizar a interface
            this.updateUI();
        } catch (error) {
            console.error('Error checking likes:', error);
            // Fallback para o método individual em caso de erro
            this.checkLikesIndividually();
        }
    }

    /**
     * Método de fallback para verificar likes individualmente
     */
    async checkLikesIndividually() {
        if (!this.state.isLoggedIn || this.state.comments.length === 0) {
            return;
        }

        const token = this.getAuthToken();
        if (!token) return;

        try {
            // Criar um array com todos os IDs de comentários (principais e respostas)
            const commentIds = [];

            // Adicionar comentários principais
            this.state.comments.forEach(comment => {
                commentIds.push(comment.id);

                // Adicionar respostas, se houver
                if (comment.replies && comment.replies.length > 0) {
                    comment.replies.forEach(reply => {
                        commentIds.push(reply.id);
                    });
                }
            });

            // Verificar likes para cada comentário individualmente
            const likesPromises = commentIds.map(commentId => {
                const url = `${this.options.apiBaseUrl}/blog/comments/${commentId}/hasLike`;

                return fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        return { commentId, hasLike: false };
                    }
                    return response.json().then(data => {
                        // Corrigir acesso à propriedade hasLike na estrutura de dados
                        const hasLike = data.result && data.result.hasLike;
                        return {
                            commentId,
                            hasLike: hasLike === true
                        };
                    });
                })
                .catch((error) => {
                    console.error('Error checking like for comment', commentId, error);
                    return { commentId, hasLike: false };
                });
            });

            // Processar os resultados e atualizar o estado
            const likesResults = await Promise.all(likesPromises);

            // Criar um mapa para facilitar a busca
            const likesMap = {};
            likesResults.forEach(result => {
                likesMap[result.commentId] = result.hasLike;
            });

            // Atualizar os comentários com as informações de like
            this.state.comments.forEach(comment => {
                comment.hasLiked = likesMap[comment.id] === true;

                if (comment.replies) {
                    comment.replies.forEach(reply => {
                        reply.hasLiked = likesMap[reply.id] === true;
                    });
                }
            });

            // Atualizar a interface
            this.updateUI();
        } catch (error) {
            console.error('Error checking likes (fallback):', error);
        }
    }

    /**
     * Carregar mais comentários (paginação)
     */
    loadMoreComments() {
        if (!this.state.hasMoreComments || this.state.isLoadingMore) return;

        this.state.isLoadingMore = true;
        this.updateUI();

        // Construir a URL com o offset atual para paginação
        const url = `${this.options.apiBaseUrl}/blog/comments/${this.options.postId}?offset=${this.state.commentOffset}&sortBy=recent`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load more comments');
                }
                return response.json();
            })
            .then(data => {
                // Acessar os dados da resposta aninhada dentro de result
                const result = data.result || {};

                // Adicionar os novos comentários aos existentes
                if (result.comments && result.comments.length > 0) {
                    const newComments = result.comments;
                    this.state.comments = [...this.state.comments, ...newComments];
                    this.state.hasMoreComments = result.hasMore || false;
                    this.state.commentOffset = this.state.comments.length;

                    // Verificar os likes do usuário para os novos comentários se estiver logado
                    if (this.state.isLoggedIn) {
                        this.checkLikesForComments(newComments);
                    }

                    // Atualizar os usuários para menções
                    this.updateMentionUsers();
                }

                this.state.isLoadingMore = false;
                this.updateUI();
            })
            .catch(error => {
                console.error('Error loading more comments:', error);
                this.state.isLoadingMore = false;
                this.updateUI();
            });
    }

    /**
     * Verificar likes para um conjunto específico de comentários
     */
    async checkLikesForComments(comments) {
        if (!this.state.isLoggedIn || !comments || comments.length === 0) {
            return;
        }

        const token = this.getAuthToken();
        if (!token) return;

        try {
            // Criar um array com todos os IDs de comentários (principais e respostas)
            const commentIds = [];

            // Adicionar comentários principais
            comments.forEach(comment => {
                commentIds.push(comment.id);

                // Adicionar respostas, se houver
                if (comment.replies && comment.replies.length > 0) {
                    comment.replies.forEach(reply => {
                        commentIds.push(reply.id);
                    });
                }
            });

            // Verificar likes para cada comentário
            const likesPromises = commentIds.map(commentId => {
                const url = `${this.options.apiBaseUrl}/blog/comments/${commentId}/hasLike`;

                return fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        return { commentId, hasLike: false };
                    }
                    return response.json().then(data => {
                        // Corrigir acesso à propriedade hasLike na estrutura de dados
                        const hasLike = data.result && data.result.hasLike;
                        return {
                            commentId,
                            hasLike: hasLike === true
                        };
                    });
                })
                .catch(() => {
                    return { commentId, hasLike: false };
                });
            });

            // Processar os resultados e atualizar o estado
            const likesResults = await Promise.all(likesPromises);

            // Criar um mapa para facilitar a busca
            const likesMap = {};
            likesResults.forEach(result => {
                likesMap[result.commentId] = result.hasLike;
            });

            // Atualizar os comentários com as informações de like
            comments.forEach(comment => {
                comment.hasLiked = likesMap[comment.id] === true;

                if (comment.replies) {
                    comment.replies.forEach(reply => {
                        reply.hasLiked = likesMap[reply.id] === true;
                    });
                }
            });
        } catch (error) {
            console.error('Error checking likes for new comments:', error);
        }
    }

    /**
     * Carregar mais respostas para um comentário específico
     * @param {string} commentId - ID do comentário para o qual carregar mais respostas
     */
    loadMoreReplies(commentId) {
        const comment = this.findComment(commentId);
        if (!comment || !comment.hasMoreReplies || comment.isLoadingReplies) return;

        comment.isLoadingReplies = true;
        this.updateUI();

        // Determinar o offset baseado nas respostas já carregadas
        const repliesOffset = comment.replies ? comment.replies.length : 0;

        // Construir a URL para buscar mais respostas
        const url = `${this.options.apiBaseUrl}/blog/comments/${commentId}/replies?offset=${repliesOffset}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load more replies');
                }
                return response.json();
            })
            .then(data => {
                // Acessar os dados da resposta aninhada dentro de result
                const result = data.result || {};

                if (result.replies && result.replies.length > 0) {
                    // Inicializar o array de respostas se for undefined
                    if (!comment.replies) {
                        comment.replies = [];
                    }

                    // Adicionar as novas respostas às existentes
                    const newReplies = result.replies;
                    comment.replies = [...comment.replies, ...newReplies];
                    comment.hasMoreReplies = result.hasMore || false;
                    comment.replyCount = result.total || comment.replies.length;

                    // Verificar os likes do usuário para as novas respostas se estiver logado
                    if (this.state.isLoggedIn) {
                        this.checkLikesForReplies(newReplies);
                    }
                }

                comment.isLoadingReplies = false;
                this.updateUI();
            })
            .catch(error => {
                console.error('Error loading more replies:', error);
                comment.isLoadingReplies = false;
                this.updateUI();
            });
    }

    /**
     * Verificar likes para um conjunto específico de respostas
     */
    async checkLikesForReplies(replies) {
        if (!this.state.isLoggedIn || !replies || replies.length === 0) {
            return;
        }

        const token = this.getAuthToken();
        if (!token) return;

        try {
            // Criar um array com todos os IDs de respostas
            const replyIds = replies.map(reply => reply.id);

            // Verificar likes para cada resposta
            const likesPromises = replyIds.map(replyId => {
                const url = `${this.options.apiBaseUrl}/blog/comments/${replyId}/hasLike`;

                return fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        return { commentId: replyId, hasLike: false };
                    }
                    return response.json().then(data => {
                        // Corrigir acesso à propriedade hasLike na estrutura de dados
                        const hasLike = data.result && data.result.hasLike;
                        return {
                            commentId: replyId,
                            hasLike: hasLike === true
                        };
                    });
                })
                .catch(() => {
                    return { commentId: replyId, hasLike: false };
                });
            });

            // Processar os resultados e atualizar o estado
            const likesResults = await Promise.all(likesPromises);

            // Criar um mapa para facilitar a busca
            const likesMap = {};
            likesResults.forEach(result => {
                likesMap[result.commentId] = result.hasLike;
            });

            // Atualizar as respostas com as informações de like
            replies.forEach(reply => {
                reply.hasLiked = likesMap[reply.id] === true;
            });
        } catch (error) {
            console.error('Error checking likes for replies:', error);
        }
    }

    /**
     * Update the UI to reflect current state
     */
    updateUI() {
        // Store current focus state and selection/cursor position
        const activeElement = document.activeElement;
        const isTextareaFocused = activeElement && activeElement.classList.contains('comment-textarea');
        let selectionStart = null;
        let selectionEnd = null;

        if (isTextareaFocused) {
            selectionStart = activeElement.selectionStart;
            selectionEnd = activeElement.selectionEnd;
        }

        // Update UI
        this.renderCommentSection();

        // Restore focus and selection if textarea was focused
        if (isTextareaFocused && this.elements.commentTextarea) {
            this.elements.commentTextarea.focus();

            if (selectionStart !== null && selectionEnd !== null) {
                this.elements.commentTextarea.selectionStart = selectionStart;
                this.elements.commentTextarea.selectionEnd = selectionEnd;
            }
        }
    }

    /**
     * Render the entire comment section
     */
    renderCommentSection() {
        if (!this.elements.container) return;

        // Clear container
        this.elements.container.innerHTML = '';

        // Create comment section wrapper
        const commentsContainer = document.createElement('div');
        commentsContainer.className = 'comments-container mt-8 mb-12';

        // Add form section
        const formSection = this.renderFormSection();
        commentsContainer.appendChild(formSection);

        // Add comments list
        const comments = this.getParentComments();
        if ((comments.length > 0 || this.state.isLoading) && !this.state.isSubmitting) {
            const commentsListSection = this.renderCommentsListSection(comments);
            commentsContainer.appendChild(commentsListSection);
        } else if (!this.state.isLoading && comments.length === 0) {
            const emptySection = this.renderEmptyCommentsSection();
            commentsContainer.appendChild(emptySection);
        }

        // Apply dark mode if needed
        if (this.options.theme === 'dark') {
            commentsContainer.classList.add('dark');
        }

        // Add to DOM
        this.elements.container.appendChild(commentsContainer);

        // Initialize references to dynamic elements
        this.initElementReferences();
    }

    /**
     * Initialize references to dynamic elements after rendering
     */
    initElementReferences() {
        try {
            // Obter referências para os elementos
            this.elements.commentTextarea = this.elements.container.querySelector('.comment-textarea');
            this.elements.commentForm = this.elements.container.querySelector('.comment-form');
            this.elements.emojiPicker = this.elements.container.querySelector('.emoji-picker');
            this.elements.emojiButton = this.elements.container.querySelector('.emoji-button');
            this.elements.mentionSuggestions = this.elements.container.querySelector('.mention-suggestions');

            // Add event listeners to dynamic elements, verificando se existem antes
            if (this.elements.commentForm) {
                this.elements.commentForm.addEventListener('submit', this.handleSubmitComment.bind(this));
            }

            if (this.elements.commentTextarea) {
                this.elements.commentTextarea.addEventListener('input', this.handleTextareaInput.bind(this));
            }

            if (this.elements.emojiButton) {
                this.elements.emojiButton.addEventListener('click', this.toggleEmojiPicker.bind(this));
            }

            // Add event listeners to emoji buttons
            const emojiButtons = this.elements.container.querySelectorAll('.emoji-item');
            emojiButtons.forEach(button => {
                if (button) {
                    button.addEventListener('click', () => {
                        const emoji = button.textContent.trim();
                        this.insertEmoji(emoji);
                    });
                }
            });

            // Add event listeners to like buttons
            const likeButtons = this.elements.container.querySelectorAll('.like-button');
            likeButtons.forEach(button => {
                if (button) {
                    button.addEventListener('click', () => {
                        const commentId = button.getAttribute('data-comment-id');
                        this.likeComment(commentId);
                    });
                }
            });

            // Add event listeners to reply buttons
            const replyButtons = this.elements.container.querySelectorAll('.reply-button');
            replyButtons.forEach(button => {
                if (button) {
                    button.addEventListener('click', () => {
                        const commentId = button.getAttribute('data-comment-id');
                        const replyToId = button.getAttribute('data-reply-to');
                        this.startReply(commentId, replyToId);
                    });
                }
            });

            // Add event listeners to edit buttons
            const editButtons = this.elements.container.querySelectorAll('.edit-button');
            editButtons.forEach(button => {
                if (button) {
                    button.addEventListener('click', () => {
                        const commentId = button.getAttribute('data-comment-id');
                        this.startEditingComment(commentId);
                    });
                }
            });

            // Add event listeners to delete buttons
            const deleteButtons = this.elements.container.querySelectorAll('.delete-button');
            deleteButtons.forEach(button => {
                if (button) {
                    button.addEventListener('click', () => {
                        const commentId = button.getAttribute('data-comment-id');
                        if (confirm(this.options.placeholders.confirmDeleteMessage)) {
                            this.deleteComment(commentId);
                        }
                    });
                }
            });

            // Add event listeners to cancel edit buttons
            const cancelEditButtons = this.elements.container.querySelectorAll('.cancel-edit-button');
            cancelEditButtons.forEach(button => {
                if (button) {
                    button.addEventListener('click', () => {
                        const commentId = button.getAttribute('data-comment-id');
                        this.cancelEditingComment(commentId);
                    });
                }
            });

            // Add event listeners to update comment buttons
            const updateButtons = this.elements.container.querySelectorAll('.update-comment-button');
            updateButtons.forEach(button => {
                if (button) {
                    button.addEventListener('click', () => {
                        const commentId = button.getAttribute('data-comment-id');
                        const commentElement = button.closest('.comment');
                        if (commentElement) {
                            const textarea = commentElement.querySelector('.edit-comment-textarea');
                            if (textarea) {
                                const content = textarea.value.trim();
                                if (content) {
                                    this.editComment(commentId, content);
                                }
                            }
                        }
                    });
                }
            });

            // Add event listeners to inline reply forms
            const inlineReplyForms = this.elements.container.querySelectorAll('.inline-reply-form');
            inlineReplyForms.forEach(form => {
                if (form) {
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const parentId = form.getAttribute('data-parent-id');
                        const textarea = form.querySelector('.inline-reply-textarea');
                        if (textarea && textarea.value.trim()) {
                            this.handleReplySubmit(parentId, textarea.value.trim());
                        }
                    });
                }
            });

            // Add event listeners to cancel inline reply buttons
            const cancelInlineReplyButtons = this.elements.container.querySelectorAll('.cancel-inline-reply-button');
            cancelInlineReplyButtons.forEach(button => {
                if (button) {
                    button.addEventListener('click', () => {
                        const commentId = button.getAttribute('data-comment-id');
                        this.cancelInlineReply(commentId);
                    });
                }
            });

            // Add event listeners to reply emoji buttons
            const replyEmojiButtons = this.elements.container.querySelectorAll('.reply-emoji-button');
            replyEmojiButtons.forEach(button => {
                if (button) {
                    button.addEventListener('click', (event) => {
                        const commentId = button.getAttribute('data-comment-id');
                        this.toggleReplyEmojiPicker(commentId, event);
                    });
                }
            });

            // Add event listeners to reply emoji items
            const replyEmojiItems = this.elements.container.querySelectorAll('.reply-emoji-item');
            replyEmojiItems.forEach(item => {
                if (item) {
                    item.addEventListener('click', () => {
                        const commentId = item.getAttribute('data-comment-id');
                        const emoji = item.getAttribute('data-emoji');
                        this.insertReplyEmoji(commentId, emoji);
                    });
                }
            });
        } catch (error) {
            console.error('Error in initElementReferences:', error);
        }
    }

    /**
     * Render the comment form section
     */
    renderFormSection() {
        const section = document.createElement('div');
        section.className = 'mb-8';

        const title = document.createElement('h3');
        title.className = 'text-xl font-bold text-neutral-800 dark:text-white mb-4';
        title.textContent = 'Leave a comment';
        section.appendChild(title);

        if (!this.state.isLoggedIn) {
            // Login required message
            const loginMessage = document.createElement('div');
            loginMessage.className = 'bg-neutral-50 dark:bg-neutral-800 p-6 rounded-lg text-center mb-6 border border-neutral-200 dark:border-neutral-700';

            const messageText = document.createElement('p');
            messageText.className = 'text-neutral-600 dark:text-neutral-400 mb-4';
            messageText.textContent = this.options.placeholders.signInPrompt;
            loginMessage.appendChild(messageText);

            const signInButton = document.createElement('a');
            signInButton.className = 'inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors';
            signInButton.textContent = this.options.placeholders.signInButton;
            signInButton.href = '#';
            signInButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof this.options.onSignInClick === 'function') {
                    this.options.onSignInClick();
                }
            });
            loginMessage.appendChild(signInButton);

            section.appendChild(loginMessage);
        } else {
            // Comment form
            const form = document.createElement('form');
            form.className = 'comment-form';

            const formContent = `
                <div class="relative">
                    <label for="comment" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Comment <span class="text-red-500">*</span></label>
                    <div class="relative">
                        <textarea
                            id="comment"
                            class="comment-textarea w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-neutral-800 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="${this.options.placeholders.commentInput}"
                            required
                            rows="4"
                        >${this.state.newComment.content}</textarea>

                        ${this.renderMentionSuggestions()}
                    </div>

                    <div class="flex justify-between mt-2">
                        <button
                            type="button"
                            class="emoji-button text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clip-rule="evenodd" />
                            </svg>
                        </button>

                        <div class="text-xs text-neutral-500 dark:text-neutral-400">
                            ${this.state.replyingTo ? `
                                <span>Replying to ${this.state.replyingTo.name}</span>
                                <button
                                    type="button"
                                    class="cancel-reply-button ml-2 text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Cancel
                                </button>
                            ` : ''}
                        </div>
                    </div>

                    ${this.renderEmojiPicker()}
                </div>

                <div class="mt-4 flex justify-end">
                    <button
                        type="submit"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        ${this.state.isSubmitting ? 'disabled' : ''}
                    >
                        ${this.state.isSubmitting ? `
                            <span class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                ${this.options.placeholders.submittingButton}
                            </span>
                        ` : this.options.placeholders.postButton}
                    </button>
                </div>
            `;

            form.innerHTML = formContent;
            section.appendChild(form);
        }

        return section;
    }

    /**
     * Render the emoji picker for main comment form
     */
    renderEmojiPicker() {
        if (!this.state.showMainEmojiPicker) {
            return '';
        }

        let emojiButtons = '';
        this.commonEmojis.forEach(emoji => {
            emojiButtons += `
                <button
                    type="button"
                    class="emoji-item w-8 h-8 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors text-lg"
                >
                    ${emoji}
                </button>
            `;
        });

        return `
            <div class="emoji-picker absolute z-10 mt-1 left-0">
                <div class="bg-white dark:bg-neutral-800 rounded-md shadow-lg border border-neutral-200 dark:border-neutral-700 p-2">
                    <div class="grid grid-cols-8 gap-1">
                        ${emojiButtons}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Toggle emoji picker for main comment form
     */
    toggleEmojiPicker(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (!this.state) {
            console.error('State object is undefined');
            return;
        }

        // Fechar o seletor de emoji das respostas se estiver aberto
        if (this.state.showReplyEmojiPicker) {
            this.state.showReplyEmojiPicker = false;
            this.state.activeEmojiCommentId = null;
        }

        this.state.showMainEmojiPicker = !this.state.showMainEmojiPicker;
        console.log('Main emoji picker toggled:', this.state.showMainEmojiPicker);

        if (this.state.showMainEmojiPicker) {
            // Close mention suggestions if open
            this.state.showMentionSuggestions = false;
        }

        // Store current focus and selection
        const activeElement = document.activeElement;
        const isTextareaFocused = activeElement && activeElement.classList.contains('comment-textarea');
        const selectionStart = isTextareaFocused ? activeElement.selectionStart : null;
        const selectionEnd = isTextareaFocused ? activeElement.selectionEnd : null;

        this.updateUI();

        // Restore focus and selection
        if (isTextareaFocused && this.elements.commentTextarea) {
            this.elements.commentTextarea.focus();

            if (selectionStart !== null && selectionEnd !== null) {
                this.elements.commentTextarea.selectionStart = selectionStart;
                this.elements.commentTextarea.selectionEnd = selectionEnd;
            }
        }
    }

    /**
     * Render mention suggestions
     */
    renderMentionSuggestions() {
        if (!this.state.showMentionSuggestions || this.state.filteredMentionUsers.length === 0) {
            return '';
        }

        let suggestionItems = '';
        this.state.filteredMentionUsers.forEach(user => {
            suggestionItems += `
                <div
                    class="mention-item px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer text-neutral-800 dark:text-neutral-200 text-sm"
                    data-user-id="${user.id}"
                    data-user-name="${user.name}"
                >
                    ${user.name}
                </div>
            `;
        });

        return `
            <div class="mention-suggestions absolute z-10 mt-1 bg-white dark:bg-neutral-800 rounded-md shadow-lg border border-neutral-200 dark:border-neutral-700 max-h-60 overflow-y-auto">
                ${suggestionItems}
            </div>
        `;
    }

    /**
     * Render the comments list section
     */
    renderCommentsListSection(comments) {
        console.log('Rendering comments list with', comments.length, 'comments');

        const section = document.createElement('div');

        const title = document.createElement('h3');
        title.className = 'text-xl font-bold text-neutral-800 dark:text-white mb-4';
        title.textContent = `${this.state.totalComments || this.state.comments.length} Comments`;
        section.appendChild(title);

        if (this.state.isLoading) {
            const loadingElement = document.createElement('div');
            loadingElement.className = 'text-center py-8';
            loadingElement.innerHTML = `
                <div class="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <p class="mt-2 text-neutral-600 dark:text-neutral-400">Loading comments...</p>
            `;
            section.appendChild(loadingElement);
            return section;
        }

        const commentsList = document.createElement('div');
        commentsList.className = 'space-y-6';

        comments.forEach(comment => {
            try {
                const commentElement = this.renderComment(comment);
                commentsList.appendChild(commentElement);
            } catch (error) {
                console.error('Error rendering comment:', error, comment);
                // Adicionar um elemento de fallback para comentários que não podem ser renderizados
                const errorElement = document.createElement('div');
                errorElement.className = 'bg-red-50 dark:bg-red-900 p-3 rounded-lg text-red-600 dark:text-red-300';
                errorElement.textContent = 'Error rendering this comment';
                commentsList.appendChild(errorElement);
            }
        });

        // Adicionar o botão "Carregar mais" se houver mais comentários
        if (this.state.hasMoreComments) {
            const loadMoreBtn = document.createElement('div');
            loadMoreBtn.className = 'text-center mt-6';

            const button = document.createElement('button');
            button.className = 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors';
            button.textContent = this.state.isLoadingMore ? 'Loading...' : 'Load More Comments';
            button.disabled = this.state.isLoadingMore;

            button.addEventListener('click', this.loadMoreComments.bind(this));

            loadMoreBtn.appendChild(button);
            commentsList.appendChild(loadMoreBtn);
        }

        section.appendChild(commentsList);
        return section;
    }

    /**
     * Render an individual comment
     */
    renderComment(comment) {
        if (!comment || typeof comment !== 'object') {
            console.error('Invalid comment object:', comment);
            throw new Error('Invalid comment object');
        }

        const commentElement = document.createElement('div');
        commentElement.className = 'comment mb-4';
        commentElement.setAttribute('data-comment-id', comment.id || 'unknown');

        // Verificar se o usuário atual é o autor do comentário
        const isAuthor = this.state.isLoggedIn && this.state.currentUser &&
                         comment.member === this.state.currentUser.id;

        // Verificar se este comentário está sendo editado
        const isEditing = this.state.editingComment === comment.id;

        // Verificar se este comentário tem um formulário de resposta aberto
        const hasReplyForm = this.state.replyForms.has(comment.id);

        // Garantir que likes nunca seja null ou undefined
        const likes = comment.likes === null || comment.likes === undefined ? 0 : comment.likes;

        // Garantir que temos um objeto memberInfo válido
        const memberInfo = comment.memberInfo || {};
        const memberName = memberInfo.name || comment.name || 'Anonymous';

        // Parent comment HTML
        if (!isEditing) {
            // Modo de visualização normal
            commentElement.innerHTML = `
                <div class="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 shadow-sm border-l-4 border-blue-500 dark:border-blue-700">
                    <div class="flex items-start">
                        <!-- Comment Avatar -->
                        <div class="flex-shrink-0 mr-3">
                            <div class="w-10 h-10 rounded-full overflow-hidden bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white shadow-sm">
                                ${memberInfo && memberInfo.avatar ?
                                    `<img src="${memberInfo.avatar}" alt="${memberName}" class="w-full h-full object-cover" />` :
                                    `<span class="font-bold text-sm">${this.getInitials(memberName)}</span>`
                                }
                            </div>
                        </div>

                        <!-- Comment Content -->
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center mb-1">
                                <h4 class="font-bold text-neutral-800 dark:text-white text-sm mr-2">${memberName}</h4>
                                <span class="text-xs text-neutral-500 dark:text-neutral-400">${this.formatDate(comment.createdAt)}</span>
                                ${comment.editedAt ? `<span class="text-xs text-neutral-500 dark:text-neutral-400 ml-2">(edited)</span>` : ''}
                            </div>

                            <div class="text-neutral-700 dark:text-neutral-300 text-sm mb-2 break-words">${this.formatCommentText(comment.content || '')}</div>

                            <div class="flex items-center text-xs mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                                <button
                                    class="like-button flex items-center text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 ${comment.hasLiked ? 'text-blue-600 dark:text-blue-400' : ''}"
                                    data-comment-id="${comment.id}"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 ${comment.hasLiked ? 'fill-current' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    <span>${likes} Like${likes !== 1 ? 's' : ''}</span>
                                </button>

                                <button
                                    class="reply-button ml-4 flex items-center text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400"
                                    data-comment-id="${comment.id}"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                    </svg>
                                    <span>Reply</span>
                                </button>

                                ${isAuthor ? `
                                <button
                                    class="edit-button ml-4 flex items-center text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400"
                                    data-comment-id="${comment.id}"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span>Edit</span>
                                </button>

                                <button
                                    class="delete-button ml-4 flex items-center text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
                                    data-comment-id="${comment.id}"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span>Delete</span>
                                </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Modo de edição
            commentElement.innerHTML = `
                <div class="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 shadow-sm border-l-4 border-yellow-500 dark:border-yellow-600">
                    <div class="flex items-start">
                        <!-- Comment Avatar -->
                        <div class="flex-shrink-0 mr-3">
                            <div class="w-10 h-10 rounded-full overflow-hidden bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white shadow-sm">
                                ${memberInfo && memberInfo.avatar ?
                                    `<img src="${memberInfo.avatar}" alt="${memberName}" class="w-full h-full object-cover" />` :
                                    `<span class="font-bold text-sm">${this.getInitials(memberName)}</span>`
                                }
                            </div>
                        </div>

                        <!-- Comment Edit Form -->
                        <div class="flex-1 min-w-0">
                            <div class="mb-2">
                                <textarea
                                    class="edit-comment-textarea w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-neutral-800 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                >${comment.content || ''}</textarea>
                            </div>

                            <div class="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    class="cancel-edit-button px-3 py-1 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-white rounded-md text-xs font-medium transition-colors"
                                    data-comment-id="${comment.id}"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    class="update-comment-button px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
                                    data-comment-id="${comment.id}"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Adicionar formulário de resposta se necessário
        if (hasReplyForm && !isEditing) {
            const replyFormContainer = document.createElement('div');
            replyFormContainer.className = 'reply-form-container ml-6 mt-4';
            replyFormContainer.innerHTML = `
                <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 shadow-sm border-l-4 border-green-500 dark:border-green-600">
                    <div class="flex items-start">
                        <!-- User Avatar -->
                        <div class="flex-shrink-0 mr-3">
                            <div class="w-8 h-8 rounded-full overflow-hidden bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white shadow-sm">
                                ${this.state.currentUser && this.state.currentUser.avatar ?
                                    `<img src="${this.state.currentUser.avatar}" alt="${this.state.currentUser.name}" class="w-full h-full object-cover" />` :
                                    `<span class="font-bold text-xs">${this.getInitials(this.state.currentUser?.name || '')}</span>`
                                }
                            </div>
                        </div>

                        <!-- Reply Form -->
                        <div class="flex-1 min-w-0">
                            <form class="inline-reply-form" data-parent-id="${comment.id}">
                                <div class="mb-2 relative">
                                    <textarea
                                        class="inline-reply-textarea w-full px-3 py-2 bg-white dark:bg-neutral-600 border border-neutral-300 dark:border-neutral-500 rounded-md text-neutral-800 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Write your reply here..."
                                        rows="3"
                                        required
                                    ></textarea>

                                    ${this.state.showReplyEmojiPicker && this.state.activeEmojiCommentId === comment.id ?
                                    this.renderReplyEmojiPicker(comment.id) : ''}
                                </div>

                                <div class="flex justify-between mt-2">
                                    <button
                                        type="button"
                                        class="reply-emoji-button text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                                        data-comment-id="${comment.id}"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                    <div>
                                        <button
                                            type="button"
                                            class="cancel-inline-reply-button px-3 py-1 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-white rounded-md text-xs font-medium transition-colors mr-2"
                                            data-comment-id="${comment.id}"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            class="submit-inline-reply-button px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            commentElement.appendChild(replyFormContainer);
        }

        // Render replies if any
        if (comment.replies && comment.replies.length > 0) {
            const repliesContainer = document.createElement('div');
            repliesContainer.className = 'ml-10 mt-4 space-y-3 border-l-2 border-neutral-200 dark:border-neutral-700 pl-4';

            comment.replies.forEach(reply => {
                const replyElement = document.createElement('div');
                replyElement.className = 'bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 shadow-sm';
                replyElement.setAttribute('data-comment-id', reply.id);

                // Verificar se o usuário atual é o autor da resposta
                const isReplyAuthor = this.state.isLoggedIn && this.state.currentUser &&
                                     reply.member === this.state.currentUser.id;

                // Verificar se esta resposta está sendo editada
                const isReplyEditing = this.state.editingComment === reply.id;

                // Garantir que likes nunca seja null para as respostas
                const replyLikes = reply.likes === null || reply.likes === undefined ? 0 : reply.likes;

                if (!isReplyEditing) {
                    // Modo de visualização normal para resposta
                    replyElement.innerHTML = `
                        <div class="flex items-start">
                            <!-- Reply Avatar -->
                            <div class="flex-shrink-0 mr-3">
                                <div class="w-8 h-8 rounded-full overflow-hidden bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white shadow-sm">
                                    ${reply.memberInfo && reply.memberInfo.avatar ?
                                        `<img src="${reply.memberInfo.avatar}" alt="${reply.memberInfo?.name || reply.name}" class="w-full h-full object-cover" />` :
                                        `<span class="font-bold text-xs">${this.getInitials(reply.memberInfo?.name || reply.name)}</span>`
                                    }
                                </div>
                            </div>

                            <!-- Reply Content -->
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center mb-1">
                                    <h4 class="font-bold text-neutral-800 dark:text-white text-sm mr-2">${reply.memberInfo?.name || reply.name}</h4>
                                    <span class="text-xs text-neutral-500 dark:text-neutral-400">${this.formatDate(reply.createdAt)}</span>
                                    ${reply.editedAt ? `<span class="text-xs text-neutral-500 dark:text-neutral-400 ml-2">(edited)</span>` : ''}
                                </div>

                                <div class="text-neutral-700 dark:text-neutral-300 text-sm mb-2 break-words">${this.formatCommentText(reply.content || '')}</div>

                                <div class="flex items-center text-xs mt-1 pt-1 border-t border-neutral-200 dark:border-neutral-700">
                                    <button
                                        class="like-button flex items-center text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 ${reply.hasLiked ? 'text-blue-600 dark:text-blue-400' : ''}"
                                        data-comment-id="${reply.id}"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 ${reply.hasLiked ? 'fill-current' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                        </svg>
                                        <span>${replyLikes} Like${replyLikes !== 1 ? 's' : ''}</span>
                                    </button>

                                    <button
                                        class="reply-button ml-4 flex items-center text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400"
                                        data-comment-id="${comment.id}"
                                        data-reply-to="${reply.id}"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                        </svg>
                                        <span>Reply</span>
                                    </button>

                                    ${isReplyAuthor ? `
                                    <button
                                        class="edit-button ml-4 flex items-center text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400"
                                        data-comment-id="${reply.id}"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span>Edit</span>
                                    </button>

                                    <button
                                        class="delete-button ml-4 flex items-center text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
                                        data-comment-id="${reply.id}"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>Delete</span>
                                    </button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    // Modo de edição para resposta
                    replyElement.innerHTML = `
                        <div class="flex items-start">
                            <!-- Reply Avatar -->
                            <div class="flex-shrink-0 mr-3">
                                <div class="w-8 h-8 rounded-full overflow-hidden bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white shadow-sm">
                                    ${reply.memberInfo && reply.memberInfo.avatar ?
                                        `<img src="${reply.memberInfo.avatar}" alt="${reply.memberInfo?.name || reply.name}" class="w-full h-full object-cover" />` :
                                        `<span class="font-bold text-xs">${this.getInitials(reply.memberInfo?.name || reply.name)}</span>`
                                    }
                                </div>
                            </div>

                            <!-- Reply Edit Form -->
                            <div class="flex-1 min-w-0">
                                <div class="mb-2">
                                    <textarea
                                        class="edit-comment-textarea w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-neutral-800 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500"
                                        rows="3"
                                    >${reply.content || ''}</textarea>
                                </div>

                                <div class="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        class="cancel-edit-button px-3 py-1 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-white rounded-md text-xs font-medium transition-colors"
                                        data-comment-id="${reply.id}"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        class="update-comment-button px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
                                        data-comment-id="${reply.id}"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }

                repliesContainer.appendChild(replyElement);
            });

            // Adicionar botão para carregar mais respostas, se necessário
            if (comment.hasMoreReplies) {
                const loadMoreRepliesBtn = document.createElement('div');
                loadMoreRepliesBtn.className = 'text-center mt-4';

                const button = document.createElement('button');
                button.className = 'text-sm text-blue-600 dark:text-blue-400 hover:underline';
                button.textContent = comment.isLoadingReplies ? 'Loading...' : `Show more replies (${comment.replyCount - comment.replies.length} more)`;
                button.disabled = comment.isLoadingReplies;

                button.addEventListener('click', () => this.loadMoreReplies(comment.id));

                loadMoreRepliesBtn.appendChild(button);
                repliesContainer.appendChild(loadMoreRepliesBtn);
            }

            commentElement.appendChild(repliesContainer);
        }

        return commentElement;
    }

    /**
     * Render empty comments section
     */
    renderEmptyCommentsSection() {
        console.log('Rendering empty comments section');

        const section = document.createElement('div');

        if (this.state.isLoading) {
            section.className = 'text-center py-8';
            section.innerHTML = `
                <div class="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <p class="mt-2 text-neutral-600 dark:text-neutral-400">Loading comments...</p>
            `;
        } else {
            section.className = 'bg-neutral-50 dark:bg-neutral-800 p-6 rounded-lg text-center';
            const message = document.createElement('p');
            message.className = 'text-neutral-600 dark:text-neutral-400';
            message.textContent = this.options.placeholders.emptyComments;
            section.appendChild(message);
        }

        return section;
    }

    /**
     * Handle form submission
     */
    handleSubmitComment(event) {
        if (event) {
            event.preventDefault();
        }

        if (this.state.isSubmitting || !this.state.isLoggedIn) {
            return;
        }

        if (!this.elements.commentTextarea) {
            console.error('Comment textarea not found');
            return;
        }

        const commentText = this.elements.commentTextarea.value.trim();
        if (!commentText) {
            return;
        }

        this.submitComment(commentText);
    }

    /**
     * Submit comment to server
     */
    async submitComment(content) {
        try {
            this.state.isSubmitting = true;
            this.updateUI();

            // Get auth token from storage
            let token = null;
            let memberData = null;

            try {
                const sessionData = sessionStorage.getItem('member');
                const localData = localStorage.getItem('member');

                const dataString = sessionData || localData;

                if (dataString) {
                    memberData = JSON.parse(dataString);
                    token = memberData.token;
                }
            } catch (e) {
                console.error('Error getting auth token:', e);
                alert('Authentication error. Please log in again.');
                return;
            }

            if (!token) {
                alert('You must be logged in to comment.');
                this.state.isSubmitting = false;
                this.updateUI();
                return;
            }

            // Build endpoint URL with query parameters if needed
            let url = `${this.options.apiBaseUrl}/blog/comments/${this.options.postId}`;

            // Add query parameters if replying to a comment
            const queryParams = new URLSearchParams();

            if (this.state.replyingTo) {
                if (this.state.replyingTo.parentId) {
                    // If replying to a reply, use the parent's ID as parentId
                    queryParams.append('parentId', this.state.replyingTo.parentId);
                    // And the reply's ID as inReplyTo
                    queryParams.append('inReplyTo', this.state.replyingTo.id);
                } else {
                    // If replying to a parent comment, use its ID as parentId
                    queryParams.append('parentId', this.state.replyingTo.id);
                }
            }

            // Add query string to URL if we have parameters
            const queryString = queryParams.toString();
            if (queryString) {
                url += `?${queryString}`;
            }

            // Prepare request options
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: content })
            };

            // Make API request
            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit comment');
            }

            const responseData = await response.json();
            // Extrair o comentário da resposta aninhada dentro de result
            const newCommentData = responseData.result || responseData;

            // If custom handler is provided, call it
            if (typeof this.options.onCommentSubmit === 'function') {
                this.options.onCommentSubmit(newCommentData);
            }

            // Add the comment to local state based on API response
            // or use a fallback if no proper response
            if (newCommentData && newCommentData.id) {
                this.state.comments.push(newCommentData);
            } else {
                // Fallback for testing/demo when API doesn't return a proper comment object
                const newComment = {
                    id: Math.random().toString(36).substring(2, 10),
                    name: this.state.currentUser.name,
                    email: this.state.currentUser.email,
                    content: content,
                    parentId: this.state.replyingTo ? this.state.replyingTo.id : null,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    likes: 0,
                    hasLiked: false,
                    avatar: this.state.currentUser.avatar
                };

                this.state.comments.push(newComment);
            }

            // Reset form
            this.state.newComment.content = '';
            if (this.elements.commentTextarea) {
                this.elements.commentTextarea.value = '';
            }

            // Reset reply state
            this.state.replyingTo = null;
            this.state.newComment.parentId = null;

            // Update mentions
            this.updateMentionUsers();

        } catch (error) {
            console.error('Error submitting comment:', error);
            alert('Failed to submit comment: ' + (error.message || 'Unknown error'));
        } finally {
            this.state.isSubmitting = false;
            this.updateUI();
        }
    }

    /**
     * Handle like comment button click
     */
    async likeComment(commentId) {
        if (!this.state.isLoggedIn) {
            if (typeof this.options.onSignInClick === 'function') {
                this.options.onSignInClick();
            }
            return;
        }

        const comment = this.findComment(commentId);
        if (!comment) return;

        try {
            // Get auth token from storage
            const token = this.getAuthToken();
            if (!token) {
                alert('You must be logged in to like comments.');
                return;
            }

            // Determinar se estamos dando like ou removendo
            const isLiking = !comment.hasLiked;

            // Atualizar a UI temporariamente (otimista)
            comment.hasLiked = isLiking;
            comment.likes = (comment.likes || 0) + (isLiking ? 1 : -1);
            this.updateUI();

            // Build endpoint URL
            const endpoint = isLiking ? 'like' : 'unlike';
            const url = `${this.options.apiBaseUrl}/blog/comments/${commentId}/${endpoint}`;

            // Prepare request options
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            // Make API request
            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                // Reverter mudanças se a requisição falhar
                comment.hasLiked = !isLiking;
                comment.likes = (comment.likes || 0) + (isLiking ? -1 : 1);
                this.updateUI();

                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${isLiking ? 'like' : 'unlike'} comment`);
            }

            // Call custom like handler if provided
            if (typeof this.options.onCommentLike === 'function') {
                this.options.onCommentLike(commentId, isLiking);
            }

        } catch (error) {
            console.error(`Error ${comment.hasLiked ? 'liking' : 'unliking'} comment:`, error);
            // Não mostramos alerta para não interromper a experiência do usuário
        }
    }

    /**
     * Start replying to a comment
     */
    startReply(commentId, replyToId) {
        if (!this.state.isLoggedIn) {
            if (typeof this.options.onSignInClick === 'function') {
                this.options.onSignInClick();
            }
            return;
        }

        const comment = this.findComment(commentId);
        if (!comment) return;

        // Adicionar o ID do comentário ao conjunto de formulários de resposta abertos
        this.state.replyForms.add(commentId);

        // Armazenar informações sobre a resposta que estamos respondendo, se aplicável
        if (replyToId) {
            // Se estamos respondendo a uma resposta específica
            const replyToComment = this.findComment(replyToId);
            if (replyToComment) {
                this.state.replyingTo = {
                    id: replyToId,
                    parentId: commentId,
                    name: replyToComment.memberInfo?.name || replyToComment.name
                };
            }
        } else {
            // Se estamos respondendo ao comentário principal
            this.state.replyingTo = {
                id: commentId,
                parentId: null,
                name: comment.memberInfo?.name || comment.name
            };
        }

        this.updateUI();

        // Focar no campo de texto da resposta inline
        setTimeout(() => {
            const replyTextarea = this.elements.container.querySelector(`.reply-form-container[data-parent-id="${commentId}"] .inline-reply-textarea`);
            if (replyTextarea) {
                replyTextarea.focus();
            }
        }, 100);
    }

    /**
     * Cancel inline reply for a specific comment
     */
    cancelInlineReply(commentId) {
        this.state.replyForms.delete(commentId);

        if (this.state.replyingTo && this.state.replyingTo.id === commentId) {
            this.state.replyingTo = null;
        }

        this.updateUI();
    }

    /**
     * Handle submission of an inline reply
     */
    async handleReplySubmit(parentId, content) {
        if (!this.state.isLoggedIn || !content || !parentId) {
            return;
        }

        try {
            // Get auth token from storage
            const token = this.getAuthToken();
            if (!token) {
                alert('You must be logged in to comment.');
                return;
            }

            // Build endpoint URL with query parameters
            let url = `${this.options.apiBaseUrl}/blog/comments/${this.options.postId}`;

            // Add query parameters
            const queryParams = new URLSearchParams();
            queryParams.append('parentId', parentId);

            // Se estamos respondendo a uma resposta específica, incluir o inReplyTo
            if (this.state.replyingTo && this.state.replyingTo.id !== parentId) {
                queryParams.append('inReplyTo', this.state.replyingTo.id);
            }

            // Add query string to URL
            url += `?${queryParams.toString()}`;

            // Prepare request options
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: content })
            };

            // Make API request
            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit reply');
            }

            const responseData = await response.json();
            const newReplyData = responseData.result || responseData;

            // If custom handler is provided, call it
            if (typeof this.options.onCommentSubmit === 'function') {
                this.options.onCommentSubmit(newReplyData);
            }

            // Atualizar o comentário pai na interface
            const parentComment = this.findComment(parentId);
            if (parentComment) {
                if (!parentComment.replies) {
                    parentComment.replies = [];
                }

                parentComment.replies.unshift(newReplyData);
                parentComment.replyCount = (parentComment.replyCount || 0) + 1;
            }

            // Limpar estados de resposta
            this.state.replyForms.delete(parentId);
            this.state.replyingTo = null;

            // Atualizar a UI
            this.updateUI();

        } catch (error) {
            console.error('Error submitting reply:', error);
            alert('Failed to submit reply: ' + (error.message || 'Unknown error'));
        }
    }

    /**
     * Get authentication token from storage
     */
    getAuthToken() {
        try {
            const sessionData = sessionStorage.getItem('member');
            const localData = localStorage.getItem('member');

            const dataString = sessionData || localData;

            if (dataString) {
                const memberData = JSON.parse(dataString);
                return memberData.token;
            }
        } catch (e) {
            console.error('Error getting auth token:', e);
        }

        return null;
    }

    /**
     * Start editing a comment
     */
    startEditingComment(commentId) {
        this.state.editingComment = commentId;
        this.updateUI();

        // Focar no campo de texto de edição
        setTimeout(() => {
            const editTextarea = this.elements.container.querySelector(`[data-comment-id="${commentId}"] .edit-comment-textarea`);
            if (editTextarea) {
                editTextarea.focus();
                // Posicionar o cursor no final do texto
                editTextarea.selectionStart = editTextarea.value.length;
                editTextarea.selectionEnd = editTextarea.value.length;
            }
        }, 100);
    }

    /**
     * Cancel editing a comment
     */
    cancelEditingComment(commentId) {
        this.state.editingComment = null;
        this.updateUI();
    }

    /**
     * Edit a comment
     */
    async editComment(commentId, content) {
        if (!this.state.isLoggedIn || !content) {
            return;
        }

        try {
            // Get auth token from storage
            const token = this.getAuthToken();
            if (!token) {
                alert('You must be logged in to edit this comment.');
                return;
            }

            // Build endpoint URL
            const url = `${this.options.apiBaseUrl}/blog/comments/${commentId}`;

            // Prepare request options
            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: content })
            };

            // Make API request
            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to edit comment');
            }

            const responseData = await response.json();
            const updatedComment = responseData.result || responseData;

            // Atualizar o comentário no estado local
            const comment = this.findComment(commentId);
            if (comment) {
                comment.content = content;
                comment.updatedAt = new Date().toISOString();
                comment.editedAt = new Date().toISOString();
            }

            // Resetar o estado de edição
            this.state.editingComment = null;

            // Atualizar a UI
            this.updateUI();

        } catch (error) {
            console.error('Error editing comment:', error);
            alert('Failed to edit comment: ' + (error.message || 'Unknown error'));
        }
    }

    /**
     * Delete a comment
     */
    async deleteComment(commentId) {
        if (!this.state.isLoggedIn) {
            return;
        }

        try {
            // Get auth token from storage
            const token = this.getAuthToken();
            if (!token) {
                alert('You must be logged in to delete this comment.');
                return;
            }

            // Build endpoint URL
            const url = `${this.options.apiBaseUrl}/blog/comments/${commentId}`;

            // Prepare request options
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            // Make API request
            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete comment');
            }

            // Remover o comentário do estado local
            this.removeCommentFromState(commentId);

            // Atualizar a UI
            this.updateUI();

        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment: ' + (error.message || 'Unknown error'));
        }
    }

    /**
     * Remove a comment from the local state
     */
    removeCommentFromState(commentId) {
        // Verificar se é um comentário principal
        const commentIndex = this.state.comments.findIndex(c => c.id === commentId);

        if (commentIndex !== -1) {
            // É um comentário principal, remover diretamente
            this.state.comments.splice(commentIndex, 1);
            return;
        }

        // Se chegou aqui, é uma resposta, precisamos encontrar o comentário pai
        for (const comment of this.state.comments) {
            if (comment.replies && comment.replies.length > 0) {
                const replyIndex = comment.replies.findIndex(r => r.id === commentId);

                if (replyIndex !== -1) {
                    // Encontrou a resposta, remover do array de respostas
                    comment.replies.splice(replyIndex, 1);

                    // Atualizar a contagem de respostas
                    comment.replyCount = (comment.replyCount || 1) - 1;
                    return;
                }
            }
        }
    }

    /**
     * Format date helper function
     */
    formatDate(dateString) {
        if (!dateString) return '';

        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSecs < 60) {
            return 'just now';
        } else if (diffMins < 60) {
            return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).format(date);
        }
    }

    /**
     * Get user initials for avatar placeholder
     */
    getInitials(name) {
        if (!name) return '?';

        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }

    /**
     * Format comment text with mentions and links
     */
    formatCommentText(text) {
        if (!text) return '';

        // Handle @mentions
        text = text.replace(/@(\w+)/g, '<span class="text-blue-600 dark:text-blue-400">@$1</span>');

        // Make URLs clickable
        text = text.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>'
        );

        return text;
    }

    /**
     * Update mention users list
     */
    updateMentionUsers() {
        const users = new Map();
        this.state.comments.forEach(comment => {
            if (!users.has(comment.id)) {
                users.set(comment.id, {
                    id: comment.id,
                    name: comment.name,
                    email: comment.email
                });
            }
        });
        this.state.mentionUsers = Array.from(users.values());
        this.updateFilteredMentionUsers();
    }

    /**
     * Update filtered mention users based on current input
     */
    updateFilteredMentionUsers() {
        if (!this.state.currentMention) {
            this.state.filteredMentionUsers = [];
            return;
        }

        const query = this.state.currentMention.toLowerCase();
        this.state.filteredMentionUsers = this.state.mentionUsers.filter(user =>
            user.name.toLowerCase().includes(query)
        );
    }

    /**
     * Get parent comments (not replies)
     */
    getParentComments() {
        return this.state.comments.filter(comment => !comment.parentId);
    }

    /**
     * Get replies for a specific comment
     */
    getReplies(commentId) {
        return this.state.comments.filter(comment => comment.parentId === commentId);
    }

    /**
     * Find a comment by ID
     */
    findComment(commentId) {
        // Primeiro, procurar nos comentários principais
        const comment = this.state.comments.find(comment => comment.id === commentId);
        if (comment) return comment;

        // Se não encontrar, procurar nas respostas
        for (const parentComment of this.state.comments) {
            if (parentComment.replies && parentComment.replies.length > 0) {
                const reply = parentComment.replies.find(reply => reply.id === commentId);
                if (reply) return reply;
            }
        }

        return null; // Não encontrou o comentário
    }

    /**
     * Render emoji picker for replies
     */
    renderReplyEmojiPicker(commentId) {
        if (!this.state.showReplyEmojiPicker || this.state.activeEmojiCommentId !== commentId) {
            return '';
        }

        let emojiButtons = '';
        this.commonEmojis.forEach(emoji => {
            emojiButtons += `
                <button
                    type="button"
                    class="reply-emoji-item w-8 h-8 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors text-lg"
                    data-emoji="${emoji}"
                    data-comment-id="${commentId}"
                >
                    ${emoji}
                </button>
            `;
        });

        return `
            <div class="reply-emoji-picker absolute z-10 left-0 mt-1">
                <div class="bg-white dark:bg-neutral-800 rounded-md shadow-lg border border-neutral-200 dark:border-neutral-700 p-2">
                    <div class="grid grid-cols-8 gap-1">
                        ${emojiButtons}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Toggle emoji picker for replies
     */
    toggleReplyEmojiPicker(commentId, event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        // Fechar o seletor principal se estiver aberto
        if (this.state.showMainEmojiPicker) {
            this.state.showMainEmojiPicker = false;
        }

        // Alternar o seletor de emoji da resposta
        if (this.state.activeEmojiCommentId === commentId && this.state.showReplyEmojiPicker) {
            this.state.showReplyEmojiPicker = false;
            this.state.activeEmojiCommentId = null;
        } else {
            this.state.showReplyEmojiPicker = true;
            this.state.activeEmojiCommentId = commentId;
        }

        console.log('Reply emoji picker toggled for comment:', commentId, this.state.showReplyEmojiPicker);

        this.updateUI();
    }

    /**
     * Insert emoji in reply textarea
     */
    insertReplyEmoji(commentId, emoji) {
        const replyForm = this.elements.container.querySelector(`.inline-reply-form[data-parent-id="${commentId}"]`);
        if (!replyForm) return;

        const textarea = replyForm.querySelector('.inline-reply-textarea');
        if (!textarea) return;

        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        const textBefore = textarea.value.substring(0, startPos);
        const textAfter = textarea.value.substring(endPos, textarea.value.length);

        // Insert emoji at cursor position
        textarea.value = textBefore + emoji + textAfter;

        // Close emoji picker
        this.state.showReplyEmojiPicker = false;
        this.state.activeEmojiCommentId = null;

        // Set cursor position after the inserted emoji
        const newCursorPos = startPos + emoji.length;
        textarea.focus();
        textarea.selectionStart = newCursorPos;
        textarea.selectionEnd = newCursorPos;

        this.updateUI();
    }

    /**
     * Insert emoji at cursor position in textarea
     */
    insertEmoji(emoji) {
        if (!this.elements.commentTextarea) {
            return;
        }

        const textarea = this.elements.commentTextarea;
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        const textBefore = textarea.value.substring(0, startPos);
        const textAfter = textarea.value.substring(endPos, textarea.value.length);

        // Insert emoji at cursor position
        textarea.value = textBefore + emoji + textAfter;

        // Update state
        this.state.newComment.content = textarea.value;

        // Close emoji picker
        this.state.showMainEmojiPicker = false;

        // Update UI without losing focus
        this.updateUI();

        // Set cursor position after the inserted emoji
        const newCursorPos = startPos + emoji.length;
        textarea.focus();
        textarea.selectionStart = newCursorPos;
        textarea.selectionEnd = newCursorPos;
    }
}

/**
 * Add to window object for global access
 */
if (typeof window !== 'undefined') {
    window.CMMVComments = CMMVComments;
}

/**
 * Export for module usage
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CMMVComments;
}

