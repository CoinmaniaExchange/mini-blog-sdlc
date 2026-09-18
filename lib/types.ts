export interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string; // ცარიელი ნიშნავს "ანონიმი"
  text: string;
  createdAt: string;
}

export interface PostInput {
  title: string;
  content: string;
  tags: string[];
}

export interface CommentInput {
  authorName: string;
  text: string;
}
