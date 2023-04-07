"use strict";
//+------------------------------------------------------------------------------+
//| - start -                12.9 To Do List Project. Список дел.                |
//+------------------------------------------------------------------------------+
(function() {
    const addText = document.querySelector(".add_text");
    const addButton = document.querySelector(".add_button");
    let inputId = [];
    // - add -
    let createToDoList = (tasks) => {
        const task = document.querySelector(".task");
        
        const divTask = document.createElement("div");
        divTask.setAttribute("class", "task_add");
        
        const inputTask = document.createElement("input");
        inputTask.setAttribute("type", "checkbox");
 
        inputId.forEach((tar) => {
            inputTask.setAttribute("style", `box-shadow: ${tar} 2px 2px 4px, ${tar} -2px -2px 4px;`);
        });
        if(tasks && tasks.taski !== "") {
            inputTask.setAttribute("style", `${tasks.taski}`);
        }
        divTask.append(inputTask);
        const inputSelect = document.createElement("input");
        inputSelect.setAttribute("type", "text"); 
        inputSelect.setAttribute("value", `${addText.value}`); 
        inputSelect.setAttribute("disabled", ""); 
        inputSelect.style.color = "black";
        divTask.append(inputSelect);

        // - start - set - localStorage -
        if(tasks) {
            inputSelect.value = tasks.name;
        }
        // - end - set - localStorage -
        const buttonTaskEditor = document.createElement("button");
        buttonTaskEditor.setAttribute("class", "task_editor");
        buttonTaskEditor.textContent = "Редактировать";
        divTask.append(buttonTaskEditor);

        // - start - set - localStorage -
        if(tasks && tasks.checked == "true") {
            divTask.setAttribute("checked", `${tasks.checked}`);
            inputTask.setAttribute("checked", `${tasks.checked}`);
            inputTask.style.setProperty("--selected", "");
            divTask.style.backgroundColor = "pink";
            divTask.children[1].style.color = "#777";
            divTask.children[1].style.textDecoration = "line-through";
            divTask.children[1].style.textDecorationColor = "red";
            divTask.prepend(inputTask);
            buttonTaskEditor.setAttribute("disabled", ""); // кнопка Редактировать не активна
        } else {
            divTask.setAttribute("checked", "false");
            inputTask.style.setProperty("--selected", "✓");
            inputSelect.style.border = "1px solid white";
            buttonTaskEditor.removeAttribute("disabled"); // кнопка Редактировать активна
        }
        // - end - set - localStorage -
        const buttonTaskRemove = document.createElement("button");
        buttonTaskRemove.setAttribute("class", "task_remove");
        buttonTaskRemove.textContent = "Удалить";
        divTask.append(buttonTaskRemove);
         
        task.prepend(divTask);  
        addText.value = "";
        taskEditor();
        taskRemove();
        styleChecked();
    };
    // - start - get - localStorage -
    let listArr = JSON.parse(localStorage.getItem("list"));
    if(listArr !== null) {
        listArr.forEach((task) => {
            createToDoList(task);
            updateLocalStorage();
        });
    }
    // - end - get - localStorage -
    addButton.addEventListener("click", (event) => {
        // - add -
        if(addText.value !== "") {
            createToDoList();
            shadowTaskInput(event, event.target.parentElement.parentElement.children[2].children[0].children[0]);
            document.querySelector(".all").click();
        }
        updateLocalStorage();
    });
    // - start - get - set - function localStorage -
    function updateLocalStorage() {
        const taskAll = document.querySelectorAll(".task_add");
        listArr = [];
        taskAll.forEach((target) => {
            let objList = {
                name: target.children[1].value,
                checked: target.getAttribute("checked"),
                taski: target.children[0].getAttribute("style"),
                selected: target.children[0].style.getPropertyValue("--selected"),
            };
            listArr.push(objList); 
        });
        localStorage.setItem("list", JSON.stringify(listArr.reverse()));
    }
    // - end - get - set - function localStorage -
    // - editor -
    function taskEditor() {
        let tasks = document.querySelector(".task");
        tasks.children[0].children[2].addEventListener("click", (event) => {
            if(event.target.parentElement.children[1].attributes.disabled) {
                event.target.parentElement.children[1].removeAttribute("disabled");
                event.target.parentElement.children[1].style.border = "1px solid teal";

                const end = event.target.parentElement.children[1].value.length;
                event.target.parentElement.children[1].setSelectionRange(end, end); // позиция курсора
                event.target.parentElement.children[1].focus();

                event.target.parentElement.children[1].value = event.target.parentElement.children[1].value;
                event.target.textContent = "Сохранить";
                updateLocalStorage();
            } else if(!event.target.parentElement.children[1].attributes.disabled) {
                event.target.parentElement.children[1].setAttribute("disabled", "");
                event.target.parentElement.children[1].style.border = "1px solid #2df5eb";
                event.target.parentElement.children[1].value = event.target.parentElement.children[1].value;
                event.target.textContent = "Редактировать";
                updateLocalStorage();
            }
        });
    }
    // - remove -
    function taskRemove() {
        let taskRemoveAll = document.querySelectorAll(".task_remove");
        const checkAll = document.querySelectorAll("input[type = checkbox]");
        taskRemoveAll.forEach((target) => {
            target.addEventListener("click", (event) => {
                // - checked -
                checkAll.forEach((check) => {
                    if(check.checked === true && event.target.parentElement === check.parentElement) {
                        check.parentElement.remove();
                        updateLocalStorage();
                    }
                });
            });
        });
    }
    // - style checked -
    function styleChecked() {
        const checkAll = document.querySelectorAll("input[type = checkbox]");
        checkAll.forEach((check) => {
            check.addEventListener("input", (e) => {
                if(e.target.checked === true) {
                    e.target.style.setProperty("--selected", "✓");
                    e.target.parentElement.setAttribute("checked", "true");
                    e.target.parentElement.style.backgroundColor = "pink";
                    e.target.parentElement.children[1].style.color = "#777";
                    e.target.parentElement.children[1].style.textDecoration = "line-through"; // текст зачеркнут
                    e.target.parentElement.children[1].style.textDecorationColor = "red";     // текст зачеркнут красным
                    e.target.parentElement.children[1].style.border = "1px solid pink";
                    e.target.parentElement.children[2].setAttribute("disabled", ""); // кнопка Редактировать не активна
                    updateLocalStorage();
                } else {
                    e.target.style.setProperty("--selected", "");
                    e.target.parentElement.setAttribute("checked", "false");
                    e.target.parentElement.style.backgroundColor = "white";
                    e.target.parentElement.children[1].style.color = "black";
                    e.target.parentElement.children[1].style.textDecoration = "none";
                    e.target.parentElement.children[1].style.border = "1px solid white";
                    e.target.parentElement.children[2].removeAttribute("disabled"); // кнопка Редактировать активна
                    updateLocalStorage();
                }
                switchChecked(e.target);
            });
        });
    }
    function shadowTaskInput(event, inputTask) {
        if(event) {
            for(let y = 0; y < event.target.parentElement.parentElement.parentElement.children[1].children.length; y++) {
                if(event.target.parentElement.parentElement.parentElement.children[1].children[y].checked === true) {
                    inputId.push(event.target.parentElement.parentElement.parentElement.children[1].children[y].id);
                    for(let w = 0; w < inputId.length; w++) {
                        inputTask.setAttribute("style", `box-shadow: ${inputId[w]} 2px 2px 4px, ${inputId[w]} -2px -2px 4px;`);
                    }
                } 
            }
            inputTask.style.setProperty("--selected", "\\2713");
        } else {
            inputTask.style.setProperty("--selected", "");
            inputId.forEach((target) => {
                inputTask.setAttribute("style", `box-shadow: ${target} 2px 2px 4px, ${target} -2px -2px 4px;`);
            });
        }  
    }
    function switchChecked(target) {
        switch(target.style.getPropertyValue("--selected")) {
            case "": target.style.setProperty("--selected", "\\2713");
                break;
            case "\\2713": target.style.setProperty("--selected", "");
                break;
            case "✓": target.style.setProperty("--selected", "");
                break;
            default: target.style.setProperty("--selected", "");
                break;
        }
    }
    //+-----------------------------------------------------------------------+
    //| - start -               Функция фильтрует по цвету кнопки             |
    //+-----------------------------------------------------------------------+
    (function() {
        const filters = document.querySelector(".filter");
        filters.addEventListener("click", (event) => {
            event.preventDefault();
            const filter = event.target.dataset.filter;

            for(let i = 0; i < event.target.parentElement.parentElement.children[2].children.length; i++) {
                if(filter === "all") {
                    event.target.parentElement.parentElement.children[2].children[i].style.display = "flex";
                } else if(filter === "selected") {
                    filtrat(event.target.parentElement.parentElement.children[2].children[i], 
                            event.target.parentElement.parentElement.children[2].children[i].children[0].checked === true);
                } else {
                    filtrat(event.target.parentElement.parentElement.children[2].children[i], 
                            event.target.parentElement.parentElement.children[2].children[i].children[0].attributes[1].value.split(" ")[1] === filter);
                }
                function filtrat(target, boolean) {
                    boolean ? target.style.display = "flex" : target.style.display = "none";
                }
            }
        });
    })();
    //+-----------------------------------------------------------------------+
    //| - end -               Функция фильтрует по цвету кнопки               |
    //+-----------------------------------------------------------------------+
    //+-----------------------------------------------------------------------+
    //| - start -                 кнопка Удалить Весь список                  |
    //+-----------------------------------------------------------------------+
    (function() {
        document.querySelector(".remove_all").addEventListener("click", () => {
            const task_add = document.querySelectorAll(".task_add");

            if(task_add.length == 0) {
                feedback();
            }

            if(task_add.length > 0) {
                const modal = document.querySelector('.modal');
                modal.setAttribute("class", "modal");

                const modalDelBtnNot = document.querySelector('.modal_del_btn_not');
                modalDelBtnNot.addEventListener('click', () => {
                    modal.setAttribute("class", "modal modal_hidden");
                });

                const modalDelBtnYes = document.querySelector('.modal_del_btn_yes');
                modalDelBtnYes.addEventListener('click', () => {
                    modal.setAttribute("class", "modal modal_hidden");
                    task_add.forEach((target) => {
                        target.remove();
                        updateLocalStorage();
                    });
                    feedback();
                });
            }
        });
        function feedback() {
            const feedback = document.querySelector(".feedback");
            feedback.setAttribute("class", "feedback block");
            feedback.textContent = "Список пуст!";
            let timeout = setTimeout(function() {
                feedback.setAttribute("class", "feedback");
                clearTimeout(timeout);
            }, 2000);
        }
    })();
    //+-----------------------------------------------------------------------+
    //| - end -                   кнопка Удалить Весь список                  |
    //+-----------------------------------------------------------------------+
    //+-----------------------------------------------------------------------+
    //| - start -                кнопка Удалить Все выбранные                 |
    //+-----------------------------------------------------------------------+
    (function() {
        document.querySelector(".remove_all_select").addEventListener("click", () => {
            const task_add = document.querySelectorAll(".task_add");
            const feedback = document.querySelector(".feedback");
            
            feedback.setAttribute("class", "feedback block");
            feedback.textContent = "Выбранных нет!";
            let timeout = setTimeout(function() {
                feedback.setAttribute("class", "feedback");
                clearTimeout(timeout);
            }, 2000);

            task_add.forEach((target) => {
                if(target.children[0].checked === true) {
                    target.remove();

                    feedback.setAttribute("class", "feedback block");
                    feedback.textContent = "Все выбранные удалены!";
                    let timeout = setTimeout(function() {
                        feedback.setAttribute("class", "feedback");
                        clearTimeout(timeout);
                    }, 2000);
                } 
                updateLocalStorage();
            });
        });
    })();
    //+-----------------------------------------------------------------------+
    //| - end -                  кнопка Удалить Все выбранные                 |
    //+-----------------------------------------------------------------------+
    //+-----------------------------------------------------------------------+
    //| - start - Событие hover.   mouseover - наезжает / mouseout - съезжает |
    //+-----------------------------------------------------------------------+
    (function() {
        document.querySelector(".task").addEventListener("mouseover", (event) => {
            hover(event.target, "#2df5eb");
        });
        document.querySelector(".task").addEventListener("mouseout", (event) => {
            hover(event.target, "white");
        });

        function hover(target, color) {
            if(target.className === "task_add") {
                target.children[1].style.border = `1px solid ${color}`; 
                target.style.backgroundColor = `${color}`;
                if(target.children[0].checked === true) {
                    target.style.backgroundColor = `pink`;
                    target.children[1].style.border = `1px solid pink`; 
                } 
            } 
            if(target.type === "checkbox" || target.className === "task_editor" || target.className === "task_remove") {
                target.parentElement.children[1].style.border = `1px solid ${color}`;
                target.parentElement.style.backgroundColor = `${color}`;
                if(target.parentElement.children[0].checked === true) {
                    target.parentElement.style.backgroundColor = `pink`;
                    target.parentElement.children[1].style.border = `1px solid pink`; 
                } 
            }
            if(target.type === "text") {
                target.style.border = `1px solid ${color}`;
                target.parentElement.style.backgroundColor = `${color}`;
                if(target.parentElement.children[0].checked === true) {
                    target.parentElement.style.backgroundColor = `pink`;
                    target.parentElement.children[1].style.border = `1px solid pink`; 
                }
                if(target.parentElement.children[2].textContent === "Сохранить") {
                    target.parentElement.children[1].style.border = `1px solid teal`; 
                } 
            } 
            if(target.className === "task_editor" && target.textContent === "Сохранить") {
                target.parentElement.children[1].style.border = `1px solid teal`; 
            }
        }
    })();
    //+-----------------------------------------------------------------------+
    //| - end -  Событие hover.   mouseover - наезжает / mouseout - съезжает  |
    //+-----------------------------------------------------------------------+
    //+------------------------------------------------------------------+
    //| - start -                           Date                         |
    //+------------------------------------------------------------------+
    (function() {
        const timeEl = document.querySelector(".time");
        const dateEl = document.querySelector(".date");
        const monthInx = new Date().getMonth();
        const months = [
            "Января",
            "Февраля", 
            "Марта", 
            "Апреля", 
            "Мая", 
            "Июня", 
            "Июля", 
            "Августа", 
            "Сентября", 
            "Октября", 
            "Ноября", 
            "Декабря"
        ];
        setInterval(() => { 
            const timer = new Date();
            const option = {
                hour : 'numeric',
                minute : 'numeric'
            };
            const formateTimer = new Intl.DateTimeFormat('ru-Ru', option).format(timer);
            timeEl.textContent = formateTimer;
            dateEl.textContent = `${timer.getDate()}  ${months[monthInx]}  ${timer.getFullYear()}`;
        }, 1000);
    })();
    //+------------------------------------------------------------------+
    //| - end -                            Date                          |
    //+------------------------------------------------------------------+
    //+------------------------------------------------------------------+
    //| - start -                         Search                         |
    //+------------------------------------------------------------------+
    (function() {
        document.querySelector(".add_text").addEventListener("input", (event) => {
            let inputValue = event.target.value.trim();
            if(inputValue !== " " || inputValue !== "") {
                document.querySelectorAll(".task_add").forEach((target) => {
                    if(target.children[1].value.search(inputValue, target.children[1].value) === -1) { // нет совпадений
                        target.style.display = "none";
                        target.style.height = "100%";
                    } else if(target.children[1].value.search(inputValue, target.children[1].value) === 0) { //  нашел
                        target.style.display = "flex";
                    }
                });
            }
        });
    })();
    //+------------------------------------------------------------------+
    //| - end -                          Search                          |
    //+------------------------------------------------------------------+
})();
//+-----------------------------------------------------------------------------+
//| - end -                 12.9 To Do List Project. Список дел.                |
//+-----------------------------------------------------------------------------+