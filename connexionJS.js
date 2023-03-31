async function logIn(connexion) {
    const email = document.querySelector('#e-mail').value
    console.log("logIn")
    const password = document.querySelector('#password').value
    const compte = {
        "email": email,
        "password": password
      }
    let response = await fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(compte)
      });
      
      let result = await response.json();   
      console.log(result)
      return result
}

document.querySelector('.contact form')
.addEventListener('submit', async (event)=> {
  event.preventDefault()
  const result = await logIn()
  if('message' in result){
    alert(result.message)
  }
  if('token' in result && 'userId' in result)
  {
    window.localStorage.setItem('token', result.token)
    
    window.localStorage.setItem('userId', result.userId)
    window.location = './index.html'
  }
  else{
    alert("erreur de connexion")
  }
})