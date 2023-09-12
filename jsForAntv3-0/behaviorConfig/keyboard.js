const keyboardConfig = {
    getDefaultCfg() {
        return {
            backKeyCode: 8,
            deleteKeyCode: 46
        };
    },
    getEvents() {
        return {
            keyup: 'onKeyUp',
            keydown: 'onKeyDown'
        };
    },

    onKeyDown(e) {
        console.log('in keyboard keydown')
        const code = e.keyCode || e.which;
        switch (code) {
            case this.deleteKeyCode:
            case this.backKeyCode:
                globalEventBus.$emit('deleteItem')
                break;
            default:
                break;
        }
    },
    onKeyUp() {
        this.keydown = false;
    }
};
