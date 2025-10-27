# Blog Posts

This directory contains all blog posts for the Moments website. Blog posts are written in Markdown (.md files) and automatically rendered on the website.

## How to Add a New Blog Post

1. **Create a new `.md` file** in this directory (e.g., `my-new-post.md`)
2. **Add frontmatter** at the top of the file with the following format:

```markdown
---
title: "Your Post Title"
description: "A brief description of your post"
date: "2025-10-27"
author: "Moments Team"
banner: "https://i.imgur.com/yourimage.png"
---

Your content starts here...
```

3. **Write your content** using Markdown syntax below the frontmatter
4. **Commit and push** the file to GitHub - it will automatically appear on the blog!

## Frontmatter Fields

- **title** (required): The title of your blog post
- **description** (required): A short description/excerpt shown in the blog listing
- **date** (required): Publication date in YYYY-MM-DD format
- **author** (required): Author name (usually "Moments Team")
- **banner** (optional): URL to a banner image for the post

## Markdown Formatting

Your blog posts support full Markdown syntax:

### Headings
```markdown
## This is a heading
### This is a subheading
```

### Emphasis
```markdown
**bold text**
*italic text*
```

### Lists
```markdown
- Item 1
- Item 2
- Item 3

1. Numbered item
2. Another item
```

### Quotes
```markdown
> This is a blockquote
> It will render with a beautiful left border
```

### Links
```markdown
[Link text](https://example.com)
```

### Images
```markdown
![Alt text](https://i.imgur.com/image.png)
```

### Code
```markdown
Inline `code` looks like this.

\```
Code blocks look like this
\```
```

### Horizontal Rules
```markdown
---
```

## File Naming

- Use lowercase
- Use hyphens instead of spaces
- Be descriptive
- Example: `introducing-new-feature.md`

The filename (without .md) becomes the URL slug:
- File: `introducing-new-feature.md`
- URL: `https://havemoments.com/blog/introducing-new-feature`

## Example Post

```markdown
---
title: "Launching Moments 2.0"
description: "Exciting new features coming to Moments"
date: "2025-11-01"
author: "Moments Team"
banner: "https://i.imgur.com/example.png"
---

We're excited to announce **Moments 2.0**!

## What's New

- New design
- Better performance
- More features

> "This is the biggest update yet" - The Team

Check it out at [havemoments.com](https://havemoments.com)
```

## That's it!

Just drop a `.md` file in this folder and it's live! 🚀

