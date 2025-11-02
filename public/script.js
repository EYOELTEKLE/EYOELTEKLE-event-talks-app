document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule');
  const searchInput = document.getElementById('searchInput');
  let talks = [];

  // Fetch talk data from the API
  fetch('/api/talks')
    .then(response => response.json())
    .then(data => {
      talks = data;
      displayTalks(talks);
    })
    .catch(error => {
      console.error('Error fetching talks:', error);
      scheduleContainer.innerHTML = '<p>Error loading talks. Please try again later.</p>';
    });

  // Display talks in the schedule
  function displayTalks(talksToDisplay) {
    scheduleContainer.innerHTML = '';
    let startTime = new Date('2025-11-02T10:00:00');

    talksToDisplay.forEach((talk, index) => {
      const scheduleItem = document.createElement('div');
      scheduleItem.classList.add('schedule-item');

      const time = new Date(startTime);
      const endTime = new Date(time.getTime() + talk.duration * 60000);

      scheduleItem.innerHTML = `
        <div class="time">${formatTime(time)} - ${formatTime(endTime)}</div>
        <h2>${talk.title}</h2>
        <div class="speakers">By: ${talk.speakers.join(', ')}</div>
        <p>${talk.description}</p>
        <div class="category">
          ${talk.category.map(cat => `<span>${cat}</span>`).join('')}
        </div>
      `;

      scheduleContainer.appendChild(scheduleItem);

      // Add break
      if (index === 2) {
        const breakItem = document.createElement('div');
        breakItem.classList.add('schedule-item');
        const breakStartTime = new Date(endTime.getTime() + 10 * 60000);
        const breakEndTime = new Date(breakStartTime.getTime() + 60 * 60000);
        breakItem.innerHTML = `
        <div class="time">${formatTime(breakStartTime)} - ${formatTime(breakEndTime)}</div>
        <h2>Lunch Break</h2>
      `;
        scheduleContainer.appendChild(breakItem);
        startTime = new Date(breakEndTime.getTime() + 10 * 60000);
      } else {
        startTime = new Date(endTime.getTime() + 10 * 60000);
      }
    });
  }

  // Format time as HH:MM AM/PM
  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Filter talks based on search input
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTalks = talks.filter(talk =>
      talk.category.some(cat => cat.toLowerCase().includes(searchTerm))
    );
    displayTalks(filteredTalks);
  });
});
