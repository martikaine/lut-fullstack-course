# Full Stack course

## 1. NodeJS basics

- on laptop

## 2. ExpressJS basics

Short and sweet. I had used ExpressJS before, so this was mostly things I already knew about. I had also used Handlebars, but using Express as the template engine was new to me. Good to know that there's a plugin for it.

## 3. MongoDB basics

Prior to starting the tutorial I was vaguely aware of how NoSQL databases work, but had never used one. The tutorial covered the most basic database operations quickly, but did not go too much in depth. Compass seemed like a nice tool for checking the contents of the database. Being already familiar with relational databases, I would have liked some discussion on the benefits of NoSQL, examples of applications where it makes sense, or something of that nature, but this was a good brief introduction regardless.

## 4. Angular basics

I completed the "first app tutorial" in its entirety and skimmed through the rest. It took me a while to figure out that I was expected to download the base project rather than create my own, but after getting past that hurdle the tutorial was rather straightforward. There was quite a lot of "copy and paste this code" involved in the tutorial, which I understand for the sake of getting impressive-looking results quickly, but it was easy to just autopilot and miss the point of what the copied code actually does. Still, I found that the tutorial covered the basic features of Angular quite nicely.

I find the Angular approach of and letting a CLI tool generate most project files interesting. I can definitely see upsides in ensuring consistency across larger dev teams, or even across different codebases. It can also be convenient for larger projects that things like dependency injection, a router, and a testing framework are already set up out of the box. However, on the flipside the amount of things included in the "simplest possible" Angular application seems quite overkill for smaller projects.

## 5. MEAN stack Front to Back / final project

Due to the amount of issues reported with this tutorial I decided to just watch the videos attentively and start building my final project based on them straight away. I used roughly the same elements, but tried to replace out-of-date practices and libraries with newer ones. Looking past the outdatedness the tutorials were great, covering a lot of topics fairly quickly but ending up with a solid foundation for a production-ready application.

The first parts of the tutorial dealt with the ExpressJS backend. I followed along the tutorial for the most part, but decided early on that I wanted to do it in TypeScript, as I find it much more comfortable to work with than vanilla Javascript. Setting up Mongoose worked well, no issues there. I was familiar with salting and hashing passwords but this was my first time setting up JWT authentication. I had issues making the `passport` library work with TypeScript and it hadn't seen updates for a couple of years, so I ended up swapping it for `express-jwt` which had better documentation and is being actively maintained by auth0.

Besides that, creating the backend felt quite straightforward. I decided I wanted to make the foundation of a Reddit-style discussion forum. The forum would consist of communities, each community would have posts, posts could be commented on in a tree-like structure, and posts and comments could be up- or downvoted. The main challenge was trying to come up with a good database schema. I tried to challenge my SQL design habits, which would have been to make a bunch of flat collections joined together by keys, but in the end I wasn't able to leverage the object structures much. I thought about nesting comments directly inside the posts collection, but ended up placing them into a separate collection in the end. My rationale was that queries such as "get all comments from a user" would become much easier/more efficient with this structure.

For the API endpoints I tried to follow basic REST principles. All endpoints return proper HTTP status codes instead of the slightly amusing `200 OK, { status: "error" }` style used in the tutorial. I was a bit conflicted on whether I should design the endpoints in a strict REST manner or to match UI behavior (for example: in the REST style `/posts` and `/comments` would probably be fetched from separate endpoints, while a UI-driven `/post-details` endpoint could return a post, all of its comments and everything else that view needs at once). In the end I think the design ended up quite REST-like, but with some minor concessions here and there for convenience.

I created the UI side using the learnings from the more up-to-date Angular tutorial completed earlier. I decided to use standalone components (no separate template file) like in that tutorial, as it seemed simpler to work with and cut down on the amount of files generated significantly. I used Bootstrap 5 for styling, and replaced the abandoned `angular-flash-message` module with Toasts from `ng-bootstrap`. For form data binding I used the built-in ReactiveFormsModule, which was also used in the earlier tutorial, and for auth guards I used the functional `CanActivateFn` as `CanActivate` was deprecated.

As a React user I have to admit Angular felt quite cumbersome to work with at first. The learning curve seems very steep - at the start, there are a lot of concepts thrown at you at once and many of them are very Angular-specific. (I still don't quite understand the point of the RxJs `.subscribe()` model when the language has `async`/`await` out of the box.) However, little by little I was able to get the application up and running, and challenging my usual habits of doing things was a positive thing overall. At first I tried to do data binding "the React way" out of habit, with data only flowing from top down, but I had to constantly `.bind()` event handler functions to fix scoping issues work which felt quite hacky. After changing to the two-way data binding model things became a lot clearer.

Unfortunately, Heroku no longer offers a free tier for hosting applications. Adding an application required entering credit card information, which I didn't want to do, so I wasn't able to publish the application. Hopefully being able to run it in localhost is enough. The instructions are in README.md.
