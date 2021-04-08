const BLACK   = vec4(0.0, 0.0, 0.0, 1.0);
const RED     = vec4(1.0, 0.0, 0.0, 1.0);
const YELLOW  = vec4(1.0, 1.0, 0.0, 1.0);
const GREEN   = vec4(0.0, 1.0, 0.0, 1.0);
const BLUE    = vec4(0.0, 0.0, 1.0, 1.0);
const MAGENTA = vec4(1.0, 0.0, 1.0, 1.0);
const CYAN    = vec4(0.0, 1.0, 1.0, 1.0);
const WHITE   = vec4(1.0, 1.0, 1.0, 1.0);

const DEFAULT_COLORS = [
    BLACK,
    RED,
    YELLOW,
    GREEN,
    BLUE,
    MAGENTA,
    CYAN,
    WHITE,
];

const NUM_DEFAULT_COLORS = DEFAULT_COLORS.length;

const RANDOM_COLOR = () => vec4(Math.random(), Math.random(), Math.random(), 1.0);