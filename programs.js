let lang = "en" // | "lt"
function localize(en, lt, color) { let txt = lang == "en" ? en : lt; return color != undefined ? `<span class="${color}">${txt}</span>` : txt }

const HERE = document.location.href
const GITHUB =  "https://github.com/up05/"
const HOME = {//{{{
    "web": {
        "eurai-kvadratu": HERE + "/eurai-kvadratu/index.html",
        "laiškų-loterija": HERE + "/laiskų-loterija",
        "kb-homepage":    HERE + "/kb-homepage",
        "nu-homepage":  GITHUB + "New-Ultimate-Homepage",
        "Skribbl QoL":  GITHUB + "Skribbl-Qol"
    },
    "fun": {
        "tetris": GITHUB + "tetris",
        "ulang":  GITHUB + "ulang",
        "concs-lang": GITHUB + "concs-lang",
        "dodge-pot":  GITHUB + "DodgePot",
        "asteroids":  GITHUB + "aSteROidS-Original",
        "asteroids C":GITHUB + "aSteROidS",
        "img2ascii2": GITHUB + "img_to_ascii2",
        "glfw-unfun": GITHUB + "glfw-unfun"
    },
    "cli": {
        "extract (Linux)": GITHUB + "extract",
        "alarm": GITHUB + "Alarm",
        "paths": GITHUB + "paths",
        "files-rename": GITHUB + "files-rename",
        "school-problem-manager": GITHUB + "School-Problem-Manager",
        "project-manager": GITHUB + "Project-Manager",
        "Windows wallpaper set": GITHUB + "Set-wallpaper"
    },
    "tui": {
        "copypasta": GITHUB + "copypasta"
    },
    "gui": {
        "sfx-picker": GITHUB + "Sfx-Picker",
        "Edit-Clips v5": GITHUB + "ClipEditorV5",
        "WallpaperTODO2": GITHUB + "WallpaperTODO2"
    },
    "lib": {
        "toml_parser": GITHUB + "toml_parser",
        "date_parser": GITHUB + "odin-RFC-3339-date-parser",
        "ast visualizer": GITHUB + "ast-visualizer",
        "Gravity lib js": GITHUB + "uGBodyLibJS"
    },
}//}}}

assign_parents(HOME, null)
function assign_parents(obj, parent) {
    for(let k in obj)
        if(typeof obj[k] === "object") 
            assign_parents(obj[k], obj)
    obj[".."] = parent
}

function exec_exec(env, args, term) {
    args = tokenize(args)

    const program_table = {
        "ls": exec_ls,
        "lang":  exec_lang,
        "kalba": exec_lang,
        "help":   exec_help,
        "padėti": exec_help,
    }

    const func = program_table[args[0]]
    if(func == null) return localize(`Program '${args[0]}' does not exist! \nUse 'help' to get program list.`, 
        `Programos '${args[0]}' nėra! \nNaudokite 'padėti', kad gautumėte programų sąrašą.`, "red-dim")
    else return func(env, args, term)
}

function print_tree(dir, level, last_ones_or_base_name) {//{{{
    let out = ""
    if(level == 0) out = `<span class="orange">${last_ones_or_base_name}\n</span>`
    let i = 0
    for(let k in dir) {
        if(k == "..") continue // always the last element

        let prefix = ""
        if(i == 0 && level == 0) prefix = "└┬"
        else if(i == 0) prefix = "└┬"
        else if(i + 2 == Object.keys(dir).length || Object.keys(dir[k]).length == 0) prefix = " └"
        else prefix = " ├"
        
        let tab = last_ones_or_base_name ? "  " : " │"

        tab = `<span class="bg4">${tab.repeat(level)}</span>`
        prefix = `${tab}<span class="bg4">${prefix}</span>`

        const is_dir = typeof dir[k] === "object"
        if(is_dir) {
            out += prefix + `<span class="blue">${k}</span>` + "<br>"
            out += print_tree(dir[k], level + 1, i + 2 == Object.keys(dir).length)
        } else out += prefix + `<a class="blue-dim" href="${dir[k]}">${k}</a>` + "<br>"
        i ++
    }
    return out
}//}}}

function exec_ls(env, args) {
    let path = env.cwd
    if(args.length > 1) { path += '/' + args[1] }
    let dir = open_dir(path)
    if(dir === null) return localize(`Directory at path: ${path} does not exist!`, `Katalogo ${path} nėra!`, "red-dim")
    if(dir === "not dir") return localize(`${path} is a file!`, `${path} yra failas, o ne katalogas!`, "red-dim")
    return print_tree(dir, 0, path)  
}

function exec_lang(env, args) {
    if(args.length < 2) return localize('Usage:\n  lang en\n  lang lt', 'Naudojimasis:\n  lang en\n  lang lt', "blue")
    if(args[1] != "en" && args[1] != "lt") 
        return localize(`${args[1]} is not a supported language code. \nPlease use either 'lt' or 'en'!`, `Vertimo į '${args[1]}' kalbą nėra. \nYra tik 'lt' ir 'en'`, "red-dim")
    lang = args[1]
    return localize(`Language has been changed to ${lang}`, `Kalba buvo pakeista į ${lang}`, "green")
}

function exec_help(env, args) {
    return localize(
`I recently made a couple web pages and felt like it would be nice to have a homepage for them, so... Over the Sunday, I made this little terminal.
Commands:
  - help    Prints this menu
  - lang    Changes the language
  - ls      Prints a tree of my projects
            projects are links, you can click
  - clear   Clears the terminal (ctrl + l)
  - cd      Changes the current directory
  - ./      Opens a link (file)
Btw, for less techy people, this is just a website. It is meant to look similar to my Linux machine and that's it...
`,
`Neseniai padariau kelis tinklalapius ir, sakau, būtų gerai jiems turėti pradinį puslapį, todėl per sekmadienį parašiau šią nedidelę komandų eilutę.
Galimos komandos:
  - padėti  Atspausdina šį ekraną
  - kalba   Keičia kalbą tarp en ir lt
  - ls      Atspausdina mano projektų medį,
            ant mėlynų failų galima paspausti
  - valyti  Ištrina ekrano tekstą (ctrl + l)
  - cd      Pakeičia dabartinį katalogą
  - ./      Atidaro nuorodą (failą)
Beje, čia tik interneto puslapis. Aš bandžiau jį padaryti kuo panašesnį į mano Linux aplinką, tačiau ls duoda tik paspaudžiamą mėlyno teksto fasadą ir dd (disk destroyed) čia nieko nedaro. 
`, "aqua")
}

function open_dir(raw_path) {
    let path = raw_path.split(/[\\\/]/)
    
    let dir = HOME
    for(name of path) {
        if(name == "~") dir = HOME
        else if(name == ".") dir = open_dir(raw_path)
        else if(name == "") continue
        else if(!(name in dir)) return null
        else if(typeof dir[name] === "string") return "not dir"
        else dir = dir[name]
    }
    return dir
}


// I remembered that backslashes exist at the end of this...
// TODO: Fuck it...
function tokenize(str) {//{{{

    const tokens = []
    
    let tries = 0
    while(true) {
        let space        = str.indexOf(' '); if(space        == -1) space         = +Infinity
        let double_quote = str.indexOf('"'); if(double_quote == -1) double_quote  = +Infinity
        let single_quote = str.indexOf("'"); if(single_quote == -1) single_quote  = +Infinity
        let min = Math.min(space, double_quote, single_quote)
        
        if(min == +Infinity) { 
            if(str.length > 0) tokens.push(str)
            return tokens;
        }

        switch(min) {
        case space:
            tokens.push(str.substring(0, min))
            str = str.substring(min + count_repeating_at(str, min))
            break;
        case double_quote: {
            let q2 = str.indexOf('"', min + 1)
            if(q2 == -1) q2 = min
            tokens.push(str.substring(min + 1, q2))
            str = str.substring(q2 + 1)
            break; }
        case single_quote: {
            let q2 = str.indexOf("'", min + 1)
            if(q2 == -1) q2 = min
            tokens.push(str.substring(min + 1, q2))
            str = str.substring(q2 + 1)
            break; }
        }

        if(tries > 10) return tokens + str
        tries ++;
    }

    return tokens;
}//}}}

function count_repeating_at(str, index) {
    let original = str.charAt(index)
    let count = 1;
    for(let i = index + 1; i < str.length; i ++) {
        if(str.charAt(i) == original) count ++;
        else return count;
    }
    return count;
}


