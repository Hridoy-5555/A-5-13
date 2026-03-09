
function login(){

const user=document.getElementById("username").value
const pass=document.getElementById("password").value

if(user==="admin" && pass==="admin123"){

document.getElementById("loginPage").style.display="none"
document.getElementById("mainPage").style.display="block"

loadIssues()

}else{

alert("Invalid Credentials")

}

}



const API="https://phi-lab-server.vercel.app/api/v1/lab/issues"



async function loadIssues(){

updateActiveTab('all-tab')
document.getElementById('loadingSpinner').style.display = 'block';
document.getElementById('issuesContainer').innerHTML = '';

const res=await fetch(API)
const data=await res.json()

displayIssues(data.data)
updateStatusCounts(data.data)
document.getElementById('loadingSpinner').style.display = 'none';

}



function displayIssues(issues){

const container=document.getElementById("issuesContainer")

container.innerHTML=""

issues.forEach(issue=>{

const card=document.createElement("div")

card.className="card"

card.classList.add(issue.status.toLowerCase())

const icon = issue.status.toLowerCase() === 'open' ?
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
    </svg>` :
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="purple" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
    </svg>`;

card.innerHTML=`

<h3 onclick="openModal('${issue._id}')" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
    <span>${issue.title}</span>
    ${icon}
</h3>

<p>${issue.description}</p>

<p>Status: ${issue.status}</p>
<p>Category: ${issue.category}</p>
<p>Author: ${issue.author}</p>
<p>Priority: ${issue.priority}</p>
<p>Label: ${issue.label}</p>
<p>Created: ${issue.createdAt}</p>

`

container.appendChild(card)

})

}

function updateStatusCounts(issues){
    const open = issues.filter(issue => issue.status.toLowerCase() === 'open').length
    const closed = issues.filter(issue => issue.status.toLowerCase() === 'closed').length
    const all = issues.length;

    document.getElementById("allCountText").innerText = `${all} Issues`;
    document.getElementById("openCountText").innerText = `${open} Open`
    document.getElementById("closedCountText").innerText = `${closed} Closed`
}



async function filterStatus(status){

updateActiveTab(`${status}-tab`)
document.getElementById('loadingSpinner').style.display = 'block';
document.getElementById('issuesContainer').innerHTML = '';

const res=await fetch(API)

const data=await res.json()

const filtered=data.data.filter(issue=>issue.status.toLowerCase()===status)
updateStatusCounts(filtered)

displayIssues(filtered)
document.getElementById('loadingSpinner').style.display = 'none';

}



function searchIssue(){

const text=document.getElementById("searchInput").value

document.getElementById('loadingSpinner').style.display = 'block';
document.getElementById('issuesContainer').innerHTML = '';

fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`)

.then(res=>res.json())

.then(data=>{
    displayIssues(data.data)
    updateStatusCounts(data.data)
    document.getElementById('loadingSpinner').style.display = 'none';
})

}



async function openModal(id){

document.getElementById("modal").classList.add("show");

const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
const data = await res.json()
const issue = data

document.getElementById("modalTitle").innerText=issue.title
document.getElementById("modalDesc").innerText=issue.description
document.getElementById("modalStatus").innerText="Status: "+issue.status
document.getElementById("modalAuthor").innerText="Author: "+issue.author
document.getElementById("modalPriority").innerText="Priority: "+issue.priority
document.getElementById("modalCategory").innerText="Category: "+issue.category
document.getElementById("modalLabel").innerText="Label: "+issue.label
document.getElementById("modalDate").innerText="Created: "+issue.createdAt

}

function updateActiveTab(activeTabId) {
    const tabButtons = document.querySelectorAll('.tabs button');
    tabButtons.forEach(button => {
        if (button.id === activeTabId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function closeModal(){

document.getElementById("modal").classList.remove("show");

}