export type Post = {
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

export type PostWithoutTimestamps = Omit<Post, 'updatedAt' | 'createdAt'>;
