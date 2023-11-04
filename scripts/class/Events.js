class Events {
  constructor() {
    this.eventScopes = {
      'faction': {},
      'planet': {},
    };
  }

  tryTriggerEvents(scope, object) {
    const scopeEvents = this.eventScopes[scope];

    Object.values(scopeEvents).forEach(evt => {
      if(this.getEventTriggerState(object, evt.key)) return;
      const triggered = evt.trigger_func(object);
      if(triggered) {
        this.setEventTriggerState(object, evt.key, true);
        this.triggerEvent(object, evt);
      }
    });
  }

  setEventTriggerState(object, key, state) {
    object.triggeredEvents[key] = state;
  }

  getEventTriggerState(object, key) {
    return object.triggeredEvents[key];
  }

  triggerEvent(object, evt) {
    if(evt.mean_months_to_happen === 0) {
      console.log(`<${object.name}> Triggered event: ${evt.name}`);
      evt.actions_func(object);
      this.setEventTriggerState(object, evt.key, false);
    } else {
      const timeToHappen = Math.round(evt.mean_months_to_happen + evt.mean_months_to_happen * getRandomArbitrary(-0.3, 0.3));
      console.log(`<${object.name}> Event ${evt.name} will happen in ${timeToHappen} months`);
      theTime.awaitMonths(timeToHappen).then(() => {
        console.log(`<${object.name}> Triggered event: ${evt.name}`);
        evt.actions_func(object);
        this.setEventTriggerState(object, evt.key, false);
      });
    }
  }
}
const theEvents = new Events();

class Event {
  constructor(key, scope) {
    this.name = key;
    this.description = key;
    this.key = key;
    this.scope = scope;
    this.mean_months_to_happen = 0;
    this.trigger_func = null;
    this.triggered = false;
    this.actions_func = null;

    theEvents.eventScopes[scope][key] = this;
  }
}


