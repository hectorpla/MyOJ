import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

declare var io: any;

@Injectable()
export class CollaborationService {
  private collaborationSocket: any;
  private _userList$: Observable<number[]>;

  constructor() { }

  init(editor: any, sessionId: number) {
    // register all events that will happen on the socket
    this.collaborationSocket = io(window.location.origin, {query: {sessionId: sessionId}});

    this.collaborationSocket.on("connected", msg => console.log(msg));

    this.collaborationSocket.on("change from collaborators", delta => {
      delete delta.id
      // console.log('change!!! ' + JSON.stringify(delta))
      editor.lastAppliedChange = delta; // order is critical
      editor.getSession().getDocument().applyDeltas([delta]);
    })

    this.collaborationSocket.on("disconnect", () => {
      console.log('rejected from the server');
    })

    this._userList$ = new Observable<number[]>(observer => {
        this.collaborationSocket.on("collaborators change", (users) => {
          observer.next(users)
        })
    })

    editor.lastAppliedChange = null;
    editor.on("change", delta => {
      delete delta.id;
      // console.log(delta, '?==', editor.lastAppliedChange);
      if (JSON.stringify(editor.lastAppliedChange) != JSON.stringify(delta)) {
        this.broadcastChange(delta);
      }
    });
  }

  get userList$() { return this._userList$; }

  broadcastChange(delta: Object) {
    this.collaborationSocket.emit('edition change', delta);
  }

  disconnect() {
    this.collaborationSocket.disconnect();
  }

}
