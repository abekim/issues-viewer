# issues-viewer
-------

Github Issues Viewer on Backbone.js framework

## How to organize issues

It's clear I need to create an issue model, collection, and view. Once I make the API call, I'll `JSON.parse` the results and store them as separate issue objects.

The tricky part is getting only 25 of them. One way to do it would be to count 25 and load just that, or I can give each model an `id` attribute (or some sort of attribute to keep them sorted) and filter the collection based on this attribute to only view 25 objects at a time.

## Data display

Displaying the data in a traditional table format (each attribute with its own column) would make it hard to see all the relevant information. Also, I'm not really sure it makes a lot of sense to include the users' gravatar in the main page. Getting the gravatar isn't hard: `issue.user.avatar_url` will be the src url for the `<img>` tag, but it just seems like a bad design choice. It not only takes up more than necessary amount of space, but it draws the viewer's attention to the images (which isn't what we want).

What I do like, however, is how the [original GitHub issues page](https://github.com/rails/rails/issues) went about displaying the title and the requestor. I believe I can do something similar, as shown in my beautiful ASCII art:

![layout](https://github.com/abekim/issues-viewer/blob/master/layout.jpg?raw=true)

Doing this can justify the display of gravatar on the main page and will help fill out the real estate.

While I was working on it, I realized I can't just get complete words just by looking for the `lastIndexOf(' ')`. I was hoping to find a regex solution to it, but couldn't find one that was reasonably simple to implement, hence the massive set of if statements in the following section:

```
<% var index = msg.lastIndexOf(' '); %>
<% if (index < msg.lastIndexOf(']')) { index = msg.lastIndexOf(']'); } %>
<% if (index < msg.lastIndexOf(']')) { index = msg.lastIndexOf('['); } %>
<% if (index < msg.lastIndexOf('(')) { index = msg.lastIndexOf('('); } %>
<% if (index < msg.lastIndexOf(')')) { index = msg.lastIndexOf(')'); } %>
<% if (index < msg.lastIndexOf('<')) { index = msg.lastIndexOf('<'); } %>
<% if (index < msg.lastIndexOf('>')) { index = msg.lastIndexOf('>'); } %>
<% if (index < msg.lastIndexOf('&')) { index = msg.lastIndexOf('&'); } %>
<% if (index < msg.lastIndexOf('^')) { index = msg.lastIndexOf('^'); } %>
<% if (index < msg.lastIndexOf('*')) { index = msg.lastIndexOf('*'); } %>
<% if (index < msg.lastIndexOf('!')) { index = msg.lastIndexOf('!'); } %>
<% if (index < msg.lastIndexOf('+')) { index = msg.lastIndexOf('+'); } %>
<% if (index < msg.lastIndexOf('-')) { index = msg.lastIndexOf('-'); } %>
<% if (index < msg.lastIndexOf('_')) { index = msg.lastIndexOf('_'); } %>
<% if (index < msg.lastIndexOf('%')) { index = msg.lastIndexOf('%'); } %>
<% if (index < msg.lastIndexOf('$')) { index = msg.lastIndexOf('$'); } %>
<% if (index < msg.lastIndexOf('#')) { index = msg.lastIndexOf('#'); } %>
<% if (index < msg.lastIndexOf('@')) { index = msg.lastIndexOf('@'); } %>
<% if (index < msg.lastIndexOf('=')) { index = msg.lastIndexOf('='); } %>
<% if (index < msg.lastIndexOf('{')) { index = msg.lastIndexOf('{'); } %>
<% if (index < msg.lastIndexOf('}')) { index = msg.lastIndexOf('}'); } %>
<% if (index < msg.lastIndexOf('/')) { index = msg.lastIndexOf('/'); } %>
<% if (index < msg.lastIndexOf('?')) { index = msg.lastIndexOf('?'); } %>
```

## API calls

When making the API call, I simply want to make AJAX `GET` requests. The best place to do it is in a main.js file, which executes on page load. Once again, I'll `JSON.parse` the results and store them as issue objects.

## CSS

Bootstrap. It's easy to use & also looks pretty. At first, I debated whether I should write my own css because the prompt specifically asks for styling of these specific elements:

* Issue number
* Issue Title 
* Issue Labels 
* Username & gravatar 
* The first 140 characters of the body (ending on a clean line or word). 

However, I think it makes sense to just use Bootstrap because it is a resource and showing application of given resources is just as important.

## Details Page

Hmm, I might have to think about this for a while. For now, I'm gonna go ahead and get started on the main objective -- pull data from github/load data correctly.

Okay, now that I'm done with all the other implementations, I should really start thinking about the details page.

Currently, I'm thinking it would mainly be separated into a "top (header)" section that includes all major informations about the issue, and then a "bottom (comments)" section that has comments by other users. 

As bad as it sounds, I'm not feeling too creative with the css at this point... I'll use bootstrap's rows to differentiate between the two sections.

### Comments

I never realized the comments weren't a part of the issue object that we get from GitHub. We do get the comments, so this means we'll just need to make another API call, preferrably when we're saving issue objects. Comments will have their own MVC.

## Future exploration (more features!)

It would be great to extend the functionality of this app to other users, repos, etc. It shouldn't be too hard to implement: using a form, I would collect the user/repo data and run the API calls based on these data. I would have to bind the API calls to the form submission, which again, isn't too hard to implement.

I'm gonna push converting `codes` to their specific blocks here because it's not *the most* important feature. It is pretty important to have it in the app, but not entirely necessary. For now, I'll redact them to `[redacted]` and if I have time, I will go back to it and work on it.

Another thing is to allow a "back to listing" button on details page. I could implement it, but I feel like I've been working on this project for a little too long. 

----------

I definitely had a lot of fun with this project. Because of a lot of schedule conflicts, I ended up working on it on and off starting yesterday, for a total of slightly over 4 hours. I feel a lot more comfortable using Backbone.js after this challenge. I think I'll come back to it every now and then to improve it. In the mean time, feel free to fork the repo and play around with it/judge my code/learn more about Backbone!