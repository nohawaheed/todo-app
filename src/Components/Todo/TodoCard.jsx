import React, { useEffect, useRef, useState } from "react";
import crossIcon from "../../assets/images/icon-cross.svg";
import checkIcon from "../../assets/images/icon-check.svg";

export default function TodoCard(props) {
  const {
    todo,
    index,
    todoLength,
    updateTodoItems,
    deleteTodo,
    containerRef,
    orderTodos,
  } = props;
  const [isDragging, setIsDragging] = useState(false);
  const todoItem = useRef();
  let hoveredItem = null;

  useEffect(() => {
    if (!isDragging) todoItem.current.style = "";
  }, [isDragging]);

  return (
    <div
      className={`card   ${index === 0 ? "todo-first-card" : ""} ${
        index !== todoLength ? "border-color" : ""
      } ${isDragging ? "dragging" : ""}`}
      key={index}
      id={index}
      ref={todoItem}
      onPointerDown={(e) => {
        //if touch pointer or mouse pointer with left button
        if (e.button === 0) {
          let draggableItemClientX = e.clientX;
          let draggableItemClientY = e.clientY;
          setIsDragging(true);
          const itemBoundings = todoItem.current.getBoundingClientRect();
          todoItem.current.style.position = "sticky";
          todoItem.current.style.zIndex = 500;
          todoItem.current.style.top = `${itemBoundings.y}px`;
          todoItem.current.style.left = `${itemBoundings.x}px`;
          todoItem.current.style.height = `${itemBoundings.height}px`;
          todoItem.current.style.width = `${itemBoundings.width}px`;
          todoItem.current.style.cursor = `grabbing`;

          const distance = `${itemBoundings.height}`;

          const nonDraggableItems = Array.from(
            containerRef.current.childNodes
          ).filter((item) => item !== todoItem.current);

          document.onpointerup = (e) => {
            if (e.button === 0) {
              setIsDragging(false);
              if (todoItem.current) todoItem.current.style = "";
              nonDraggableItems.forEach((item) => {
                item.style = "";
              });
              if (hoveredItem != null) orderTodos(index, hoveredItem);
              document.onpointermove = null;
            }
          };
          document.onpointermove = (e) => {
            todoItem.current.style.transform = `translate(${
              e.clientX - draggableItemClientX
            }px , ${e.clientY - draggableItemClientY}px)`;
            let currentClientY = e.clientY;

            nonDraggableItems.forEach((item) => {
              const draggedItem = todoItem.current.getBoundingClientRect();
              const draggedOverItem = item.getBoundingClientRect();
              // check if the draggedItem overlaps with draggedOverItem
              let isOverlapping =
                draggedItem.y <
                  draggedOverItem.y + draggedOverItem.height / 2 &&
                draggedItem.y + draggedItem.height / 2 > draggedOverItem.y;
              if (isOverlapping) {
                if (item.getAttribute("style")) {
                  item.style.transform = "";
                } else {
                  item.style.transform = `${
                    //move item up if draggedItem is above draggedOverItem
                    draggableItemClientY < currentClientY
                      ? `translateY(-${distance}px)`
                      : `translateY(${distance}px)`
                  }`;
                }
                hoveredItem = item.id;
              }
            });
          };
        } else {
          return;
        }
      }}
    >
      <span
        className="circle check"
        style={{
          display: todo.status === "completed" ? `flex` : "",
          justifyContent: todo.status === "completed" ? `center` : "",
          alignItems: todo.status === "completed" ? `center` : "",
          background:
            todo.status === "completed"
              ? ` linear-gradient(to bottom, #57ddff, #c058f3) `
              : "",
        }}
        onClick={() => {
          updateTodoItems(todo.status === "active" ? -1 : 1, todo.id);
        }}
      >
        <img
          src={checkIcon}
          style={{
            display: todo.status === "completed" ? `flex` : "none",
          }}
          alt=""
        />
      </span>
      <div className="todo-list">
        <p
          style={{
            textDecoration: todo.status === "completed" ? "line-through" : "",
            color:
              todo.status === "completed"
                ? "var( --light-grayish-blue)"
                : "var(--very-dark-grayish-blue)",
          }}
        >
          {todo.item}
        </p>
        <div className="cross-icon">
          <img src={crossIcon} alt="" onClick={() => deleteTodo(index)} />
        </div>
      </div>
    </div>
  );
}
