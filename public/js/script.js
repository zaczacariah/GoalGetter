





async function logIn(event){
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;

    if(!email || !password){
        console.log("Please enter a password")
        return;
    }

    try{
        const loggedIn = await fetch('/api/users/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        if(loggedIn.status === 200){
            window.location.href = '/dashboard-goals';
        } else {
            const message = await loggedIn.json();
            console.log(message)
        }

    } catch(err){
        
    }
}