const signupFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#name').value.trim();
  const username = document.querySelector('#username').value.trim();
  const password = document.querySelector('#password').value.trim();

  if (name && username && password) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name, username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/dashboard-goals');
    } else {
      alert(response.statusText);
    }
  }
};

document.querySelector('#signup').addEventListener('click', signupFormHandler);
