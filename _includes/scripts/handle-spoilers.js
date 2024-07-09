const blockSpoilers = [...document.querySelectorAll('[data-spoiler]')];

// Iterate block spoilers and assign event handlers
blockSpoilers.forEach((el) => {
  const button = el.getElementsByTagName('BUTTON')[0];

  const show = () => {
    el.classList.remove('hidden');
    el.classList.add('not-hidden');
    button.removeEventListener('click', show);
  };

  button.addEventListener('click', show);
});
