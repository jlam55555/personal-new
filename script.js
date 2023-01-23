// lazy-load images backgrounds
let imageSeparators = document.querySelectorAll('.image-separator');
let imageBackgrounds = document.querySelectorAll('[data-src]:not(img)');
Array.from(imageBackgrounds).forEach(imageSeparator => imageSeparator.style.backgroundImage = `url('${imageSeparator.dataset.src}')`);

// lazy load images
let images = document.querySelectorAll('img');
Array.from(images).forEach(image => image.src = image.dataset.src);

// set size of first jumbotron to window height (and resize when window resized)
// resize image separators
let firstJumbotron = document.querySelector('#main-jumbotron');
let oldWidth = 0;
let desktopNavbar = document.querySelector('#nav-bar .desktop');
let projectLightboxElem = document.querySelector('#project-lightbox');
let resizeHandler = () => {
  let windowWidth, windowHeight;
  if(window.visualViewport) {
    windowWidth = window.visualViewport.width;
    windowHeight = window.visualViewport.height;
  } else {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
  }
  // prevent constant refreshing on mobile on vertical resize
  if(oldWidth !== windowWidth || (windowWidth > 500 && windowHeight > 500)) {
    firstJumbotron.style.height = windowHeight + 'px';
    [].forEach.call(imageSeparators, imageSeparator => {
      imageSeparator.style.minHeight = windowHeight + 'px';
    });
  }
  oldWidth = windowWidth;
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

// dynamic terminal buttons
let codeVisualElem = document.querySelector('#codeVisual');
let closeButtonElem = document.querySelector('#button1');
let resizeButtonElem = document.querySelector('#button2');
let minimizeButtonElem = document.querySelector('#button3');
closeButtonElem.addEventListener('click', _ => {
  codeVisualElem.classList.toggle('closed');
});
resizeButtonElem.addEventListener('click', _ => {
  codeVisualElem.classList.toggle('big');
});
minimizeButtonElem.addEventListener('click', _ => {
  codeVisualElem.classList.add('minimize');
  setTimeout(_ => {
    codeVisual.classList.remove('minimize')
    codeVisual.classList.add('minimized')
  }, 1000);
});
codeVisualElem.addEventListener('click', _ => {
  if(codeVisualElem.classList.contains('minimized')) {
    codeVisualElem.classList.remove('minimized');
    codeVisualElem.classList.add('expand');
    setTimeout(_ => {
      codeVisualElem.classList.remove('expand');
    }, 1000);
  }
});


// dropdown button
let dropdownButton = document.querySelector('#dropdown-button');
let dropdown = document.querySelector('#dropdown-nav');
let dropdownAs = document.querySelectorAll('#dropdown-nav > a');
let toggleMenu = () => dropdown.classList.toggle('show');
dropdownButton.addEventListener('click', toggleMenu);
Array.from(dropdownAs).forEach(dropdownA => dropdownA.addEventListener('click', toggleMenu));

let navButtons = Array.from(document.querySelectorAll('#nav-bar .desktop a'));
let elements = [
  document.querySelector('#main-jumbotron'),
  document.querySelector('#about'),
  document.querySelector('#projects'),
  document.querySelector('#technologies'),
  document.querySelector('#contact')
];
let currentSection = 0;
let scrollHandler = () => {
  let i;
  for(i = 0; i < elements.length; i++) {
    if(elements[i].getBoundingClientRect().top > 1) {
      break;
    }
  }
  i = i == 0 ? 0 : i-1;
  currentSection = i;
  navButtons[i].classList.add('active');
  navButtons.forEach((button, index) => {
    if(index !== i) button.classList.remove('active');
  });
};
document.addEventListener('scroll', scrollHandler);
scrollHandler();
navButtons.forEach((button, id) => {
  button.addEventListener('click', () => window.scroll({
    top: elements[id].getBoundingClientRect().top + window.scrollY,
    behavior: 'smooth'
  }));
});

// timeline buttons
let timelineElem = document.querySelector('#timeline');
document.querySelectorAll('.timeline-button').forEach(btnElem => {
  let isNext = btnElem.classList.contains('timeline-button-next');
  btnElem.addEventListener('click', _ => {
    // iOS safari conditional -- see note at end
    timelineElem.scrollBy({
      left: timelineElem.getBoundingClientRect().width * (isNext ? 1 : -1),
      behavior: /iP(ad|hone|od).+Version\/[\d\.]+.*Safari/i.test(navigator.userAgent) ? 'auto' : 'smooth'
    });
  });
});

// START CAROUSEL BEHAVIOR
// scroll animation function adapted from https://pawelgrzybek.com/page-scroll-in-vanilla-javascript/
HTMLElement.prototype.animatedScrollTo = function(destination, duration = 200, easing = 'linear', callback) {

  const easings = {
    linear(t) { return t; },
    easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
  };

  const start = this.scrollLeft;
  const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
  const destinationOffsetToScroll = Math.floor(destination);

  const scroll = () => {
    const now = 'now' in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, ((now - startTime) / duration));
    const timeFunction = easings[easing](time);
    this.scrollTo(Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start), 0);

    if (Math.abs(this.scrollLeft - destinationOffsetToScroll) < 10) {
      if (callback) { callback(); }
      return;
    }
    requestAnimationFrame(scroll);
  }
  scroll();
}

let scrollContainer = document.querySelector('#project-scroller');
let projects = [
  {
    image: './assets/programath-logo.png',
    background: './assets/programath-full.png',
    title: 'Programath',
    description: 'Jonathan\'s oldest surviving relic published onto the World Wide Web! This was created for the PLTW final project in the eighth grade, and features basic calculators, with expression parsing written in JavaScript. The website shows how HTML, CSS, JavaScript, and PHP (for a quiz) can be tied together to make a useful, presentable website.',
    active: '2014',
    stack: [ 'JavaScript', 'HTML5', 'CSS3', 'PHP' ],
    links: [
      { title: 'See it', url: 'http://www.programath.co.nf' },
      { title: 'GitHub', url: 'https://github.com/jlam55555/programath' }
    ]
  },
  {
    image: './assets/atechlife-logo.png',
    background: './assets/atechlife-full.png',
    title: 'A Tech Life',
    description: 'How much has modern (computing) technology assimilated itself into the lives of high schoolers by 2015? This is the final project for the year-long freshmen LENS project, which involved exploring history through a lens (theme) and location. The theme explored here was new productivity technologies in ancient China, and the website is an interactive demonstration into how vital non-essential digital technology has become&mdash; a fact that becomes ever more prevalent.',
    active: '2015',
    stack: [ 'HTML5', 'JavaScript', 'CSS3', 'PHP' ],
    links: [
      { title: 'See it', url: 'http://www.atechlife.co.nf/' },
      { title: 'GitHub', url: 'https://github.com/jlam55555/ATechLife' }
    ]
  },
  {
    image: './assets/thl.jpg',
    background: './assets/thl-full.jpg',
    title: 'The Homework Life',
    description: 'The earliest of multiple blogs! The fear of fluncking Advanced English drove me to create this collection of babbling adolescent blurbs. For a while, this also was the hub of my programming projects before switching over to using GitHub sites for hosting.',
    active: '2015-2016',
    stack: [ 'JavaScript', 'HTML5', 'CSS3', 'PHP', 'MySQL' ],
    links: [
      { title: 'See it', url: 'http://www.thehomeworklife.co.nf' }
    ]
  },
  {
    imageText: 'WV',
    background: './assets/wv.jpg',
    title: 'Word Visualizer',
    description: 'Word visualizer is a tool to turn text into an image for downloading. Change colors and shading! Useful for replicating the styles of textual logos.',
    active: '2016',
    stack: [ 'JavaScript', 'HTML5', 'CSS3' ],
    links: [
      { title: 'Use it', url: 'https://jlam55555.github.io/word-visualizer' },
      { title: 'GitHub', url: 'https://github.com/jlam55555/word-visualizer' }
    ]
  },
  {
    imageText: 'A.Io',
    background: './assets/ar.jpg',
    title: 'Agar.io Imitation',
    description: 'Online multiplayer game inspired by Agar.io. Eat coins to grow, upgrade your stats, and bump into other players to damage them! Primarily developed during junior prom (morp) night.',
    active: '2016',
    stack: [ 'JavaScript', 'HTML5', 'CSS3', 'Node.JS', 'Socket.io' ],
    links: [
      { title: 'Play it', url: 'http://jlam55555.github.io/agario-ripoff' },
      { title: 'GitHub', url: 'https://github.com/jlam55555/agario-ripoff' }
    ]
  },
  {
    imageText: 'RT',
    background: './assets/rt.jpg',
    title: 'RingTune',
    description: 'Make a little melody with RingTune! The app guesses the next note based on common note melodies, and can generate random euphonious subtunes. Created during LIHacks 2016 and won the Most Entrepreneurial Award.',
    active: '2016',
    stack: [ 'JavaScript', 'HTML5', 'CSS3' ],
    links: [
      { title: 'Use it', url: 'https://jlam55555.github.io/ringtune-website/' },
      { title: 'GitHub', url: 'https://github.com/jlam55555/ringtune-website' }
    ]
  },
  {
    imageText: '<span>xkcd</span><span>term</span>',
    background: './assets/xkcd-term.jpg',
    title: 'xkcd (Terminal)',
    description: `Terminal-based xkcd viewer for Linux inspired by <a href='https://github.com/hakerdefo/pmxkcd' target='_blank'>pmxkcd</a>. Uses ImageMagick to display a comic in another window. This program allows you to view the current comic, a random comic, or the comic with a given ID.`,
    active: '2016',
    stack: [ 'Bash' ],
    links: [
      { title: 'GitHub', url: 'https://github.com/jlam55555/xkcd-client' }
    ]
  },
  {
    imageText: 'jkcd',
    background: './assets/jkcd.jpg',
    title: 'jkcd',
    description: `Java-based GUI for viewing xkcd comics. Was built as an improvement over the terminal-based <a href='https://github.com/jlam55555/xkcd-term' target='_blank'>xkcd-client</a>. Has all of the navigational functionalities of the xkcd website.`,
    active: '2016',
    stack: [ 'Java' ],
    links: [
      { title: 'GitHub', url: 'https://github.com/jlam55555/jkcd' }
    ]
  },
  {
    imageText: '<span>Pop</span><span>the</span><span>Lock</span>',
    background: './assets/ptl.jpg',
    title: 'Pop the Lock',
    description: `Simple implementation of Pop the Lock. Tap the space bar to try to pop the lock. Try to get the highest streak! Uses CSS for lightweight, minimalistic animations. Inspired by Jacob Wunder's <a href='http://jacobwunder.com/tap-tap-pop/' target='_blank'>Tap Tap Pop</a>.`,
    active: '2016',
    stack: [ 'HTML5', 'CSS3', 'JavaScript' ],
    links: [
      { title: 'Play it', url: 'https://jlam55555.github.io/pop-the-lock' },
      { title: 'GitHub', url: 'https://github.com/jlam55555/pop-the-lock' }
    ]
  },
  {
    imageText: 'Noted',
    background: './assets/noted.jpg',
    title: 'Noted',
    description: 'Keep tabs on your shopping list, homework assignments, or daily job demands with this convenient Google Chrome extension! You can access it from the icon or from the new tab page. Your notes save automatically as you type, and will persist through browser sessions.',
    active: '2016',
    stack: [ 'HTML5', 'JavaScript', 'Google Chrome' ],
    links: [
      { title: 'GitHub', url: 'https://github.com/jlam55555/noted-chrome-extension' }
    ]
  },
  {
    image: './assets/mendelbrot-logo.png',
    background: './assets/julia-full.jpg',
    title: 'Assorted Fractals',
    description: `Played around with fractals on a sick day. Found a lot of fun in learning the very interesting methods used to generate (or approximate) these curves, such as the chaos game for the Sierpinski gasket, the complex function for Julia and Mendelbrot sets, and the Thue-Morse sequence for the Koch curve.`,
    active: '2016',
    stack: [ 'JavaScript' ],
    links: [
      { title: 'Julia Set generator', url: 'https://jsfiddle.net/jlam55555/ay4nqfqL/5/' },
      { title: 'Mendelbrot Set generator', url: 'https://jsfiddle.net/jlam55555/3bgvt3c4/2/' },
      { title: 'Koch Curve Generator', url: 'https://jsfiddle.net/jlam55555/a1qshh6x/7/' },
      { title: 'Chaos Game (Square)', url: 'https://jsfiddle.net/jlam55555/m0gyzpt0/22/' },
      { title: 'Chaos Game (Hexagon)', url: 'https://jsfiddle.net/jlam55555/tkduy1o3/3/' },
    ]
  },
  {
    imageText: '<span>Nutmeg</span><span>Bowl</span>',
    background: './assets/nutmegbowl-full.png',
    title: 'Nutmeg Bowl',
    description: `The <a href='https://web.archive.org/web/20150205230240/http://nutmegbowl.com:80/' target='_blank'>design of the old website for the Nutmeg Bowl bowling alley</a> had not been changed in a decade and a half. This website sought to modernize the site by making it more consistent, aesthetically-pleasing, modular, and informative. Unfortunately, the alley had simultaneous plans to modernize their site and replaced their website shortly before this one was proposed to them.`,
    active: '2016',
    stack: [ 'JavaScript', 'CSS3', 'HTML5' ],
    links: [
      { title: 'See it', url: 'https://jlam55555.github.io/nutmegbowl/' },
      { title: 'GitHub', url: 'https://github.com/jlam55555/nutmegbowl' }
    ]
  },
  {
    imageText: '<span>uns</span><span>cram</span><span>ble</span>',
    background: './assets/unscrambler.jpg',
    title: 'Word Unscrambler',
    description: `Look up anagrams of a word, or play a game to find them yourself! Fun for word games (you cheater!) or to expand your vocabulary. This tool uses the <a href='https://www.github.com/dwyl/english-words' target='_blank'>@dwyl/english-words</a> as an English dictionary.`,
    active: '2016',
    stack: [ 'JavaScript' ],
    links: [
      { title: 'Use it', url: 'http://jonlamdev.com/unscrambler/' },
      { title: 'GitHub', url: 'https://github.com/jlam55555/unscrambler' }
    ]
  },
  {
    imageText: '<span>Simple</span><span>New</span><span>Tab</span>',
    background: './assets/snt.jpg',
    title: 'Simple New Tab',
    description: 'Tired of the new tab page? Make it your own. You can choose to leave it blank, fill it with a color, or replace it with an image. The single control is intuitive and is hidden when not in use so you can enjoy your personalized newtab page.',
    active: '2016',
    stack: [ 'HTML5', 'JavaScript', 'CSS3', 'Google Chrome' ],
    links: [
      { title: 'GitHub', url: 'https://github.com/jlam55555/simple-new-tab' }
    ]
  },
  {
    image: './assets/momath-2017-logo.png',
    background: './assets/momath-2017-full.jpg',
    title: 'MoMath Exhibits 1',
    description: `Kid-friendly, educational exhibits for the MoMath Hackathon 2017. This includes a function grapher for the <a href='https://www.youtube.com/watch?v=RzDM5qzTZeE&feature=youtu.be' target='_blank'>Dynamic Wall</a> exhibit and a function regression game for the Math Square, a large touchscreen exhibit. The Crease Graph exhibit won first place for the Dynamic Wall; the Regression Game won finalist for the Math Square; and the Main Idea Notebook won the Wolfram Award. Created with <a href='https://github.com/all88keys/' target='_blank'>Chris Vassallo</a> and <a href='https://github.com/poobaloofa' target='_blank'>Julian Ivaldi</a>.`,
    active: '2017',
    stack: [ 'JavaScript', 'Java', 'Mathematica', 'MoMath SDK' ],
    links: [
      { title: 'GitHub', url: 'https://github.com/poobaloofa/howitfeelstochew5gum' },
    ]
  },
  {
    image: './assets/fs.jpg',
    background: './assets/fs-full.jpg',
    title: 'Fruit Sensei',
    description: `Slice that fruit with your &hellip; phone! This website uses JavaScript's deviceorientationevent on a mobile device to control a virtual katana. Created during MLH StuyHacks LHD 2017 with <a href='https://prathgan.github.io/' target='_blank'>Pratham Gandhi</a> and <a href='https://navidmx.com/' target='_blank'>Navid Mamoon</a>, and won the Best Game Award.`,
    active: '2017',
    stack: [ 'JavaScript', 'HTML5', 'THREE.JS', 'Socket.io' ],
    links: [
      { title: 'Play it', url: 'https://fruit-sensei.herokuapp.com/' },
      { title: 'Devpost', url: 'https://devpost.com/software/fruit-sensei' },
      { title: 'GitHub', url: 'https://github.com/FruitSensei/fruitsensei.github.io' }
    ]
  },
  {
    image: './assets/bb.jpg',
    background: './assets/bb-full.jpg',
    title: 'JBHS Bowling',
    description: 'Statistics for the JBHS CIBL Bowling Team of the 2017-2018 season. This website displays team statistics and uses a heuristic formula to estimate which players will be on Varsity in the subsequent week. Users can view both individual and team statistics, which include measures of center, spread, and improvement. (This website was specific to the 2017-2018 season and is not being used for the most recent JBHS Bowling Team.)',
    active: '2017-2018',
    stack: [ 'HTML5', 'CSS3', 'JavaScript', 'Angular' ],
    links: [
      { title: 'See it', url: 'https://jbhsbowling.github.io' },
      { title: 'GitHub', url: 'https://www.github.com/jbhsbowling/jbhsbowling.github.io' }
    ]
  },
  {
    image: './assets/srre.jpg',
    background: './assets/srre-full.jpg',
    title: 'Safe Rides of ER9',
    description: 'The official web-app for the Safe Rides service for the ER9 region! The service provides high schoolers with a trusted, reliable way home on late Friday and Saturday nights. The web-app is a website which can easily be saved as a web-app on iOS for easy access, and offers anything a volunteer or ride-requester needs to use the service. (Currently not in use by the service, although that may change.)',
    active: '2017-2018',
    stack: [ 'JavaScript', 'HTML5', 'CSS3', 'Node.JS', 'PostgreSQL', 'Bootstrap', 'Socket.io' ],
    links: [
      { title: 'See it', url: 'https://safe-rides-redding-easton.herokuapp.com' }
    ]
  },
  {
    image: './assets/eis.jpg',
    background: './assets/eis-full.jpg',
    title: 'Everything is Sheep',
    description: 'Everything is Sheep (EiS) is a blog comprising of essays about high school and programming, and is the successor to The Homework Life (THL). While THL was written in 2015 in response to academic-literary dread, this one was written on a whim. All of the posts from THL were migrated over. A major goal of EiS was to create a sleeker blog interface and move the tech stack over from PHP (LAMP) to JavaScript (Node.js back-end).',
    active: '2017-2018',
    stack: [ 'JavaScript', 'HTML5', 'CSS3', 'Node.JS', 'PostgreSQL' ],
    links: [
      { title: 'See it', url: 'https://everything-is-sheep.herokuapp.com' }
    ]
  },
  {
    image: './assets/mrg.jpg',
    background: './assets/mrg-full.jpg',
    title: 'Multiracer Game',
    description: `Use your phone to steer a car on the screen. Play with up to three of your friends. This uses JavaScript's deviceorientation event to track your phone's orientation. Created for the AP CSP Create Performance Task with <a href='https://github.com/rdk750' target='_blank'>Rahul Kiefer</a>.`,
    active: '2018',
    stack: [ 'JavaScript', 'HTML5', 'THREE.JS', 'Socket.io' ],
    links: [
      { title: 'Play it', url: 'https://racing-game-csp.herokuapp.com' },
      { title: 'GitHub', url: 'https://github.com/jlam55555/racing-game' }
    ]
  },
  {
    image: './assets/optum-labs-logo.png',
    background: './assets/mygut-full.png',
    title: 'Optum Labs Florida',
    description: `myGUT X22 and RespHealth X22 are revolutionary new products by Optum Labs of Florida, which allow patients to conveniently and privately take lab samples at home using a kit. The kit may then be mailed to the lab for analysis, and results are reported in only a day! Patients may receive the kit from an affiliated doctor or online. The website offers a way for patients to find nearby doctors or purchase the kit directly through Shopify.`,
    active: '2018',
    stack: [ 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap', 'Vue.JS', 'Java' ],
    links: [
      { title: 'See myGUT X22', url: 'https://www.mygutx22.com' },
      { title: 'See RespHealth X21', url: 'https://www.resphealthx21.com' },
    ]
  },
  {
    image: './assets/momath-2018-logo.png',
    background: './assets/momath-2018-full.jpg',
    title: 'MoMath Exhibits 2',
    description: `Award-winning projects for the MoMath Hackathon 2018! Again kid-friendly, educational, and interactive, the 2017 team reprises with a Doppler Effect exhibit for the Dynamic Wall (finalist), a Slope Fields animation and Spirographs of Venus exhibit (winner) for the Math Square, a fractal augmented-reality app called MengAR (winner), and a Purple Pendulums simulation (winner). Developed with the LINK team.`,
    active: '2018',
    stack: [ 'JavaScript', 'Java', 'AR.JS', 'MoMath SDK' ],
    links: [
      { title: 'GitHub', url: 'https://github.com/jlam55555/howitfeelstochew6gum' },
    ]
  },
  {
    image: './assets/fluorination-logo.png',
    background: './assets/fluorination-full.jpg',
    title: 'Fluorination',
    description: `There are many high-schoolers and college students crave information in an easy, intuitive way, as they cram for a test on the next day. There are many high-schoolers and college students who have that information, and are entirely capable of delivering it. The goal of Fluorination is to incentivize this exchange by gamification. This was developed during HackCooper 2018, and won Best Use of Algolia. (Currently out of service because of trial software; will be edited soon.)`,
    active: '2018',
    stack: [ 'JavaScript', 'HTML5', 'CSS3', 'Vue.JS', 'Algolia', 'Alexa' ],
    links: [
      { title: 'See it', url: 'https://fluorination-server.herokuapp.com' },
      { title: 'GitHub', url: 'https://github.com/FluorinationNation/fluorination-server' },
    ]
  },
  {
    image: './assets/regulators-logo.png',
    background: './assets/regulators-full.png',
    title: 'The Regulators',
    description: `In Uganda, junk food is becoming abundant, lifestyles are becoming stagnant, and health education is lacking, leading to a dangerous rise in diabetes. The cost of modern glucometers to measure blood sugar is prohibitive for many Ugandans, so a team of Cooper Union students created a low-cost alternative: chemical test strips that change color based on the sugar level. The website documents the project, and the app helps analyze the test strips.`,
    active: '2018',
    stack: [ 'JavaScript', 'HTML5', 'CSS3', 'React.JS', 'Android', 'Java' ],
    links: [
      { title: 'See the website', url: 'https://theregulators.github.io' },
      { title: 'GitHub (website)', url: 'https://github.com/theregulators/website-source' },
      { title: 'GitHub (app)', url: 'https://www.github.com/theregulators/regulators-android' },
    ]
  },
  {
    imageText: 'CM',
    background: './assets/consignmore-full.png',
    title: 'Consignmore',
    description: `It may take over a month for a consignor's art piece to go through the consignment process, and there may be no feedback from the auction house at all during that period. There's no way to know what preparation stage the piece is currently at, what the current bids are, or if the piece has been bought. Consignmore solves this problem by enabling data flow internally (in the auction house) and externally (to the consignors) in a simple, intuitive interface.`,
    active: '2018-present',
    stack: [ 'JavaScript', 'HTML5', 'CSS3', 'Angular', 'Node.JS', 'PostgreSQL', 'SSE' ],
    links: [
      { title: 'See it', url: 'https://consignmore.herokuapp.com' },
    ]
  },
  {
    imageText: '<span>Cooper</span><span>Union</span><span>Fusion</span>',
    background: '',
    title: 'Cooper Union Fusion',
    description: `Fusion website for Cooper Union student-managed websites. The old websites have an archaic PHP back-end. This projects aims to centralize and modularize the current student websites, such as the bookfair, locker management, student resource locator, club funding applications, and student council sites. Stay tuned.`,
    active: 'Spring 2019-Summer 2019',
    stack: [ 'MERN' ],
    links: [
      { title: 'GitHub', url: 'https://github.com/archwa/fusion' },
    ]
  },
  {
    image: './assets/babap-logo.png',
    background: './assets/babap-full.png',
    title: 'BaBaP',
    description: `Bits and Bytes and Peaces. What do you think when you see the word "navigate"? What about "navigating a blog"? They're two completely different things, aren't they? The concept for BaBaP was to make them the same: physical navigation of a blog. Instead of the linear relationship of a traditional blog, the posts will be mapped to a physical, 2D space that users can navigate in the traditional way: walking. This 2D remapping is currently being designed.`,
    active: '2018-present',
    stack: [ 'HTML5', 'JavaScript', 'CSS3', 'PHP7' ],
    links: [
      { title: 'See it', url: 'http://babap.co.nf/' },
      { title: 'GitHub', url: 'https://github.com/jlam55555/babap-blog' },
    ]
  },
  {
    image: './assets/website-logo.png',
    background: './assets/website-full.png',
    title: 'Personal Website',
    description: `This website! You've seen it already. But it really is an evolution over the last few years. Every design choice is the result of many iterations, with the following criteria: is it fast? Is it consistent? Is it future-proof? Is it elegant? Vanilla JS and CSS were used to avoid the performance costs of libraries.`,
    active: '2017-present',
    stack: [ 'Javascript', 'HTML5', 'CSS3' ],
    links: [
      { title: 'See it', url: '#' },
      { title: 'GitHub', url: 'https://jlam55555.github.io/' },
    ]
  },
  {
    imageText: '<span>Photo</span><span>Chooser</span>',
    background: '',
    title: 'Photo Chooser',
    description: `Imagine using machine learning to choose the best out of a set of photos. Instead of having to choose that best shots out of the thousands of photos taken at the last family gathering, let a computer choose for you based on the choices of others.`,
    active: 'future (no timeline planned yet)',
    stack: [ 'ML' ],
    links: [ ]
  },
];
let preloadedProjectImages = [];
projects.forEach((project, index) => {
  let div = document.createElement('div');
  div.classList.add('project-icon');
  div.dataset.index = index;
  div.addEventListener('click', function() {
    debounceScrollHandler(this);
  });
  if(project.imageText) {
    let imageText = document.createElement('div');
    imageText.classList.add('unselectable', 'image-text');
    if(project.imageText.length < 5) imageText.classList.add('large-text');
    imageText.innerHTML = project.imageText;
    div.appendChild(imageText);
  } else {
    let image = document.createElement('img');
    image.classList.add('unselectable');
    image.src = project.image;
    div.appendChild(image);
  }
  scrollContainer.appendChild(div);
  
  // preload backgrounds
  let preloadedProjectImage = new Image();
  preloadedProjectImage.src = project.background;
  preloadedProjectImages.push(preloadedProjectImage);
});

let n = projects.length;
let currentProject = projects.find(project => project.active === '2018');
let cur = projects.indexOf(currentProject);

// set to center
let sampleElement = scrollContainer.firstChild;
let sampleElementWidth = _ => sampleElement.getBoundingClientRect().width + parseInt(getComputedStyle(sampleElement).marginLeft.slice(0, -2)) * 2;

// get first project from 2018
// make sure it runs on time
scrollContainer.scrollLeft = sampleElementWidth() * cur;
setTimeout(_ => {
  scrollContainer.scrollLeft = sampleElementWidth() * cur;
}, 100);

// get center-most project
let getCenterItem = _ => {
  let scrollPos = scrollContainer.scrollLeft;
  let containerCenter = scrollContainer.getBoundingClientRect().width / 2;
  let elementWidth = sampleElement.getBoundingClientRect().width;
  let elementMargin = parseInt(getComputedStyle(sampleElement).marginLeft.slice(0, -2));
  let closest, closestElem;
  document.querySelectorAll('.project-icon').forEach((icon, index) => {
    let iconOffset = icon.offsetLeft + elementWidth / 2 - scrollPos;
    if(Math.abs(iconOffset - containerCenter) <= elementWidth / 2 + elementMargin) {
      // closest to center!
      icon.classList.add('centered');
      closest = index;
      closestElem = icon;
    } else {
      icon.classList.remove('centered');
    }
  });
	if(closestElem !== currentProject) currentProject = closestElem;
  return {
    index: closest,
    elem: closestElem
  };
};

// update DOM with details
let projectTitleElem = document.querySelector('#project-title');
let projectDescriptionElem = document.querySelector('#project-description');
let projectActiveElem = document.querySelector('#project-active');
let projectStackElem = document.querySelector('#project-stack');
let projectLinksElem = document.querySelector('#project-links');
const faClassMap = {
  'Algolia': 'fab fa-algolia',
  'Android': 'fab fa-android',
  'Angular': 'fab fa-angular',
  'Bash': 'fas fa-terminal',
  'CSS': 'fab fa-css3',
  'CSS3': 'fab fa-css3',
  'Google Chrome': 'fab fa-chrome',
  'HTML': 'fab fa-html5',
  'HTML5': 'fab fa-html5',
  'Java': 'fab fa-java',
  'JavaScript': 'fab fa-js',
  'MySQL': 'fas fa-database',
  'Node.JS': 'fab fa-node-js',
  'PostgreSQL': 'fas fa-database',
  'PHP': 'fab fa-php',
  'PHP7': 'fab fa-php',
  'React.JS': 'fab fa-react',
  'SSE': 'fas fa-server',
  'Socket.io': 'fas fa-server',
  'Vue.JS': 'fab fa-vuejs',
};
let changeProjectBox = index => {
  let project = projects[index];
  projectTitleElem.textContent = project.title;
  projectDescriptionElem.innerHTML = project.description;
  scrollContainer.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${project.background}')`;

  projectActiveElem.textContent = project.active;
  projectStackElem.innerHTML = (project.stack || []).map(projectTechnology => `<span class='stack-card unselectable'><i class='${faClassMap[projectTechnology] || 'fas fa-code'}'></i> <span>${projectTechnology}</span></span>`).join('');
  projectLinksElem.innerHTML = (project.links || []).map(projectLink => `<a href='${projectLink.url}' target='_blank'>${projectLink.title}</a>`).join(' | ');
};
changeProjectBox(cur);

// debouncing
let debounceTimeout;
let autoplayInterval;
let projectScrollHandler;
debounceScrollHandler = elem => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(projectScrollHandler.bind(null, elem), 100);
};
let throttleLock = false;
projectScrollHandler = elem => {
  if(throttleLock) return;
  throttleLock = true;
  let curElem = getCenterItem().elem;
  changeProjectBox((elem || curElem).dataset.index);
  if(elem && elem != curElem) {
    let scrollToPos = Math.floor(elem.offsetLeft + (sampleElementWidth() - scrollContainer.getBoundingClientRect().width) / 2);
    // iOS safari specific -- see note at end
    // code to detect iOS safari from https://coderwall.com/p/ktrbhq/detect-mobile-safari
    if(/iP(ad|hone|od).+Version\/[\d\.]+.*Safari/i.test(navigator.userAgent)) {
      scrollContainer.scrollTo(scrollToPos, 0);
      throttleLock = false;
    } else {
      scrollContainer.classList.remove('snappy');
      scrollContainer.animatedScrollTo(scrollToPos, 200, 'easeInOutQuad', _ => {
        scrollContainer.classList.add('snappy');
        throttleLock = false;
      });
    }
    curElem.classList.remove('centered');
    elem.classList.add('centered');
  } else {
    throttleLock = false;
  }
};

scrollContainer.addEventListener('scroll', _ => {
  debounceScrollHandler();
});

// scroll left and right
// scroll by 3s
// scroll by full screen is too much
let scrollButtonHandler = left => {
  if((left && !currentProject.previousSibling) || (!left && !currentProject.nextSibling)) return;
  if(left) {
    currentProject.previousSibling.click();
  } else {
    currentProject.nextSibling.click();
  }
};
document.querySelector('#scroll-left').addEventListener('click', scrollButtonHandler.bind(null, true));
document.querySelector('#scroll-right').addEventListener('click', scrollButtonHandler.bind(null, false));

// allow scrolling by left/right arrows
document.addEventListener('keydown', event => {
  if((currentSection == 1 || currentSection == 2) && ((event.which == 37 && currentProject.previousSibling) || (event.which == 39 && currentProject.nextSibling))) {
    if(event.which == 37) {
      currentProject.previousSibling.click();
    } else {
      currentProject.nextSibling.click();
    }    
    event.preventDefault();
  }
});

// on resize fix
let projectResizeHandler = _ => {
	debounceScrollHandler(currentProject);

	// for firefox
	if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
		scrollContainer.lastChild.style.marginRight = (window.innerWidth - sampleElementWidth()) / 2 + 'px';
	}
}
window.addEventListener('resize', projectResizeHandler);
setTimeout(_ => {
	if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
		projectResizeHandler();
	}
}, 100);

// tip menu
let projectHelpElem = document.querySelector('#project-help');
let projectHelpTextElem = document.querySelector('#project-help-text');
projectHelpElem.addEventListener('click', _ => {
	projectHelpElem.classList.toggle('expanded');
});
// END CAROUSEL BEHAVIOR

/* hexagon images */
const hexagonImages = [
  './assets/jon-dld.jpg',
  './assets/jon-award.jpg',
  './assets/jon-bowling-action.jpg',
  './assets/jon-codeb.jpg',
  './assets/jon-bowling.jpg',
  './assets/jon-momath.jpg',
  './assets/jon-piano.jpg',
  './assets/jon-coding.jpg',
  './assets/jon-sleep.jpg',
  './assets/jon-skates.jpg',
  './assets/jon-ski.jpg',
  './assets/jon-science.jpg',
  './assets/jon-subway.jpg',
  './assets/jon-snowman.jpg',
  './assets/jon-cubing.jpg',
  './assets/jon-workspace.jpg',
  './assets/jon-stuyhacks.jpg',
  './assets/jon-piano2.jpg',
  './assets/jon-marathon.jpg',
  './assets/jon-sbhacks.jpg',
  './assets/jon-momath2.jpg',
];
let hexagonImageGridElem = document.querySelector('#image-grid');
hexagonImages.forEach(imageSource => {
  let hexagonContainerElem = document.createElement('div');
  hexagonContainerElem.classList.add('image-hexagon-container');
  let hexagonElem = document.createElement('div');
  hexagonElem.classList.add('image-hexagon');
  hexagonElem.style.backgroundImage = `url(${imageSource})`;
  hexagonContainerElem.appendChild(hexagonElem);
  hexagonImageGridElem.appendChild(hexagonContainerElem);
});

/**
	* KNOWN BUGS a.k.a. TODO
	*
  * Firefox ignores padding at end of overflow scroll element container element, so this is added programatically (targeted at FF)  
  * iOS Safari has problems adding back CSS snap behavior after it was removed, so tapping doesn't use animation; may be the case with more browsers
  */
