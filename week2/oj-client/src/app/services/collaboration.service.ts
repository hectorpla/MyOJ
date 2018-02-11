import { Injectable } from '@angular/core';

declare var io: any;

@Injectable()
export class CollaborationService {
  collaborationSocket: any;

  constructor() { }

  init() {
    this.collaborationSocket = io(window.location.origin);
  }

  broadcastChange(delta: Object) {
    // this.collaborationSocket.emit('change', delta)
  }
}
