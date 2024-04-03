let fileUploaded;

// Function to prevent default behaviors
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}
async function uploadFile(file) {
  let url = '/upload';
  let formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Upload failed with status ' + response.status);
    }
    return await response.json(); // Assuming the server responds with JSON containing imageUrl
  } catch (error) {
    console.error('Error during file upload:', error);
    throw error; // Rethrow to allow caller to handle
  }
}

async function addNewGoal(event) {
  event.preventDefault();

  try {
    const file = fileUploaded[0];

    const { imgUrl } = await uploadFile(file);

    const { target } = event;

    const name = target[1].value ? target[1].value : false;
    const description = 'NEED TO CREATE FIELD ON ADD GOAL';
    const quantity = target[4].value ? target[4].value : false;
    const due_date = target[6].value != '' ? target[6].value : false;
    const goaltype = target[2].value ? target[2].value : false;
    let body;

    if (!name || !due_date || !goaltype) {
      console.error('Need name, quantity, duedate and/or goaltype');
      return;
    }

    if (goaltype === 'actionable') {
      const unit = target[3].value || false;
      const quantity = target[4].value || false;
      const direction = target[5].value || false;

      if (!unit || !quantity || !direction) {
        console.error('Need unit, quantity and/or direction');
        return;
      }

      body = {
        imgUrl,
        name,
        unit,
        direction,
        description,
        goal_amount: quantity,
        due_date,
      };
    } else if (goaltype === 'habitual') {
      body = {
        imgUrl,
        name,
        description,
        goal_amount: quantity,
        due_date,
      };
    }

    const response = await fetch(`../api/goals/${goaltype}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return (window.location.href = '../dashboard-goals?newGoalSuccess=true');
    } else {
      console.error(response);
    }

    // Additional code to handle the uploaded image URL...
  } catch (error) {
    console.error('Error adding new goal:', error);
    // Handle error (e.g., show user-friendly message)
  }
}

async function logIn(event) {
  event.preventDefault();
  const email = event.target[0].value;
  const password = event.target[1].value;

  if (!email || !password) {
    console.log('Please enter a password');
    return;
  }

  try {
    const loggedIn = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (loggedIn.status === 200) {
      window.location.href = '/dashboard-goals';
    } else {
      const message = await loggedIn.json();
      console.log(message);
    }
  } catch (err) {}
}
