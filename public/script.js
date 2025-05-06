fetch('/tasks')
  .then(res => res.json())
  .then(tasks => {
    const list = document.getElementById('task-list');
    list.innerHTML = ''; // clear old content if any

    tasks.forEach((task, i) => {
      const li = document.createElement('li');
      li.textContent = task.text;
      if (task.done) li.classList.add('done');

      // Form to mark as done
      const formDone = document.createElement('form');
      formDone.action = '/done';
      formDone.method = 'POST';
      formDone.style.display = 'inline';
      formDone.innerHTML = `
        <input type="hidden" name="index" value="${i}">
        <button type="submit">✓</button>
      `;

      // Form to delete task
      const formDelete = document.createElement('form');
      formDelete.action = '/delete';
      formDelete.method = 'POST';
      formDelete.style.display = 'inline';
      formDelete.innerHTML = `
        <input type="hidden" name="index" value="${i}">
        <button type="submit">🗑</button>
      `;

      // Append forms
      li.appendChild(formDone);
      li.appendChild(formDelete);
      list.appendChild(li);
    });
  });