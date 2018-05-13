// set size of first jumbotron to window height (and resize when window resized)
let firstJumbotron = document.querySelector('#main-jumbotron');
let resizeHandler = () => {
  firstJumbotron.style.height = window.innerHeight + 'px';
};
resizeHandler();
window.addEventListener('resize', resizeHandler);

// images for image separators
let imageSeparators = document.querySelectorAll('.image-separator');
[].forEach.call(imageSeparators, imageSeparator => {
  imageSeparator.style.backgroundImage = `url('${imageSeparator.dataset.src}')`;
});

// dynamic terminal
let actions = ['brother', 'math', 'run', 'blog', 'code', 'build', 'cube', 'bowl', 'teach', 'learn', 'hack', 'eat', 'sleep', 'design'];
let actionsIndex = Math.floor(Math.random() * actions.length);
let wordIndex = 0;
let increasing = true;
let dynamicTerminal = document.querySelector('#codeVisualText');
let dynamicCursor = document.querySelector('#codeVisualCursor');
let t = setInterval(() => {
  dynamicTerminal.textContent = actions[actionsIndex].slice(0, wordIndex);
  if(increasing) {
    wordIndex++;
    if(wordIndex == actions[actionsIndex].length) {
      dynamicCursor.classList.add('blinking');
    }
    if(wordIndex == actions[actionsIndex].length + 15) {
      increasing = false;
    }
  } else {
    wordIndex--;
    if(wordIndex == actions[actionsIndex].length) {
      dynamicCursor.classList.remove('blinking');
    }
    if(wordIndex == 0) {
      increasing = true;
      actionsIndex = Math.floor(Math.random() * actions.length);
    }
  }
}, 150);