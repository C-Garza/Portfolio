import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {flare: 0, reverse: false, initial: true, contactBottom: 0, dash: 0, pathY: 0, width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, height: 0};
    this.getPageBottom = this.getPageBottom.bind(this);
    this.updateDash = this.updateDash.bind(this);
    this.updateDashY = this.updateDashY.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.canvasStars = this.canvasStars.bind(this);
    this.canvasTwinkle = this.canvasTwinkle.bind(this);
    this.canvasDraw = this.canvasDraw.bind(this);
    this.animateSun = this.animateSun.bind(this);
    this.contactRef = React.createRef();
    this.canvas = React.createRef();
    this.aboutRef = React.createRef();
    this.portfolioRef = React.createRef();
    this.contactNavRef = React.createRef();
    this.timeout;
    this.start;
    this.starArray = [];
  }
  ////UPDATES LENGTH OF TIMELINE DASH
  updateDash(e) {
    this.setState({dash: e});
    return null;
  }
  ////UPDATES Y-POSITION OF TIMELINE DASH
  updateDashY(e) {
    this.setState({pathY: e});
    return null;
  }
  ////GET BOTTOM OF LAST ELEMENT, CONTACT (CHANGE TO BOTTOM OF PAGE? CROSS-BROWSER?)
  getPageBottom() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    let contact = this.contactRef.current.contactRef.current;
    this.setState({contactBottom: contact.getBoundingClientRect().bottom + scrollTop - 2});
  }
  ////FINDS NEW POSITION OF BOTTOM OF PAGE ON RESIZE
  handleResize() {
    let contact = this.contactRef.current.contactRef.current;
    if(contact.getBoundingClientRect().bottom !== this.state.contactBottom) {
      this.getPageBottom();
    }
    this.setState({height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)});
    this.setState({width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth});
  }
  componentDidMount() {
    this.getPageBottom();
    this.setState({height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)});
    let ctx = this.canvas.current.getContext("2d");
    ctx.canvas.width = this.state.width - 17;
    ctx.canvas.height = this.state.contactBottom - 1200;
    ctx.translate(this.state.width / 2, (this.state.contactBottom - 1200) / 2);
    this.start = Date.now();
    this.canvasStars();
    requestAnimationFrame(() => {this.canvasDraw()});
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevState.width !== this.state.width || prevState.contactBottom === 0) {
      let ctx = this.canvas.current.getContext("2d");
      ctx.canvas.width = this.state.width - 17;
      ctx.canvas.height = this.state.contactBottom - 1200;
      ctx.translate(this.state.width / 2, (this.state.contactBottom - 1200) / 2);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {this.canvasStars()}, 100);
    }
  }
  ////INITIALIZE CANVAS STARS
  canvasStars() {
    let canvas = this.canvas.current;
    let ctx = canvas.getContext("2d");
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    for(let i = 0; i < 550; i++) {
      if(this.state.initial) {
        this.starArray.push({x: Math.floor(Math.random() * ctx.canvas.width), y: Math.floor(Math.random() * ctx.canvas.height), size: Math.floor(Math.random() * 4) + 3, alpha: Math.random(), dir: Math.random() >= 0.5});
      }
      else {
        this.starArray[i].x = Math.floor(Math.random() * ctx.canvas.width);
        this.starArray[i].y = Math.floor(Math.random() * ctx.canvas.height);
        this.starArray[i].size = Math.floor(Math.random() * 4) + 3;
        this.starArray[i].alpha = Math.random();
        this.starArray[i].dir = Math.random() >= 0.5;
      }
      ctx.fillStyle = "rgba(255, 255, 255, " + this.starArray[i].alpha + ")";
      ctx.fillRect(this.starArray[i].x,this.starArray[i].y,this.starArray[i].size,this.starArray[i].size);
    }
    ctx.restore();
    if(this.state.initial) {
      this.setState({initial: false});
    }
  }
  ////TWINKLE STARS IN CANVAS
  canvasTwinkle() {
    let canvas = this.canvas.current;
    let ctx = canvas.getContext("2d");
    let ease = 0.04;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    for(let i = 0; i < 550; i++) {
      if(this.starArray[i].alpha >= 1) {
        this.starArray[i].dir = false;
      }
      else if(this.starArray[i].alpha <= 0) {
        this.starArray[i].dir = true;
      }
      if(this.starArray[i].dir) {
        this.starArray[i].alpha += ease;
      }
      else if(!this.starArray[i].dir) {
        this.starArray[i].alpha -= ease;
      }
      ctx.fillStyle = "rgba(255, 255, 255, " + this.starArray[i].alpha + ")";
      ctx.fillRect(this.starArray[i].x,this.starArray[i].y,this.starArray[i].size,this.starArray[i].size);
    }
    ctx.restore();
  }
  ////ANIMATE SUN PULSE
  animateSun() {
    if(this.state.flare >= .55) {
      this.setState({reverse: true});
    }
    if(this.state.flare <= .15) {
      this.setState({reverse: false});
    }
    if(this.state.reverse) {
      this.setState((prevState, props) => ({
        flare: prevState.flare - 0.01
      }));
    }
    if(!this.state.reverse) {
      this.setState((prevState, props) => ({
        flare: prevState.flare + 0.01
      }));
    }
  }
  ////DRAW NEW CANVAS FRAME
  canvasDraw() {
    let canvas = this.canvas.current;
    let ctx = canvas.getContext("2d");
    requestAnimationFrame(() => {this.canvasDraw()});
    let now = Date.now();
    let elapsed = now - this.start;
    if(elapsed > (1000/25)) {
      this.start = now - (elapsed % (1000/25));
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
      ctx.restore();
      this.canvasTwinkle();
      this.animateSun();
    }
  }
  render() {
    return (
      <div id="timeline">
        <EventWrapper handleResize={this.handleResize} >
        <Header flare={this.state.flare} about={this.aboutRef.current} portfolio={this.portfolioRef.current} contact={this.contactNavRef.current} bottomPage={this.state.contactBottom} updateDash={this.updateDash} updateDashY={this.updateDashY} width={this.state.width} />
        <div className="gradient-bg">
          <div className="bg">
            <div className="gradient"></div>
            <div className="stars"></div>
            <div id="canvas-wrapper-stars">
              <canvas id="canvas-stars" ref={this.canvas} height={this.state.contactBottom - 1200}></canvas>
            </div>
            <About navRef={this.aboutRef} dash={this.state.dash} dashY={this.state.pathY} width={this.state.width} height={this.state.height} />
            <Portfolio navRef={this.portfolioRef} dash={this.state.dash} dashY={this.state.pathY} />
            <Contact navRef={this.contactNavRef} ref={this.contactRef} dash={this.state.dash} dashY={this.state.pathY} />
          </div>
        </div>
        </EventWrapper>
      </div>
    );
  }
}
class EventWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.throttle = this.throttle.bind(this);
    this.tick = false;
  }
  throttle (callback, throttle) {
    let tick = false;
    return function () {
      if (!tick) {
        callback();
        tick = true;
        setTimeout(() => {
          tick = false;
        }, throttle);
      }
    }
  }
  ////FUNCTION TO HANDLE SCROLL FUNCTIONS
  handleScroll() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if(!this.tick) {
      requestAnimationFrame(() => {
        this.props.handleScroll(scrollTop);
        this.tick = false;
      });
    }
    this.tick = true;
  }
  ////FUNCTION TO HANDLE RESIZE FUNCTIONS
  handleResize() {
    this.props.handleResize();
  }
  componentDidMount() {
    let ie = window.navigator.userAgent.match(/(MSIE|Trident)/);
    //HANDLES SCROLL ON ANIMATIONS
    if(this.props.handleScroll) {
        window.addEventListener("scroll", this.handleScroll);
    }
    if(this.props.handleResize) {
      if(ie) {
        window.addEventListener("resize", this.throttle(this.handleResize, 16));
      }
      else {
        window.addEventListener("resize", this.handleResize);
      }
    }
  }
  componentWillUnmount() {
    let ie = window.navigator.userAgent.match(/(MSIE|Trident)/);
    if(this.props.handleScroll) {
        window.removeEventListener("scroll", this.handleScroll);
    }
    if(this.props.handleResize) {
      if(ie) {
        window.removeEventListener("resize", this.throttle(this.handleResize, 16));
      }
      else {
        window.removeEventListener("resize", this.handleResize);
      }
    }
  }
  render() {
    return this.props.children;
  }
}
class Header extends Component {
  constructor(props) {
    super(props);
    this.scrollTo = this.scrollTo.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.stopScroll = this.stopScroll.bind(this);
    this.currentlyScrolling = false;
    this.timeout;
  }
  handleClick(e, element, to, duration) {
    e.preventDefault();
    if(this.currentlyScrolling === true) {
      cancelAnimationFrame(this.timeout);
    }
    let scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    requestAnimationFrame(() => this.scrollTo(element, to + scrollHeight, duration));
  }
  scrollTo(element, to, duration) {
    if(duration <= 0) return;
    let difference = to - element.scrollTop;
    let tick = Math.ceil(difference / duration * 35);
    this.currentlyScrolling = true;
    element.scrollTop = Math.ceil(element.scrollTop + tick);
    if(element.scrollTop === Math.ceil(to) || Math.ceil(window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
      this.currentlyScrolling = false;
    }
    if (element.scrollTop === Math.ceil(to) || Math.ceil(window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) return;
    this.timeout = requestAnimationFrame(() => this.scrollTo(element, to, duration - 10));
  }
  stopScroll() {
    cancelAnimationFrame(this.timeout);
    this.currentlyScrolling = false;
  }
  componentDidMount() {
    window.addEventListener("mousewheel", this.stopScroll);
    window.addEventListener("DOMMouseScroll", this.stopScroll);
    window.addEventListener("touchstart", this.stopScroll);
    window.addEventListener("keydown", (e) => {
      let key = e.key;
      if(key === "PageUp" || key === "PageDown" || key === "ArrowUp" || key === "ArrowDown" || key === "Down" || key === "Up" || key === "Home" || key === "End") {
        this.stopScroll();
      }
    });
  }
  render() {
    let edge = /Edge/.test(navigator.userAgent);
    let elTop = document.documentElement;
    if(edge) {
      elTop = document.body;
    }
    return (
      <header>
        <Nav handleClick={this.handleClick} about={this.props.about} portfolio={this.props.portfolio} contact={this.props.contact} />
        <div className="nav-padding"></div>
        <div className="sun-container">
          <svg version="1.1" id="sun" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 111.69 111.69" >
            <filter id="darken">
              <feColorMatrix
                type="matrix"
                values=".6  0   0   0   0
                        0  .6   0   0   0
                        0   0  .6   0   0
                        0   0   0   1   0 "/>
            </filter>
            <radialGradient id="flare" cx="50%" cy="50%" r="50%" >
              <stop offset="88%" stopColor="#ffcd40" />
              <stop offset="100%" stopColor="#ffbd00" stopOpacity={this.props.flare} />
            </radialGradient>
            <g filter="url(#darken)">
		          <g>
			          <circle fill="url(#flare)" cx="55.845" cy="55.845" r="55.845"/>
		          </g>
		          <g>
			          <circle fill="#ffea00" cx="55.845" cy="55.845" r="46.174"/>
	    	      </g>
            </g>
          </svg>
        </div>
        <TechLines bottomPage={this.props.bottomPage} updateDash={this.props.updateDash} updateDashY={this.props.updateDashY} width={this.props.width} />
        <div className="header-container">
          <h1>Christian Garza</h1>
          <h2>Hello, I'm a Front-End Developer who is always looking to learn and improve. Feel free to<br/>learn more below.</h2>
          <div className="next-section" onClick={(e) => this.handleClick(e, elTop, this.props.about.getBoundingClientRect().top - 60, 850)}><i className="fas fa-chevron-down"></i></div>
        </div>
      </header>
    );
  }
}
class Nav extends React.Component {
  render() {
    let edge = /Edge/.test(navigator.userAgent);
    let elTop = document.documentElement;
    if(edge) {
      elTop = document.body;
    }
    return(
      <nav>
        <ul>
          <li><a href="#about" onClick={(e) => this.props.handleClick(e, elTop, this.props.about.getBoundingClientRect().top - 60, 850)}>About</a></li>
          <li><a href="#portfolio" onClick={(e) => this.props.handleClick(e, elTop, this.props.portfolio.getBoundingClientRect().top - 60, 850)}>Portfolio</a></li>
          <li><a href="#contact" onClick={(e) => this.props.handleClick(e, elTop, this.props.contact.getBoundingClientRect().top, 850)}>Contact</a></li>
        </ul>
        <div className="social-links">
          <div className="social-tab"><a href="https://github.com/C-Garza" target="_blank" rel="noopener noreferrer"><i className="fab fa-github-square"></i></a></div>
          <div className="social-tab"><a href="#"><i className="fab fa-linkedin"></i></a></div>
        </div>
      </nav>
    );
  }
}
class TechLines extends Component {
  constructor(props) {
    super(props);
    this.pathCoordinates = this.pathCoordinates.bind(this);
    this.animateTimeline = this.animateTimeline.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleAnimation = this.handleAnimation.bind(this);
    this.canvasLightStrobes = this.canvasLightStrobes.bind(this);
    this.canvasDraw = this.canvasDraw.bind(this);
    this.lightStrobeGap = [-105,-105,-105,-105];
    this.delay = [false,false,false,false];
    this.timelineStrokeDashOffsetCurrent = 1201;
    this.lightProbeStrokeDashOffsetCurrent = 1201;
    this.start = Date.now();
    this.timeout;
    this.stopCanvas;
    this.canvas = React.createRef();
    this.path = React.createRef();
    this.state = {dasharray: 0, originalWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, pathYOrigin: 0, height: 0, pathLength: 0, atBeginning: false, stopCanvas: false};
  }
  ////DRAWS NEW FRAME FOR LIGHT STROBES
  canvasDraw(ease) {
    let canvas = this.canvas.current;
    let ctx = canvas.getContext("2d");
    this.stopCanvas = requestAnimationFrame(() => {this.canvasDraw(10)});
    let now = Date.now();
    let elapsed = now - this.start;
    if(elapsed > (1000/60)) {
      this.start = now - (elapsed % (1000/60));
      if(this.lightStrobeGap[0] >= 2620) {
        this.lightStrobeGap[0] = -105;
      }
      if(this.lightStrobeGap[1] >= 2631) {
        this.lightStrobeGap[1] = -105;
      }
      if(this.lightStrobeGap[2] >= 2650) {
        this.lightStrobeGap[2] = -105;
      }
      if(this.lightStrobeGap[3] >= 2640) {
        this.lightStrobeGap[3] = -105;
      }
      if(!this.delay[3]) {
        if(this.delay[0]) {
          this.lightStrobeGap[0] += ease;
        }
        if(this.delay[1]) {
          this.lightStrobeGap[1] += ease;
        }
        if(this.delay[2]) {
          this.lightStrobeGap[2] += ease;
        }
      }
      else {
        this.lightStrobeGap[0] += ease;
        this.lightStrobeGap[1] += ease;
        this.lightStrobeGap[2] += ease;
        this.lightStrobeGap[3] += ease;
      }
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
      ctx.restore();
      this.canvasLightStrobes();
    }
  }
  ////DRAW CANVAS LIGHT STROBES
  canvasLightStrobes() {
    let canvas = this.canvas.current;
    let ctx = canvas.getContext("2d");
    let blue = "rgb(26, 198, 255)";
    let glow = "rgba(26, 198, 255, 0.45)";

    ctx.strokeStyle = blue;
    ctx.shadowBlur = 20;
    ctx.shadowColor = blue;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";

    ////LIGHT STROBE 1
    ctx.beginPath();
    ctx.setLineDash([100,2631]);
    ctx.lineDashOffset = -this.lightStrobeGap[0];
    ctx.moveTo(-260, 300);
    ctx.lineTo(-480, 300);
    ctx.lineTo(-510, 239);
    ctx.lineTo(-3000, 239);
    ctx.stroke();
    ////LIGHT STROBE 2
    ctx.beginPath();
    ctx.setLineDash([100,2631]);
    ctx.lineDashOffset = -this.lightStrobeGap[1];
    ctx.moveTo(-340, 500);
    ctx.lineTo(-608, 500);
    ctx.lineTo(-710, 601);
    ctx.lineTo(-3000, 601);
    ctx.stroke();
    ////LIGHT STROBE 3
    ctx.beginPath();
    ctx.setLineDash([100,2631]);
    ctx.lineDashOffset = -this.lightStrobeGap[2];
    ctx.moveTo(200,220);
    ctx.lineTo(492, 220);
    ctx.lineTo(590,340);
    ctx.lineTo(3000,340);
    ctx.stroke();
    ////LIGHT STROBE 4
    ctx.beginPath();
    ctx.setLineDash([100,2631]);
    ctx.lineDashOffset = -this.lightStrobeGap[3];
    ctx.moveTo(300, 700);
    ctx.lineTo(592, 700);
    ctx.lineTo(712, 820);
    ctx.lineTo(3000, 820);
    ctx.stroke();

    ////LIGHT GLOW 1
    ctx.beginPath();
    ctx.strokeStyle = glow;
    ctx.lineDashOffset = -this.lightStrobeGap[0];
    for(let i = 0; i < 10; i++) {
      ctx.lineWidth = 5 + i;
      ctx.moveTo(-260, 300);
      ctx.lineTo(-480, 300);
      ctx.lineTo(-510, 239);
      ctx.lineTo(-3000, 239);
    }
    ctx.stroke();
    ////LIGHT GLOW 2
    ctx.beginPath();
    ctx.lineDashOffset = -this.lightStrobeGap[1];
    for(let i = 0; i < 10; i++) {
      ctx.lineWidth = 5 + i;
      ctx.moveTo(-340, 500);
      ctx.lineTo(-608, 500);
      ctx.lineTo(-710, 601);
      ctx.lineTo(-3000, 601);
    }
    ctx.stroke();
    ////LIGHT GLOW 3
    ctx.beginPath();
    ctx.lineDashOffset = -this.lightStrobeGap[2];
    for(let i = 0; i < 10; i++) {
      ctx.lineWidth = 5 + i;
      ctx.moveTo(200,220);
      ctx.lineTo(492, 220);
      ctx.lineTo(590,340);
      ctx.lineTo(3000,340);
    }
    ctx.stroke();
    ////LIGHT GLOW 4
    ctx.beginPath();
    ctx.lineDashOffset = -this.lightStrobeGap[3];
    for(let i = 0; i < 10; i++) {
      ctx.lineWidth = 5 + i;
      ctx.moveTo(300, 700);
      ctx.lineTo(592, 700);
      ctx.lineTo(712, 820);
      ctx.lineTo(3000, 820);
    }
    ctx.stroke();
  }
  ////HANDLES VERTICAL TIMELINE STROBE ON EDGE AND IE
  handleAnimation(easing) {
    let strokeDashOffsetFrom = 1201;
    let strokeDashOffsetTo = 100;
    let lightStrobeTimeline = document.querySelectorAll("#light-strobe-timeline")[0];
    let lightStrobeFix = document.querySelectorAll("#light-strobe-fix")[0];
    this.timelineStrokeDashOffsetCurrent = this.timelineStrokeDashOffsetCurrent - easing;
    if(this.timelineStrokeDashOffsetCurrent <= strokeDashOffsetTo) {
      this.timelineStrokeDashOffsetCurrent = strokeDashOffsetFrom;
    }
    lightStrobeTimeline.style.strokeDashoffset = this.timelineStrokeDashOffsetCurrent;
    lightStrobeFix.style.strokeDashoffset = this.timelineStrokeDashOffsetCurrent;
    requestAnimationFrame(() => {this.handleAnimation(6)});
  }
  ////HANDLES ANIMATE SVG TIMELINE ON SCROLL
  handleScroll(e) {
    this.animateTimeline();
  }
  ////HANDLES REPOSITIONS SVG TIMELINE Y-COORDINATE ON RESIZE
  handleResize(e) {
    this.pathCoordinates();
    this.animateTimeline();
  }
  componentDidMount() {
    this.pathCoordinates();
    if(window.navigator.userAgent.match(/(MSIE|Trident)/) || /Edge/.test(navigator.userAgent)) {
      requestAnimationFrame(() => {this.handleAnimation(6)});
    }
    if(this.props.width >= 1130) {
      let ctx = this.canvas.current.getContext("2d");
      ctx.canvas.width = this.props.width - 17;
      ctx.translate(this.state.originalWidth / 2, 0);
      setTimeout(() => {this.delay[0] = true}, 1000);
      setTimeout(() => {this.delay[1] = true}, 1700);
      setTimeout(() => {this.delay[2] = true}, 2000);
      setTimeout(() => {this.delay[3] = true}, 3700);
      requestAnimationFrame(() => {this.canvasDraw(10)});
    }
    else {
      this.setState({stopCanvas: true});
    }
  }
  componentDidUpdate(prevProps,prevState) {
    if(this.props.bottomPage !== prevProps.bottomPage) {
      this.pathCoordinates();
      this.animateTimeline();
    }
    if(this.props.width !== prevProps.width && this.props.width >= 1130) {
      let ctx = this.canvas.current.getContext("2d");
      ctx.canvas.width = this.props.width - 17;
      ctx.translate(this.props.width / 2,0);
    }
    if(this.props.width <= 1130 && !this.state.stopCanvas) {
      cancelAnimationFrame(this.stopCanvas);
      this.setState({stopCanvas: true});
      for(let i = 0; i < this.delay.length; i++) {
        this.delay[i] = false;
        this.lightStrobeGap[i] = -105;
      }
    }
    else if(this.props.width > 1130 && this.state.stopCanvas) {
      this.setState({stopCanvas: false});
      setTimeout(() => {this.delay[0] = true}, 1000);
      setTimeout(() => {this.delay[1] = true}, 1700);
      setTimeout(() => {this.delay[2] = true}, 2000);
      setTimeout(() => {this.delay[3] = true}, 3700);
      requestAnimationFrame(() => {this.canvasDraw(10)});
    }
  }
  ////GET Y-POSITION OF SVG TIMELINE
  pathCoordinates() {
    let body = document.body;
    let html = document.documentElement;
    this.setState({height: Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight) - window.innerHeight, pathLength: this.path.current.getTotalLength()})
    let newWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if(this.state.originalWidth !== newWidth) {
      this.setState({originalWidth: newWidth});
    }
    if(this.state.originalWidth >= 1410 && this.state.originalWidth <= 1610) {
      this.setState({pathYOrigin: 605 - (208 - (newWidth - 1410)) / 2});
    }
    else if(this.state.originalWidth <= 1410 && this.state.pathYOrigin !== 502) {
      this.setState({pathYOrigin: 502});
    }
    else if(this.state.originalWidth >= 1610 && this.state.pathYOrigin !== 602) {
      this.setState({pathYOrigin: 602});
    }
    this.props.updateDashY(this.state.pathYOrigin);
  }
  ////DRAWS SVG TIMELINE
  animateTimeline() {
    let scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    let percentDone = scrollHeight / this.state.height;
    let lengthDone = percentDone * (this.props.bottomPage - this.state.pathYOrigin);
    if(this.props.width > 1130) {
      this.setState({dasharray: lengthDone});
    }
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {this.props.updateDash(lengthDone)},100);
    if(lengthDone === 0 && this.state.atBeginning === false) {
      this.setState({atBeginning: true});
    }
    else if(lengthDone > 0 && this.state.atBeginning === true){
      this.setState({atBeginning: false});
    }
  }
  render() {
    let ie = window.navigator.userAgent.match(/(MSIE|Trident)/);
    let edge = /Edge/.test(navigator.userAgent);
    return(
      <div>
      <EventWrapper handleScroll={this.handleScroll} handleResize={this.handleResize} >
      <div className="techLine-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" >
          <defs>
            <linearGradient id="strobe-left" x1="100%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="rgb(26, 198, 255)" stopOpacity=".45" />
              <stop offset="100%" stopColor="rgb(26, 198, 255)"/>
            </linearGradient>
            <linearGradient id="test" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(26, 198, 255)" stopOpacity=".45" />
              <stop offset="50%" stopColor="rgb(26, 198, 255)" />
              <stop offset="100%" stopColor="rgb(26, 198, 255)" stopOpacity=".45" />
            </linearGradient>
            <radialGradient id="circle-aura" cx="50%" cy="50%" r="30%" fx="40%" fy="50%">
              <stop offset="0%" stopColor="rgb(26, 198, 255)" stopOpacity=".55" />
              <stop offset="100%" stopColor="rgb(26, 198, 255)" stopOpacity="0" />
            </radialGradient>
            <filter id="chrome">
              <feGaussianBlur result="coloredBlur" stdDeviation="3"></feGaussianBlur>
              <feMerge>
                <feMergeNode in="coloredBlur"></feMergeNode>
                <feMergeNode in="coloredBlur"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>
            <filter id="glow" width="250%" height="250%" x="-20%" y="-60%">
            <feMorphology operator="dilate" radius="2" in="SourceAlpha" result="thicken" />
            <feGaussianBlur in="thicken" stdDeviation="3" result="blurred" />
            <feFlood floodColor="rgb(26, 198, 255)" result="glowColor" />
            <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />
              <feGaussianBlur result="coloredBlur" stdDeviation="5"></feGaussianBlur>
              <feMerge>
                <feMergeNode in="coloredBlur"></feMergeNode>
                <feMergeNode in="softGlow_colored"/>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>
          </defs>
          <g className="tech-paths">
            <path id="techLine1" d="M125 150 L15 150 L0 120 L-650 120" stroke="white" strokeWidth="2" fill="none" filter="url(#chrome)"/>
            <path id="techLine2" d="M90 250 L-50 250 L-100 300 L-650 300" stroke="white" strokeWidth="2" fill="none" filter="url(#chrome)"/>
            <path id="techLine3" d="M330 110 L500 110 L550 170 L1000 170" stroke="white" strokeWidth="2" fill="none" filter="url(#chrome)"/>
            <path id="techLine4" d="M375 350 L550 350 L610 410 L1000 410" stroke="white" strokeWidth="2" fill="none" filter="url(#chrome)"/>
          </g>
        </svg>
      </div>
      <div id="canvas-wrapper">
        <canvas id="canvas" ref={this.canvas} height="950px"></canvas>
      </div>
      <div className="svg-timeline-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height={this.props.bottomPage}>
          <defs>
            <linearGradient id="strobe-down" x1="0%" x2="0%" y1="0%" y2="100%" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgb(26, 198, 255)" stopOpacity=".35" />
              <stop offset="100%" stopColor="rgb(26, 198, 255)"/>
            </linearGradient>
            <filter id="timeline-glow" filterUnits={edge ? "" : "userSpaceOnUse"} width="250%" height="250%" x="-10%" y="-60%">
            <feMorphology operator="dilate" radius="2" in="SourceAlpha" result="thicken" />
            <feGaussianBlur in="thicken" stdDeviation="3" result="blurred" />
            <feFlood floodColor="rgb(26, 198, 255)" result="glowColor" />
            <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />
              <feGaussianBlur result="coloredBlur" stdDeviation="5"></feGaussianBlur>
              <feMerge>
                <feMergeNode in="coloredBlur"></feMergeNode>
                <feMergeNode in="softGlow_colored"/>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>
            <filter id="timeChrome" filterUnits="userSpaceOnUse" width="100%" height="100%" x="0%" y="0%">
              <feGaussianBlur result="coloredBlur" stdDeviation="3"></feGaussianBlur>
              <feMerge>
                <feMergeNode in="coloredBlur"></feMergeNode>
                <feMergeNode in="coloredBlur"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>
          </defs>
          <g>
            <path ref={this.path} id="svg-timeline-path" className={this.state.atBeginning ? "svg-timeline-hide" : ""} d={"M100 " + this.state.pathYOrigin + " L100 " + (this.state.pathYOrigin + this.state.dasharray)} stroke="white" strokeWidth="6" fill="none" filter={(ie || edge)? "" : "url(#timeChrome)"} strokeLinecap="round" />
            {(ie || edge) ? (
              <g filter="url(#timeline-glow)">
                <path id="light-strobe-timeline" className={this.state.atBeginning ? "svg-timeline-hide" : ""} d={"M100 " + this.state.pathYOrigin + " L100 " + (this.state.pathYOrigin + this.state.dasharray)} stroke="url(#strobe-down)" strokeWidth="9" strokeLinecap="round" />
                <line id="light-strobe-fix" x1="100" className={this.state.atBeginning ? "svg-timeline-hide" : ""} y1={this.state.pathYOrigin} x2="150" y2={this.state.pathYOrigin + this.state.dasharray} stroke="white" strokeOpacity="0" strokeLinecap="round" />
              </g>
              ) : (
              <path id="light-strobe-timeline" className={this.state.atBeginning ? "svg-timeline-hide" : ""} d={"M100 " + this.state.pathYOrigin + " L100 " + (this.state.pathYOrigin + this.state.dasharray)} stroke="rgb(26, 198, 255)" strokeWidth="9" fill="none" strokeLinecap="round"/>
            )}
          </g>
        </svg>
      </div>
      </EventWrapper>
      </div>
    );
  }
}
function AboutTile(props) {
  return(
    <div className={"about-tile " + props.class} style={props.style}>
      <div className="about-tile-icon">
        {props.hex &&
          <React.Fragment>
            <div className="hex"></div>
            <div className="border-hex"></div>
          </React.Fragment>
        }
        <i className={props.icon}></i>
        {props.icon2 && 
          <i className={props.icon2}></i>
        }
        <p>{props.header}</p>
      </div>
      <div className="about-tile-caption">
        <p>{props.caption}</p>
      </div>
    </div>
  );
}
class About extends Component {
  constructor(props) {
    super(props);
    this.state = {degree: 0, isShowing: true, isOnScroll: false, isOnScrollTiles: false, hasLight: false, front: "", back: "", left: "", right: "", clear: "translateY(0px)", isButtonDisabled: false};
    this.handleClick = this.handleClick.bind(this);
    this.rotate = this.rotate.bind(this);
    this.translateSpheres = this.translateSpheres.bind(this);
    this.animateOnScroll = this.animateOnScroll.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleLight = this.handleLight.bind(this);
    this.aboutRef = React.createRef();
    this.aboutPictureRef = React.createRef();
    this.aboutTilesContainerRef = React.createRef();
  }
  ////HANDLES CLICK FOR PLANET MODE BUTTONS
  handleClick(e) {
    if(e.target.id === "next" || e.target.id === "prev") {
      this.rotate(e.target.id);
    }
    if(e.target.id === "planet" || e.target.classList[2] === "fa-stack-1x" || e.target.classList[0] === "fa-stack") {
      let newState = this.state.isShowing ? false : true;
      this.setState({isShowing: newState, isButtonDisabled: true});
      setTimeout(() => {this.setState({isButtonDisabled: false, degree: 0})}, 1000);
    }
  }
  ////CHANGES DEGREES STATE AND ROTATES PLANETS
  rotate(e) {
    if(e === "next") {
      this.setState((prevState, props) => ({
        degree: prevState.degree - 90
      }));
    }
    if(e === "prev") {
      this.setState((prevState, props) => ({
        degree: prevState.degree + 90
      }));
    }
  }
  ////KEEPS TRANSFORM POSITIONS OF PLANETS AS THEY ROTATE AROUND
  translateSpheres() {
    //Sphere 1 is front, Sphere 2 is right, Sphere 3 is back, Sphere 4 is left
    let originalFront = "rotateY(0deg) translateZ(300px)";
    let originalBack = "rotateY(180deg) translateZ(300px) rotateY(-180deg)";
    let originalLeft = "rotateY(270deg) translateZ(200px) rotateY(-270deg) translateX(-100px)";
    let originalRight = "rotateY(90deg) translateZ(200px) rotateY(-90deg) translateX(100px)";
    let translateDown = "translateY(50px)";
    let translateUp = "translateY(-50px)";
    if(this.state.degree % 360 === 0) {
      //Sphere 1 and 3 are translated spheres
      this.setState({front: originalFront + translateDown, 
      back: originalBack + translateUp,
      left: originalLeft + this.state.clear,
      right: originalRight + this.state.clear
    });
    }
    if((this.state.degree <= 0 && this.state.degree % 360 === -90) || (this.state.degree >= 0 && this.state.degree % 360 === 270)) {
      //Sphere 2 and 4 are front/back
      this.setState({front: originalFront + this.state.clear,
      back: originalBack + this.state.clear,
      left: originalLeft + translateUp,
      right: originalRight + translateDown
      });
    }
    if((this.state.degree <= 0 && this.state.degree % 360 === -180) || (this.state.degree >= 0 && this.state.degree % 360 === 180)) {
      //Sphere 3 and 1 are front/back
      this.setState({front: originalFront + translateUp,
      back: originalBack + translateDown,
      left: originalLeft + this.state.clear,
      right: originalRight + this.state.clear
      });
    }
    if((this.state.degree <= 0 && this.state.degree % 360 === -270) || (this.state.degree >= 0 && this.state.degree % 360 === 90)) {
      //Sphere 4 and 2 are front/back
      this.setState({front: originalFront + this.state.clear,
      back: originalBack + this.state.clear,
      left: originalLeft + translateDown,
      right: originalRight + translateUp
      });
    }
  }
  ////TRIGGERS HEXAGON AND PICTURE CONTAINER ANIMATIONS
  animateOnScroll(e) {
    if(window.innerWidth > 1130 && this.state.isOnScrollTiles === false) {
      this.setState({isOnScroll: true, isOnScrollTiles: true});
    }
    else if(window.innerWidth <= 1130 && this.state.isOnScrollTiles === false) {
      let scale = 0;
      if(this.props.height >= 730) {
        scale = 4;
      }
      else if(this.props.height >= 530) {
        scale = 1.7;
      }
      else {
        scale = 1.3;
      }
      this.setState({isOnScroll: true});
      if(e >= this.aboutTilesContainerRef.current.getBoundingClientRect().top + (e/scale)) {
        this.setState({isOnScrollTiles: true});
      }
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevState.degree !== this.state.degree) {
      this.translateSpheres();
    }
    if(this.props.width <= 1555 && this.state.isShowing === false) {
      this.setState({isShowing: true, degree: 0});
    }
    if(prevProps.dash !== this.props.dash) {
      let e = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      this.handleLight(e);
    }
  }
  ////HANDLES ANIMATE ON SCROLL EVENT AND TRIGGERS LIGHT FUNCTION
  handleScroll(e) {
    let scrollTriggerHeight = (this.aboutPictureRef.current.getBoundingClientRect().top);
    if(e >= scrollTriggerHeight && this.state.isOnScrollTiles === false) {
      this.animateOnScroll(e);
    }
    this.handleLight(e);
  }
  ////HANDLES LIGHT ANIMATION FOR HEADER
  handleLight(e) {
    let trigger = this.aboutRef.current.getBoundingClientRect().bottom + e - 10;
    if((this.props.dash + this.props.dashY) >= trigger && this.state.hasLight === false) {
      this.setState({hasLight: true});
    }
    else if((this.props.dash + this.props.dashY) <= trigger && this.state.hasLight === true) {
      this.setState({hasLight: false});
    }
  }
  render() {
    let carouselTransform = {transform: "rotateY("+this.state.degree+"deg)"};
    let tileTransform = {transform: "rotateY("+(-this.state.degree)+"deg)"};
    let visibilityStyle = {visibility: this.state.isOnScrollTiles ? "inherit" : "hidden"};
    let tilesAnimateClass = this.state.isOnScrollTiles ? "about-tile-animate" : "";
    let toggleLight = this.state.hasLight ? "animate-sign" : "";
    let craters = <React.Fragment><div className="craters crater"></div>
    <div className="craters crater2"></div>
    <div className="craters crater3"></div>
    <div className="craters crater4"></div>
    <div className="craters crater5"></div></React.Fragment>;
    let bobPlanetAdjust = [{transform: this.state.front}, {transform: this.state.right}, {transform: this.state.back}, {transform: this.state.left}];
    return(
      <section id="about" ref={this.props.navRef}>
      <EventWrapper handleScroll={this.handleScroll} >
        <div className="section-background"></div>
        <h2 ref={this.aboutRef}><span className={"about-header " + toggleLight}>ABOUT</span></h2>
        <div className="about-picture-container" ref={this.aboutPictureRef} style={{visibility: this.state.isOnScroll ? "inherit" : "hidden"}}>
          <div className={"about-picture " + (this.state.isOnScroll ? "about-picture-animation" : "")}></div>
          <div className={"about-picture-caption " + (this.state.isOnScroll ? "about-picture-animation" : "")}>
            <h3>I'm a Front-End Developer who aims to build fully responsive layouts and keeping users engaged 
              through animation and designs, all while maintaining best practices in code. </h3>
          </div>
        </div>
        <div className="about-tiles-container" ref={this.aboutTilesContainerRef} >
          <div className={"hexagons " + (this.state.isShowing ? "toggleAnimation" : "hideClass")}>
            <AboutTile class={tilesAnimateClass} style={visibilityStyle} icon="fas fa-laptop-code" header="Web Development" caption="Skillset specifically tailored for front-end proficiency." hex={true} ></AboutTile>
            <AboutTile class={tilesAnimateClass} style={visibilityStyle} icon="fas fa-desktop" icon2="fas fa-mobile-alt fa-small" header="Responsive Layouts" caption="Strives to make layouts work on any device a top priority." hex={true}></AboutTile>
            <AboutTile class={tilesAnimateClass} style={visibilityStyle} icon="fas fa-lightbulb" header="Perseverant Attitude" caption="Never gives up without learning something new. Always learning." hex={true}></AboutTile>
            <AboutTile class={tilesAnimateClass} style={visibilityStyle} icon="fas fa-globe-americas" header="Passionately Curious" caption="Enjoys learning how and why things work. Always questioning." hex={true}></AboutTile>
          </div>
          <div className={"carousel-container " + (this.state.isShowing ? "hideClass" : "")}>
            <div className="spheres carousel" style={carouselTransform}>
              <div className="planet-position" style={bobPlanetAdjust[0]}>
                <div className={(this.state.isShowing ? "" : "animation-wrap") + " ani-one"}>
                  <figure className="sphere" style={tileTransform}>
                    {craters}
                    <AboutTile class={tilesAnimateClass} style={visibilityStyle} icon="fas fa-laptop-code" header="Web Development" caption="Skillset specifically tailored for front-end proficiency."></AboutTile>
                  </figure>
                </div>
              </div>
              <div className="planet-position" style={bobPlanetAdjust[1]}>
                <div className={(this.state.isShowing ? "" : "animation-wrap") + " ani-two"}>
                  <figure className="sphere" style={tileTransform}>
                    {craters}
                    <AboutTile class={tilesAnimateClass} style={visibilityStyle} icon="fas fa-desktop" icon2="fas fa-mobile-alt fa-small" header="Responsive Layouts" caption="Strives to make layouts work on any device a top priority."></AboutTile>
                  </figure>
                </div>
              </div>
              <div className="planet-position" style={bobPlanetAdjust[2]}>
                <div className={(this.state.isShowing ? "" : "animation-wrap") + " ani-three"}>
                  <figure className="sphere" style={tileTransform}>
                    {craters}
                    <AboutTile class={tilesAnimateClass} style={visibilityStyle} icon="fas fa-lightbulb" header="Perseverant Attitude" caption="Never gives up without learning something new. Always learning."></AboutTile>
                  </figure>
                </div>
              </div>
              <div className="planet-position" style={bobPlanetAdjust[3]}>
                <div className={(this.state.isShowing ? "" : "animation-wrap") + " ani-four"}>
                  <figure className="sphere" style={tileTransform}>
                    {craters}
                    <AboutTile class={tilesAnimateClass} style={visibilityStyle} icon="fas fa-globe-americas" header="Passionately Curious" caption="Enjoys learning how and why things work. Always questioning."></AboutTile>
                  </figure>
                </div>
              </div>
            </div>
            <div className="button-container">
              <button id="prev" className="button button-choice" onClick={this.handleClick}>Previous</button>
              <button id="next" className="button button-choice" onClick={this.handleClick}>Next</button>
            </div>
          </div>
          <div className="button-container button-container-position">
            <button id="planet" className={"button " + (this.state.isShowing ? "planet-off" : "planet-on")} onClick={this.handleClick} disabled={this.state.isButtonDisabled}>
              <span className="fa-stack">
                <i className={"fa fa-circle fa-stack-1x " + (this.state.isShowing ? "planet-grass-off" : "planet-grass-on")}></i>
                <i className={"fas fa-globe-americas fa-stack-1x " + (this.state.isShowing ? "planet-water-off" : "planet-water-on")}></i>
              </span>
            </button>
          </div>
        </div>
        <div className="about-tech-container">
          <div className="about-tech-header"><h2>Technologies I Use</h2></div>
          <i className="about-tech-icon devicon-react-original-wordmark icon"></i>
          <i className="about-tech-icon devicon-html5-plain-wordmark icon"></i>
          <i className="about-tech-icon devicon-css3-plain-wordmark icon"></i>
          <i className="about-tech-icon devicon-sass-original icon"></i>
          <i className="about-tech-icon devicon-jquery-plain-wordmark icon"></i>
          <i className="about-tech-icon devicon-javascript-plain icon"></i>
        </div>
      </EventWrapper>
      </section>
    );
  }
}
function PortfolioTile(props) {
  return(
    <div className={"portfolio-tile " + props.class}>
      <a href={props.href} target="_blank" rel="noopener noreferrer">
      <img className="portfolio-tile-image" src={require("" + props.src)} alt={props.alt} />
      <div className="portfolio-tile-overlay">
        <div className="portfolio-tile-overlay-header">
          <h3>{props.header}</h3>
          <h5>{props.caption}</h5>
        </div>
        <div className="portfolio-tile-overlay-icons">
          <i className={props.icon + " small-icon"}></i>
          <i className={props.icon2 + " small-icon"}></i>
          {props.icon3 && 
            <i className={props.icon3 + " small-icon"}></i>
          }
          {props.icon4 && 
            <i className={props.icon4 + " small-icon"}></i>
          }
        </div>
      </div>
      </a>
    </div>
  );
}
class Portfolio extends Component {
  constructor(props) {
    super(props);
    this.state = {hasLight: false, isOnScroll: false};
    this.handleLight = this.handleLight.bind(this);
    this.projectRef = React.createRef();
    this.portfolioTilesContainerRef = React.createRef();
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.dash !== this.props.dash) {
      let e = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      this.handleLight(e);
    }
  }
  ////HANDLES LIGHT ANIMATION FOR HEADER
  handleLight(e) {
    let trigger = this.projectRef.current.getBoundingClientRect().bottom + e - 10;
    if((this.props.dash + this.props.dashY) >= trigger && this.state.hasLight === false) {
      this.setState({hasLight: true});
    }
    else if ((this.props.dash + this.props.dashY) <= trigger && this.state.hasLight === true) {
      this.setState({hasLight: false});
    }
    if((e + (window.innerHeight / 1.3)) >= (trigger) && this.state.isOnScroll === false) {
      this.setState({isOnScroll: true});
    }
  }
  render() {
    let toggleLight = this.state.hasLight ? "animate-sign" : "";
    let tilesAnimateClass = this.state.isOnScroll ? "portfolio-tile-animate " : "";
    let icons = {html5: "devicon-html5-plain-wordmark", css3: "devicon-css3-plain-wordmark", js: "devicon-javascript-plain", jquery: "devicon-jquery-plain-wordmark", react: "devicon-react-original-wordmark"};
    return(
      <section id="portfolio" ref={this.props.navRef}>
        <EventWrapper handleScroll={this.handleLight} >
          <h2 ref={this.projectRef}><span className={"project-header " + toggleLight}>PROJECTS</span></h2>
          <div className="portfolio-tiles-container" ref={this.portfolioTilesContainerRef}>
            <PortfolioTile class={tilesAnimateClass} href="https://github.com/C-Garza/Portfolio" src="./images/portfolio screenshot.png" alt="My Portfolio Site" header="Portfolio Site" caption="My portfolio site created and designed by me. Check out my code on GitHub!" icon={icons.react} icon2={icons.css3} ></PortfolioTile>
            <PortfolioTile class={tilesAnimateClass} href="https://c-garza.github.io/Wiki-Viewer/" src="./images/wiki screenshot.png" alt="Wikipedia Viewer" header="Wikipedia Viewer" caption="Using the MediaWiki API, this project provides a search interface for Wikipedia pages." icon={icons.html5} icon2={icons.css3} icon3={icons.jquery} ></PortfolioTile>
            <PortfolioTile class={tilesAnimateClass} href="#" src="./images/book fund screenshot.png" alt="Latino Book Fund" header="Latino Book Fund" caption="Currently in the process of redesigning a local non-profit website." icon={icons.html5} icon2={icons.css3} icon3={icons.js}></PortfolioTile>
            <PortfolioTile class={tilesAnimateClass} href="./random.html" src="./images/random quote screenshot.png" alt="Random Quote Generator" header="Random Quote Generator" caption="Using the Quotes on Design API, this project displays a new random quote on click." icon={icons.html5} icon2={icons.css3} icon3={icons.js} ></PortfolioTile>
          </div>
        </EventWrapper>
      </section>
    );
  }
}
class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {scrollTop: 0, hasLight: false, isOnScroll: false};
    this.handleLight = this.handleLight.bind(this);
    this.contactRef = React.createRef();
    this.contactHeaderRef = React.createRef();
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.dash !== this.props.dash) {
      let e = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      this.handleLight(e);
    }
  }
  ////HANDLES LIGHT ANIMATION FOR HEADER
  handleLight(e) {
    let trigger = this.contactHeaderRef.current.getBoundingClientRect().bottom + e - 10;
    if((this.props.dash + this.props.dashY) >= trigger && this.state.hasLight === false) {
      this.setState({hasLight: true});
    }
    else if ((this.props.dash + this.props.dashY) <= trigger && this.state.hasLight === true) {
      this.setState({hasLight: false});
    }
    if((e + (window.innerHeight / 1.3)) >= (trigger) && this.state.isOnScroll === false) {
      this.setState({isOnScroll: true});
    }
  }
  render() {
    let toggleLight = this.state.hasLight ? "animate-sign" : "";
    return(
      <div className="contact-background" ref={this.contactRef}>
        <EventWrapper handleScroll={this.handleLight} >
          <footer id="contact" ref={this.props.navRef}>
            <h2 ref={this.contactHeaderRef}><span className={"contact-header-light " + toggleLight}>CONTACT</span></h2>
            <div className="contact-header">
              <h3>Feel free to get in touch.</h3>
              <a href="mailto:christianga101@gmail.com"><p className={"contact-email " + (this.state.isOnScroll ? "animate-contact" : "")}>christianga101@gmail.com <i className={"fas fa-paper-plane " + (this.state.isOnScroll ? "animate-contact-plane" : "")}></i></p></a>
            </div>
            <small><a href="https://www.svgrepo.com/vectors/space-3/" target="_blank" rel="noopener noreferrer">SVG Earth, Sun, and ISS by svgrepo is licensed under CC By 4.0</a></small>
            <svg version="1.1" id="iss" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 59 59">
              <g>
                <g>
                  <rect x="15.5" y="20" fill="#ECF0F1" width="12" height="18"/>
                  <rect x="31.5" y="20" fill="#ECF0F1" width="12" height="18"/>
                  <rect x="49.5" y="20" fill="#ECF0F1" width="9" height="18"/>
                  <rect x="0.5" y="42" fill="#8697CB" width="20" height="16"/>
                  <rect x="38.5" y="42" fill="#8697CB" width="20" height="16"/>
                  <rect x="0.5" y="0" fill="#8697CB" width="20" height="16"/>
                  <rect x="38.5" y="0" fill="#8697CB" width="20" height="16"/>
                </g>
                <g>
                  <rect x="4.5" y="42" fill="#556080" width="2" height="16"/>
                  <rect x="9.5" y="42" fill="#556080" width="2" height="16"/>
                  <rect x="14.5" y="42" fill="#556080" width="2" height="16"/>
                  <rect x="42.5" y="42" fill="#556080" width="2" height="16"/>
                  <rect x="47.5" y="42" fill="#556080" width="2" height="16"/>
                  <rect x="52.5" y="42" fill="#556080" width="2" height="16"/>
                  <rect x="4.5" y="0" fill="#556080" width="2" height="16"/>
                  <rect x="9.5" y="0" fill="#556080" width="2" height="16"/>
                  <rect x="14.5" y="0" fill="#556080" width="2" height="16"/>
                  <rect x="42.5" y="0" fill="#556080" width="2" height="16"/>
                  <rect x="47.5" y="0" fill="#556080" width="2" height="16"/>
                  <rect x="52.5" y="0" fill="#556080" width="2" height="16"/>
                </g>
                <g>
                  <rect x="21.5" y="31" fill="#BDC3C7" width="3" height="7"/>
                  <rect x="31.5" y="20" fill="#BDC3C7" width="4" height="4"/>
                  <rect x="31.5" y="27" fill="#BDC3C7" width="4" height="4"/>
                  <rect x="31.5" y="34" fill="#BDC3C7" width="4" height="4"/>
                </g>
                <g>
                  <circle fill="#BDC3C7" cx="52.5" cy="23" r="1"/>
                  <circle fill="#BDC3C7" cx="52.5" cy="26" r="1"/>
                  <circle fill="#BDC3C7" cx="52.5" cy="29" r="1"/>
                  <circle fill="#BDC3C7" cx="52.5" cy="32" r="1"/>
                  <circle fill="#BDC3C7" cx="52.5" cy="35" r="1"/>
                </g>
                <path fill="#556080" d="M30.5,13V8c0-0.553-0.448-1-1-1s-1,0.447-1,1v5h-1v32h1v5c0,0.553,0.448,1,1,1s1-0.447,1-1v-5h1V13 H30.5z"/>
                <rect x="0.5" y="20" fill="#ECF0F1" width="9" height="18"/>
                <rect x="43.5" y="25" fill="#BDC3C7" width="6" height="8"/>
                <rect x="9.5" y="25" fill="#BDC3C7" width="6" height="8"/>
                <g>
                  <rect x="0.5" y="7" fill="#556080" width="58" height="2"/>
                  <rect x="0.5" y="49" fill="#556080" width="58" height="2"/>
                </g>
                <rect x="26.5" y="4" fill="#8697CB" width="6" height="4"/>
                <rect x="26.5" y="50" fill="#8697CB" width="6" height="4"/>
                <circle fill="#BDC3C7" cx="34.5" cy="58" r="1"/>
                <circle fill="#BDC3C7" cx="23.5" cy="12" r="1"/>
              </g>
            </svg>
            <svg id="earth" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 58 58">
              <g>
                <circle fill="#285680" cx="29" cy="29" r="29"/>
                <g>
                  <path fill="#24AE5F" d="M29,0c-4.03,0-7.866,0.823-11.353,2.308c-0.159,0.949-0.952,2.57-0.928,3.087
                    c0.112,0.022,7.373-7.4,6.472-2.39C22.61,6.23,16.675,6.211,16.93,9.458c6.236,2.445,8.411-4.642,13.708-4.613
                    c1.767,0.01,6.292-2.784,7.155-2.215c3.496,2.303-0.799,10.467-3.474,7.75c-2.572-2.572-6.242,0.901-6.077,4.912
                    c1.337,0.06,1.908-3.796,3.11-2.51c1.324,1.417,0.846,4.27-0.986,4.925c-1.844,0.659-9.077-4.89-7.3-0.684
                    c1.954,4.668-5.854,8.275,2.028,6.393c3.716-0.891,2.481,1.937,4.234,3.286c2.088,1.603,1.164-2.214,2.686-1.633
                    c2.215,0.857-0.381,3.065,3.088,1.462c4.069-1.856,2.54,1.038,3.786,2.93c2.336,3.532,8.077,6.922,11.086,2.254
                    c0.709-1.101,0.254-9.807,4.72-3.967c2.836,3.71,1.863-4.383,2.247-6.509C53.547,8.993,42.327,0,29,0z"/>
                </g>
                <path fill="#FAC176" d="M32.919,42.082l-5.348-4.008l-3.585,0.141l-3.719-1.17l-2.911-2.007l-6.603,1.526L8.03,37.881
                  L5,41.963l1.072,4.784c0.306,0.395,0.623,0.782,0.949,1.161l5.608,2.618l3.785,0.511l2.252,4.622l0.068,0.465
                  C21.926,57.333,25.385,58,29,58c2.494,0,4.914-0.315,7.224-0.908l0.761-4.544l3.459-2.807l1.437-4.481l-7.222-0.03L32.919,42.082z"
                />
                <path fill="#88C057" d="M0.375,33.647c0.138-0.012,0.156-0.024,0.168-0.036c1.297-1.296,2.377-1.513,3.458-3.458
                  c1.081-1.945-0.216-1.945,0-5.187c0.216-3.242-0.216-1.729,0-5.187c0.078-1.244-0.053-1.928-1.565-2.417C0.873,20.926,0,24.86,0,29
                  C0,30.582,0.131,32.133,0.375,33.647z"/>
                <path fill="#FAC176" d="M30,53c-1.083-0.083-5.083-1.333-6-3c-0.917-1.667-2.917-4.5-3-4
                  c-0.057,0.34-9.111-2.743-15.331-4.938L5,41.963l1.072,4.784c0.306,0.395,0.623,0.782,0.949,1.161l5.608,2.618l3.785,0.511
                  l2.252,4.622l0.068,0.465C21.926,57.333,25.385,58,29,58c2.494,0,4.914-0.315,7.224-0.908l0.577-3.445
                  C36.292,53.488,35.705,53.278,35,53C32.25,51.917,31.083,53.083,30,53z"/>
                <path fill="#88C057" d="M40.444,49.741l1.437-4.481l-7.222-0.03l-1.741-3.148l-5.348-4.008l-3.585,0.141l-3.719-1.17
                  l-2.911-2.007l-6.603,1.526L8.03,37.881l-2.361,3.18C11.889,43.257,20.943,46.34,21,46c0.083-0.5,2.083,2.333,3,4
                  c0.917,1.667,4.917,2.917,6,3c1.083,0.083,2.25-1.083,5,0c0.705,0.278,1.292,0.488,1.801,0.647l0.184-1.099L40.444,49.741z"/>
                <path fill="#88C057" d="M39.925,2.153c-0.194,3.66-0.337,6.305-0.337,6.305L34,14.046c0,0,5.238,7.508,5.588,8.381
                  c0.349,0.873,4.714,1.921,5.588,1.397c0.873-0.524,4.191-3.318,5.588-1.397c0.972,1.337,0.847,2.504,1.445,3.325
                  c0.412,0.006,0.927,0.283,1.569,0.93c0.908,0.272,1.943,0.539,2.865,0.762c0.306-1.79,0.079-4.983,0.299-6.205
                  C54.532,12.549,48.172,5.516,39.925,2.153z"/>
                <path fill="#FAC176" d="M43.33,3.806C43.148,7.26,43,10,43,10l-4,4c0,0,3.75,5.375,4,6s3.375,1.375,4,1s3-2.375,4-1
                  s0.375,2.5,2,3c1.373,0.423,3.267,0.842,3.825,0.962c0.008-1.112,0.011-2.141,0.116-2.723C54.876,13.787,49.903,7.555,43.33,3.806z
                "/>
              </g>
            </svg>
          </footer>
        </EventWrapper>
      </div>
    );
  }
}
export default App;