export const EventBus = {
    events: {},
    subscribe: function(eventName, callback){
        if (this.events[eventName] === undefined) this.events[eventName] = [];

        this.events[eventName].push(callback);
    },
    unsubscribe: function(eventName, callback){
        if (this.events[eventName] === undefined) return;

        this.events[eventName] = this.events[eventName].filter((fn) => fn !== callback);
    },
    emit: function(eventName, data){
        if (this.events[eventName] === undefined)
        {
            console.log("No callback registered for " + eventName);
            return;
        }

        for (let i = 0; i < this.events[eventName].length; i++)
        {
            this.events[eventName][i](data);
        }
    }
}