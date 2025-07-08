

const model = document.querySelector(".model");

const addBtn = document.querySelector("#add-btn");
const closeBtn = document.querySelector("#close-icon");
const form = document.querySelector(".form");
const inputTask = document.querySelector("#inputTask");
const cards = document.querySelector(".cards");




var addBtnFlag = !addBtnFlag;

addBtn.addEventListener("click", (() => {

    if(addBtnFlag === true){
        model.style.display = "flex";
    }

}))

closeBtn.addEventListener("click", (() => {

    model.style.display = "none"

}))

form.addEventListener("keydown", ((e) => {
    
    if(e.key == 'Shift'){
        let id = shortid();
        let task = inputTask.value;
        taskCreated(task, id)
        inputTask.value = ""
    }
}))


function taskCreated(ticketTask, ticketId) {
    const card = document.createElement("div");
    card.setAttribute("class","card")
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