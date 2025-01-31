import './styles/styles.scss';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
    throw new Error('App element cannot be found');
}

app.innerHTML = `
  <div class="todo">
    <h1 class="todo__title">MyToDo</h1>

    <p id="greeting"></p>

    <p id="weather">Fetching weather...</p>

    <h2 class="todo__heading">MyToDo's Today:</h2>

    <ul class="todo__list" id="todoList">
    </ul>

    <form id="todoForm" class="todo__form">
      <input type="text" id="todoInput" class="todo__input" placeholder="Enter a task" />
      <button type="submit" class="todo__button">Add Task</button>
    </form>
  </div>
`;

const greetingElement = document.getElementById('greeting');
const weatherElement = document.getElementById('weather');

if (!greetingElement || !weatherElement) {
    throw new Error('Required DOM elements cannot be found');
}

const updateGreeting = (): void => {
    const greetingElement = document.getElementById('greeting');
    if (!greetingElement) return;

    const now: Date = new Date();
    // console.log('now:', now);
    const hours: number = now.getHours();
    let greeting: string = 'Hello';

    if (hours < 12) {
        greeting = 'Good morning';
    } else if (hours < 18) {
        greeting = 'Good afternoon';
    } else {
        greeting = 'Good evening';
    }

    greetingElement.textContent = `${greeting}, Si`;
};

const fetchWeather = async (): Promise<void> => {
    const weatherElement = document.getElementById('weather');
    if (!weatherElement) return;

    // London API not currently working, using Manchester for now
    try {
        const response: Response = await fetch(
            'https://wttr.in/Manchester?format=%C+%t'
        );
        const weatherText: string = await response.text();
        weatherElement.textContent = `Today's weather in London: ${weatherText}`;
    } catch (error) {
        weatherElement.textContent = 'Weather unavailable.';
        console.log(error);
    }
};

// const fetchTasks = async (): Promise<void> => {
//     try {
//         const response = await fetch('/todos.json');
//         const tasks = await response.json();
//         console.log(tasks);
//     } catch (error) {
//         console.error('Failed to fetch tasks:', error);
//     }
// };

const fetchTasks = async (): Promise<void> => {
    const todoList = document.getElementById('todoList');
    if (!todoList) return;

    try {
        const response = await fetch('/todos.json');
        const taskData = await response.json();
        const tasks = taskData.tasks;

        todoList.innerHTML = '';

        // fix for type on task
        tasks.forEach(
            (task: { id: number; task: string; taskComplete: boolean }) => {
                console.log(task.task);
                const li = document.createElement('li');
                li.className = 'todo__task';
                li.innerHTML = `
              <span>${task.task}</span>
              <button class="todo__delete-button" data-id="${task.id}">X</button>
          `;
                todoList.appendChild(li);
            }
        );
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
    }
};

// This should call these functions on page load
updateGreeting();
fetchWeather();
fetchTasks();
