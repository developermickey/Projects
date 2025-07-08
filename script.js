

const model = document.querySelector(".model");

const addBtn = document.querySelector("#add-btn");
const closeBtn = document.querySelector("#close-icon");
const form = document.querySelector(".form");
const inputTask = document.querySelector("#inputTask");
const cards = document.querySelector(".cards");
const priorityColors = document.querySelectorAll(".priorityColor");
let modalPriorityColor = 'lightpink'


var addBtnFlag = !addBtnFlag;

addBtn.addEventListener("click", (() => {

    if(addBtnFlag === true){
        model.style.display = "flex";
    }

}))

closeBtn.addEventListener("click", (() => {

    model.style.display = "none"

}))

form.addEventListener("submit", ((e) => {
    e.preventDefault();
    if(inputTask.value == ''){
            alert("Please enter your task")
    }

        let id = shortid();
        let task = inputTask.value;
        taskCreated(task, id, modalPriorityColor)
        inputTask.value = ""
}))


function taskCreated(ticketTask, ticketId, ticketColor) {
    const card = document.createElement("div");
    card.setAttribute("class","card")
    card.setAttribute("style", `border-top: 8px solid ${ticketColor};`)

    card.innerHTML = `
                    <div class="card-top">
                        <span class="card-id">${ticketId}</span>
                        <i class="ri-lock-fill"></i>
                    </div>
                    <div class="card-bottom">
                        <h3>${ticketTask}</h3>
                    </div>
                
                `
    cards.appendChild(card);
    
}




priorityColors.forEach((priorityColor) => {
   priorityColor.addEventListener("click", (() => {
        priorityColors.forEach((priorityColor) => {
            priorityColor.classList.remove("active");
        })

      priorityColor.classList.add("active");
      modalPriorityColor = priorityColor.classList[0]
   }))
})