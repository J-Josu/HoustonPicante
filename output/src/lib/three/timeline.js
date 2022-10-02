class TimeLine {
    MARK_DURATION;
    length;
    currentMark;
    accumulatedTime;
    onChangeSubscribers;
    constructor(mark_duration, marks_quantity) {
        this.MARK_DURATION = mark_duration;
        this.length = marks_quantity;
        this.onChangeSubscribers = [];
        this.accumulatedTime = 0;
        this.currentMark = 0;
    }
    setLength(size) {
        this.length = size;
        this.currentMark = 0;
    }
    reset() {
        this.accumulatedTime = 0;
        this.currentMark = 0;
    }
    update(delta) {
        this.accumulatedTime += delta;
        if (this.accumulatedTime < this.MARK_DURATION)
            return;
        this.accumulatedTime = 0;
        this.nextMark();
    }
    setMark(index) {
        this.currentMark = index;
    }
    nextMark() {
        this.currentMark += 1;
        if (this.currentMark > this.length)
            this.currentMark = 0;
        this.onChangeSubscribers.forEach(callback => callback());
    }
    subscribe(callback) {
        this.onChangeSubscribers.push(callback);
    }
}
export { TimeLine };
//# sourceMappingURL=timeline.js.map