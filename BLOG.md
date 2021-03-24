### Starter:
After a few weeks of cobbling together dated howtos on using Gatsby with WordPress backend, I finally found an out-of-the-box, get-going solution that works with latest WP-Gatsby APIs. Duh, it should since the developer, Tyler Barnes, who is key guy at Gatsby working on the integration. His up-to-date starter code can be found here: https://github.com/gatsbyjs/gatsby-starter-wordpress-blog

(Sidebar on my friend TB with photos from Mexico)



Not only does his Gatsby connect seamlessly with WP, he's got nice pagination feature already working. Plus a little style.

### Version01:
Menus are the order of the day. Problem: so far from what I've seen in previous demos, using WP menus screws up root (/index.html) default which has to be redirected to another landing page like /home. And what about ad how routes that I want independent of WP? First, let me see if I can get them going.

Before, starting that, here are a few changes I made:

With the new **gatsby-source-wordpress** (4.0.0) plugin, it's basically plug-and-play out of the box. Here's my local install of WP in **gatsby-config.js**
```
      resolve: `gatsby-source-wordpress`,
            options: {
              // the only required plugin option for WordPress is the GraphQL url.
              url:
                process.env.WPGRAPHQL_URL ||
                `http://wp.localhost/graphql`,
            },
```
I wanted to route my blog from "/" to "/blog", so I changed this in **gatsby-node.js**:
```
      const getPagePath = page => {
        if (page > 0 && page <= totalPages) {
          // Since our homepage is our blog page
          // we want the first page to be "/" and any additional pages
          // to be numbered.
          // "/blog/2" for example
          return page === 1 ? `/blog` : `/blog/${page}`
        }
```
### Version02:
To get posts to follow /blog/(post), I changed this in **gatsby-node.js**:
```
      const createIndividualBlogPostPages = async ({ posts, gatsbyUtilities }) =>
        Promise.all(
          posts.map(({ previous, post, next }) =>
            // createPage is an action passed to createPages
            // See https://www.gatsbyjs.com/docs/actions#createPage for more info
            gatsbyUtilities.actions.createPage({
              // Use the WordPress uri as the Gatsby page path
              // This is a good idea so that internal links and menus work 👍
              path:`/blog${post.uri}`,
              // note to scw: I added /blog to path and this places all posts after /blog which is where they belong. Also: this probably breaks WP menuing but how many menus do I really need to manage? 
```
I also had to manipulate urls on posts at /blog using this:
https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-link/#pass-state-as-props-to-the-linked-page

I changed blog-post-archive.js to:
```
      <header>
        <h2>
          {/* I added /blog so that when you click title link, it goes to the right url */}
          <Link to={`/blog${post.uri}`} itemProp="url">
            <span itemProp="headline">{parse(title)}</span>
          </Link>
        </h2>
        <small>{post.date}</small>
      </header>
```
Note the ```to={`/blog${post.uri}`}``` change from ```to="{post.uri}"```

After a lot of effort, I got WordPress menuing to work thru graphql using method deftly explained here:
https://gregbastianelli.com/gatsby-wordpress-menu-api
I had to add this addition to menu.js:
```import React, {useState} from "react"```

### Version 03
Moved back to manually created and managed menu. I started to mess around with css. More on this later.
Next, version: gatsby-wordpress-inline-images.

### Version 04
Images: Forget about gatsby-wordpress-inline-images. Instead, just add these extras to **gatsby-config.js**  
```
    resolve: `gatsby-source-wordpress`,
          options: {
            // the only required plugin option for WordPress is the GraphQL url.
            url:
              process.env.WPGRAPHQL_URL ||
              `http://wp.localhost/graphql`,
            html: {
              useGatsbyImage: true,
              imageMaxWidth: 1024,
              fallbackImageMaxWidth: 800,
              imageQuality: 90,
            },

          }
 ``` 
 
 Also, do:
 ```
 $ npm i gatsby-transformer-sharp gatsby-plugin-sharp
 ```

Then, you're ready to go. That's it. 

I also installed **gatsby-source-filesystem** because that's where I want to store images to be used in galleries. Even better, I'd like to do a symbolic link to where I store photos locally. We'll see about that.

Add this to **gatsby-config.js**:
```
```