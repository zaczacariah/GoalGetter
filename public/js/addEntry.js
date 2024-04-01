// catch click on Add Entry
async function addEntryHandler(event) {

    if (event.target.matches('a')) {
        const entryEl = event.target.previousElementSibling;
        const notes = entryEl.value.trim();
        const goal_id = entryEl.getAttribute('data-goal-id');
        const goalType = entryEl.getAttribute('data-goal-type');

        if (notes === "") {
            return;
        };

        switch (goalType) {
            case "Actionable":
                var response = await fetch(`/api/goals/actionable/entry`, {
                    method: 'POST',
                    body: JSON.stringify({
                        quantity: notes,
                        notes: "",
                        actionable_goal_id: goal_id
                    }),
                    headers: { 'Content-Type': 'application/json'},
                });

                if (response.ok) {
                    document.location.replace(`/dashboard-goals`);
                } else {
                    alert(response.statusText);
                };
                break;
        
            case "Habitual":
                response = await fetch(`/api/goals/habitual/entry`, {
                    method: 'POST',
                    body: JSON.stringify({
                        notes: notes,
                        habitual_goal_id: goal_id
                    }),
                    headers: { 'Content-Type': 'application/json'},
                });

                if (response.ok) {
                    document.location.replace(`/dashboard-goals`);
                } else {
                    alert(response.statusText);
                };
                break;
            
            default:
                break;
        };
    };
};
document.querySelector('.goals').addEventListener('click', (event) => addEntryHandler(event));