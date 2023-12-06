export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
    }

export const postDb: PostType[]= [
    {
        id: "Post's ID",
        title: "Post's title",
        shortDescription: "Something about your post",
        content: "Content your Post",
        blogId: "Blog's ID",
        blogName: "Blog's name"
    },
]
