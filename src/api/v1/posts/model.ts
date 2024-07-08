interface Post {
    id: string;
    title: string;
    content: string;
    category: {
      id: string;
      name: string;
    };
    image_url: string;
    created_at: string;
    updated_at: string;
}

interface ExternalPost {
    id: number;
    title: string;
    body: string;
}

export { Post, ExternalPost};