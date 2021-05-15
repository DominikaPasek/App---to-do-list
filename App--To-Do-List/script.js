const apikey = '6f35a5cd-e75b-4363-9149-53230bce64e0';
const apiHost = 'https://todo-api.coderslab.pl';


document.addEventListener('DOMContentLoaded', function() {

    function apiListTasks() {
      return fetch(
        apiHost + '/api/tasks',
        {headers: { 'Authorization': apikey }})
      .then(function(response) {
            if (!response.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return response.json();
        })
    }

    function apiListOperations(taskId) {
      return fetch(
          apiHost + `/api/tasks/${taskId}/operations`,
        {headers: { 'Authorization': apikey }})
      .then(function(resp) {
          if(!resp.ok) {
            alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
          }
          return resp.json();
        })
    }


     function apiCreateTask(title, description) {
      return fetch(
        apiHost + '/api/tasks',
        {headers: {
            'Authorization': apikey,
            'Content-Type': 'application/json'},
            body: JSON.stringify({ title: title, description: description, status: 'open' }),
            method: 'POST',
            })
      .then(resp => {
          if(!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
          return resp.json();
        })
    }

    function apiCreateOperation(taskId, description) {
        return fetch(
        apiHost + `/api/tasks/${taskId}/operations`,
        {headers: {
            'Authorization': apikey,
            'Content-Type': 'application/json'},
            body: JSON.stringify({description: description, timeSpent: 0}),
            method: 'POST',
            })
        .then(resp => {
            if(!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        })
    }


    function apiDeleteTask(taskId) {
        return fetch(
        apiHost + `/api/tasks/${taskId}`,
        {headers: {'Authorization': apikey},
            method: 'DELETE',
        })
        .then(resp => {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        })
    }

    function apiDeleteOperation(operationId) {
        return fetch(
            apiHost + `/api/operations/${operationId}`,
            {headers: {'Authorization': apikey},
            method: 'DELETE',
            })
        .then(resp => {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny')
            }
            return resp.json();
        })
    }

    function apiUpdateTask(taskId, title, description, status) {
        return fetch(
            apiHost + `/api/tasks/${taskId}`,
            {headers: {
                    'Authorization': apikey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title: title, description: description, status: status}),
                method: 'PUT',
            })
            .then(resp => {
                if (!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            })
    }

    function apiUpdateOperation(operationId, description, timeSpent) {
        return fetch(
            apiHost + `/api/operations/${operationId}`,
            {headers: {
                'Authorization': apikey,
                'Content-Type': 'application/json'},
            body: JSON.stringify({description: description, timeSpent: timeSpent}),
            method: 'PUT',
            })
        .then(resp => {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny')
            }
            return resp.json();
        })
    }

    apiListTasks()
    .then(function(response) {
        response.data.forEach(function(task) {
            renderTask(task.id, task.title, task.description, task.status);
        })
      })


    function renderTask(taskId, title, description, status) {
      const section = document.createElement("section");
      section.className = 'card mt-5 shadow-sm';
      document.querySelector('main').appendChild(section);

      const headerDiv = document.createElement('div');
      headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
      section.appendChild(headerDiv);

      const headerLeftDiv = document.createElement('div');
      headerDiv.appendChild(headerLeftDiv);

      const h5 = document.createElement('h5');
      h5.innerText = title;
      headerLeftDiv.appendChild(h5);

      const h6 = document.createElement('h6');
      h6.className = 'card-subtitle text-muted';
      h6.innerText = description;
      headerLeftDiv.appendChild(h6);

      const headerRightDiv = document.createElement('div');
      headerDiv.appendChild(headerRightDiv);

      if (status === 'open') {
        const finishButton = document.createElement('button');
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
        finishButton.innerText = 'Finish';
        headerRightDiv.appendChild(finishButton);
        finishButton.addEventListener('click', function() {
            apiUpdateTask(taskId, title, description, 'closed').then(response => {
                section.querySelectorAll('.js-task-open-only').forEach(element => {
                    element.remove();
                })
            })
        })
      }

      const deleteButton = document.createElement('button');
      deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
      deleteButton.innerText = 'Delete';
      headerRightDiv.appendChild(deleteButton);
      deleteButton.addEventListener('click', function() {
          apiDeleteTask(taskId).then(response => {
              section.remove();
          })
      })

      const ul = document.createElement('ul');
      section.appendChild(ul);

      apiListOperations(taskId)
        .then(response => {
            response.data.forEach(operation => {
            renderOperation(ul, operation.id, status, operation.description, operation.timeSpent);
            })
        })

        if (status === 'open') {
            const addOperationDiv = document.createElement('div');
            addOperationDiv.className = 'card-body js-task-open-only';
            section.appendChild(addOperationDiv);

            const form = document.createElement('form');
            addOperationDiv.appendChild(form);

            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            form.appendChild(inputGroup);

            const descriptionInput = document.createElement('input');
            descriptionInput.setAttribute('type', 'text');
            descriptionInput.setAttribute('placeholder', 'Operation description');
            descriptionInput.setAttribute('minlength', '5');
            descriptionInput.className = 'form-control';
            inputGroup.appendChild(descriptionInput);

            const inputGroupAppend = document.createElement('div');
            inputGroupAppend.className = 'input-group-append';
            inputGroup.appendChild(inputGroupAppend);

            const addButton = document.createElement('button');
            addButton.className = 'btn btn-info';
            addButton.innerText = 'Add';
            inputGroupAppend.appendChild(addButton);

            form.addEventListener('submit', function (event) {
                event.preventDefault();
                apiCreateOperation(taskId, descriptionInput.value).then(
                    function (response) {
                        renderOperation(
                            ul,
                            response.data.id,
                            status,
                            response.data.description,
                            response.data.timeSpent
                        );
                    })
                descriptionInput.value = "";
            });
        }
    }

    function renderOperation(operationsList, operationId, status, operationDescription, timeSpent) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        operationsList.appendChild(li);

        const descriptionDiv = document.createElement('div');
        descriptionDiv.innerText = operationDescription;
        li.appendChild(descriptionDiv);

        const time = document.createElement('span');
        time.className = 'badge badge-success badge-pill ml-2';
        time.innerText = rightTime(timeSpent);
        descriptionDiv.appendChild(time);

        if (status === "open") {
            const controlDiv = document.createElement('div');
            controlDiv.className = 'js-task-open-only';
            li.appendChild(controlDiv);

            const add15minButton = document.createElement('button');
            add15minButton.className = 'btn btn-outline-success btn-sm mr-2';
            add15minButton.innerText = '+15m';
            controlDiv.appendChild(add15minButton);
            add15minButton.addEventListener('click', function() {
                apiUpdateOperation(operationId, operationDescription, timeSpent + 15).then(
                    function(response) {
                      time.innerText = rightTime(response.data.timeSpent);
                      timeSpent = response.data.timeSpent;
                    }
                  );
            })

            const add1hButton = document.createElement('button');
            add1hButton.className = 'btn btn-outline-success btn-sm mr-2';
            add1hButton.innerText = '+1h';
            controlDiv.appendChild(add1hButton);
            add1hButton.addEventListener('click', function() {
                apiUpdateOperation(operationId, operationDescription, timeSpent + 60).then(
                    function(response) {
                      time.innerText = rightTime(response.data.timeSpent);
                      timeSpent = response.data.timeSpent;
                    }
                  );
            })

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-outline-danger btn-sm';
            deleteButton.innerText = 'Delete';
            controlDiv.appendChild(deleteButton);
            deleteButton.addEventListener('click', function() {
                apiDeleteOperation(operationId).then(response => {
                    li.remove();
                })
            })
          }


        function rightTime(timeSpent) {
            const timeInHours = Math.floor(timeSpent / 60);
            const minutes = timeSpent % 60;
            if (timeInHours > 0) {
                return timeInHours + ' h ' + minutes + ' m';}
            else {
                return minutes + ' m'}
        }
    }


    document.querySelector('.js-task-adding-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const tit = event.target.elements.title;
        const desc = event.target.elements.description;
        apiCreateTask(tit.value, desc.value)
            .then(function (response) {
                renderTask(response.data.id, response.data.title, response.data.description, response.data.status);
            })
        tit.value = '';
        desc.value = '';
    })

})
