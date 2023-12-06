export type BlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
}
export const blogDb: BlogType[] = [
    {
        id: "Put your blog ID",
        name: "Blog's name",
        description: "Something about your blog",
        websiteUrl: "Example of correct URL: https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$",
    },
]