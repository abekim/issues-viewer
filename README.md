issues-viewer
=============

Github Issues Viewer on Backbone.js framework

## Brainstorm

### How to organize issues

It's clear I need to create an issue model, collection, and view. Once I make the API call, I'll `JSON.parse` the results and store them as separate issue objects.

The tricky part is getting only 25 of them. One way to do it would be to count 25 and load just that, or I can give each model an `id` attribute (or some sort of attribute to keep them sorted) and filter the collection based on this attribute to only view 25 objects at a time.

### Data display

Displaying the data in a traditional table format (each attribute with its own column) would make it hard to see all the relevant information. Also, I'm not really sure it makes a lot of sense to include the users' gravatar in the main page. Getting the gravatar isn't hard: issue.user.avatar_url will be the src url for the img tag, but it just seems like a bad design choice. It not only takes up more than necessary amount of space, but it draws the viewer's attention to the images (which isn't what we want).

What I do like, however, is how the [original GitHub issues page](https://github.com/rails/rails/issues) went about displaying the title and the requestor. I believe I can do something similar, as shown in my beautiful ASCII art:

![layout](https://github.com/abekim/issues-viewer/blob/master/layout.jpg?raw=true)

Doing this can justify the display of gravatar on the main page and will help fill out the real estate.

### API calls

When making the API call, I simply want to make AJAX `GET` requests. The best place to do it is in a main.js file, which executes on page load. Once again, I'll `JSON.parse` the results and store them as issue objects.

### CSS

Bootstrap. It's easy to use & also looks pretty. At first, I debated whether I should write my own css because the prompt specifically asks for styling of these specific elements:

* Issue number
* Issue Title 
* Issue Labels 
* Username & gravatar 
* The first 140 characters of the body (ending on a clean line or word). 

However, I think it makes sense to just use Bootstrap because it is a resource and showing application of given resources is just as important.

### Details Page

Hmm, I might have to think about this for a while. For now, I'm gonna go ahead and get started on the main objective -- pull data from github/load data correctly.

### Future exploration (more features!)

It would be great to extend the functionality of this app to other users, repos, etc. It shouldn't be too hard to implement: using a form, I would collect the user/repo data and run the API calls based on these data. I would have to bind the API calls to the form submission, which again, isn't too hard to implement.