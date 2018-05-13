// images for image separators
let imageSeparators = document.querySelectorAll('.image-separator');
[].forEach.call(imageSeparators, imageSeparator => {
  imageSeparator.style.backgroundImage = `url('${imageSeparator.dataset.src}')`;
});

// set size of first jumbotron to window height (and resize when window resized)
// resize image separators
let firstJumbotron = document.querySelector('#main-jumbotron');
let videoSeparator = document.querySelector('.video-separator');
let videoPlaceholder = document.querySelector('.video-placeholder');
let oldWidth = 0;
let resizeHandler = () => {
  firstJumbotron.style.height = window.innerHeight + 'px';
  // prevent constant refreshing on mobile on vertical resize
  if(oldWidth !== window.innerWidth) {
    oldWidth = window.innerWidth;
    [].forEach.call(imageSeparators, imageSeparator => {
      // mobile
      if(window.innerWidth < 750 || window.innerHeight < 700)
        imageSeparator.style.backgroundSize = `auto ${window.innerHeight}px`;
      // desktop
      else
        imageSeparator.style.backgroundSize = `${window.innerWidth}px auto`;
      imageSeparator.style.height = window.innerHeight + 'px';
    });
    videoPlaceholder.style.height = window.innerHeight + 'px';
    videoSeparator.style.minHeight = window.innerHeight + 'px';
    videoSeparator.style.minWidth = window.innerWidth + 'px';
    videoSeparator.style.marginLeft = (window.innerWidth - videoSeparator.offsetWidth) / 2 + 'px';
  }
};
resizeHandler();
window.addEventListener('resize', resizeHandler);

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