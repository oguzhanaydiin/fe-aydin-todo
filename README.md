# AydinTodo

This is a simple todo app where you can use it in your day to day tasks.
It's built with Vue 2, Vuex, Typescript, Tailwindcss.
UI is designed to be responsive, It works well with mobile, tablet and desktop.
There is also a dark theme support!

## Features

- **Multiple Lists:** You can have separate lists to put your todos. 
- **Todo Management:** Add new todos, edit them, mark as completed (or mark a completed todo as not completed), or delete them (soft delete of course).
- **Completed Todos:** Completed tasks are shown separately and you can also hide them.
- **Delete Empty Lists:** You can delete a list if it doesn't have any todos left.
- **Dark Mode:** Toggle between light and dark theme.
- **Responsive Design:** Looks good on both desktop and mobile devices.
- **Toast Notifications:** Get feedback for your clear actions, or informed with errors clearly.

## Tech Stack

- Vue 2 (Options API)
- Vuex
- Vue Router
- TypeScript
- TailwindCSS
- MongoDB connection

## Usage

Install dependencies and start the dev server:

```sh
npm install
npm run dev
```

.env file needs to be filled for it to be working on your local
I can share them with you, or you can preview on from the link I have deployed for preview

VUE_APP_AYDIN_TODO_API_URL
VUE_APP_AYDIN_TODO_API_USERNAME
VUE_APP_AYDIN_TODO_API_PASSWORD


## Docker

You can also run the app with Docker:

```sh
docker build -t aydin-todo .
docker run -p 8080:80 aydin-todo
```


If you want to run the app with Docker:

- If you cloned the project, create a `.env` file in the root before building the image. The build will use your environment variables.

- If you only have the Docker image, you can pass your environment variables when running the container:

	```sh
	docker run -p 8080:80 \
		-e VUE_APP_AYDIN_TODO_API_URL=your_api_url \
		-e VUE_APP_AYDIN_TODO_API_USERNAME=your_username \
		-e VUE_APP_AYDIN_TODO_API_PASSWORD=your_password \
		aydin-todo
	```

	Or, if you have a `.env` file:

	```sh
	docker run -p 8080:80 --env-file .env aydin-todo
	```

---

Thanks for checking my project!