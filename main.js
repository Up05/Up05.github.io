/* TODO:
 - store settings and mails in local storage

Settings:
    - font size
    - text box height


*/

function by_id(id) {
    return document.getElementById(id)
}
function by_class(name) {
    return document.getElementsByClassName(name)    
}

function add_box(parent, class_name) {
    const parent_parent = parent.parentNode 

    parent_parent.removeChild(parent)

    const parent_div = document.createElement("div")
    parent_div.innerHTML = `<label>${parent_parent.children.length}.</label> <input type="text" class="${class_name}"> `
    parent_parent.appendChild(parent_div)

    parent.children.item(0).innerText = parent_parent.children.length + '.'
    parent_parent.appendChild(parent)
}


let mail_to_values = new Map()

function assign_values(element) {

    const value_elems = document.getElementsByClassName("value")
    const email_elems = document.getElementsByClassName("email")

    const values = []
    const emails = []

    for(let i = 0; i < value_elems.length; i ++) {
        const text = value_elems.item(i).value
        if(text == undefined || text == null || text == "" || text == " ") continue;
        values.push(text)
    }

    for(let i = 0; i < email_elems.length; i ++) {
        const text = email_elems.item(i).value
        if(text == undefined || text == null || text == "" || text == " ") continue;
        emails.push(text)
    }

    console.log(values)
    console.log(emails)

    if(values.length < emails.length) { highlight(element); return }

    const res_log_elem = document.getElementById("res-log")

    res_log_elem.innerText = ""
    mail_to_values.clear()

    for(email of emails) {
        const i = Math.floor(Math.random() * values.length)
        mail_to_values.set(email, values[i])
        res_log_elem.innerText += 
            `${email} gaus reikšmę #${i+1}, t.y.: „${cap(values[i], 20)}“\n`
        values.splice(i, 1)
    }

    console.log(mail_to_values)
}

function cap(str, max_len) {
    if(str.length > max_len) {
        str = str.substring(0, max_len - 3)
        str += "..."
    }
    return str;
}

let res_log_hidden = true
function toggle_res_log() {
    const res_log_elem = document.getElementById("res-log")
    if(res_log_hidden) {
        res_log_elem.style.backgroundColor = "transparent"
    } else {
        res_log_elem.style.backgroundColor = document.body.getAttribute("--fg")
    }
    res_log_hidden = !res_log_hidden
}

function send_email(to, message) {
    const params = {
        to:    to,
        from:  document.getElementById("mail-sender").value,
        title: document.getElementById("mail-title").value,
        text:  document.getElementById("mail-text").value.replace("{REIKŠMĖ}", message)
    }
    console.log(params)
    // emailjs.send('gmail', 'main', params)
}

function send_it(element){
    if(mail_to_values.size == 0) { highlight(element); return }
    if(by_id("mail-text").value == "") { highlight(element); return }

    for([key, value] of mail_to_values) {
        send_email(key, value)
    }
}

// assertions:

function highlight(element) {
    const prev_bg = element.style.backgroundColor
    const prev_fg = element.style.color
    element.style.backgroundColor = "#E63946"
    element.style.color = "#F1FAEE"
    setTimeout(function() {
        element.style.backgroundColor = prev_bg
        element.style.color = prev_fg
    }, 200)
}

function assert(expr, str, only_warn) {
    if(expr) return
    const id = only_warn ? "warnings" : "errors"
    by_id(id).innerHTML += str + '<br>'
}

document.onchange = assertions
function assertions(event) {
    const warning_elem = document.getElementById("warnings")
    const error_elem   = document.getElementById("errors")
    warning_elem.innerText = ""
    error_elem.innerText = ""

    {
        let v_count = 0, m_count = 0
        const value_elems = by_class("value")
        for(let i = 0; i < value_elems.length; i ++) 
            if(value_elems.item(i).value != undefined && value_elems.item(i).value != "") v_count ++
        const mail_elems = by_class("email")
        for(let i = 0; i < mail_elems.length; i ++) 
            if(mail_elems.item(i).value != undefined && mail_elems.item(i).value != "") m_count ++
            
        console.log(v_count, m_count);
        
        assert(v_count >= m_count, `Reikšmių yra mažiau nei pašto adresų, todėl keli adresatai gautų tą pačią reikšmę. Reikšmių skaičius = ${v_count}, pašto adresų skaičius = ${m_count}.`)
    }

    {
        assert(by_id("mail-sender").value != "", "Laiško siuntėjo vardas yra tuščias.", true)
        assert(by_id("mail-title").value != "", "Laiško pavadinimo laikelis yra tuščias.", true)
        assert(by_id("mail-text").value != "", "Laiškas neturi jokio teksto (turinys yra tuščias)", false)
        assert(by_id("mail-text").value.includes("{REIKŠMĖ}"), "Laiškas neturi laukelio {REIKŠMĖ}! Kiekvienas adrestas gaus tą patį laišką ir parinktos reikšmės bus ignoruojamos!", true)

    }

    if(warning_elem.innerText != "" || error_elem.innerText != "") {
        by_id("log").style.visibility = "visible"
        by_id("log").style.display = "block"
    } else {
        by_id("log").style.visibility = "hidden"
        by_id("log").style.display = "none"
    }
}
assertions()

function set_font(size) {
    document.querySelectorAll("*").forEach(e => e.style.fontSize = `${size}px`)
}

function set_height(height) {
    document.querySelectorAll("button, input").forEach(e => e.style.height = `${height}px`)
}
