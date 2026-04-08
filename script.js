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

function remove (id) {
  tasks = tasks.filter(t => t.id !== id)
  save()
}

function toggle (id) {
  tasks = tasks.map(t => {
    if (t.id === id) return { ...t, done: !t.done }
    return t
  })
  save()
}

function editTask (id, oldText) {
  const newText = prompt('Edit your task:', oldText)
  if (newText === null || newText.trim() === '') return

  tasks = tasks.map(t => {
    if (t.id === id) return { ...t, text: newText.trim() }
    return t
  })
  save()
}

function render () {
  list.innerHTML = ''

  let filtered = tasks.filter(t => t.text.toLowerCase().includes(searchTerm))

  if (currentFilter === 'active') {
    filtered = filtered.filter(t => !t.done)
  } else if (currentFilter === 'done') {
    filtered = filtered.filter(t => t.done)
  }

  if (filtered.length === 0) {
    list.innerHTML = `<li class="empty-tasks">No tasks found</li>`
  }

  filtered.forEach(t => {
    const li = document.createElement('li')
    li.className = `todo-item ${t.rank}`

    li.innerHTML = `
            <div class="todo-text ${
              t.done ? 'completed' : ''
            }" onclick="toggle(${t.id})" ondblclick="editTask(${t.id}, '${
      t.text
    }')">
                <span class="task-icon">${t.done ? '✅' : '⭕'}</span>
                <div>
                    <div>${t.text}</div>
                    <small class="task-meta">Added: ${t.created} | Priority: ${
      t.rank
    }</small>
                </div>
            </div>
            <button class="del-btn" onclick="remove(${t.id})">
                <i class="fas fa-trash"></i> ×
            </button>
        `
    list.appendChild(li)
  })

  updateStats()
}

function updateStats () {
  const total = tasks.length
  const active = tasks.filter(t => !t.done).length
  const done = total - active

  count.innerText = active

  const p = total === 0 ? 0 : Math.round((done / total) * 100)
  progress.style.width = p + '%'
  percent.innerText = p + '%'

  if (p === 100 && total > 0) {
    percent.style.color = '#10b981'
    percent.innerText = 'All Done! 🎉'
  } else {
    percent.style.color = '#64748b'
  }
}

addBtn.onclick = addTask

input.onkeypress = e => {
  if (e.key === 'Enter') addTask()
}

clearBtn.onclick = () => {
  if (confirm('Clear all completed tasks?')) {
    tasks = tasks.filter(t => !t.done)
    save()
  }
}

navBtns.forEach(btn => {
  btn.onclick = () => {
    navBtns.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    currentFilter = btn.getAttribute('data-f')
    render()
  }
})

document.addEventListener('DOMContentLoaded', () => {
  createSearchInput()
  render()
})
