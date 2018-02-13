import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

declare var io: any;
declare var ace: any;
declare var aceRange: any;

@Injectable()
export class CollaborationService {
  private collaborationSocket: any;
  private _userList$: Observable<number[]>;

  constructor() { }

  init(editor: any, sessionId: number) {
    // register all events that will happen on the socket
    this.collaborationSocket = io(window.location.origin, {query: {sessionId: sessionId}});

    this.collaborationSocket.on("connected", msg => console.log(msg));

    this.collaborationSocket.on("edition change", delta => {
      delete delta.id
      // console.log('change!!! ' + JSON.stringify(delta))
      editor.lastAppliedChange = delta; // order is critical
      editor.getSession().getDocument().applyDeltas([delta]);
    })

    this.collaborationSocket.on("cursor change", (userId: number, position) => {
      console.log(`cursor changed in ${userId}, ${JSON.stringify(position)}`);
      // implementation for colored cursors
      let {row, col} = position;
      console.log(ace)
      let range = new aceRange(row, col, row, col + 1);
      console.log(range);

      editor.getSession()
        .addMarker(range,'user' + userId,'unknown-type',true);
    })

    this.collaborationSocket.on("disconnect", () => {
      console.log('rejected from the server');
    })

    // participants change notification
    this._userList$ = new Observable<number[]>(observer => {
        this.collaborationSocket.on("participants change", (users) => {
          observer.next(users)
        })
    })

    editor.lastAppliedChange = null;
    editor.on("change", delta => {
      delete delta.id;
      // console.log(delta, '?==', editor.lastAppliedChange);
      if (JSON.stringify(editor.lastAppliedChange) != JSON.stringify(delta)) {
        this.collaborationSocket.emit('edition change', delta);
      }
    });

    editor.getSelection().on("changeCursor", () => {
      // let range = editor.getSelection().getRange();
      console.log(editor.getCursorPosition());
      // overlap with on change (typing triger changeCursor)
      this.collaborationSocket.emit("cursor change", editor.getCursorPosition());
    });
  }

  get userList$() { return this._userList$; }

  disconnect() {
    this.collaborationSocket.disconnect();
  }

}
