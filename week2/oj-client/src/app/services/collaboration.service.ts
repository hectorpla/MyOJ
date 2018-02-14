import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

declare var io: any;
declare var ace: any;
declare var aceRange: any;

@Injectable()
export class CollaborationService {
  private collaborationSocket: any;
  private _userList$: Observable<number[]>;
  private activeUserCursors = {}

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
      console.log(`cursor changed in user ${userId}, ${JSON.stringify(position)}`);
      // implementation for colored cursors
      let {row, column} = position;
      let range = new aceRange(row, column, row, column + 2);
      console.log(range);

      if (userId in this.activeUserCursors) {
        editor.getSession().removeMarker(this.activeUserCursors[userId]);
      }
      this.activeUserCursors[userId] = editor.getSession()
        .addMarker(range, `user-${userId} edit-marker`, true);
      console.log(this.activeUserCursors);
    })

    this.collaborationSocket.on("disconnect", () => {
      console.log('rejected from the server');
    })

    // participants change notification
    this._userList$ = new Observable<number[]>(observer => {
        this.collaborationSocket.on("participants change", (users) => {
          // ok or not to put here?
          console.log('before removing cursors ' + JSON.stringify(users))
          for (let user of Object.keys(this.activeUserCursors)) {
            if (!users.includes(+user)) {
              console.log(`removing user ${user}'s cursor`)
              editor.getSession().removeMarker(this.activeUserCursors[user]);
              delete this.activeUserCursors[user];
            }
          }
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
