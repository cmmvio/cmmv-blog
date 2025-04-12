<p align="center">
  <a href="https://cmmv.io/" target="blank"><img src="https://raw.githubusercontent.com/cmmvio/docs.cmmv.io/main/public/assets/logo_CMMV2_icon.png" width="300" alt="CMMV Logo" /></a>
</p>
<p align="center">CMMV Blog <br/> A powerful, framework-agnostic blog system for Contract-Model-Model-View applications.</p>
<p align="center">
    <a href="https://www.npmjs.com/package/@cmmv/blog"><img src="https://img.shields.io/npm/v/@cmmv/blog.svg" alt="NPM Version" /></a>
    <a href="https://github.com/cmmvio/cmmv-blog/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@cmmv/blog.svg" alt="Package License" /></a>
</p>

<p align="center">
  <a href="https://cmmv.io/docs/blog">Documentation</a> &bull;
  <a href="https://github.com/cmmvio/cmmv-blog/issues">Report Issue</a>
</p>

## Description

CMMV Blog is a versatile, high-performance blog system designed to work seamlessly with any frontend framework. It provides a consistent API interface that can be used with Vue.js, React, Angular, or vanilla JavaScript applications, making it an ideal choice for projects requiring flexibility and cross-framework compatibility.

Built on the CMMV (Contract-Model-Model-View) architecture, this blog system leverages contract-based development to automate API communication, data fetching, and content rendering. The system supports server-side rendering (SSR), SEO optimization, and structured data through LD+JSON, ensuring your blog content is discoverable and properly indexed.

## Philosophy

CMMV Blog simplifies content management by providing a unified client API across different frameworks. It focuses on **performance**, **flexibility**, and **developer experience**, allowing you to use your preferred framework while maintaining a consistent API interface for interacting with your blog content.

## Features

- **Framework-Agnostic:** Use with Vue.js, React, Angular, or vanilla JavaScript
- **Unified API:** Consistent client API regardless of the frontend framework
- **SEO Optimization:** Built-in support for meta tags and structured data
- **Server-Side Rendering:** Compatible with SSR for better performance and SEO
- **Type Safety:** Full TypeScript support with proper type definitions
- **Analytics Integration:** Built-in support for tracking page views and user engagement
- **Responsive Images:** Automatic handling of responsive images with proper dimensions
- **Extensible:** Easy to extend and customize for specific needs

## Installation

```bash
$ pnpm add @cmmv/blog
```

## Quick Start

Here's how to use CMMV Blog with different frameworks:

### Vue.js

```typescript
// In your main.ts or main.js
import { createApp } from 'vue';
import App from './App.vue';
import { useBlog } from '@cmmv/blog/client/client.vue3';

const app = createApp(App);

// Register the blog API globally
app.provide('blog', useBlog());

app.mount('#app');

// In a component
<script setup>
import { inject, onMounted, ref } from 'vue';

const blog = inject('blog');
const posts = ref([]);

onMounted(async () => {
  posts.value = await blog.getPosts();
});
</script>
```

### React

```typescript
// In your component
import { useEffect, useState } from 'react';
import { useBlog } from '@cmmv/blog/client/client.react';

function BlogPosts() {
  const blog = useBlog();
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    async function fetchPosts() {
      const { data } = await blog.posts.getAll();
      if (data) {
        setPosts(data);
      }
    }
    
    fetchPosts();
  }, []);
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### Angular

```typescript
// In your service
import { Injectable } from '@angular/core';
import { BlogService } from '@cmmv/blog/client/client.angular';

@Injectable({
  providedIn: 'root'
})
export class MyBlogService {
  constructor(private blogService: BlogService) {}
  
  getPosts() {
    return this.blogService.getPosts();
  }
}

// In your component
import { Component, OnInit } from '@angular/core';
import { MyBlogService } from './my-blog.service';

@Component({
  selector: 'app-blog',
  template: `
    <div *ngFor="let post of posts$ | async">
      <h2>{{ post.title }}</h2>
      <p>{{ post.excerpt }}</p>
    </div>
  `
})
export class BlogComponent implements OnInit {
  posts$ = this.blogService.getPosts();
  
  constructor(private blogService: MyBlogService) {}
  
  ngOnInit() {}
}
```

### Vanilla JavaScript

```javascript
import { createBlogClient } from '@cmmv/blog/client/client.vanilla';

const blog = createBlogClient();

async function loadPosts() {
  const posts = await blog.getPosts();
  
  posts.forEach(post => {
    const article = document.createElement('article');
    const title = document.createElement('h2');
    title.textContent = post.title;
    
    const excerpt = document.createElement('p');
    excerpt.textContent = post.excerpt;
    
    article.appendChild(title);
    article.appendChild(excerpt);
    document.getElementById('blog-posts').appendChild(article);
  });
}

document.addEventListener('DOMContentLoaded', loadPosts);
```

## API Reference

CMMV Blog provides the following core functionalities across all framework implementations:

### Posts

- `getPosts(offset?: number)`: Get a list of published posts
- `getPostById(id: string)`: Get a post by its ID
- `getPostBySlug(slug: string)`: Get a post by its slug
- `getPostByAuthor(author: string)`: Get posts by a specific author
- `searchPosts(query: string)`: Search posts by title

### Categories

- `getAllCategories()`: Get all blog categories
- `getCategoryById(id: string)`: Get a category by its ID
- `getCategoryBySlug(slug: string)`: Get a category by its slug

### Tags

- `getAllTags()`: Get all blog tags
- `getPostsByTagSlug(tagSlug: string)`: Get posts with a specific tag

### Pages

- `getPageById(id: string)`: Get a page by its ID
- `getPageBySlug(slug: string)`: Get a page by its slug

### Authors

- `getAuthorById(id: string)`: Get an author by their ID
- `getAuthorBySlug(slug: string)`: Get an author by their slug

### Members

- `createMember(payload: any)`: Create a new member
- `getMemberProfile(id: string)`: Get a member's profile
- `getMyProfile()`: Get the current member's profile
- `updateMemberProfile(id: string, payload: any)`: Update a member's profile

### Analytics

- `registerAnalyticsAccess(path?: string)`: Register a page view
- `registerAnalyticsUnload(path?: string)`: Register a page exit

### Settings

- `getAllSettings()`: Get all blog settings

## Structured Data (LD+JSON)

CMMV Blog includes support for structured data to improve SEO:

```typescript
import { createLdJSON } from '@cmmv/blog/client';

// In your post component
const ldJson = createLdJSON('post', postData, settings);

// Add to your <head> section
<script type="application/ld+json">
  {JSON.stringify(ldJson)}
</script>
```

## Configuration

Configure the blog API endpoint in your environment variables:

```
VITE_API_URL=http://localhost:5000
VITE_API_URL_FRONT=http://localhost:5000
VITE_WEBSITE_URL=https://myblog.com
```