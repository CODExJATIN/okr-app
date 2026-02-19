const style = { open: '', close: '' };
const styles = new Proxy({}, {
    get: (target, prop) => {
        // Return a configured style object for any property access (colors, modifiers, etc.)
        return style;
    }
});
module.exports = styles;
