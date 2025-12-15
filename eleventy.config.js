import pluginVite from "@11ty/eleventy-plugin-vite";
import pluginNavigation from "@11ty/eleventy-navigation";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownItMath from "markdown-it-math";
import pluginIcons from "eleventy-plugin-icons";
import tailwindcss from "@tailwindcss/vite";

import { resolve } from "node:path";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginVite, {
    viteOptions: {
      plugins: [tailwindcss()],
    },
  });

  eleventyConfig.addPlugin(pluginIcons, {
    sources: [
      {
        name: "lucide",
        path: "node_modules/lucide-static/icons",
        default: true,
      },
      {
        name: "tmthy",
        path: "./icons",
      },
    ],
  });

  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownItMath));

  eleventyConfig.addBundle("html");

  eleventyConfig.setLayoutResolution(false);
  eleventyConfig.addLayoutAlias("root", "root.html");
  eleventyConfig.addLayoutAlias("main", "main.html");
  eleventyConfig.addLayoutAlias("post", "post.html");
  eleventyConfig.addLayoutAlias("sketch", "sketch.html");
  eleventyConfig.addLayoutAlias("project", "project.html");

  eleventyConfig.addPassthroughCopy({
    static: "/",
  });
  eleventyConfig.addPassthroughCopy("src/**/*.css");
  eleventyConfig.addPassthroughCopy("src/**/*.glsl");
  eleventyConfig.addPassthroughCopy("src/**/*.png");

  eleventyConfig.setServerOptions({
    showAllHosts: true,
  });

  eleventyConfig.addFilter("srcPath", function (path) {
    const {
      env: { root },
      directories: { input },
    } = this.eleventy;

    return resolve(root, input, path);
  });

  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
}
