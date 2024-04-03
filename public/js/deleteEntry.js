// catch click on Add Entry
async function deleteEntryHandler(event) {

    if (event.target.closest('button')) {
        const entryEl = event.target.parentElement;
        const entryId = entryEl.getAttribute('data-entry-id');
        const goalType = entryEl.getAttribute('data-goal-type');

        switch (goalType) {
            case "Actionable":
                var response = await fetch(`/api/goals/actionable/entry/${entryId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    let deletedEl = entryEl.closest("details > div");
                    deletedEl.remove();
                } else {
                    alert(response.statusText);
                };
                break;
        
            case "Habitual":
                response = await fetch(`/api/goals/habitual/entry/${entryId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    let deletedEl = entryEl.closest("details > div");
                    deletedEl.remove();
                } else {
                    alert(response.statusText);
                };
                break;
            
            default:
                break;
        };
    };
};
document.querySelector('.goals').addEventListener('click', (event) => deleteEntryHandler(event));