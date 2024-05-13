import "./App.css";
import moonIcon from "./assets/images/icon-moon.svg";
import sunIcon from "./assets/images/icon-sun.svg";
import { useEffect, useRef, useState } from "react";
import Todo from "./Components/Todo/TodoCard";
import { useMediaQuery } from "react-responsive";
import desktopImageLight from "./assets/images/bg-desktop-light.jpg";
import mobileImageLight from "./assets/images/bg-mobile-light.jpg";
import desktopImageDark from "./assets/images/bg-desktop-dark.jpg";
import mobileImageDark from "./assets/images/bg-mobile-dark.jpg";

function App() {
  const [{ all, active, completed }, setActive] = useState({
    all: true,
    active: false,
    completed: false,
  });

  const container = useRef();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState("theme-light");
  const todos = [
    { id: 1, item: "Complete online JavaScript course", status: "active" },
    { id: 2, item: "Jog around the park 3x", status: "active" },
    { id: 3, item: "10 minutes meditation", status: "active" },
    { id: 4, item: "Read for 1 hour", status: "active" },
    { id: 5, item: "Pick up groceries", status: "active" },
    {
      id: 6,
      item: "Complete Todo App on Frontend Mentor",
      status: "active",
    },
  ];
  const [todoList, setTodoList] = useState(todos);
  const [itemsLeft, setItemsLeft] = useState(todos.length);
  const updateTodoItems = (increment, todoId) => {
    const updatedTodos = [...todoList];
    const index = updatedTodos.findIndex((todo) => todo.id === todoId);

    if (increment === 1) {
      setItemsLeft(itemsLeft + 1);
      updatedTodos[index] = {
        id: todoId,
        item: todoList[index].item,
        status: "active",
      };
      setTodoList(updatedTodos);
    } else if (increment === -1) {
      setItemsLeft(itemsLeft - 1);
      updatedTodos[index] = {
        id: todoId,
        item: todoList[index].item,
        status: "completed",
      };
      setTodoList(updatedTodos);
    } else {
      return todoList.length;
    }
  };

  const deleteTodo = (index) => {
    const newList = todoList.filter((todo, i) => i !== index);
    setTodoList(newList);
    setItemsLeft(itemsLeft - 1);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      const updatedList = [
        { id: todoList.length + 1, item: event.target.value, status: "active" },
        ...todoList,
      ];
      setTodoList(updatedList);
      event.target.value = "";
      setItemsLeft(itemsLeft + 1);
    }
  };

  const orderTodos = (draggedIndex, hoverIndex) => {
    const todos = [...todoList];
    let draggedTodo = todos.splice(draggedIndex, 1)[0];
    todos.splice(hoverIndex, 0, draggedTodo);
    setTodoList(todos);
  };

  useEffect(() => {
    setTheme(isDarkMode ? "theme-dark" : "theme-light");
  }, [isDarkMode]);

  return (
    <main
      className={theme}
      style={{
        backgroundImage: `${
          isMobile && !isDarkMode
            ? `url(${mobileImageLight})`
            : isMobile && isDarkMode
            ? `url(${mobileImageDark})`
            : !isMobile && !isDarkMode
            ? `url(${desktopImageLight})`
            : `url(${desktopImageDark})`
        } `,
      }}
    >
      <div className={`container josefin-sans-400`}>
        <header className="app-header josefin-sans-700 ">
          <h1>Todo</h1>
          <div className="image" onClick={() => setIsDarkMode(!isDarkMode)}>
            <img src={isDarkMode ? sunIcon : moonIcon} alt="" />
          </div>
        </header>
        <div className="card create-todo">
          <span className="circle"></span>
          <input
            type="text"
            placeholder="Create a new todo..."
            onKeyDown={handleKeyDown}
            style={{ color: " var(--very-dark-grayish-blue)" }}
          />
        </div>
        <div className="shadow">
          <div className="todo-list-container" ref={container}>
            {active && todoList
              ? todoList
                  .filter((todo) => todo.status === "active")
                  .map((todo, index) => (
                    <Todo
                      todo={todo}
                      index={index}
                      key={index}
                      todoLength={todoList.length}
                      updateTodoItems={updateTodoItems}
                      deleteTodo={deleteTodo}
                      containerRef={container}
                      orderTodos={orderTodos}
                    />
                  ))
              : completed && todoList
              ? todoList
                  .filter((todo) => todo.status === "completed")
                  .map((todo, index) => (
                    <Todo
                      todo={todo}
                      index={index}
                      key={index}
                      todoLength={todoList.length}
                      updateTodoItems={updateTodoItems}
                      deleteTodo={deleteTodo}
                      containerRef={container}
                      orderTodos={orderTodos}
                    />
                  ))
              : todoList.map((todo, index) => (
                  <Todo
                    todo={todo}
                    index={index}
                    key={index}
                    todoLength={todoList.length}
                    updateTodoItems={updateTodoItems}
                    deleteTodo={deleteTodo}
                    containerRef={container}
                    orderTodos={orderTodos}
                  />
                ))}
          </div>
          <div className="card total">
            <p>{`${itemsLeft} items left`}</p>
            {!isMobile ? (
              <div className="filter-todos desktop-view">
                <button
                  type="button"
                  className={all ? "active" : ""}
                  onClick={() => {
                    setActive({ all: true, active: false, completed: false });
                  }}
                >
                  All
                </button>
                <button
                  type="button"
                  className={active ? "active" : ""}
                  onClick={() => {
                    setActive({ all: false, active: true, completed: false });
                  }}
                >
                  Active
                </button>
                <button
                  type="button"
                  className={completed ? "active" : ""}
                  onClick={() => {
                    setActive({ all: false, active: false, completed: true });
                  }}
                >
                  Completed
                </button>
              </div>
            ) : null}
            <button
              className="clear-completed"
              onClick={() => {
                setTodoList(
                  todoList.filter((todo) => todo.status !== "completed")
                );
              }}
            >
              Clear Completed
            </button>
          </div>
          {isMobile ? (
            <div className="filter-todos card">
              <button
                type="button"
                className={all ? "active" : ""}
                onClick={() => {
                  setActive({ all: true, active: false, completed: false });
                }}
              >
                All
              </button>
              <button
                type="button"
                className={active ? "active" : ""}
                onClick={() => {
                  setActive({ all: false, active: true, completed: false });
                }}
              >
                Active
              </button>
              <button
                type="button"
                className={completed ? "active" : ""}
                onClick={() => {
                  setActive({ all: false, active: false, completed: true });
                }}
              >
                Completed
              </button>
            </div>
          ) : null}
        </div>
        <p className="drag">Drag and drop to reorder list</p>
        <div className="attribution">
          Challenge by
          <a
            href="https://www.frontendmentor.io?ref=challenge"
            rel="noreferrer"
            target="_blank"
          >
            Frontend Mentor
          </a>
          . Coded by
          <a
            href="https://github.com/nohawaheed"
            rel="noreferrer"
            target="_blank"
          >
            Noha Waheed
          </a>
          .
        </div>
      </div>
    </main>
  );
}

export default App;
