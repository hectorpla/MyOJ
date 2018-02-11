import { Injectable } from '@angular/core';

declare var io: any;

@Injectable()
export class CollaborationService {
  collaborationSocket: any;

  lastChange: Object

  constructor() { }

  init(editor: any) {
    this.collaborationSocket = io(window.location.origin);
    this.collaborationSocket.on("connected", msg => console.log(msg));

    this.collaborationSocket.on("change from collaborators", delta => {
      delete delta.id
      // console.log('change!!! ' + JSON.stringify(delta))
      editor.lastAppliedChange = delta; // order is critical
      editor.getSession().getDocument().applyDeltas([delta]);
    })

    editor.lastAppliedChange = null;
    
    editor.on("change", delta => {
      delete delta.id;
      console.log(delta, '?==', editor.lastAppliedChange);
      if (JSON.stringify(editor.lastAppliedChange) != JSON.stringify(delta)) {
        this.broadcastChange(delta);
      }
    });
  }

  broadcastChange(delta: Object) {
    this.collaborationSocket.emit('edition change', delta)
  }

}
