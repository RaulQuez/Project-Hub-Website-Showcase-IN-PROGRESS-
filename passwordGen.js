// passwordGen.js
// Function to generate a random password

// Section 1 -- Grab the HTML elements we need:
/* Find elements on the page that we need to read, 
we do this once at the top and store them in variables
*/
const canvas = document.getElementById('bg');

/* Gets the 2D context from the canvas and we use ctx it to draw on it (circles shapes and colors) 
    The 2D means that were drawing flat 2D shapes, not 3D.

    getContext('2d') Enables drawing tools like:
    ctx.fillStyle = 'red';     // pick up the red pen
    ctx.fillRect(0, 0, 100, 100); // draw a square
    ctx.beginPath();           // start a new shape
    ctx.arc(50, 50, 30, 0, Math.PI * 2); // describe a circle
    ctx.fill();                // fill it in
*/
const ctx = canvas.getContext('2d');

/*  finds the outer container <div id="scene"> and stores 
it in the variable scene. This is needed to measure its width and height for canvas.
*/
const scene = document.getElementById('scene');

// finds the <span id="pw"> that displays password text
// we update its text content when a password is generated.
const pwText = document.getElementById('pwText');

// finds <input type="range" id="lenRange"> slider
// Reads its .value to know how long to make the password
const lenRange = document.getElementById('lenRange');

// dinds the <span id="lenValue"> that shows the current length value from the slider
// we update its text content when the slider changes.
const lenVal = document.getElementById('lenVal');

// Finds the input type checkbox and id="useUpper" that lets user choose to include uppercase letters
// We read its .checked property to know if we should include uppercase letters in the password.
const useUpper = document.getElementById('useUpper');
// Same for the checkbox for including numbers in the password
const useNums = document.getElementById('useNums');
// Same for the checkbox for including symbols in the password
const useSyms = document.getElementById('useSyms');

// Finds all four strength bar segments and puts them into an array segments:
const segments = [
    document.getElementById('s0'),
    document.getElementById('s1'),
    document.getElementById('s2'),
    document.getElementById('s3')
];

// Finds toast id and copied notification. show and hide this when the copy button is clicked.
const toast = document.getElementById('toast');

// Section 2 -- Variables and constants we need for password generation and strength calculation:
// Global variables
let currentPw = ''; // This will hold the currently generated password & starts empty, and is updated every time generate() runs.
let W,H; // W, H = canvas width, height (px)--let keyword allows value to change later unlike const
let particles = []; // empty array that holds all the particle objects and each particle is an object like x, y, speed, color

// Section 2 -- GENERATE()
function generate() {

    // lenRange.value gives the sliders current position as a string like 12 or 24 and we convert
    // to a whole number with parseInt()
    const len = parseInt(lenRange.value); // Read the desired password length from the slider input and convert it to an integer
    const upper = useUpper.checked; // Read whether to include uppercase letters from the checkbox
    const nums = useNums.checked; // Read whether to include numbers from the checkbox
    const syms = useSyms.checked; // Read whether to include symbols from the checkbox  

    let chars = 'abcdefghijklmnopqrstuvwxyz'; // Start with lowercase letters as the base character set;
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // If uppercase is selected (upper = true), += adds tp the end of the String variable chars so we append.
    if (nums) chars += '0123456789'; // If numbers are selected, append digits to chars, adding digits to chars
    if (syms) chars += '!@#$%^&*()_+-='; // If symbols are selected, append special characters to chars, adding symbols to chars
    // if all are true chars will be 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-='

    let pw = ''; // Start with an empty password string that we will build up character by character in the loop below.

    // if len is 12 it runs 12 times.
    for(let i=0;i<len;i++){
        // gives a random decimal between 0 and 1, multiplies by chars.length
        // math.floor rounds down to a whole number
        // number is valid index position in chars string
        const randomIndex = Math.floor(Math.random() * chars.length);
        pw += chars[randomIndex]; // adds the randomly selected character to the password string
    /*
        This loop runs len times and adds a random character from randomIndex len times so the 
        password becomes len characters and len (number) amount of characters in pw

        In const randomIndex = Math.floor(Math.random() * chars.length); we do this because we generate a random decimal 0-1 and times it by the chars.length
        so that we never get an index that is out of bounds of the chars string. If chars has 26 characters, chars.length is 26, and randomIndex will be a number 
        from 0 to 25, which are valid index positions in the chars string.

    */
    }

    // Save the password
    currentPw = pw;

    pwText.textContent = pw; // .textContent sets the visible text inside the <span> abd replaces the "click generate" with the actual password

    pwText.classList.remove('empty');

    // Update the strength bar based
    updateStrength(pw, upper, nums, syms);

    // Animate the button
    const btn = document.querySelector('.gen-btn'); // This finds the element matching the CSS selector '.gen-btn' the buttom

    btn.style.transform = 'scale(0.97)'; // Directly sets a CSS property from JS, this shrinks the button to 97% - a subtle press effect

    setTimeout(() => btn.style.transform = '', 120);
    /*
     setTimeout runs a function after a delay
     120 = 120 milliseconds (1/8 a second)
     after the 120ms we reset transform to an empty string hence: ''
     which removes the scale and the button springs back to normal size
     the () => syntax is an arrow function--a shorter way to write a function in JavaScript. It's like saying function() but more concise.
    */
}
// 4 parameters/inputs
// (true/false) for which are enabled: pw, upper, nums, syms
function updateStrength(pw, upper, nums, syms) {
    // We create a score variable to store the points for strength starting at 0
    // Each check adds 1 point
    let score=0;

    // Award the points for strength
    // Starting with length
    if(pw.length>=8) score++;
    if(pw.length>=14) score++;
    // Now upper
    /*
        upper && -- only check if upper was enabled/true
        /[A-Z]/ is a regular expression used as a pattern to search if the (pw) contains it
        .test(pw) checks that
        returns if true score++
    */
    if(upper && /[A-Z]/.test(pw)) score++;
    /*
        same idea as before but with numbers, checks if pw contains nums first
        [0-9] searches for any digit 0 to 9
    */
    if(nums && /[0-9]/.test(pw)) score++;

    /*
        [^a-zA-Z0-9] means any character that is NOT a letter or digit.
        The ^ inside [] means "NOT" so matches and searches for symbols like !@#$
    */
    if(syms && /[a-zA-Z0-9]/.test(pw)) score++;

    // Colors for each level display strength level
    /*
        Array that has 4 colors:    (0123 order)
        red (weak)
        orange (okay)
        green (good)
        purple (strong)
    */
    const colors = ['#ef4444', '#f97316', '#22c55e', '#a78bfa'];

    // Light up the segments with for loop i= 0,1,2,3,4 + future colors if need be
    for(let i=0;i<colors.length;i++){

        // for example if score is 2 only 2 segments get lit (starts at 0,1,2)
        // grab the segment at position i from array
        // access its inline css styles (style keyword), colors [i] specifying the background color 
        if(i < score) {
            segments[i].style.background = colors[i];    
        } else {
            segments[i].style.background = 'rgba(255,255,255,0.1)';  // keeps this segment dim or unaffected hence opacity (0.1)
        }
    }
}
// Copt function that copies the current password to the clipboard and shows "Copied!" toast notification
function copyPw(){
    // ! Not statement-if currentPw is empty return nothing to copy
    if(!currentPw) return;

    /*
        navigator--built into the browser to access device features
        navigator.clipboard is the browser's built in clipboard API
        .writeText send the text to that clip board--it happens asynchronous--it doesnt happen instantly
        it returns a "Promise"-- a guarantee it will finish eventually
    */
   // We use then because copying isnt instant so we use .then() which waits for the copy to finish
    navigator.clipboard.writeText(currentPw).then(() =>{ 
        // This only runs after copy is confirmed done
        // Adds the CSS class "show" to the toast elements in HTML
        toast.classList.add('show');

        // After 1800 ms (1.8 seconds) remove the 'show' class
        // Reverses the animation-toaster slides in and out
        setTimeout(() => toast.classList.remove('show'), 1800);
    });
}
// Section 6 Particles--draws 80 floating particles in canvas bg floating up, out, respawn at the bottom, a looped animation of 60 times/sec
function resize(){

//  scene.offsetWidth/Height--gives the scenes current pizel size
// canva's w and h match---if you dont do this it stays in its default 300*150px and everything looks stretched or cropped
    W = canvas.width = scene.offsetWidth;
    H = canvas.height = scene.offsetHeight;
}

// Create a single particle
function makeParticle(){
    /*
        Guideline: 
        Math.random()         // 0 to 1
        Math.random() * 10    // 0 to 10
        Math.random() * 60    // 0 to 60
        Math.random() * W     // 0 to canvas width

        Whereever you add becomes the new minimum:
        + number -- math random++ (++1)
        Math.random() + 2      // 2 to 3
        Multiple numbers:
        Math.random() * 2 + 5  // 5 to 7
        The + at the end always tells you the minimum, and the total tells you the maximum.
        Math.random() * 50 + 50 // 0 to 50, then shifted up to 50 to 100      
        */

    // returns a single OBJECT with random properties
    // An OBJECT is a collection of named values (like a data card)
    return {

        x:  Math.random() * W,  // Random horizontal position between 0 and canvas width
        y: Math.random() * H,    // Random vertical position 0-canvas
        r: Math.random() * 2 +0.5,  // R-radius (size of particle)- between 0.5px to 2.5px
        vx: (Math.random() - 0.5) * 0.4, // Horizontal velocity--how fast it moves left or right, 0.5 gives -0.5 to 0.5 (either direction) * 0.4 keepts the drift subtle   
        vy: -(Math.random() * 0.6 + 0.2), // vertical velocity -- negative--moving up-- range: -0.2 to -0.8 always up different speeds
        life: Math.random(), //curent opacity, 0(invisible)-1(visible)--starts at random value
        decay: Math.random() * 0.003 + 0.001, // How much life is lost each frame, smaller-fades slower, range 0.001 to 0.004 at 60fps a particle decays 0.002 lasts about 8 seconds
        hue: Math.random() * 60 + 240   // Color hue value 240=blue, 300=purple/pink, range 240-300 gives blue-to-purple color range
    };
}

// Initialize particles
function initParticles(){
    // Settings the canvas size first so makeParticle() has correct W & H
    resize();

    /*  Array.from() creates a new array
        {length: 80} tells us how many slots to make so this is an array of 80, particles[80]
        ,makeParticle() is a function that in each slot that calls for random particles 80 times for each slot in the array
        Automatically creates an 80 index array and puts makeParticles() function call in each index, easier and faster than a for loop using particles.push(makeParticles)
    */
    particles = Array.from({length: 80}, makeParticle);
}

// Animation loop
function frame(){
    // First clear the previous frame
    // This wipes the entire canvas clean, without it every fram would draw
    // on top of the last one seeing trails everywhere, (x,y,width,height)
    ctx.clearRect(0,0,W,H);

    // cx - horizontal center of the canvas
    // cy - 30% down from the top- where the glow sits
    const cx = W/2;
    const cy = H *0.3;

    // Possible bc of ctx = getContext('2d')
    // createRadialGradient() creates radial gradient that is a circular color fade
    // first cx,cy,10 = inner cirlce center and radius
    // second cx,cy,160 = outer circle center and radius
    // Color fades from inner circle outward to 160px
    const orbGrad = ctx.createRadialGradient(cx,cy, 10, cx,cy,160);

    // At the center = 0, color is purple with 22% opacity
    orbGrad.addColorStop(0, 'rgba(109,40,217, 0.22)');
    // At the edges = 1, 
    orbGrad.addColorStop(1,'rgba(109,40,217, 0)');
    // Set the fill color to gradient
    ctx.fillStyle = orbGrad;
    // Fill the whole canvas, gradient is circular so it only shows as a glow in the center
    ctx.fillRect(0,0,W,H);

    /*
    for.Each creates the variables & validates them p,i
    forEach loops through every particle with p as the current particle object
    and i as its index number 0,1,2,3.....
    */
   particles.forEach((p,i) => {
    /*
  x:    Math.random() * W,  // Random horizontal position between 0 and canvas width
        y: Math.random() * H,    // Random vertical position 0-canvas
        r: Math.random() * 2 +0.5,  // R-radius (size of particle)- between 0.5px to 2.5px
        vx: (Math.random() - 0.5) * 0.4, // Horizontal velocity--how fast it moves left or right, 0.5 gives -0.5 to 0.5 (either direction) * 0.4 keepts the drift subtle   
        vy: -(Math.random() * 0.6 + 0.2), // vertical velocity -- negative--moving up-- range: -0.2 to -0.8 always up different speeds
        life: Math.random(), //curent opacity, 0(invisible)-1(visible)--starts at random value
        decay: Math.random() * 0.003 + 0.001, // How much life is lost each frame, smaller-fades slower, range 0.001 to 0.004 at 60fps a particle decays 0.002 lasts about 8 seconds
        hue: Math.random() * 60 + 240   // Color hue value 240=blue, 300=purple/pink, range 240-300 gives blue-to-purple color range
    */
    // we move the particle (p) horizontally by its velocity
    // += means add it itself, if p.vx is 0.2, x increases by 0.2
    p.x += p.vx;

    // move particle up, vy is negative so y descreases = moves up
    p.y += p.vy;

    // Reduce life (opacity) by decay amount each frame, at 0=invisible
    p.life -= p.decay;

    // respawn dead or escaped particles-- life ran out or particle floated off the top
    if(p.life<=0 || p.y<-10){

        // replace with new random particle
        particles[i] = makeParticle();

        // Starts at bellow the bottom .y and drift up +5
        particles[i].y = H + 5;

        // we return since the particle is invisible or off screen
        return;
    } 
     // tells canvas to begin a new shape, without this shapes get merged together
   ctx.beginPath();

   // Describes a circle(arc) p.x, p.y = center of circle, p.r = radius, 0=start of angle(0 radians = 3 oclock postion)
   // Math.PI * 2 = end angle (full circle= 360 degrees in radians)
   ctx.arc(p.x,p.y,p.r,0,Math.PI*2);

   // Set the color, hsla-(hue, saturation, lightness, alpha): 
   // p.hue = color (240-300 = blue to purple), 80% sat,80% lightness
   // p.life * 0.6 = opacity. As life drops, the particle fades.
   // × 0.6 means even at full life it's only 60% opaque — subtle.
   ctx.fillStyle = `hsla(${p.hue}, 80%, 80%, ${p.life * 0.6})`;
   ctx.fill(); // fills and paints circle into the canvas
   
   });

 

/* key to making animation loop
    Tells the browser: before you paint the next screen frame, call my frame function first
    --frame() is called which calls requestAnimationFrame(), calling frame() again and forver 60 times per second
    it automatically pauses when the browser tab is hidden
*/ 
requestAnimationFrame(frame);
}

// Section 7
// Call all the functions:
initParticles();

frame();

// listens for browser window being resized hence 'resize()'
window.addEventListener('resize', () =>{
    resize();
})