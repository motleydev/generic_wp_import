const fs = require("fs").promises;
import {
  proMark,
  pickConstructor,
  isHTML,
  isMD,
  pathify,
  attrConstructor,
  firstVal as fv,
  firstKey as fk,
  escapify,
  month,
  uploadMutation,
} from "./utils/utils";

// Determine if the text is markdown or not.
const checkMD = (input) => (isMD(input) ? input : proMark(input));

const metaTransformers = {
  source: (input) => checkMD(input),
  caption: (input) => checkMD(input),
  image_permalink: (input) => input,
  photos: (input) => input,
  url: (input) => input,
  link_author: (input) => input,
  excerpt: (input) => checkMD(input),
  publisher: (input) => input,
  description: (input) => checkMD(input),
  video: (input) => input,
  link_url: (input) => input,
  embed: (input) => input,
  audio_url: (input) => input,
  audio_source_url: (input) => input,
};

const run = async () => {
  const file = await fs.readFile("./data/data.json");
  const data = JSON.parse(file);
  const pick = pickConstructor(data);

  const keys = Object.keys(data[0]);
  const tags = pick("tag");
  const categories = pick("category");
  const authors = pick("author");
  const items = pick("item", false);
  const pickPost = pickConstructor(posts);

  const posts = items.filter((item) => item["wp:post_type"][0] === "post");
  const first = posts[0];
  const last = posts[posts.length - 1];

  for (let post of posts) {
    const attr = attrConstructor(post);
    const payload = {};

    [payload.date, payload.time] = attr("wp:post_date").split(" ");

    payload.slug = attr("wp:post_name");
    payload.status = attr("wp:status");

    payload.title = attr("title").trim();
    payload.categories = attr("category", true)
      ? [...new Set(attr("category", true).map((category) => category._))]
      : [];
    payload.tags = attr("tag", true)
      ? attr("tag", true).map((tag) => tag._)
      : [];
    payload.author = attr("dc:creator");
    payload.excerpt = escapify(attr("excerpt:encoded").trim());

    const content = attr("content:encoded");

    const strippedContent = content.replace(/<!-{2}\s.+?-{2}>\n/gi, "");

    if (isHTML(strippedContent)) {
      payload.content = proMark(strippedContent);
    } else {
      payload.content = strippedContent;
    }

    payload.content = payload.content.replace("<br>", /\n\n/);
    payload.content = payload.content.replace("<hr>", "***");
    payload.content = payload.content.replace(/<\/?[a-z][\s\S]*>/gi, proMark);

    payload.path = pathify(payload.date);

    payload.tumblrMeta = {};
    payload.meta = {};

    if (attr("wp:postmeta", true)) {
      // Check if Tumblr is in the list
      if (payload.categories.includes("tumblr")) {
        attr("wp:postmeta", true).map((metaPair) => {
          const key = fk(metaPair);
          const value =
            typeof fv(metaPair) === "string"
              ? fv(metaPair).replace(/^"|"$/g, "")
              : fv(metaPair);

          if (key === "text") {
            payload.content = proMark(value);
          }

          if (Object.keys(metaTransformers).includes(key)) {
            payload.tumblrMeta[key] = escapify(
              metaTransformers[key](value).trim()
            );
          }
        });
      } else {
        attr("wp:postmeta", true).map((metaPair) => {
          const key = fk(metaPair);
          const value = fv(metaPair);

          if (Object.keys(metaTransformers).includes(key)) {
            payload.meta[key] = escapify(value);
          }
        });
      }
    }

    console.log(payload);

    // Run your await fetch mutation here to write content.

    /* 
    Example:
    
    await uploadMutation(`
    mutation CreatePost($title: String!) {
        createPost(data: {
            title: $title
        }) { title } }`,
        {
            title: payload.title
        }
    )
*/
  }
};

try {
  run();
} catch (error) {
  console.log(error);
}
