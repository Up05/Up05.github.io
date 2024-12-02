function by_id(id) { return document.getElementById(id) }
function parent_term(base_elem) { let elem = base_elem; while(elem != null && elem.tagName != "PRE") { elem = elem.parentElement } return elem }

class Animation {
    constructor(delay, step_duration) { this.delay = delay, this.step = step_duration; this.steps = [] }
    add_step(func) { this.steps.push(func); return this }
    start() { for(let i in this.steps) setTimeout(this.steps[i], this.delay + this.step * i) }
}

function make_prompt_str(cwd) {
    return `<span class="blue">${cwd}</span> <span class="purple">❯</span> <span contenteditable spellcheck="false" autofocus></span>`
}

function term_register(element) {
    element.onkeydown = term_kb_handler
    element.onmouseover = function() { element.lastChild.focus() }
    element.onclick = function() { element.lastChild.focus() }
    term_clear(element)
}


function term_clear(term) {
    term.innerHTML = ""
    term.innerHTML += make_prompt_str(term.dataset.cwd)
    term.lastChild.focus()
}

function term_exec(term, str) {
    const input = term.lastChild
    term.removeChild(input)
    term.innerHTML += input.innerText + "<br>"
    term.innerHTML += exec_exec(term.dataset, str, term) + "<br>"
    term.innerHTML += make_prompt_str(term.dataset.cwd)
    if(str == "clear" || str == "valyti") term_clear(term) // great!.. 
    term.lastChild.focus()
}


function term_kb_handler(event) {
    const key = event.key 
    const elt = event.target

    if(event.ctrlKey) {
        switch(key) {
        case "l":
            term_clear(parent_term(elt))
            event.preventDefault(true)
        }
    }

    switch(key) {
    case "Enter":
        term_exec(parent_term(elt), elt.innerText)
        event.preventDefault(true)
        break;


    }

}

