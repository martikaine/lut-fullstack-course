import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'api/';

export interface Community {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
  creator: string;
  moderators: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  community: string;
  author: { username: string };
  createdAt: Date;
  votes: number;
  voteIds: Record<string, string>;
  voteStatus: 'up' | 'down' | undefined;
}

export interface PostsResponse {
  totalPages: number;
  currentPage: number;
  posts: Post[];
}

export interface Comment {
  _id: string;
  content: string;
  post: string;
  parentCommentId: string | null;
  children: Comment[];
  author: {
    _id: string;
    username: string;
  };
  createdAt: Date;
  votes: number;
  voteIds: Record<string, string>;
  voteStatus?: 'up' | 'down';
}

/**
 * Handles API traffic related to communities, posts and comments.
 */
@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  constructor(private http: HttpClient) {}

  getAllCommunities(): Observable<Community[]> {
    return this.http.get<Community[]>(`${API_URL}communities`);
  }

  getCommunity(communityName: string): Observable<Community> {
    return this.http.get<Community>(`${API_URL}communities/${communityName}`);
  }

  addCommunity(name: string, description: string) {
    return this.http.post(`${API_URL}communities`, { name, description });
  }

  getAllPosts(
    communityName: string,
    page: number = 1
  ): Observable<PostsResponse> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('communityName', communityName);

    return this.http.get<PostsResponse>(`${API_URL}posts`, { params });
  }

  addPost(
    communityName: string,
    title: string,
    content: string
  ): Observable<Post> {
    const body = { title, content };
    return this.http.post<Post>(
      `${API_URL}communities/${communityName}/posts`,
      body
    );
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${API_URL}posts/${id}`);
  }

  votePost(postId: string, type: 'up' | 'down') {
    return this.http.post<Post>(`${API_URL}posts/${postId}/vote`, { type });
  }

  addComment(
    postId: string,
    parentCommentId: string | null,
    content: string
  ): Observable<Comment> {
    return this.http.post<Comment>(`${API_URL}posts/${postId}/comments`, {
      parentCommentId,
      content,
    });
  }

  getComments(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${API_URL}posts/${postId}/comments`);
  }

  voteComment(postId: string, commentId: string, type: 'up' | 'down') {
    return this.http.post(
      `${API_URL}posts/${postId}/comment/${commentId}/vote`,
      {
        type,
      }
    );
  }
}
