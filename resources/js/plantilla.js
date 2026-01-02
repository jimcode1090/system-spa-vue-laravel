/* AdminLTE Template JS Bundle */

// Import and expose jQuery globally IMMEDIATELY
import jQuery from 'jquery';
window.jQuery = jQuery;
window.$ = jQuery;

// Import Popper.js (required by Bootstrap 4)
import Popper from 'popper.js';
window.Popper = Popper;

// Import Bootstrap 4 JS
import 'bootstrap';

// Import AdminLTE scripts (they will use the global jQuery)
// These files are not ES6 modules, so they'll execute immediately and use window.jQuery
import('../vendor/js/adminlte.min.js');
import('../vendor/js/demo.js');
