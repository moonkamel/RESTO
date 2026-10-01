import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { articleSchema } from "./src/content/article.schema.ts";

/*
 * Articles MDX (content/articles/*.mdx). Le frontmatter est validé par articleSchema :
 * un article incomplet fait échouer `next dev` et `next build`.
 */
const articles = defineCollection({
  name: "articles",
  directory: "content/articles",
  include: "*.mdx",
  schema: articleSchema,
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document);
    return {
      ...document,
      slug: document._meta.path,
      mdx,
    };
  },
});

export default defineConfig({ content: [articles] });
