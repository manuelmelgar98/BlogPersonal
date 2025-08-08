import { Post } from "../models/post.js";
import { fetchPosts, createPost, updatePost, deletePost } from "../api/postApi.js";

export class DataService {
    private _posts: Post[] = [];

    constructor() {}

    async init(): Promise<void> {
        try {
            await this.loadAllPosts();
        } catch (error) {
            console.error("Error initializing DataService:", error);
            throw error;
        }
    }

    async loadAllPosts(): Promise<Post[]> {
        try {
            this._posts = await fetchPosts();
            document.dispatchEvent(new CustomEvent('posts-changed', { detail: { action: 'load', posts: [...this._posts] } }));
            return this._posts;
        } catch (error) {
            console.error("Error loading posts:", error);
            throw error;
        }
    }

    async addPost(postData: Omit<Post, 'id'>): Promise<Post> {
        try {
            const newPost = await createPost(postData);
            this._posts.unshift(newPost);
            document.dispatchEvent(new CustomEvent('posts-changed', { detail: { action: 'created', post: newPost, posts: [...this._posts] } }));
            return newPost;
        } catch (error) {
            console.error("Error adding post:", error);
            throw error;
        }
    }

    async updatePost(updatedPost: Post): Promise<Post> {
        try {
            const post = await updatePost(updatedPost);
            const index = this._posts.findIndex(p => p.id === post.id);
            if (index !== -1) {
                this._posts[index] = post;
                document.dispatchEvent(new CustomEvent('posts-changed', { detail: { action: 'updated', post, posts: [...this._posts] } }));
            }
            return post;
        } catch (error) {
            console.error("Error updating post:", error);
            throw error;
        }
    }

    async deletePost(postId: number): Promise<void> {
        try {
            await deletePost(postId);
            this._posts = this._posts.filter(p => p.id !== postId);
            document.dispatchEvent(new CustomEvent('posts-changed', { detail: { action: 'deleted', postId, posts: [...this._posts] } }));
        } catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    }

    getPosts(): Post[] {
        return [...this._posts];
    }

    async getPost(postId: number): Promise<Post> {
        const post = this._posts.find(p => p.id === postId);
        if (post) {
            return post;
        } else {
            throw new Error(`Post with ID ${postId} not found`);
        }
    }
}

export const dataService = new DataService();