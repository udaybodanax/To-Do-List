const input = document.getElementById('todoInput')
const priority = document.getElementById('priority-select')
const addBtn = document.getElementById('addBtn')
const list = document.getElementById('todoList')
const count = document.getElementById('pendingCount')
const progress = document.getElementById('progress-bar')
const percent = document.getElementById('percent-val')
const clearBtn = document.getElementById('clearBtn')
const navBtns = document.querySelectorAll('.nav-btn')

let tasks = JSON.parse(localStorage.getItem('smart_tasks_v3')) || []
let currentFilter = 'all'
let searchTerm = ''

function createSearchInput () {
  const parent = document.querySelector('.input-area')
  const search = document.createElement('input')
  search.type = 'text'
  search.id = 'searchBox'
  search.placeholder = 'Search tasks...'
  search.className = 'search-box'

  search.oninput = e => {
    searchTerm = e.target.value.toLowerCase()
    render()
  }

  parent.appendChild(search)
}

function save () {
  localStorage.setItem('smart_tasks_v3', JSON.stringify(tasks))
  render()
}

function addTask () {
  const val = input.value.trim()
  if (!val) {
    input.style.borderColor = '#f43f5e'
    setTimeout(() => (input.style.borderColor = '#e2e8f0'), 1000)
    return
  }

  const task = {
    id: Date.now(),
    text: val,
    rank: priority.value,
    done: false,
    created: new Date().toLocaleDateString()
  }

  tasks.push(task)
  input.value = ''
  save()
}
